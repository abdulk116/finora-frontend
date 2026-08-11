import { useCallback, useEffect, useMemo, useState } from 'react';
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
  Button,
  Container,
  TextField,
  InputAdornment,
  Skeleton,
  Menu,
  ListItemIcon,
  ListItemText,
} from '@mui/material';

import {
  ViewList,
  CalendarMonth,
  Add as AddIcon,
  CheckCircleOutlined,
  ErrorOutlined,
  AccessTime,
  Search,
  ReceiptLong,
  TrendingUp,
  AccountBalanceWallet,
  MoreVert,
  Refresh,
} from '@mui/icons-material';

import DateRangeFilter from './Components/DateRangeFilter';
import AddExpenseModal from './Modals/AddExpenseModal';
import expensesApi from '../../api/expensesApi';

import './Expenses.css';
import ExpenseCalendar from './Components/ExpenseCalendar';
import ExpenseSummaryCards from './Components/ExpenseSummaryCards';


/* -------------------------------------------------------------------------- */
/* Helpers                                                                    */
/* -------------------------------------------------------------------------- */

const STATUS_OPTIONS = ['All', 'Completed', 'Pending', 'Overdue'];

const formatCurrency = (amount = 0) =>
  `₹${Number(amount || 0).toLocaleString('en-IN')}`;

const formatDate = (date) => {
  if (!date) return '-';

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return '-';
  }

  return parsedDate.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};

const getStatusConfig = (status) => {
  switch (status) {
    case 'Completed':
      return {
        color: 'success',
        icon: <CheckCircleOutlined fontSize="small" />,
      };

    case 'Overdue':
      return {
        color: 'error',
        icon: <ErrorOutlined fontSize="small" />,
      };

    case 'Pending':
    default:
      return {
        color: 'warning',
        icon: <AccessTime fontSize="small" />,
      };
  }
};


/* -------------------------------------------------------------------------- */
/* Status Chip                                                                */
/* -------------------------------------------------------------------------- */

const StatusChip = ({ status, onChange, disabled = false }) => {
  const config = getStatusConfig(status);

  return (
    <Select
      value={status}
      onChange={(event) => onChange(event.target.value)}
      size="small"
      variant="standard"
      disableUnderline
      disabled={disabled}
      renderValue={() => (
        <Chip
          label={status}
          color={config.color}
          icon={config.icon}
          size="small"
          variant="outlined"
          sx={{
            fontWeight: 600,
            cursor: disabled ? 'default' : 'pointer',
          }}
        />
      )}
      sx={{
        minWidth: 115,

        '& .MuiSelect-select': {
          padding: 0,
          display: 'flex',
          alignItems: 'center',
        },

        '& .MuiSelect-icon': {
          display: 'none',
        },
      }}
    >
      <MenuItem value="Completed">
        <Chip
          label="Completed"
          color="success"
          size="small"
          variant="outlined"
        />
      </MenuItem>

      <MenuItem value="Pending">
        <Chip
          label="Pending"
          color="warning"
          size="small"
          variant="outlined"
        />
      </MenuItem>

      <MenuItem value="Overdue">
        <Chip
          label="Overdue"
          color="error"
          size="small"
          variant="outlined"
        />
      </MenuItem>
    </Select>
  );
};


/* -------------------------------------------------------------------------- */
/* Summary Card                                                               */
/* -------------------------------------------------------------------------- */

