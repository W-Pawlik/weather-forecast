import { ReactNode } from 'react';
import { useSelector } from 'react-redux';

import { convertTemperature } from '@/utils/temperature';
import { selectTempratureUnit } from '@/redux/selectors/settingsSelectors';

interface TemperatureProps {
  valueC: number | undefined;
  showUnit?: boolean;
  placeholder?: ReactNode;
}

export default function Temperature({
  valueC,
  showUnit = true,
  placeholder = '...',
}: TemperatureProps) {
  const unit = useSelector(selectTempratureUnit);

  if (valueC === undefined || valueC === null) {
    return <>{placeholder}</>;
  }

  const converted = convertTemperature(valueC, unit);
  const suffix = showUnit ? (unit === 'celsius' ? '°C' : unit === 'fahrenheit' ? '°F' : 'K') : '';

  return <>{`${Math.round(converted)}${suffix}`}</>;
}
