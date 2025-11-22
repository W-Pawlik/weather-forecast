import { useMapEvents } from 'react-leaflet';

interface MapClickHandlerProps {
  onMapClick: () => void;
}

export default function MapClickHandler({ onMapClick }: MapClickHandlerProps) {
  useMapEvents({
    click() {
      onMapClick();
    },
  });

  return null;
}
