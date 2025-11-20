import { RootState } from '@/redux/store';

export const selectFavoriteCities = (state: RootState) => state.favCities.cities;

export const selectIsCityFavorite = (cityName: string) => (state: RootState) =>
  state.favCities.cities.includes(cityName);
