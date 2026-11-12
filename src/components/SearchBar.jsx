import { useState, useEffect, useRef } from 'react';
import { Search, Navigation, MapPin, X, Loader2 } from 'lucide-react';
import { searchCities, QUICK_CITIES } from '../services/weatherApi';

export function SearchBar({ selectedCity, onSelectCity, onUseGps, gpsLoading }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    const trimmed = query.trim();
    if (trimmed.length < 2) {
      setResults([]);
      setSearching(false);
      return;
    }

    setSearching(true);
    const timer = setTimeout(async () => {
      try {
        const list = await searchCities(trimmed);
        setResults(list);
        setIsOpen(true);
      } catch {
        setResults([]);
      } finally {
        setSearching(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  function handleSelect(city) {
    onSelectCity(city);
    setQuery('');
    setResults([]);
    setIsOpen(false);
  }

  return (
    <header className="search-header" ref={containerRef}>
      <div className="search-bar-row">
        <div className="search-input-wrapper">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => results.length > 0 && setIsOpen(true)}
            placeholder="Buscar cidade..."
            aria-label="Buscar cidade"
            className="search-input"
          />
          {searching && <Loader2 size={16} className="spin-icon" />}
          {!searching && query && (
            <button
              type="button"
              onClick={() => {
                setQuery('');
                setResults([]);
              }}
              className="clear-btn"
              aria-label="Limpar busca"
            >
              <X size={16} />
            </button>
          )}
        </div>

        <button
          type="button"
          onClick={onUseGps}
          disabled={gpsLoading}
          className="gps-btn"
          title="Usar minha localização"
          aria-label="Usar minha localização"
        >
          {gpsLoading ? <Loader2 size={18} className="spin-icon" /> : <Navigation size={18} />}
        </button>
      </div>

      {isOpen && results.length > 0 && (
        <ul className="search-dropdown" role="listbox">
          {results.map((city) => (
            <li key={city.id}>
              <button
                type="button"
                className="search-result-item"
                onClick={() => handleSelect(city)}
              >
                <MapPin size={16} className="result-pin" />
                <div className="result-text">
                  <span className="result-name">{city.name}</span>
                  <span className="result-sub">
                    {[city.admin1, city.country].filter(Boolean).join(', ')}
                  </span>
                </div>
              </button>
            </li>
          ))}
        </ul>
      )}

      <div className="quick-cities" aria-label="Cidades rápidas">
        {QUICK_CITIES.map((city) => {
          const isActive = selectedCity?.name === city.name;
          return (
            <button
              key={city.id}
              type="button"
              onClick={() => onSelectCity(city)}
              className={`city-chip ${isActive ? 'active' : ''}`}
            >
              {city.name}
            </button>
          );
        })}
      </div>
    </header>
  );
}

