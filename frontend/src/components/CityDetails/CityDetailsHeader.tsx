import { Stack, IconButton, Typography } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';

interface CityDetailsHeaderProps {
  onBack: () => void;
  isFavorite: boolean;
  onToggleFavorite: () => void;
}

export default function CityDetailsHeader({
  onBack,
  isFavorite,
  onToggleFavorite,
}: CityDetailsHeaderProps) {
  return (
    <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
      <Stack direction="row" alignItems="center" spacing={1}>
        <IconButton onClick={onBack}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="button">Back</Typography>
      </Stack>
      <IconButton onClick={onToggleFavorite} color={isFavorite ? 'error' : 'default'}>
        {isFavorite ? <FavoriteIcon /> : <FavoriteBorderIcon />}
      </IconButton>
    </Stack>
  );
}
