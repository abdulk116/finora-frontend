import React, { useState } from 'react';
import {
  Box,
  Paper,
  Button,
  Menu,
  MenuItem,
  TextField,
  Typography,
  Stack,
  Divider,
} from '@mui/material';
import {CalendarMonth, FilterAlt} from '@mui/icons-material';

export default function DateRangeFilter({ onFilterChange }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  // Filter Modes: 'this_month' | 'last_month' | 'custom'
  const [filterMode, setFilterMode] = useState('this_month');

  // Dates state (YYYY-MM-DD)
  const today = new Date();
  const firstDayThisMonth = new Date(today.getFullYear(), today.getMonth(), 1)
    .toISOString()
    .split('T')[0];
  const lastDayThisMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0)
    .toISOString()
    .split('T')[0];

  const [startDate, setStartDate] = useState(firstDayThisMonth);
  const [endDate, setEndDate] = useState(lastDayThisMonth);
  const [selectedMonth, setSelectedMonth] = useState(
    `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`
  );

  const handleClick = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  // Preset Handlers
  const handleSelectThisMonth = () => {
    const start = new Date(today.getFullYear(), today.getMonth(), 1)
      .toISOString()
      .split('T')[0];
    const end = new Date(today.getFullYear(), today.getMonth() + 1, 0)
      .toISOString()
      .split('T')[0];

    setStartDate(start);
    setEndDate(end);
    setFilterMode('this_month');
    onFilterChange({ startDate: start, endDate: end, mode: 'this_month' });
    handleClose();
  };

  const handleSelectLastMonth = () => {
    const start = new Date(today.getFullYear(), today.getMonth() - 1, 1)
      .toISOString()
      .split('T')[0];
    const end = new Date(today.getFullYear(), today.getMonth(), 0)
      .toISOString()
      .split('T')[0];

    setStartDate(start);
    setEndDate(end);
    setFilterMode('last_month');
    onFilterChange({ startDate: start, endDate: end, mode: 'last_month' });
    handleClose();
  };

  const handleMonthPickerChange = (e) => {
    const value = e.target.value; // Format: "YYYY-MM"
    if (!value) return;

    setSelectedMonth(value);
    const [year, month] = value.split('-').map(Number);

    const start = new Date(year, month - 1, 1).toISOString().split('T')[0];
    const end = new Date(year, month, 0).toISOString().split('T')[0];

    setStartDate(start);
    setEndDate(end);
    setFilterMode('month_picker');
    onFilterChange({ startDate: start, endDate: end, mode: 'month_picker', year, month });
    handleClose();
  };

  const handleCustomApply = () => {
    if (!startDate || !endDate) return;
    setFilterMode('custom');
    onFilterChange({ startDate, endDate, mode: 'custom' });
    handleClose();
  };

  return (
    <Box>
      {/* Trigger Button */}
      <Button
        variant="outlined"
        startIcon={<CalendarMonth />}
        endIcon={<FilterAlt fontSize="small" />}
        onClick={handleClick}
        sx={{ borderRadius: 2, textTransform: 'none', px: 2 }}
      >
        {startDate} to {endDate}
      </Button>

      {/* Popover Menu */}
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        PaperProps={{
          elevation: 3,
          sx: { p: 2, minWidth: 280, borderRadius: 2 },
        }}
      >
        <Typography variant="subtitle2" fontWeight="bold" sx={{ mb: 1.5 }}>
          Filter Expense Period
        </Typography>

        {/* Quick Presets */}
        <Stack spacing={1} sx={{ mb: 2 }}>
          <Button
            size="small"
            variant={filterMode === 'this_month' ? 'contained' : 'text'}
            onClick={handleSelectThisMonth}
            fullWidth
            sx={{ justifyContent: 'flex-start' }}
          >
            This Month
          </Button>
          <Button
            size="small"
            variant={filterMode === 'last_month' ? 'contained' : 'text'}
            onClick={handleSelectLastMonth}
            fullWidth
            sx={{ justifyContent: 'flex-start' }}
          >
            Last Month
          </Button>
        </Stack>

        <Divider sx={{ my: 1.5 }} />

        {/* Month Picker */}
        <Box sx={{ mb: 2 }}>
          <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 0.5 }}>
            Select Specific Month
          </Typography>
          <TextField
            type="month"
            size="small"
            value={selectedMonth}
            onChange={handleMonthPickerChange}
            fullWidth
            InputLabelProps={{ shrink: true }}
          />
        </Box>

        <Divider sx={{ my: 1.5 }} />

        {/* Custom Range Selection */}
        <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 1 }}>
          Custom Date Range
        </Typography>
        <Stack spacing={1.5}>
          <TextField
            label="From"
            type="date"
            size="small"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
            fullWidth
          />
          <TextField
            label="To"
            type="date"
            size="small"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
            fullWidth
          />
          <Button
            variant="contained"
            size="small"
            onClick={handleCustomApply}
            fullWidth
            sx={{ mt: 1 }}
          >
            Apply Range
          </Button>
        </Stack>
      </Menu>
    </Box>
  );
}