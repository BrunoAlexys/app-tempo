import { useState, useEffect, useCallback } from 'react';
import { RefreshCw, AlertCircle } from 'lucide-react';
import {
  QUICK_CITIES,
  fetchWeatherData,
  reverseGeocode,
} from './services/weatherApi';
import { getWeatherInfo } from './utils/weatherCodes';
import { SearchBar } from './components/SearchBar';
import { CurrentWeather } from './components/CurrentWeather';
import { HourlyForecast } from './components/HourlyForecast';
import { WeatherMetrics } from './components/WeatherMetrics';
import { DailyForecast } from './components/DailyForecast';

const STORAGE_KEY = 'clima_selected_city';

function getInitialCity() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : QUICK_CITIES[0];
  } catch {
    return QUICK_CITIES[0];
  }
}

export default function App() {
  const [city, setCity] = useState(getInitialCity);
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [gpsLoading, setGpsLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadWeather = useCallback(async (targetCity) => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchWeatherData(
        targetCity.latitude,
        targetCity.longitude
      );
      setWeather(data);
    } catch (err) {
      setError(err.message || 'Erro ao carregar dados meteorológicos.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadWeather(city);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(city));
    } catch {}
  }, [city, loadWeather]);

  function handleUseGps() {
    if (!navigator.geolocation) {
      setError('Geolocalização não é suportada pelo seu navegador.');
      return;
    }

    setGpsLoading(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          const resolvedCity = await reverseGeocode(latitude, longitude);
          setCity(resolvedCity);
        } catch {
          setError('Não foi possível obter sua localização.');
        } finally {
          setGpsLoading(false);
        }
      },
      () => {
        setGpsLoading(false);
        setError('Permissão de localização negada ou indisponível.');
      },
      { enableHighAccuracy: false, timeout: 10000 }
    );
  }

  const theme = weather
    ? getWeatherInfo(weather.current.weatherCode, weather.current.isDay).theme
    : 'sunny';

  return (
    <div className={`app-shell theme-${theme}`}>
      <div className="ambient-glow" aria-hidden="true" />

      <div className="mobile-container">
        <SearchBar
          selectedCity={city}
          onSelectCity={setCity}
          onUseGps={handleUseGps}
          gpsLoading={gpsLoading}
        />

        {error && (
          <div className="error-banner" role="alert">
            <AlertCircle size={18} />
            <span>{error}</span>
            <button
              type="button"
              onClick={() => loadWeather(city)}
              className="retry-btn"
            >
              Tentar novamente
            </button>
          </div>
        )}

        {loading && !weather ? (
          <div className="skeleton-wrapper" aria-busy="true">
            <div className="skeleton-hero" />
            <div className="skeleton-hourly" />
            <div className="skeleton-grid">
              <div className="skeleton-box" />
              <div className="skeleton-box" />
              <div className="skeleton-box" />
              <div className="skeleton-box" />
            </div>
          </div>
        ) : (
          weather && (
            <main className={`weather-content ${loading ? 'is-refreshing' : ''}`}>
              <CurrentWeather city={city} current={weather.current} />
              <HourlyForecast hourly={weather.hourly} />
              <WeatherMetrics current={weather.current} />
              <DailyForecast daily={weather.daily} />

              <footer className="app-footer">
                <span>Dados em tempo real via Open-Meteo</span>
                <button
                  type="button"
                  onClick={() => loadWeather(city)}
                  className="refresh-link"
                  disabled={loading}
                >
                  <RefreshCw size={13} className={loading ? 'spin-icon' : ''} />
                  Atualizar
                </button>
              </footer>
            </main>
          )
        )}
      </div>
    </div>
  );
}

