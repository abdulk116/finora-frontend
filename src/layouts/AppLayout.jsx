import { useState } from "react";
import { Box, Toolbar } from "@mui/material";

import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

import "./Layout.css";

const SIDEBAR_WIDTH = 260;

export default function AppLayout({ children }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen((current) => !current);
  };

  return (
    <Box className="finora-app-layout">

      {/* =====================================================
          TOP NAVBAR
      ===================================================== */}

      <Navbar
        handleDrawerToggle={handleDrawerToggle}
      />

      {/* =====================================================
          SIDEBAR
      ===================================================== */}

      <Sidebar
        mobileOpen={mobileOpen}
        handleDrawerToggle={handleDrawerToggle}
      />

      {/* =====================================================
          MAIN CONTENT
      ===================================================== */}

      <Box
        component="main"
        className="finora-main-content"
        sx={{
          ml: {
            xs: 0,
            md: `${SIDEBAR_WIDTH}px`,
          },
        }}
      >
        {/* AppBar spacer */}
        <Toolbar />

        <Box className="finora-page-container">
          {children}
        </Box>
      </Box>
    </Box>
  );
}