const SummaryCard = ({
  title,
  value,
  subtitle,
  icon,
  className = '',
}) => {
  return (
    <Card
      elevation={0}
      className={`finora-expense-summary-card ${className}`}
    >
      <CardContent>
        <Box className="finora-expense-summary-top">
          <Box className="finora-expense-summary-icon">
            {icon}
          </Box>
        </Box>

        <Typography
          variant="body2"
          color="text.secondary"
          className="finora-expense-summary-title"
        >
          {title}
        </Typography>

        <Typography
          variant="h5"
          className="finora-expense-summary-value"
        >
          {value}
        </Typography>

        {subtitle && (
          <Typography
            variant="caption"
            color="text.secondary"
            className="finora-expense-summary-subtitle"
          >
            {subtitle}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
};


/* -------------------------------------------------------------------------- */
/* Loading Skeleton                                                           */
/* -------------------------------------------------------------------------- */

const ExpenseTableSkeleton = () => {
  return (
    <>
      {Array.from({ length: 5 }).map((_, index) => (
        <TableRow key={index}>
          <TableCell>
            <Skeleton width={30} />
          </TableCell>

          <TableCell>
            <Skeleton width={100} />
          </TableCell>

          <TableCell>
            <Skeleton width={140} />
          </TableCell>

          <TableCell align="right">
            <Skeleton width={90} sx={{ ml: 'auto' }} />
          </TableCell>

          <TableCell align="center">
            <Skeleton width={100} sx={{ mx: 'auto' }} />
          </TableCell>
        </TableRow>
      ))}
    </>
  );
};


/* -------------------------------------------------------------------------- */
/* Main Component                                                             */
/* -------------------------------------------------------------------------- */

export default function MonthlyExpenses() {
  const [viewMode, setViewMode] = useState('table');

  const [data, setData] = useState({
    summary: {
      totalAmount: 0,
      paidAmount: 0,
      balanceAmount: 0,
    },
    expenses: [],
  });

  const [modalOpen, setModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  const [selectedDateRange, setSelectedDateRange] = useState({
    startDate: null,
    endDate: null,
  });

  const [menuAnchor, setMenuAnchor] = useState(null);
  const [selectedExpense, setSelectedExpense] = useState(null);


  /* ---------------------------------------------------------------------- */
  /* Fetch Expenses                                                         */
  /* ---------------------------------------------------------------------- */

  const getExpensesList = useCallback(async () => {
    try {
      setLoading(true);

      const res = await expensesApi?.getAllExpensesByUserId();

      if (res?.success) {
        const expensesList = Array.isArray(res?.data)
          ? res.data
          : [];

        const summary = expensesList.reduce(
          (acc, item) => {
            const amount = Number(item?.amount) || 0;

            acc.totalAmount += amount;

            if (item?.status === 'Completed') {
              acc.paidAmount += amount;
            } else {
              acc.balanceAmount += amount;
            }

            return acc;
          },
          {
            totalAmount: 0,
            paidAmount: 0,
            balanceAmount: 0,
          }
        );

        setData({
          summary,
          expenses: expensesList,
        });
      } else {
        setData({
          summary: {
            totalAmount: 0,
            paidAmount: 0,
            balanceAmount: 0,
          },
          expenses: [],
        });
      }
    } catch (error) {
      console.error(
        'Error fetching expenses:',
        error?.message || error
      );
    } finally {
      setLoading(false);
    }
  }, []);


  /* ---------------------------------------------------------------------- */
  /* Initial API Call                                                       */
  /* ---------------------------------------------------------------------- */

  useEffect(() => {
    getExpensesList();
  }, [getExpensesList]);


  /* ---------------------------------------------------------------------- */
  /* Filter Expenses                                                        */
  /* ---------------------------------------------------------------------- */

  const filteredExpenses = useMemo(() => {
    const search = searchTerm.trim().toLowerCase();

    return data.expenses.filter((expense) => {
      const matchesSearch =
        !search ||
        expense?.related?.toLowerCase?.().includes(search);

      const matchesStatus =
        statusFilter === 'All' ||
        expense?.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [
    data.expenses,
    searchTerm,
    statusFilter,
  ]);


  /* ---------------------------------------------------------------------- */
  /* Derived Statistics                                                     */
  /* ---------------------------------------------------------------------- */

  const statistics = useMemo(() => {
    const total = data.expenses.length;

    const completed = data.expenses.filter(
      (item) => item?.status === 'Completed'
    ).length;

    const pending = data.expenses.filter(
      (item) => item?.status === 'Pending'
    ).length;

    const overdue = data.expenses.filter(
      (item) => item?.status === 'Overdue'
    ).length;

    return {
      total,
      completed,
      pending,
      overdue,
      active: pending + overdue,
    };
  }, [data.expenses]);


  /* ---------------------------------------------------------------------- */
  /* Update Expense Status                                                  */
  /* ---------------------------------------------------------------------- */

  const handleStatusChange = useCallback(
    async (id, newStatus) => {
      if (!id || !newStatus) return;

      try {
        const payload = {
          expenseId: id,
          status: newStatus,
        };

        const res = await expensesApi?.updateExpenseStatus(
          payload
        );

        if (res?.success) {
          await getExpensesList();
        }
      } catch (error) {
        console.error(
          'Error updating expense status:',
          error?.message || error
        );
      }
    },
    [getExpensesList]
  );


  /* ---------------------------------------------------------------------- */
  /* Create Expense                                                         */
  /* ---------------------------------------------------------------------- */

  const handleCreateExpense = async (payload) => {
    try {
      setSubmitting(true);

      const res = await expensesApi?.createExpenses(payload);

      if (res?.success) {
        await getExpensesList();
        setModalOpen(false);
      }
    } catch (error) {
      console.error(
        'Failed to create expense:',
        error?.message || error
      );
    } finally {
      setSubmitting(false);
    }
  };


  /* ---------------------------------------------------------------------- */
  /* Date Filter                                                            */
  /* ---------------------------------------------------------------------- */

  const handleFilterChange = ({ startDate, endDate }) => {
    setSelectedDateRange({
      startDate,
      endDate,
    });

    /*
      Your existing API currently exposes getAllExpensesByUserId().
      Therefore we keep the date filter state ready here without
      inventing a new API method.

      When your backend supports:
      getExpensesByRange(startDate, endDate)

      this handler can call that endpoint.
    */
  };


  /* ---------------------------------------------------------------------- */
  /* Menu                                                                   */
  /* ---------------------------------------------------------------------- */

  const handleMenuOpen = (event, expense) => {
    setMenuAnchor(event.currentTarget);
    setSelectedExpense(expense);
  };

  const handleMenuClose = () => {
    setMenuAnchor(null);
    setSelectedExpense(null);
  };


  /* ---------------------------------------------------------------------- */
  /* Render                                                                 */
  /* ---------------------------------------------------------------------- */

  return (
    <Container
      maxWidth="xl"
      className="finora-expenses-page"
    >

      {/* ---------------------------------------------------------------- */}
      {/* Page Header                                                       */}
      {/* ---------------------------------------------------------------- */}

      <Box className="finora-expenses-header">

        <Box>
          <Typography
            variant="h4"
            className="finora-expenses-title"
          >
            Expenses
          </Typography>

          <Typography
            variant="body2"
            color="text.secondary"
          >
            Track your spending, payments and upcoming
            expenses.
          </Typography>
        </Box>

        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setModalOpen(true)}
          className="finora-expenses-add-button"
        >
          Add Expense
        </Button>

      </Box>


      {/* ---------------------------------------------------------------- */}
      {/* Summary Cards                                                     */}
      {/* ---------------------------------------------------------------- */}

      {/* <Grid
        container
        spacing={2}
        className="finora-expense-summary-grid"
      >

        <Grid item xs={12} sm={6} lg={3}>
          <SummaryCard
            title="Total Expenses"
            value={formatCurrency(
              data.summary.totalAmount
            )}
            subtitle={`${statistics.total} total expenses`}
            icon={<ReceiptLong />}
            className="summary-total"
          />
        </Grid>


        <Grid item xs={12} sm={6} lg={3}>
          <SummaryCard
            title="Paid Amount"
            value={formatCurrency(
              data.summary.paidAmount
            )}
            subtitle={`${statistics.completed} completed`}
            icon={<CheckCircleOutlined />}
            className="summary-paid"
          />
        </Grid>


        <Grid item xs={12} sm={6} lg={3}>
          <SummaryCard
            title="Outstanding"
            value={formatCurrency(
              data.summary.balanceAmount
            )}
            subtitle={`${statistics.pending} pending • ${statistics.overdue} overdue`}
            icon={<AccountBalanceWallet />}
            className="summary-balance"
          />
        </Grid>


        <Grid item xs={12} sm={6} lg={3}>
          <SummaryCard
            title="Payment Progress"
            value={
              data.summary.totalAmount > 0
                ? `${Math.round(
                  (data.summary.paidAmount /
                    data.summary.totalAmount) *
                  100
                )}%`
                : '0%'
            }
            subtitle="Expenses completed"
            icon={<TrendingUp />}
            className="summary-progress"
          />
        </Grid>

      </Grid> */}

      <Grid
        container
        spacing={2}
        className="finora-expense-summary-grid"
      >
        <ExpenseSummaryCards
          totalExpenses={data.summary.totalAmount}
          paidAmount={data.summary.paidAmount}
          outstandingAmount={data.summary.balanceAmount}

          totalExpensesCount={data?.expenses?.length || 0}
          completedCount={statistics.completed}
          pendingCount={statistics.pending}
          overdueCount={statistics.overdue}

          startDate={selectedDateRange?.startDate}
          endDate={selectedDateRange?.endDate}
        />
      </Grid>

      {/* ---------------------------------------------------------------- */}
      {/* Expense Tracker                                                   */}
      {/* ---------------------------------------------------------------- */}

      <Card
        elevation={0}
        className="finora-expense-main-card"
      >

        {/* Toolbar */}

        <Box className="finora-expense-toolbar">

          <Box>
            <Typography
              variant="h6"
              fontWeight={700}
            >
              Expense Tracker
            </Typography>

            <Typography
              variant="body2"
              color="text.secondary"
            >
              {filteredExpenses.length} expense
              {filteredExpenses.length !== 1 ? 's' : ''}
              {' '}shown
            </Typography>
          </Box>


          <Box className="finora-expense-view-controls">

            <ToggleButtonGroup
              value={viewMode}
              exclusive
              onChange={(event, value) => {
                if (value) {
                  setViewMode(value);
                }
              }}
              size="small"
              className="finora-expense-view-toggle"
            >

              <ToggleButton value="table">
                <ViewList fontSize="small" />
                <span>Table</span>
              </ToggleButton>

              <ToggleButton value="calendar">
                <CalendarMonth fontSize="small" />
                <span>Calendar</span>
              </ToggleButton>

            </ToggleButtonGroup>

          </Box>

        </Box>


        {/* Filters */}

        <Box className="finora-expense-filters">

          <TextField
            size="small"
            placeholder="Search expenses..."
            value={searchTerm}
            onChange={(event) =>
              setSearchTerm(event.target.value)
            }
            className="finora-expense-search"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search fontSize="small" />
                </InputAdornment>
              ),
            }}
          />


          <Select
            size="small"
            value={statusFilter}
            onChange={(event) =>
              setStatusFilter(event.target.value)
            }
            className="finora-expense-status-filter"
          >
            {STATUS_OPTIONS.map((status) => (
              <MenuItem
                key={status}
                value={status}
              >
                {status === 'All'
                  ? 'All Status'
                  : status}
              </MenuItem>
            ))}
          </Select>


          <Box className="finora-expense-date-filter">
            <DateRangeFilter
              onFilterChange={handleFilterChange}
            />
          </Box>


          <Button
            variant="outlined"
            startIcon={<Refresh />}
            onClick={getExpensesList}
            disabled={loading}
            className="finora-refresh-button"
          >
            Refresh
          </Button>

        </Box>


        {/* ---------------------------------------------------------------- */}
        {/* Table View                                                       */}
        {/* ---------------------------------------------------------------- */}

        {viewMode === 'table' && (

          <TableContainer
            component={Paper}
            elevation={0}
            className="finora-expense-table-container"
          >

            <Table
              stickyHeader
              className="finora-expense-table"
            >

              <TableHead>

                <TableRow>

                  <TableCell width={60}>
                    #
                  </TableCell>

                  <TableCell>
                    Date
                  </TableCell>

                  <TableCell>
                    Expense
                  </TableCell>

                  <TableCell align="right">
                    Amount
                  </TableCell>

                  <TableCell align="center">
                    Status
                  </TableCell>

                  <TableCell
                    align="right"
                    width={60}
                  />

                </TableRow>

              </TableHead>


              <TableBody>

                {loading ? (
                  <ExpenseTableSkeleton />
                ) : filteredExpenses.length === 0 ? (

                  <TableRow>

                    <TableCell
                      colSpan={6}
                      align="center"
                    >

                      <Box className="finora-expense-empty">

                        <ReceiptLong />

                        <Typography
                          variant="h6"
                          fontWeight={600}
                        >
                          No expenses found
                        </Typography>

                        <Typography
                          variant="body2"
                          color="text.secondary"
                        >
                          Try changing your filters or
                          add a new expense.
                        </Typography>

                        <Button
                          variant="contained"
                          startIcon={<AddIcon />}
                          onClick={() =>
                            setModalOpen(true)
                          }
                        >
                          Add Expense
                        </Button>

                      </Box>

                    </TableCell>

                  </TableRow>

                ) : (

                  filteredExpenses.map(
                    (row, index) => (

                      <TableRow
                        key={row?._id || index}
                        hover
                        className="finora-expense-row"
                      >

                        <TableCell>
                          <Typography
                            variant="body2"
                            color="text.secondary"
                          >
                            {index + 1}
                          </Typography>
                        </TableCell>


                        <TableCell>
                          <Typography
                            variant="body2"
                            fontWeight={500}
                          >
                            {formatDate(
                              row?.dueDate
                            )}
                          </Typography>
                        </TableCell>


                        <TableCell>

                          <Box>
                            <Typography
                              variant="body2"
                              fontWeight={600}
                            >
                              {row?.related ||
                                'Unnamed expense'}
                            </Typography>

                            {row?.category && (
                              <Typography
                                variant="caption"
                                color="text.secondary"
                              >
                                {row.category}
                              </Typography>
                            )}
                          </Box>

                        </TableCell>


                        <TableCell align="right">

                          <Typography
                            variant="body2"
                            fontWeight={700}
                            className="finora-expense-amount"
                          >
                            {formatCurrency(
                              row?.amount
                            )}
                          </Typography>

                        </TableCell>


                        <TableCell align="center">

                          <StatusChip
                            status={
                              row?.status ||
                              'Pending'
                            }
                            onChange={(newStatus) =>
                              handleStatusChange(
                                row?._id,
                                newStatus
                              )
                            }
                          />

                        </TableCell>


                        <TableCell align="right">

                          <Button
                            size="small"
                            onClick={(event) =>
                              handleMenuOpen(
                                event,
                                row
                              )
                            }
                            className="finora-expense-more-button"
                          >
                            <MoreVert
                              fontSize="small"
                            />
                          </Button>

                        </TableCell>

                      </TableRow>

                    )
                  )

                )}

              </TableBody>

            </Table>

          </TableContainer>

        )}


        {/* ---------------------------------------------------------------- */}
        {/* Calendar View                                                    */}
        {/* ---------------------------------------------------------------- */}

        {viewMode === 'calendar' && (
          <ExpenseCalendar
            expenses={filteredExpenses}
            onExpenseClick={(expense) => {
              console.log('Selected expense:', expense);

              // Later:
              // setSelectedExpense(expense);
              // setExpenseDetailsOpen(true);
            }}
            onDateClick={(date) => {
              console.log('Selected date:', date);

              // Later we can open AddExpenseModal
              // with this date pre-filled.
            }}
          />
        )}

      </Card>


      {/* ---------------------------------------------------------------- */}
      {/* Expense Context Menu                                              */}
      {/* ---------------------------------------------------------------- */}

      <Menu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={handleMenuClose}
        PaperProps={{
          elevation: 4,
          sx: {
            minWidth: 180,
            borderRadius: 2,
          },
        }}
      >

        <MenuItem
          onClick={handleMenuClose}
        >
          <ListItemIcon>
            <ReceiptLong fontSize="small" />
          </ListItemIcon>

          <ListItemText>
            View Expense
          </ListItemText>
        </MenuItem>

        <MenuItem
          onClick={handleMenuClose}
        >
          <ListItemIcon>
            <AccountBalanceWallet fontSize="small" />
          </ListItemIcon>

          <ListItemText>
            Edit Expense
          </ListItemText>
        </MenuItem>

      </Menu>


      {/* ---------------------------------------------------------------- */}
      {/* Add Expense Modal                                                 */}
      {/* ---------------------------------------------------------------- */}

      <AddExpenseModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleCreateExpense}
        loading={submitting}
      />

    </Container>
  );
}