import { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Select,
  MenuItem,
  Chip,
  ToggleButtonGroup,
  ToggleButton,
  IconButton,
  Button,
  Container,
} from '@mui/material';

import {
  ViewList,
  CalendarMonth,
  Add as AddIcon,
  CheckCircleOutlined,
  ErrorOutlined,
  AccessTime
} from '@mui/icons-material';
import DateRangeFilter from './Components/DateRangeFilter';
import AddExpenseModal from './Modals/AddExpenseModal';
import expensesApi from '../../api/expensesApi';

const getFormatedMonth = {
  0: 'Jan',
  1: "Feb",
  2: "Mar",
  3: "Apr",
  4: "May",
  5: "Jun",
  6: "Jul",
  7: "Aug",
  8: "Sep",
  9: "Oct",
  10: "Nov",
  11: "Dec"

}

// Custom Status Chip Renderer
const StatusChip = ({ status, onChange }) => {
  const getProps = () => {
    switch (status) {
      case 'Completed':
        return { color: 'success', icon: <CheckCircleOutlined /> };
      case 'Overdue':
        return { color: 'error', icon: <ErrorOutlined /> };
      case 'Pending':
      default:
        return { color: 'warning', icon: <AccessTime /> };
    }
  };

  const { color } = getProps();

  return (
    <Select
      value={status}
      onChange={(e) => onChange(e.target.value)}
      size="small"
      variant="standard"
      disableUnderline
      sx={{
        '& .MuiSelect-select': {
          p: 0,
        },
      }}
    >
      <MenuItem value="Completed">
        <Chip label="Completed" color="success" size="small" />
      </MenuItem>
      <MenuItem value="Pending">
        <Chip label="Pending" color="warning" size="small" />
      </MenuItem>
      <MenuItem value="Overdue">
        <Chip label="Overdue" color="error" size="small" />
      </MenuItem>
    </Select>
  );
};

const earnAmountPerDay = (balanceAmt = 0) => {
  const now = new Date();
  const totalDays = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
  const currentDate = now.getDate();
  const earnAmtPerDay = balanceAmt / (totalDays - currentDate)

  return (
    <>
      <div>₹{Math.ceil(earnAmtPerDay)} / day</div>
      <div>{(totalDays - currentDate)} days left</div>
    </>
  )
}

