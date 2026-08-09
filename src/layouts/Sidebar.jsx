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
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  AccountBalance as LoansIcon,
  Payment as EmiIcon,
  TrendingUp as IncomeIcon,
  ReceiptLong as ExpensesIcon,
  Settings as SettingsIcon,
  AccountBalanceWallet,
} from '@mui/icons-material';
import './Layout.css';
import { useState } from 'react';
import { useNavigate } from 'react-router';

const drawerWidth = 260;

const menuItems = [
  { text: 'Dashboard', icon: <DashboardIcon />, name: "dashboard" },
  { text: 'Loans Tracker', icon: <LoansIcon />, name: "loans" },
  { text: 'EMI Management', icon: <EmiIcon />, name: "emi-list" },
  { text: 'Income Tracker', icon: <IncomeIcon />, name: "incomes" },
  { text: 'Expenses', icon: <ExpensesIcon />, name: "expenses" },
  { text: 'Settings', icon: <SettingsIcon />, name: "settings" },
];

export default function Sidebar({ mobileOpen, handleDrawerToggle }) {
  const [activeRoute, setActiveRoute] = useState("dashboard");
  const navigate = useNavigate();

  const handleNavigate = (route = "dashboard") => {
    navigate(route);
    setActiveRoute(route);
  }

  const drawerContent = (
    <Box className="finora-sidebar-inner">
      {/* Brand Header */}
      <Box className="finora-sidebar-brand">
        <AccountBalanceWallet color="primary" fontSize="large" />
        <Typography variant="h5" fontWeight="700" color="primary">
          Finora
        </Typography>
      </Box>
      <Divider sx={{ mb: 2 }} />

      {/* Navigation Links */}
      <List>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding sx={{ mb: 0.5 }} onClick={() => handleNavigate(item?.name)}>
            <ListItemButton
              className={`finora-nav-item ${item?.name === activeRoute ? 'active' : ''}`}
            >
              <ListItemIcon className="finora-nav-icon">{item.icon}</ListItemIcon>
              <ListItemText
                primary={item.text}
                primaryTypographyProps={{ fontWeight: item.active ? 600 : 500 }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <Box component="nav" sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}>
      {/* Mobile Drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', sm: 'none' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
        }}
      >
        {drawerContent}
      </Drawer>

      {/* Desktop Persistent Drawer */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', sm: 'block' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
        }}
        open
      >
        {drawerContent}
      </Drawer>
    </Box>
  );
}