import { configureStore, createSlice, PayloadAction } from '@reduxjs/toolkit';

type Units = 'metric' | 'imperial';
type ThemeMode = 'light' | 'dark';

interface SettingsState {
  units: Units;
  theme: ThemeMode;
  lang: 'pl' | 'en';
}

const initialState: SettingsState = {
  units: 'metric',
  theme: 'light',
  lang: 'pl',
};

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    setUnits: (s, a: PayloadAction<Units>) => void (s.units = a.payload),
    toggleTheme: (s) => void (s.theme = s.theme === 'light' ? 'dark' : 'light'),
    setLang: (s, a: PayloadAction<'pl' | 'en'>) => void (s.lang = a.payload),
  },
});

export const { setUnits, toggleTheme, setLang } = settingsSlice.actions;

export const store = configureStore({
  reducer: {
    settings: settingsSlice.reducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
