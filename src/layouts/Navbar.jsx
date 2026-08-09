import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  InputBase,
  Badge,
  Avatar,
  Box,
  Popper,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Search as SearchIcon,
  Notifications as NotificationsIcon,
} from '@mui/icons-material';
import './Layout.css';
import { useState } from 'react';
import { logout } from '../redux/slices/authSlice';
import { useDispatch } from 'react-redux';

export default function Navbar({ handleDrawerToggle }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const dispatch = useDispatch();

  const handleClick = (event) => {
    setAnchorEl(anchorEl ? null : event.currentTarget);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popper' : undefined;

  const handleLogout = () => {
    dispatch(logout());
    localStorage.clear();
  }

  return (
    <AppBar
      position="fixed"
      elevation={0}
      className="finora-navbar"
      sx={{
        width: { sm: `calc(100% - 260px)` },
        ml: { sm: `260px` },
      }}
    >
      <Toolbar>
        <IconButton
          color="inherit"
          edge="start"
          onClick={handleDrawerToggle}
          sx={{ mr: 2, display: { sm: 'none' } }}
        >
          <MenuIcon />
        </IconButton>

        <Typography variant="h6" noWrap component="div" sx={{ fontWeight: 600 }}>
          Financial Overview
        </Typography>

        <Box sx={{ flexGrow: 1 }} />

        {/* Search Bar */}
        <Box className="finora-search-bar">
          <SearchIcon sx={{ color: 'text.secondary', mr: 1 }} />
          <InputBase placeholder="Search transactions, loans..." fullWidth />
        </Box>

        {/* Actions & Profile */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, ml: 2 }}>
          <IconButton color="inherit">
            <Badge badgeContent={3} color="error">
              <NotificationsIcon color="action" />
            </Badge>
          </IconButton>
          <Avatar
            alt="User Name"
            src="https://i.pravatar.cc/150?img=32"
            sx={{ width: 36, height: 36, cursor: 'pointer' }}
            onClick={handleClick}
          />
          {!!open && <Popper id={id} open={open} anchorEl={anchorEl} style={{ zIndex: 999 }}>
            <Box sx={{ border: 1, p: 1, bgcolor: 'background.paper' }}>
              <div onClick={handleLogout}>Logout</div>
            </Box>
          </Popper>}
        </Box>
      </Toolbar>
    </AppBar>
  );
}