import {
  Drawer,
  Box,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
} from '@mui/material';
import { NavLink } from 'react-router-dom';

import { navItems } from '@/consts/drawerList';

type Props = {
  open: boolean;
  onClose: () => void;
  variant: 'temporary';
  width?: number;
};

export default function NavDrawer({ open, onClose, width = 280 }: Props) {
  const paperSx = { width, boxSizing: 'border-box' as const };

  const list = (
    <Box role="presentation" sx={{ width, pt: '2rem' }} onClick={onClose} onKeyDown={onClose}>
      <List>
        {navItems.map(({ to, label, icon: Icon, end }) => (
          <ListItemButton key={to} component={NavLink} to={to} {...(end ? { end: true } : {})}>
            <ListItemIcon>
              <Icon />
            </ListItemIcon>
            <ListItemText primary={label} />
          </ListItemButton>
        ))}
      </List>

      <Divider />
    </Box>
  );

  return (
    <Drawer
      anchor="left"
      variant="temporary"
      open={open}
      onClose={onClose}
      ModalProps={{ keepMounted: true }}
      sx={{ '& .MuiDrawer-paper': paperSx }}
    >
      {list}
    </Drawer>
  );
}
