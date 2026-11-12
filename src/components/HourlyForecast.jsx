import { Clock, Droplet } from 'lucide-react';
import { WeatherIcon, formatHour } from '../utils/weatherCodes';

export function HourlyForecast({ hourly }) {
  return (
    <section className="glass-panel" aria-label="Previsão por hora">
      <div className="panel-header">
        <Clock size={16} className="panel-icon" />
        <h2 className="panel-title">Próximas 24 horas</h2>
      </div>

      <div className="hourly-scroll">
        {hourly.slice(0, 16).map((item, index) => (
          <div
            key={item.time}
            className={`hourly-item ${index === 0 ? 'hourly-now' : ''}`}
          >
            <span className="hourly-time">
              {index === 0 ? 'Agora' : formatHour(item.time)}
            </span>

            <WeatherIcon
              code={item.weatherCode}
              isDay={item.isDay}
              size={26}
            />

            <span className="hourly-temp">{item.temp}°</span>

            <span
              className="hourly-rain"
              style={{ opacity: item.rainProb > 0 ? 1 : 0.25 }}
            >
              <Droplet size={10} />
              {item.rainProb}%
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}

