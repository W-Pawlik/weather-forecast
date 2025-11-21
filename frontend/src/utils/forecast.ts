import { FiveDayForecastDTO, ForecastListItem } from '@/types/weatherApi';

export interface DailyForecast {
  date: string;
  dayLabel: string;
  minTemp: number;
  maxTemp: number;
  icon: string | null;
  description: string;
  popPercent: number;
}

function getDayLabel(item: ForecastListItem, locale = 'pl-PL'): string {
  const d = new Date(item.dt_txt);
  return d.toLocaleDateString(locale, { weekday: 'short' }).replace('.', '');
}

export function buildDailyForecast(forecast: FiveDayForecastDTO, maxDays = 5): DailyForecast[] {
  const byDate: Record<string, ForecastListItem[]> = {};

  forecast.list.forEach((item) => {
    const dateKey = item.dt_txt.split(' ')[0];
    if (!byDate[dateKey]) byDate[dateKey] = [];
    byDate[dateKey].push(item);
  });

  const entries = Object.entries(byDate)
    .sort(([a], [b]) => (a < b ? -1 : 1))
    .slice(0, maxDays);

  return entries.map(([date, items]) => {
    const minTemp = Math.min(...items.map((i) => i.main.temp_min));
    const maxTemp = Math.max(...items.map((i) => i.main.temp_max));
    const rep =
      items.find((i) => i.dt_txt.includes('12:00:00')) ??
      items.find((i) => i.sys.pod === 'd') ??
      items[0];

    const popPercent = Math.round(Math.max(...items.map((i) => i.pop ?? 0)) * 100);

    const icon = rep.weather[0]?.icon ?? null;
    const description = rep.weather[0]?.description ?? '';

    return {
      date,
      dayLabel: getDayLabel(rep),
      minTemp,
      maxTemp,
      icon,
      description,
      popPercent,
    };
  });
}