export default function MonthlyExpenses() {
  const [viewMode, setViewMode] = useState('table'); // 'table' | 'calendar'
  const [selectedMonth, setSelectedMonth] = useState(3); // March
  const [selectedYear, setSelectedYear] = useState(2026);

  // Mock initial state based on sheet image
  const [data, setData] = useState({
    summary: { totalAmount: 0, paidAmount: 0, balanceAmount: 0 },
    expenses: []
  });
  const [modalOpen, setModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const activeExpenses = data?.expenses?.filter((item) => item?.status !== "Completed")?.length || 0;

  const handleStatusChange = async (id, newStatus) => {
    if (!id) return;

    try {
      const payload = {
        expenseId: id,
        status: newStatus
      }
      const res = await expensesApi?.updateExpenseStatus(payload)

      if (res?.success) {
        getExpensesList();
      }
    } catch (error) {
      console.log("Error in update expense status", error?.message)
    }
  };

  // Fetch expenses when filter date changes
  const handleFilterChange = async ({ startDate, endDate }) => {
    // try {
    //   setLoading(true);
    //   // Fetch expenses between start and end dates from backend
    //   const response = await expenseApi.getExpensesByRange(startDate, endDate);
    //   setExpenses(response.expenses);
    // } catch (error) {
    //   console.error('Failed to fetch filtered expenses:', error);
    // } finally {
    //   setLoading(false);
    // }
  };

  const handleCreateExpense = async (payload) => {
    try {
      setSubmitting(true);

      // Send API request
      const res = await expensesApi.createExpenses(payload);
      if (res?.success) {
        getExpensesList();
      }

      setModalOpen(false);
    } catch (error) {
      console.error('Failed to create expense:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const getExpensesList = async () => {
    try {
      const res = await expensesApi?.getAllExpensesByUserId();

      if (res?.success) {
        const expensesList = res?.data || [];

        // Calculate all summary metrics in a single O(N) iteration
        const summary = expensesList.reduce(
          (acc, item) => {
            const amount = Number(item?.amount) || 0;
            const status = item?.status;

            acc.totalAmount += amount;

            if (status === 'Completed') {
              acc.paidAmount += amount;
            } else if (status === 'Pending' || status === 'Overdue') {
              acc.balanceAmount += amount;
            }

            return acc;
          },
          { totalAmount: 0, paidAmount: 0, balanceAmount: 0 } // Initial values
        );

        setData({
          summary,
          expenses: expensesList,
        });
      } else {
        // Fallback state if API returns success: false or empty payload
        setData({
          summary: { totalAmount: 0, paidAmount: 0, balanceAmount: 0 },
          expenses: [],
        });
      }
    } catch (error) {
      console.error('Error in get expenses list:', error?.message || error);
    }
  };

  useEffect(() => {
    getExpensesList();
  }, []);

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header & Controls */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" fontWeight="bold">
          My Accounts - Monthly Expenses - {getFormatedMonth[new Date().getMonth()]}
        </Typography>

        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <ToggleButtonGroup
            value={viewMode}
            exclusive
            onChange={(e, val) => val && setViewMode(val)}
            size="small"
          >
            <ToggleButton value="table">
              <ViewList sx={{ mr: 0.5 }} /> Table
            </ToggleButton>
            <ToggleButton value="calendar">
              <CalendarMonth sx={{ mr: 0.5 }} /> Calendar
            </ToggleButton>
          </ToggleButtonGroup>

          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setModalOpen(true)}
          >
            Add Expense
          </Button>
        </Box>
      </Box>

      {/* Summary Cards */}
      <Grid container spacing={2} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={4}>
          <Card variant="outlined" sx={{ bgcolor: 'action.hover' }}>
            <CardContent>
              <Typography color="text.secondary" variant="body2">
                Total Expenses
              </Typography>
              <Typography variant="h5" fontWeight="bold">
                ₹{data.summary.totalAmount.toLocaleString('en-IN')}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card variant="outlined" sx={{ borderColor: 'success.main', bgcolor: '#f0fdf4' }}>
            <CardContent>
              <Typography color="success.dark" variant="body2" fontWeight="500">
                Paid Amount
              </Typography>
              <Typography variant="h5" fontWeight="bold" color="success.main">
                ₹{data.summary.paidAmount.toLocaleString('en-IN')}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card variant="outlined" sx={{ borderColor: 'error.main', bgcolor: '#fef2f2' }}>
            <CardContent>
              <Typography color="error.dark" variant="body2" fontWeight="500">
                Balance Amount
              </Typography>
              <Typography variant="h5" fontWeight="bold" color="error.main">
                ₹{data.summary.balanceAmount.toLocaleString('en-IN')}
              </Typography>
              <Typography fontWeight="bold" color="error.main">
                {/* ₹{data.summary.balanceAmount.toLocaleString('en-IN')} */}
                {earnAmountPerDay(data.summary.balanceAmount)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card variant="outlined">
            <CardContent>
              <Typography color="error.dark" variant="body2" fontWeight="500">
                Active vs Closed
              </Typography>
              <Typography variant="h5" fontWeight="bold" color="error.main">
                {activeExpenses} / {data?.expenses?.length}
              </Typography>
              <Typography fontWeight="bold" color="error.main">
                {data?.expenses?.length - activeExpenses} expenses fully paid off
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" fontWeight="bold">
          Expense Tracker
        </Typography>

        {/* Date Range Filter */}
        <DateRangeFilter onFilterChange={handleFilterChange} />
      </Box>

      {/* Table View */}
      {viewMode === 'table' ? (
        <TableContainer component={Paper} elevation={1} sx={{ borderRadius: 2 }}>
          <Table>
            <TableHead sx={{ backgroundColor: 'action.hover' }}>
              <TableRow>
                <TableCell fontWeight="bold">Sl</TableCell>
                <TableCell fontWeight="bold">Date</TableCell>
                <TableCell fontWeight="bold">Related</TableCell>
                <TableCell fontWeight="bold" align="right">
                  Amount
                </TableCell>
                <TableCell fontWeight="bold" align="center">
                  Status
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.expenses.map((row, index) => (
                <TableRow key={row._id} hover>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{
                    new Date(row.dueDate).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })
                  }</TableCell>
                  <TableCell fontWeight="500">{row.related}</TableCell>
                  <TableCell align="right">₹{row.amount.toLocaleString('en-IN')}</TableCell>
                  <TableCell align="center">
                    <StatusChip
                      status={row.status}
                      onChange={(newStatus) => handleStatusChange(row._id, newStatus)}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        /* Simple Calendar View Grid */
        <Paper sx={{ p: 3, borderRadius: 2 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            March 2026 Expense Calendar
          </Typography>
          <Grid container spacing={1}>
            {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => {
              const dayStr = `2026-03-${String(day).padStart(2, '0')}`;
              const dayExpenses = data.expenses.filter((e) => e.dueDate === dayStr);

              return (
                <Grid item xs={12} sm={6} md={1.7} key={day}>
                  <Box
                    sx={{
                      border: '1px solid',
                      borderColor: 'divider',
                      borderRadius: 1,
                      p: 1,
                      minHeight: 90,
                      bgcolor: dayExpenses.length ? 'action.hover' : 'background.paper',
                    }}
                  >
                    <Typography variant="caption" fontWeight="bold" color="text.secondary">
                      {day}
                    </Typography>
                    {dayExpenses.map((exp) => (
                      <Box
                        key={exp.id}
                        sx={{
                          fontSize: '0.7rem',
                          p: 0.5,
                          mt: 0.5,
                          borderRadius: 0.5,
                          bgcolor:
                            exp.status === 'Completed'
                              ? '#dcfce7'
                              : exp.status === 'Overdue'
                                ? '#fee2e2'
                                : '#fef3c7',
                          color:
                            exp.status === 'Completed'
                              ? '#166534'
                              : exp.status === 'Overdue'
                                ? '#991b1b'
                                : '#92400e',
                        }}
                      >
                        {exp.related}: ₹{exp.amount}
                      </Box>
                    ))}
                  </Box>
                </Grid>
              );
            })}
          </Grid>
        </Paper>
      )}

      <AddExpenseModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleCreateExpense}
        loading={submitting}
      />
    </Container>
  );
}