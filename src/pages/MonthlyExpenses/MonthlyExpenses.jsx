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

const STATUS_OPTIONS = [
  'All',
  'Completed',
  'Pending',
  'Overdue',
];

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

/* -------------------------------------------------------------------------- */
/* Status Config                                                              */
/* -------------------------------------------------------------------------- */

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

const StatusChip = ({
  status,
  onChange,
  disabled = false,
}) => {
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
          className="finora-expense-status-chip"
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
/* Desktop Table Skeleton                                                     */
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
            <Skeleton
              width={90}
              sx={{ ml: 'auto' }}
            />
          </TableCell>

          <TableCell align="center">
            <Skeleton
              width={100}
              sx={{ mx: 'auto' }}
            />
          </TableCell>

          <TableCell>
            <Skeleton width={35} />
          </TableCell>
        </TableRow>
      ))}
    </>
  );
};

/* -------------------------------------------------------------------------- */
/* Mobile Card Skeleton                                                       */
/* -------------------------------------------------------------------------- */

const ExpenseMobileSkeleton = () => {
  return (
    <Box className="finora-expense-mobile-skeleton">
      {Array.from({ length: 4 }).map((_, index) => (
        <Card
          key={index}
          elevation={0}
          className="finora-expense-mobile-card"
        >
          <Box className="finora-expense-mobile-card-top">
            <Skeleton
              variant="rounded"
              width={42}
              height={42}
            />

            <Box sx={{ flex: 1 }}>
              <Skeleton width="55%" height={22} />
              <Skeleton width="35%" height={18} />
            </Box>

            <Skeleton
              variant="rounded"
              width={70}
              height={26}
            />
          </Box>

          <Skeleton
            width="45%"
            height={32}
            sx={{ mt: 2 }}
          />

          <Box className="finora-expense-mobile-details">
            <Skeleton width="35%" />
            <Skeleton width="35%" />
          </Box>
        </Card>
      ))}
    </Box>
  );
};

/* -------------------------------------------------------------------------- */
/* Mobile Expense Card                                                        */
/* -------------------------------------------------------------------------- */

const ExpenseMobileCard = ({
  expense,
  index,
  onStatusChange,
  onMenuOpen,
}) => {
  const status = expense?.status || 'Pending';

  const isCompleted = status === 'Completed';
  const isOverdue = status === 'Overdue';

  return (
    <Card
      elevation={0}
      className={`
        finora-expense-mobile-card
        ${isCompleted ? 'is-completed' : ''}
        ${isOverdue ? 'is-overdue' : ''}
      `}
    >
      <CardContent className="finora-expense-mobile-card-content">

        {/* -------------------------------------------------------------- */}
        {/* Card Header                                                    */}
        {/* -------------------------------------------------------------- */}

        <Box className="finora-expense-mobile-card-header">

          <Box className="finora-expense-mobile-expense-info">

            <Box className="finora-expense-mobile-icon">
              <ReceiptLong fontSize="small" />
            </Box>

            <Box className="finora-expense-mobile-title-wrapper">

              <Typography
                variant="subtitle1"
                className="finora-expense-mobile-title"
              >
                {expense?.related || 'Unnamed expense'}
              </Typography>

              {expense?.category && (
                <Typography
                  variant="caption"
                  color="text.secondary"
                  className="finora-expense-mobile-category"
                >
                  {expense.category}
                </Typography>
              )}

            </Box>

          </Box>

          <Button
            size="small"
            className="finora-expense-mobile-more"
            onClick={(event) =>
              onMenuOpen(event, expense)
            }
          >
            <MoreVert fontSize="small" />
          </Button>

        </Box>

        {/* -------------------------------------------------------------- */}
        {/* Amount                                                         */}
        {/* -------------------------------------------------------------- */}

        <Box className="finora-expense-mobile-amount-section">

          <Typography
            variant="caption"
            color="text.secondary"
          >
            Amount
          </Typography>

          <Typography
            variant="h5"
            className="finora-expense-mobile-amount"
          >
            {formatCurrency(expense?.amount)}
          </Typography>

        </Box>

        {/* -------------------------------------------------------------- */}
        {/* Details                                                        */}
        {/* -------------------------------------------------------------- */}

        <Box className="finora-expense-mobile-details">

          <Box className="finora-expense-mobile-detail-item">

            <Typography
              variant="caption"
              color="text.secondary"
            >
              Date
            </Typography>

            <Typography
              variant="body2"
              fontWeight={600}
            >
              {formatDate(expense?.dueDate)}
            </Typography>

          </Box>

          <Box className="finora-expense-mobile-detail-item">

            <Typography
              variant="caption"
              color="text.secondary"
            >
              Expense #
            </Typography>

            <Typography
              variant="body2"
              fontWeight={600}
            >
              #{index + 1}
            </Typography>

          </Box>

        </Box>

        {/* -------------------------------------------------------------- */}
        {/* Bottom Action Row                                               */}
        {/* -------------------------------------------------------------- */}

        <Box className="finora-expense-mobile-actions">

          <Box className="finora-expense-mobile-status">

            <Typography
              variant="caption"
              color="text.secondary"
              className="finora-expense-mobile-status-label"
            >
              Status
            </Typography>

            <StatusChip
              status={status}
              onChange={(newStatus) =>
                onStatusChange(
                  expense?._id,
                  newStatus
                )
              }
            />

          </Box>

        </Box>

      </CardContent>
    </Card>
  );
};

