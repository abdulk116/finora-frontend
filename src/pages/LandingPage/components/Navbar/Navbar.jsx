import { useState } from "react";
import {
  AppBar,
  Box,
  Button,
  Container,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Stack,
  Toolbar,
  Typography,
} from "@mui/material";

import { MenuRounded, CloseRounded, ArrowForwardRounded, AccountBalanceWalletRounded } from "@mui/icons-material";

import { Link } from "react-router";

import "./Navbar.css";

const navItems = [
  {
    label: "Features",
    href: "#features",
  },
  {
    label: "How it works",
    href: "#how-it-works",
  },
  {
    label: "Security",
    href: "#security",
  },
];

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen((prev) => !prev);
  };

  const handleNavClick = () => {
    setMobileOpen(false);
  };

  return (
    <>
      <AppBar
        position="fixed"
        elevation={0}
        className="finora-navbar"
      >
        <Container maxWidth="lg">
          <Toolbar
            disableGutters
            className="navbar-toolbar"
          >
            {/* Logo */}
            <Link
              to="/"
              className="finora-logo"
            >
              <Box className="logo-icon">
                <AccountBalanceWalletRounded />
              </Box>

              <Typography className="logo-text">
                Finora
              </Typography>
            </Link>

            {/* Desktop Navigation */}
            <Stack
              direction="row"
              alignItems="center"
              spacing={1}
              className="desktop-nav"
            >
              {navItems.map((item) => (
                <Button
                  key={item.label}
                  href={item.href}
                  className="nav-link"
                >
                  {item.label}
                </Button>
              ))}
            </Stack>

            {/* Desktop Actions */}
            <Stack
              direction="row"
              alignItems="center"
              spacing={1.5}
              className="desktop-actions"
            >
              <Button
                component={Link}
                to="/login"
                className="login-button"
              >
                Login
              </Button>

              <Button
                component={Link}
                to="/login"
                variant="contained"
                endIcon={<ArrowForwardRounded />}
                className="navbar-cta"
              >
                Get Started
              </Button>
            </Stack>

            {/* Mobile Menu Button */}
            <IconButton
              onClick={handleDrawerToggle}
              className="mobile-menu-button"
              aria-label="Open navigation menu"
            >
              <MenuRounded />
            </IconButton>
          </Toolbar>
        </Container>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer
        anchor="right"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        className="mobile-drawer"
      >
        <Box
          className="drawer-content"
          role="presentation"
        >
          {/* Drawer Header */}
          <Box className="drawer-header">
            <Link
              to="/"
              className="finora-logo"
              onClick={handleNavClick}
            >
              <Box className="logo-icon">
                <AccountBalanceWalletRounded />
              </Box>

              <Typography className="logo-text">
                Finora
              </Typography>
            </Link>

            <IconButton
              onClick={handleDrawerToggle}
              aria-label="Close navigation menu"
            >
              <CloseRounded />
            </IconButton>
          </Box>

          {/* Mobile Links */}
          <List className="mobile-nav-list">
            {navItems.map((item) => (
              <ListItem
                disablePadding
                key={item.label}
              >
                <ListItemButton
                  component="a"
                  href={item.href}
                  onClick={handleNavClick}
                  className="mobile-nav-item"
                >
                  <ListItemText
                    primary={item.label}
                  />
                </ListItemButton>
              </ListItem>
            ))}
          </List>

          {/* Mobile Actions */}
          <Stack
            spacing={1.5}
            className="mobile-actions"
          >
            <Button
              component={Link}
              to="/login"
              variant="outlined"
              onClick={handleNavClick}
              className="mobile-login-button"
            >
              Login
            </Button>

            <Button
              component={Link}
              to="/login"
              variant="contained"
              endIcon={<ArrowForwardRounded />}
              onClick={handleNavClick}
              className="mobile-cta"
            >
              Get Started
            </Button>
          </Stack>
        </Box>
      </Drawer>
    </>
  );
};

export default Navbar;