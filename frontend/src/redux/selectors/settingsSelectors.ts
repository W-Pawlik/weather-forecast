import { RootState } from '../store';

export const selectTempratureUnit = (state: RootState) => state.settings.tempratureUnit;

export const selectTheme = (state: RootState) => state.settings.theme;