/* -------------------------------------------------------------------------- */
/* Mobile Empty State                                                         */
/* -------------------------------------------------------------------------- */

const MobileEmptyState = ({ onAdd }) => {
  return (
    <Box className="finora-expense-mobile-empty">

      <Box className="finora-expense-mobile-empty-icon">
        <ReceiptLong />
      </Box>

      <Typography
        variant="h6"
        fontWeight={700}
      >
        No expenses found
      </Typography>

      <Typography
        variant="body2"
        color="text.secondary"
      >
        Try changing your filters or add a new
        expense.
      </Typography>

      <Button
        variant="contained"
        startIcon={<AddIcon />}
        onClick={onAdd}
        className="finora-expense-mobile-empty-button"
      >
        Add Expense
      </Button>

    </Box>
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

  const [submitting, setSubmitting] =
    useState(false);

  const [loading, setLoading] =
    useState(true);

  const [searchTerm, setSearchTerm] =
    useState('');

  const [statusFilter, setStatusFilter] =
    useState('All');

  const [selectedDateRange, setSelectedDateRange] =
    useState({
      startDate: null,
      endDate: null,
    });

  const [menuAnchor, setMenuAnchor] =
    useState(null);

  const [selectedExpense, setSelectedExpense] =
    useState(null);

  /* ---------------------------------------------------------------------- */
  /* Fetch Expenses                                                         */
  /* ---------------------------------------------------------------------- */

  const getExpensesList = useCallback(async () => {
    try {
      setLoading(true);

      const res =
        await expensesApi?.getAllExpensesByUserId();

      if (res?.success) {
        const expensesList = Array.isArray(res?.data)
          ? res.data
          : [];

        const summary = expensesList.reduce(
          (acc, item) => {
            const amount =
              Number(item?.amount) || 0;

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
    const search =
      searchTerm.trim().toLowerCase();

    return data.expenses.filter((expense) => {

      const matchesSearch =
        !search ||
        expense?.related
          ?.toLowerCase?.()
          .includes(search) ||
        expense?.category
          ?.toLowerCase?.()
          .includes(search);

      const matchesStatus =
        statusFilter === 'All' ||
        expense?.status === statusFilter;

      return (
        matchesSearch &&
        matchesStatus
      );
    });
  }, [
    data.expenses,
    searchTerm,
    statusFilter,
  ]);

  /* ---------------------------------------------------------------------- */
  /* Statistics                                                             */
  /* ---------------------------------------------------------------------- */

  const statistics = useMemo(() => {

    const total =
      data.expenses.length;

    const completed =
      data.expenses.filter(
        (item) =>
          item?.status === 'Completed'
      ).length;

    const pending =
      data.expenses.filter(
        (item) =>
          item?.status === 'Pending'
      ).length;

    const overdue =
      data.expenses.filter(
        (item) =>
          item?.status === 'Overdue'
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

      if (!id || !newStatus) {
        return;
      }

      try {

        const payload = {
          expenseId: id,
          status: newStatus,
        };

        const res =
          await expensesApi?.updateExpenseStatus(
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

  const handleCreateExpense = async (
    payload
  ) => {

    try {

      setSubmitting(true);

      const res =
        await expensesApi?.createExpenses(
          payload
        );

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

  const handleFilterChange = ({
    startDate,
    endDate,
  }) => {

    setSelectedDateRange({
      startDate,
      endDate,
    });

  };

  /* ---------------------------------------------------------------------- */
  /* Context Menu                                                           */
  /* ---------------------------------------------------------------------- */

  const handleMenuOpen = (
    event,
    expense
  ) => {

    setMenuAnchor(
      event.currentTarget
    );

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

      {/* ================================================================== */}
      {/* PAGE HEADER                                                        */}
      {/* ================================================================== */}

      <Box className="finora-expenses-header">

        {/* Page information */}
        <Box className="finora-expenses-header-content">

          <Typography
            variant="h4"
            className="finora-expenses-title"
          >
            Expenses
          </Typography>

          <Typography
            variant="body2"
            color="text.secondary"
            className="finora-expenses-description"
          >
            Track your spending, payments and upcoming expenses.
          </Typography>

        </Box>

        {/* Add Expense */}
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setModalOpen(true)}
          className="finora-expenses-add-button"
        >
          <span className="finora-add-expense-text">
            Add Expense
          </span>

          <span className="finora-add-expense-short-text">
            Add
          </span>
        </Button>

      </Box>

      {/* ================================================================== */}
      {/* SUMMARY                                                            */}
      {/* ================================================================== */}

      <Grid
        container
        spacing={2}
        className="finora-expense-summary-grid"
      >

        <ExpenseSummaryCards
          totalExpenses={
            data.summary.totalAmount
          }
          paidAmount={
            data.summary.paidAmount
          }
          outstandingAmount={
            data.summary.balanceAmount
          }
          totalExpensesCount={
            data?.expenses?.length || 0
          }
          completedCount={
            statistics.completed
          }
          pendingCount={
            statistics.pending
          }
          overdueCount={
            statistics.overdue
          }
          startDate={
            selectedDateRange?.startDate
          }
          endDate={
            selectedDateRange?.endDate
          }
        />

      </Grid>

      {/* ================================================================== */}
      {/* MAIN CARD                                                          */}
      {/* ================================================================== */}

      <Card
        elevation={0}
        className="finora-expense-main-card"
      >

        {/* ================================================================ */}
        {/* TOOLBAR                                                          */}
        {/* ================================================================ */}

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
              {filteredExpenses.length}{' '}
              expense
              {filteredExpenses.length !== 1
                ? 's'
                : ''}{' '}
              shown
            </Typography>
          </Box>

          <Box className="finora-expense-view-controls">

            <ToggleButtonGroup
              value={viewMode}
              exclusive
              onChange={(
                event,
                value
              ) => {
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

        {/* ================================================================ */}
        {/* FILTERS                                                          */}
        {/* ================================================================ */}

        <Box className="finora-expense-filters">

          <TextField
            size="small"
            placeholder="Search expenses..."
            value={searchTerm}
            onChange={(event) =>
              setSearchTerm(
                event.target.value
              )
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
              setStatusFilter(
                event.target.value
              )
            }
            className="finora-expense-status-filter"
          >

            {STATUS_OPTIONS.map(
              (status) => (
                <MenuItem
                  key={status}
                  value={status}
                >
                  {status === 'All'
                    ? 'All Status'
                    : status}
                </MenuItem>
              )
            )}

          </Select>

          <Box className="finora-expense-date-filter">
            <DateRangeFilter
              onFilterChange={
                handleFilterChange
              }
            />
          </Box>

          <Button
            variant="outlined"
            startIcon={<Refresh />}
            onClick={
              getExpensesList
            }
            disabled={loading}
            className="finora-refresh-button"
          >
            Refresh
          </Button>

        </Box>

        {/* ================================================================= */}
        {/* TABLE / MOBILE LIST VIEW                                         */}
        {/* ================================================================= */}

        {viewMode === 'table' && (
          <>
            {/* ============================================================= */}
            {/* DESKTOP TABLE                                                 */}
            {/* ============================================================= */}

            <Box className="finora-expense-desktop">

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
                              Try changing your
                              filters or add a
                              new expense.
                            </Typography>

                            <Button
                              variant="contained"
                              startIcon={
                                <AddIcon />
                              }
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
                            key={
                              row?._id ||
                              index
                            }
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
                                onChange={(
                                  newStatus
                                ) =>
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
                                onClick={(
                                  event
                                ) =>
                                  handleMenuOpen(
                                    event,
                                    row
                                  )
                                }
                                className="finora-expense-more-button"
                              >
                                <MoreVert fontSize="small" />
                              </Button>

                            </TableCell>

                          </TableRow>

                        )
                      )

                    )}

                  </TableBody>

                </Table>

              </TableContainer>

            </Box>

            {/* ============================================================= */}
            {/* MOBILE CARDS                                                  */}
            {/* ============================================================= */}

            <Box className="finora-expense-mobile">

              {loading ? (

                <ExpenseMobileSkeleton />

              ) : filteredExpenses.length === 0 ? (

                <MobileEmptyState
                  onAdd={() =>
                    setModalOpen(true)
                  }
                />

              ) : (

                <Box className="finora-expense-mobile-list">

                  {filteredExpenses.map(
                    (expense, index) => (
                      <ExpenseMobileCard
                        key={
                          expense?._id ||
                          index
                        }
                        expense={expense}
                        index={index}
                        onStatusChange={
                          handleStatusChange
                        }
                        onMenuOpen={
                          handleMenuOpen
                        }
                      />
                    )
                  )}

                </Box>

              )}

            </Box>
          </>
        )}

        {/* ================================================================= */}
        {/* CALENDAR                                                          */}
        {/* ================================================================= */}

        {viewMode === 'calendar' && (
          <ExpenseCalendar
            expenses={filteredExpenses}
            onExpenseClick={(expense) => {
              console.log(
                'Selected expense:',
                expense
              );
            }}
            onDateClick={(date) => {
              console.log(
                'Selected date:',
                date
              );
            }}
          />
        )}

      </Card>

      {/* ================================================================== */}
      {/* CONTEXT MENU                                                       */}
      {/* ================================================================== */}

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

      {/* ================================================================== */}
      {/* ADD EXPENSE MODAL                                                  */}
      {/* ================================================================== */}

      <AddExpenseModal
        open={modalOpen}
        onClose={() =>
          setModalOpen(false)
        }
        onSubmit={handleCreateExpense}
        loading={submitting}
      />

    </Container>
  );
}