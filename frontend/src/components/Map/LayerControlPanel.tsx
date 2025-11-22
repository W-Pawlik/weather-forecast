import { Paper, Stack, ToggleButton, ToggleButtonGroup, Typography } from '@mui/material';

import type { WeatherLayerType } from './WeatherLayer';

interface LayerControlPanelProps {
  activeLayer: WeatherLayerType;
  onChangeLayer: (layer: WeatherLayerType) => void;
  width: number;
}

export default function LayerControlPanel({
  activeLayer,
  onChangeLayer,
  width,
}: LayerControlPanelProps) {
  return (
    <Paper
      elevation={4}
      sx={{
        p: 1.5,
        borderRadius: 3,
        bgcolor: (t) =>
          t.palette.mode === 'dark' ? 'rgba(30,30,30,0.9)' : 'rgba(255,255,255,0.95)',
        width,
      }}
    >
      <Stack spacing={1}>
        <Typography variant="subtitle2">Weather layer</Typography>
        <ToggleButtonGroup
          exclusive
          size="small"
          value={activeLayer}
          onChange={(_, value) => {
            if (!value) return;
            onChangeLayer(value);
          }}
        >
          <ToggleButton value="none">None</ToggleButton>
          <ToggleButton value="temperature">Temp</ToggleButton>
          <ToggleButton value="wind">Wind</ToggleButton>
          <ToggleButton value="precipitation">Rain</ToggleButton>
          <ToggleButton value="clouds">Clouds</ToggleButton>
        </ToggleButtonGroup>
      </Stack>
      <Typography variant="caption" color="text.secondary">
        Click a city marker to see detailed weather and forecast.
      </Typography>
    </Paper>
  );
}
