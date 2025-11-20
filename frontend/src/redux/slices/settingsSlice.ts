import { createSlice } from '@reduxjs/toolkit';

import { TempUnits, ThemeMode } from '../../types/settings';

interface SettingsState {
  theme: ThemeMode;
  tempratureUnit: TempUnits;
}

export const defaultSettingsState: SettingsState = {
  theme: 'light',
  tempratureUnit: 'celsius',
};

const settingsSlice = createSlice({
  name: 'settings',
  initialState: defaultSettingsState,
  reducers: {
    toggleTempratureUnit: (state) => {
      state.tempratureUnit =
        state.tempratureUnit === 'celsius'
          ? 'fahrenheit'
          : state.tempratureUnit === 'fahrenheit'
            ? 'kelvin'
            : 'celsius';
    },
    toggleTheme: (state) => {
      state.theme = state.theme === 'light' ? 'dark' : 'light';
    },
  },
});

export const { toggleTempratureUnit, toggleTheme } = settingsSlice.actions;
export default settingsSlice.reducer;
