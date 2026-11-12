import { Thermometer, Droplets, Wind, SunDim, Gauge, Sunrise } from 'lucide-react';
import { getUvLevel, formatHour } from '../utils/weatherCodes';

export function WeatherMetrics({ current }) {
  const metrics = [
    {
      id: 'feels',
      label: 'Sensação',
      value: `${current.feelsLike}°C`,
      sub: current.feelsLike > current.temp ? 'Mais quente' : 'Similar ao real',
      Icon: Thermometer,
      color: '#fb923c',
    },
    {
      id: 'humidity',
      label: 'Umidade',
      value: `${current.humidity}%`,
      sub: current.humidity > 70 ? 'Ar úmido' : current.humidity < 35 ? 'Ar seco' : 'Confortável',
      Icon: Droplets,
      color: '#38bdf8',
    },
    {
      id: 'wind',
      label: 'Vento',
      value: `${current.windSpeed} km/h`,
      sub: current.windSpeed > 25 ? 'Moderado a forte' : 'Brisa leve',
      Icon: Wind,
      color: '#a78bfa',
    },
    {
      id: 'uv',
      label: 'Índice UV',
      value: String(current.uvIndex),
      sub: getUvLevel(current.uvIndex),
      Icon: SunDim,
      color: '#facc15',
    },
    {
      id: 'pressure',
      label: 'Pressão',
      value: `${current.pressure} hPa`,
      sub: 'Atmosférica',
      Icon: Gauge,
      color: '#34d399',
    },
    {
      id: 'sun',
      label: 'Sol hoje',
      value: current.sunrise ? formatHour(current.sunrise) : '--:--',
      sub: current.sunset ? `Pôr às ${formatHour(current.sunset)}` : '',
      Icon: Sunrise,
      color: '#f472b6',
    },
  ];

  return (
    <section className="metrics-grid" aria-label="Detalhes do clima">
      {metrics.map(({ id, label, value, sub, Icon, color }) => (
        <article key={id} className="metric-card">
          <div className="metric-header">
            <span className="metric-icon-box" style={{ '--metric-color': color }}>
              <Icon size={16} color={color} />
            </span>
            <span className="metric-label">{label}</span>
          </div>
          <strong className="metric-value">{value}</strong>
          <span className="metric-sub">{sub}</span>
        </article>
      ))}
    </section>
  );
}

