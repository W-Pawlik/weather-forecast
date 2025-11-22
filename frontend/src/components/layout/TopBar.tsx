import { AppBar, Toolbar, IconButton, Typography, Stack } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { Link, useLocation } from 'react-router-dom';

import CitySearch from '@/components/layout/CitySearch';

export default function TopBar({ onMenuClick }: { onMenuClick: () => void }) {
  const pathName = useLocation().pathname;

  return (
    <AppBar position="fixed">
      <Toolbar
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          justifyContent: 'space-between',
          px: '1rem',
        }}
      >
        <Stack direction="row" alignItems="center" spacing={1}>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="open drawer"
            onClick={onMenuClick}
          >
            <MenuIcon />
          </IconButton>
          <Typography
            variant="h6"
            noWrap
            component={Link}
            to="/"
            sx={{ display: { xs: 'none', sm: 'block' }, color: 'inherit', textDecoration: 'none' }}
          >
            WeatherAi
          </Typography>
        </Stack>

        {(pathName === '/' && <CitySearch />) || (pathName === '/map' && <CitySearch />)}
      </Toolbar>
    </AppBar>
  );
}
