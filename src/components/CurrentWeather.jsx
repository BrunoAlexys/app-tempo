import { MapPin, ArrowUp, ArrowDown } from 'lucide-react';
import { getWeatherInfo, WeatherIcon } from '../utils/weatherCodes';

export function CurrentWeather({ city, current }) {
  const { label } = getWeatherInfo(current.weatherCode, current.isDay);

  const formattedDate = new Intl.DateTimeFormat('pt-BR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  }).format(new Date());

  return (
    <section className="hero-card" aria-label="Clima atual">
      <div className="hero-top">
        <div className="location-badge">
          <MapPin size={15} className="pin-accent" />
          <div>
            <h1 className="city-title">{city.name}</h1>
            {(city.admin1 || city.country) && (
              <p className="city-subtitle">
                {[city.admin1, city.country].filter(Boolean).join(' • ')}
              </p>
            )}
          </div>
        </div>
        <span className="current-date">{formattedDate}</span>
      </div>

      <div className="hero-main">
        <div className="temp-block">
          <span className="temp-value">{current.temp}</span>
          <span className="temp-unit">°C</span>
        </div>

        <div className="hero-icon-wrapper">
          <WeatherIcon
            code={current.weatherCode}
            isDay={current.isDay}
            size={68}
            className="hero-weather-icon"
          />
        </div>
      </div>

      <div className="hero-bottom">
        <p className="condition-label">{label}</p>

        <div className="high-low-pills">
          <span className="hl-pill">
            <ArrowUp size={14} className="hl-up" />
            Máx {current.tempMax}°
          </span>
          <span className="hl-pill">
            <ArrowDown size={14} className="hl-down" />
            Mín {current.tempMin}°
          </span>
        </div>
      </div>
    </section>
  );
}

