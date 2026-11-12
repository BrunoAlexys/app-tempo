import { Calendar, Droplet } from 'lucide-react';
import { WeatherIcon, formatWeekday } from '../utils/weatherCodes';

export function DailyForecast({ daily }) {
  const weekMin = Math.min(...daily.map((d) => d.tempMin));
  const weekMax = Math.max(...daily.map((d) => d.tempMax));
  const totalSpan = Math.max(1, weekMax - weekMin);

  return (
    <section className="glass-panel" aria-label="Previsão para 7 dias">
      <div className="panel-header">
        <Calendar size={16} className="panel-icon" />
        <h2 className="panel-title">Próximos 7 dias</h2>
      </div>

      <div className="daily-list">
        {daily.map((day, index) => {
          const leftPercent = ((day.tempMin - weekMin) / totalSpan) * 100;
          const widthPercent = Math.max(
            12,
            ((day.tempMax - day.tempMin) / totalSpan) * 100
          );

          return (
            <div key={day.date} className="daily-row">
              <span className="daily-day">{formatWeekday(day.date, index)}</span>

              <div className="daily-condition">
                <WeatherIcon code={day.weatherCode} isDay={1} size={22} />
                {day.rainProb > 15 && (
                  <span className="daily-rain">
                    <Droplet size={10} />
                    {day.rainProb}%
                  </span>
                )}
              </div>

              <div className="daily-temp-range">
                <span className="temp-min">{day.tempMin}°</span>
                <div className="range-track">
                  <div
                    className="range-fill"
                    style={{
                      left: `${leftPercent}%`,
                      width: `${Math.min(100 - leftPercent, widthPercent)}%`,
                    }}
                  />
                </div>
                <span className="temp-max">{day.tempMax}°</span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

