import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface FavCitiesState {
  cities: string[];
}

export const defaultFavCitiesState: FavCitiesState = {
  cities: [],
};

const favCitiesSlice = createSlice({
  name: 'favCities',
  initialState: defaultFavCitiesState,
  reducers: {
    toggleFavoriteCity: (state, action: PayloadAction<string>) => {
      const city = action.payload;
      if (state.cities.includes(city)) {
        state.cities = state.cities.filter((c) => c !== city);
      } else {
        state.cities.push(city);
      }
    },
  },
});

export const { toggleFavoriteCity } = favCitiesSlice.actions;
export default favCitiesSlice.reducer;
