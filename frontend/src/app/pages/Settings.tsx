import { Typography } from '@mui/material';

export default function Settings() {
  return (
    <>
      <Typography variant="h4" gutterBottom>
        Settings Page
      </Typography>
      <Typography>
        Wpisz nazwę miasta w pasku wyszukiwania u góry, aby zobaczyć aktualną pogodę z OpenWeather.
      </Typography>
    </>
  );
}
