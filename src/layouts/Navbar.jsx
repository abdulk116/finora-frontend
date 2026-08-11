import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  InputBase,
  Badge,
  Avatar,
  Box,
  Menu,
  MenuItem,
  Divider,
  ListItemIcon,
  ListItemText,
} from "@mui/material";

import {
  Menu as MenuIcon,
  Search as SearchIcon,
  NotificationsNoneRounded,
  LogoutRounded,
  PersonRounded,
  SettingsRounded,
} from "@mui/icons-material";

import { useState } from "react";
import { useDispatch } from "react-redux";

import { logout } from "../redux/slices/authSlice";

import "./Layout.css";

const NAVBAR_HEIGHT = 64;

export default function Navbar({ handleDrawerToggle }) {
  const dispatch = useDispatch();

  const [anchorEl, setAnchorEl] = useState(null);

  const menuOpen = Boolean(anchorEl);

  // =========================================================
  // PROFILE MENU
  // =========================================================

  const handleProfileClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileClose = () => {
    setAnchorEl(null);
  };

  // =========================================================
  // LOGOUT
  // =========================================================

  const handleLogout = () => {
    handleProfileClose();

    dispatch(logout());

    localStorage.clear();
  };

  return (
    <AppBar
      position="fixed"
      elevation={0}
      className="finora-navbar"
      sx={{
        width: {
          xs: "100%",
          sm: "calc(100% - 260px)",
        },

        ml: {
          xs: 0,
          sm: "260px",
        },

        height: NAVBAR_HEIGHT,
      }}
    >
      <Toolbar
        sx={{
          minHeight: `${NAVBAR_HEIGHT}px !important`,
          px: {
            xs: 1.5,
            sm: 2.5,
          },
        }}
      >

        {/* ===================================================
            MOBILE MENU
        =================================================== */}

        <IconButton
          aria-label="Open navigation menu"
          onClick={handleDrawerToggle}
          className="finora-mobile-menu-button"
          sx={{
            display: {
              xs: "inline-flex",
              sm: "none",
            },
          }}
        >
          <MenuIcon />
        </IconButton>

        {/* ===================================================
            PAGE TITLE
        =================================================== */}

        <Box className="finora-navbar-title-wrapper">
          <Typography
            component="h1"
            className="finora-navbar-title"
          >
            Financial Overview
          </Typography>

          <Typography className="finora-navbar-subtitle">
            Manage your finances with clarity
          </Typography>
        </Box>

        {/* ===================================================
            SPACER
        =================================================== */}

        <Box sx={{ flexGrow: 1 }} />

        {/* ===================================================
            SEARCH
        =================================================== */}

        <Box className="finora-search-bar">
          <SearchIcon className="finora-search-icon" />

          <InputBase
            placeholder="Search transactions, loans..."
            fullWidth
            inputProps={{
              "aria-label":
                "Search transactions and loans",
            }}
            className="finora-search-input"
          />
        </Box>

        {/* ===================================================
            NOTIFICATION
        =================================================== */}

        <IconButton
          aria-label="Notifications"
          className="finora-navbar-action"
        >
          <Badge
            badgeContent={3}
            color="primary"
            overlap="circular"
            className="finora-notification-badge"
          >
            <NotificationsNoneRounded />
          </Badge>
        </IconButton>

        {/* ===================================================
            PROFILE
        =================================================== */}

        <IconButton
          onClick={handleProfileClick}
          aria-label="Open account menu"
          aria-controls={
            menuOpen
              ? "finora-account-menu"
              : undefined
          }
          aria-haspopup="true"
          aria-expanded={
            menuOpen ? "true" : undefined
          }
          className="finora-profile-button"
        >
          <Avatar
            alt="User profile"
            className="finora-profile-avatar"
          >
            U
          </Avatar>
        </IconButton>

        {/* ===================================================
            PROFILE MENU
        =================================================== */}

        <Menu
          id="finora-account-menu"
          anchorEl={anchorEl}
          open={menuOpen}
          onClose={handleProfileClose}
          onClick={handleProfileClose}
          transformOrigin={{
            horizontal: "right",
            vertical: "top",
          }}
          anchorOrigin={{
            horizontal: "right",
            vertical: "bottom",
          }}
          slotProps={{
            paper: {
              className: "finora-account-menu",
            },
          }}
        >

          {/* User */}

          <MenuItem
            className="finora-account-user"
            disableRipple
          >
            <ListItemIcon>
              <PersonRounded />
            </ListItemIcon>

            <ListItemText
              primary="My Account"
              secondary="Manage your profile"
            />
          </MenuItem>

          <Divider />

          {/* Settings */}

          <MenuItem>
            <ListItemIcon>
              <SettingsRounded />
            </ListItemIcon>

            <ListItemText primary="Settings" />
          </MenuItem>

          {/* Logout */}

          <MenuItem
            onClick={handleLogout}
            className="finora-logout-item"
          >
            <ListItemIcon>
              <LogoutRounded />
            </ListItemIcon>

            <ListItemText primary="Logout" />
          </MenuItem>

        </Menu>

      </Toolbar>
    </AppBar>
  );
}