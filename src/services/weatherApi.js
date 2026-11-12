const FORECAST_URL = 'https://api.open-meteo.com/v1/forecast';
const GEOCODING_URL = 'https://geocoding-api.open-meteo.com/v1/search';
const REVERSE_GEO_URL = 'https://api.bigdatacloud.net/data/reverse-geocode-client';

export const QUICK_CITIES = [
  { id: 'rec', name: 'Recife', admin1: 'Pernambuco', country: 'Brasil', latitude: -8.0476, longitude: -34.877 },
  { id: 'sp', name: 'São Paulo', admin1: 'São Paulo', country: 'Brasil', latitude: -23.5505, longitude: -46.6333 },
  { id: 'rj', name: 'Rio de Janeiro', admin1: 'Rio de Janeiro', country: 'Brasil', latitude: -22.9068, longitude: -43.1729 },
  { id: 'cwb', name: 'Curitiba', admin1: 'Paraná', country: 'Brasil', latitude: -25.4284, longitude: -49.2733 },
  { id: 'ssa', name: 'Salvador', admin1: 'Bahia', country: 'Brasil', latitude: -12.9714, longitude: -38.5014 },
  { id: 'bsb', name: 'Brasília', admin1: 'Distrito Federal', country: 'Brasil', latitude: -15.7801, longitude: -47.9292 },
];

export async function searchCities(query) {
  const trimmed = query.trim();
  if (trimmed.length < 2) return [];

  const params = new URLSearchParams({
    name: trimmed,
    count: '5',
    language: 'pt',
    format: 'json',
  });

  const response = await fetch(`${GEOCODING_URL}?${params}`);
  if (!response.ok) {
    throw new Error('Erro ao buscar cidades.');
  }

  const data = await response.json();
  return (data.results || []).map((item) => ({
    id: `${item.id || `${item.latitude}-${item.longitude}`}`,
    name: item.name,
    admin1: item.admin1 || '',
    country: item.country || '',
    latitude: item.latitude,
    longitude: item.longitude,
  }));
}

export async function reverseGeocode(latitude, longitude) {
  try {
    const params = new URLSearchParams({
      latitude: String(latitude),
      longitude: String(longitude),
      localityLanguage: 'pt',
    });
    const response = await fetch(`${REVERSE_GEO_URL}?${params}`);
    if (!response.ok) throw new Error();
    const data = await response.json();

    return {
      id: 'gps-location',
      name: data.city || data.locality || 'Sua localização',
      admin1: data.principalSubdivision || '',
      country: data.countryName || '',
      latitude,
      longitude,
    };
  } catch {
    return {
      id: 'gps-location',
      name: 'Sua localização',
      admin1: `${latitude.toFixed(2)}°, ${longitude.toFixed(2)}°`,
      country: '',
      latitude,
      longitude,
    };
  }
}

export async function fetchWeatherData(latitude, longitude) {
  const params = new URLSearchParams({
    latitude: String(latitude),
    longitude: String(longitude),
    current: [
      'temperature_2m',
      'relative_humidity_2m',
      'apparent_temperature',
      'is_day',
      'precipitation',
      'weather_code',
      'surface_pressure',
      'wind_speed_10m',
    ].join(','),
    hourly: [
      'temperature_2m',
      'precipitation_probability',
      'weather_code',
      'is_day',
    ].join(','),
    daily: [
      'weather_code',
      'temperature_2m_max',
      'temperature_2m_min',
      'sunrise',
      'sunset',
      'uv_index_max',
      'precipitation_probability_max',
    ].join(','),
    timezone: 'auto',
    forecast_days: '7',
  });

  const response = await fetch(`${FORECAST_URL}?${params}`);
  if (!response.ok) {
    throw new Error('Não foi possível carregar os dados do clima no momento.');
  }

  const raw = await response.json();

  const currentTimeIso = raw.current.time;
  const startIndex = Math.max(
    0,
    raw.hourly.time.findIndex((t) => t >= currentTimeIso)
  );

  const hourly = raw.hourly.time
    .slice(startIndex, startIndex + 24)
    .map((time, idx) => {
      const i = startIndex + idx;
      return {
        time,
        temp: Math.round(raw.hourly.temperature_2m[i]),
        rainProb: raw.hourly.precipitation_probability[i] ?? 0,
        weatherCode: raw.hourly.weather_code[i],
        isDay: raw.hourly.is_day[i],
      };
    });

  const daily = raw.daily.time.map((date, i) => ({
    date,
    weatherCode: raw.daily.weather_code[i],
    tempMax: Math.round(raw.daily.temperature_2m_max[i]),
    tempMin: Math.round(raw.daily.temperature_2m_min[i]),
    sunrise: raw.daily.sunrise[i],
    sunset: raw.daily.sunset[i],
    uvMax: Math.round(raw.daily.uv_index_max[i] ?? 0),
    rainProb: raw.daily.precipitation_probability_max[i] ?? 0,
  }));

  return {
    current: {
      temp: Math.round(raw.current.temperature_2m),
      feelsLike: Math.round(raw.current.apparent_temperature),
      humidity: raw.current.relative_humidity_2m,
      windSpeed: Math.round(raw.current.wind_speed_10m),
      pressure: Math.round(raw.current.surface_pressure),
      precipitation: raw.current.precipitation,
      weatherCode: raw.current.weather_code,
      isDay: raw.current.is_day,
      time: raw.current.time,
      tempMax: daily[0]?.tempMax ?? Math.round(raw.current.temperature_2m),
      tempMin: daily[0]?.tempMin ?? Math.round(raw.current.temperature_2m),
      uvIndex: daily[0]?.uvMax ?? 0,
      sunrise: daily[0]?.sunrise,
      sunset: daily[0]?.sunset,
    },
    hourly,
    daily,
  };
}

