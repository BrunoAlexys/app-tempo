import {
  Sun,
  Moon,
  CloudSun,
  CloudMoon,
  Cloud,
  CloudFog,
  CloudDrizzle,
  CloudRain,
  CloudSnow,
  CloudLightning,
} from 'lucide-react';

export function getWeatherInfo(code, isDay = 1) {
  const night = isDay === 0;

  if (code === 0) {
    return {
      label: 'Céu limpo',
      theme: night ? 'night' : 'sunny',
      Icon: night ? Moon : Sun,
      accent: night ? '#818cf8' : '#fbbf24',
    };
  }

  if (code === 1 || code === 2) {
    return {
      label: code === 1 ? 'Predominantemente limpo' : 'Parcialmente nublado',
      theme: night ? 'night' : 'sunny',
      Icon: night ? CloudMoon : CloudSun,
      accent: night ? '#a5b4fc' : '#fcd34d',
    };
  }

  if (code === 3) {
    return {
      label: 'Encoberto',
      theme: night ? 'night' : 'cloudy',
      Icon: Cloud,
      accent: '#94a3b8',
    };
  }

  if (code === 45 || code === 48) {
    return {
      label: 'Neblina',
      theme: 'cloudy',
      Icon: CloudFog,
      accent: '#cbd5e1',
    };
  }

  if ([51, 53, 55, 56, 57].includes(code)) {
    return {
      label: 'Garoa leve',
      theme: 'rainy',
      Icon: CloudDrizzle,
      accent: '#38bdf8',
    };
  }

  if ([61, 63, 65, 66, 67, 80, 81, 82].includes(code)) {
    const heavy = [65, 82].includes(code);
    return {
      label: heavy ? 'Chuva forte' : 'Chuva',
      theme: 'rainy',
      Icon: CloudRain,
      accent: '#38bdf8',
    };
  }

  if ([71, 73, 75, 77, 85, 86].includes(code)) {
    return {
      label: 'Neve',
      theme: 'cloudy',
      Icon: CloudSnow,
      accent: '#e2e8f0',
    };
  }

  if ([95, 96, 99].includes(code)) {
    return {
      label: 'Tempestade',
      theme: 'stormy',
      Icon: CloudLightning,
      accent: '#facc15',
    };
  }

  return {
    label: 'Tempo variável',
    theme: night ? 'night' : 'sunny',
    Icon: Cloud,
    accent: '#94a3b8',
  };
}

export function WeatherIcon({ code, isDay = 1, size = 28, className = '' }) {
  const { Icon, accent } = getWeatherInfo(code, isDay);
  return <Icon size={size} color={accent} strokeWidth={2} className={className} />;
}

export function formatWeekday(dateString, index) {
  if (index === 0) return 'Hoje';
  const date = new Date(`${dateString}T12:00:00`);
  const day = date.toLocaleDateString('pt-BR', { weekday: 'short' }).replace('.', '');
  return day.charAt(0).toUpperCase() + day.slice(1);
}

export function formatHour(isoString) {
  const date = new Date(isoString);
  return date.toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function getUvLevel(uv) {
  if (uv <= 2) return 'Baixo';
  if (uv <= 5) return 'Moderado';
  if (uv <= 7) return 'Alto';
  if (uv <= 10) return 'Muito alto';
  return 'Extremo';
}

