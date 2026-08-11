import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Box,
  Divider,
} from "@mui/material";

import {
  DashboardRounded,
  AccountBalanceRounded,
  PaymentsRounded,
  TrendingUpRounded,
  ReceiptLongRounded,
  SettingsRounded,
  AccountBalanceWalletRounded,
  AssessmentRounded,
} from "@mui/icons-material";

import { useLocation, useNavigate } from "react-router";

import "./Layout.css";

const DRAWER_WIDTH = 260;

const menuItems = [
  {
    text: "Dashboard",
    icon: <DashboardRounded />,
    path: "/dashboard",
  },

  {
    text: "Loans Tracker",
    icon: <AccountBalanceRounded />,
    path: "/loans",
  },

  {
    text: "EMI Management",
    icon: <PaymentsRounded />,
    path: "/emi-list",
  },

  {
    text: "Income Tracker",
    icon: <TrendingUpRounded />,
    path: "/incomes",
  },

  {
    text: "Expenses",
    icon: <ReceiptLongRounded />,
    path: "/expenses",
  },

  {
    text: "Reports",
    icon: <AssessmentRounded />,
    path: "/reports",
  },

  {
    text: "Settings",
    icon: <SettingsRounded />,
    path: "/settings",
  },
];

export default function Sidebar({
  mobileOpen,
  handleDrawerToggle,
}) {
  const navigate = useNavigate();
  const location = useLocation();

  // =========================================================
  // NAVIGATION
  // =========================================================

  const handleNavigate = (path) => {
    navigate(path);

    // Close temporary mobile drawer
    if (mobileOpen) {
      handleDrawerToggle();
    }
  };

  // =========================================================
  // ACTIVE ROUTE
  // =========================================================

  const isRouteActive = (path) => {
    if (path === "/dashboard") {
      return location.pathname === "/dashboard";
    }

    return (
      location.pathname === path ||
      location.pathname.startsWith(`${path}/`)
    );
  };

  // =========================================================
  // DRAWER CONTENT
  // =========================================================

  const drawerContent = (
    <Box className="finora-sidebar-inner">

      {/* =====================================================
          BRAND
      ===================================================== */}

      <Box className="finora-sidebar-brand">

        <Box className="finora-sidebar-brand-icon">
          <AccountBalanceWalletRounded />
        </Box>

        <Box>
          <Typography
            component="div"
            className="finora-sidebar-brand-text"
          >
            Finora
          </Typography>

          <Typography className="finora-sidebar-brand-subtitle">
            Personal Finance
          </Typography>
        </Box>

      </Box>

      <Divider className="finora-sidebar-divider" />

      {/* =====================================================
          MAIN NAVIGATION
      ===================================================== */}

      <Typography className="finora-nav-section-label">
        Overview
      </Typography>

      <List
        component="nav"
        disablePadding
      >
        {menuItems
          .slice(0, 1)
          .map((item) => {
            const active = isRouteActive(
              item.path
            );

            return (
              <ListItem
                key={item.path}
                disablePadding
              >
                <ListItemButton
                  selected={active}
                  onClick={() =>
                    handleNavigate(item.path)
                  }
                  className={`finora-nav-item ${
                    active ? "active" : ""
                  }`}
                >
                  <ListItemIcon className="finora-nav-icon">
                    {item.icon}
                  </ListItemIcon>

                  <ListItemText
                    primary={item.text}
                  />
                </ListItemButton>
              </ListItem>
            );
          })}
      </List>

      {/* =====================================================
          MONEY MANAGEMENT
      ===================================================== */}

      <Typography className="finora-nav-section-label">
        Money Management
      </Typography>

      <List
        component="nav"
        disablePadding
      >
        {menuItems
          .slice(1, 5)
          .map((item) => {
            const active = isRouteActive(
              item.path
            );

            return (
              <ListItem
                key={item.path}
                disablePadding
              >
                <ListItemButton
                  selected={active}
                  onClick={() =>
                    handleNavigate(item.path)
                  }
                  className={`finora-nav-item ${
                    active ? "active" : ""
                  }`}
                >
                  <ListItemIcon className="finora-nav-icon">
                    {item.icon}
                  </ListItemIcon>

                  <ListItemText
                    primary={item.text}
                  />
                </ListItemButton>
              </ListItem>
            );
          })}
      </List>

      {/* =====================================================
          ANALYTICS
      ===================================================== */}

      <Typography className="finora-nav-section-label">
        Analytics
      </Typography>

      <List
        component="nav"
        disablePadding
      >
        {menuItems
          .slice(5, 6)
          .map((item) => {
            const active = isRouteActive(
              item.path
            );

            return (
              <ListItem
                key={item.path}
                disablePadding
              >
                <ListItemButton
                  selected={active}
                  onClick={() =>
                    handleNavigate(item.path)
                  }
                  className={`finora-nav-item ${
                    active ? "active" : ""
                  }`}
                >
                  <ListItemIcon className="finora-nav-icon">
                    {item.icon}
                  </ListItemIcon>

                  <ListItemText
                    primary={item.text}
                  />
                </ListItemButton>
              </ListItem>
            );
          })}
      </List>

      {/* =====================================================
          SETTINGS
      ===================================================== */}

      <Box className="finora-sidebar-bottom">

        <Divider className="finora-sidebar-divider" />

        {menuItems
          .slice(6)
          .map((item) => {
            const active = isRouteActive(
              item.path
            );

            return (
              <ListItem
                key={item.path}
                disablePadding
              >
                <ListItemButton
                  selected={active}
                  onClick={() =>
                    handleNavigate(item.path)
                  }
                  className={`finora-nav-item ${
                    active ? "active" : ""
                  }`}
                >
                  <ListItemIcon className="finora-nav-icon">
                    {item.icon}
                  </ListItemIcon>

                  <ListItemText
                    primary={item.text}
                  />
                </ListItemButton>
              </ListItem>
            );
          })}

      </Box>

    </Box>
  );

  // =========================================================
  // DRAWERS
  // =========================================================

  return (
    <Box
      component="nav"
      sx={{
        width: {
          sm: DRAWER_WIDTH,
        },

        flexShrink: {
          sm: 0,
        },
      }}
    >

      {/* =====================================================
          MOBILE DRAWER
      ===================================================== */}

      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true,
        }}
        sx={{
          display: {
            xs: "block",
            sm: "none",
          },

          "& .MuiDrawer-paper": {
            boxSizing: "border-box",
            width: DRAWER_WIDTH,
          },
        }}
      >
        {drawerContent}
      </Drawer>

      {/* =====================================================
          DESKTOP DRAWER
      ===================================================== */}

      <Drawer
        variant="permanent"
        open
        sx={{
          display: {
            xs: "none",
            sm: "block",
          },

          "& .MuiDrawer-paper": {
            boxSizing: "border-box",
            width: DRAWER_WIDTH,
          },
        }}
      >
        {drawerContent}
      </Drawer>

    </Box>
  );
}