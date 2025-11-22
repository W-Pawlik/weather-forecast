import * as React from 'react';
import { Box } from '@mui/material';

import TopBar from '@/components/layout/TopBar';
import NavDrawer from '@/components/layout/NavDrawer';

export default function Layout({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = React.useState(false);

  return (
    <Box sx={{ display: 'flex' }}>
      <TopBar onMenuClick={() => setOpen(true)} />

      <NavDrawer variant="temporary" open={open} onClose={() => setOpen(false)} width={280} />

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          mt: 8,
        }}
      >
        {children}
      </Box>
    </Box>
  );
}
