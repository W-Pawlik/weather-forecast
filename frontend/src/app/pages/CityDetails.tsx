import { useNavigate, useParams } from 'react-router-dom';
import { Box, IconButton, Typography } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

import CityCard from '@/components/Home/CityCard';

export default function CityDetails() {
  const navigate = useNavigate();
  const { cityName } = useParams<{ cityName: string }>();

  if (!cityName) {
    return <Typography>No city name in the address.</Typography>;
  }

  const decodedCityName = decodeURIComponent(cityName);

  return (
    <Box sx={{ p: 2 }}>
      <IconButton onClick={() => navigate(-1)}>
        <ArrowBackIcon sx={{ mr: 1 }} />
        <Typography variant="button">Go back</Typography>
      </IconButton>

      <CityCard cityName={decodedCityName} />
    </Box>
  );
}
