import { configureStore } from '@reduxjs/toolkit';

import settingsSliceReducer, { defaultSettingsState } from './slices/settingsSlice';
import favCitiesSliceReducer, { defaultFavCitiesState } from './slices/favCitiesSlice';

import { loadFromStorage, saveToStorage } from '@/utils/storage';
import { SETTINGS_KEY, FAVCITIES_KEY } from '@/consts/localStorage';

const preloadedSettings = loadFromStorage(SETTINGS_KEY, defaultSettingsState);
const preloadedFavCities = loadFromStorage(FAVCITIES_KEY, defaultFavCitiesState);

export const store = configureStore({
  reducer: {
    settings: settingsSliceReducer,
    favCities: favCitiesSliceReducer,
  },
  preloadedState: {
    settings: preloadedSettings,
    favCities: preloadedFavCities,
  },
});

store.subscribe(() => {
  const state = store.getState();
  saveToStorage(SETTINGS_KEY, state.settings);
  saveToStorage(FAVCITIES_KEY, state.favCities);
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
