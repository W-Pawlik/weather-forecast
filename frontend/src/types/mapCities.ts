import rawCities from '../data/current.city.list.json';

export interface MapCity {
  id: number;
  name: string;
  country: string;
  coord: {
    lon: number;
    lat: number;
  };
  stat?: {
    level?: number;
    population?: number;
  };
  zoom?: number;
}

const mapCities: MapCity[] = rawCities as MapCity[];

export default mapCities;
