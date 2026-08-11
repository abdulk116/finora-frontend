import {
  AccountBalance,
  Add as AddIcon,
  ArrowForwardIos,
  CheckCircle,
  CreditScore,
  MoreHoriz,
  Pending,
  TrendingDown,
  Wallet,
} from '@mui/icons-material';

import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  IconButton,
  LinearProgress,
  Menu,
  MenuItem,
  Skeleton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router';

import loanApi from '../../api/loanApi';
import './LoanManagement.css';


/* -------------------------------------------------------------------------- */
/* Helpers                                                                    */
/* -------------------------------------------------------------------------- */

const formatCurrency = (amount = 0) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(Number(amount) || 0);
};


const getProgress = (totalAmount = 0, remainingAmount = 0) => {
  const total = Number(totalAmount) || 0;
  const remaining = Number(remainingAmount) || 0;

  if (total <= 0) return 0;

  const paid = total - remaining;

  return Math.min(
    100,
    Math.max(0, Math.round((paid / total) * 100))
  );
};


const normalizeStatus = (status) => {
  return String(status || '')
    .trim()
    .toLowerCase();
};


/* -------------------------------------------------------------------------- */
/* Empty state                                                                */
/* -------------------------------------------------------------------------- */

function EmptyLoanState({ onAddLoan }) {
  return (
    <Box className="finora-loans-empty">
      <Box className="finora-empty-icon">
        <AccountBalance />
      </Box>

      <Typography variant="h6" fontWeight={700}>
        No loans yet
      </Typography>

      <Typography
        variant="body2"
        color="text.secondary"
        sx={{ maxWidth: 420, textAlign: 'center', mt: 0.5 }}
      >
        Start tracking your loans, debts, EMIs and repayment progress
        from one place.
      </Typography>

      <Button
        variant="contained"
        startIcon={<AddIcon />}
        onClick={onAddLoan}
        sx={{
          mt: 2.5,
          borderRadius: 2.5,
          textTransform: 'none',
          fontWeight: 700,
        }}
      >
        Add Your First Loan
      </Button>
    </Box>
  );
}


/* -------------------------------------------------------------------------- */
/* Loading skeleton                                                           */
/* -------------------------------------------------------------------------- */

function LoanTableSkeleton() {
  return (
    <Box className="finora-loan-skeleton">
      {[1, 2, 3, 4].map((item) => (
        <Box key={item} className="finora-skeleton-row">
          <Skeleton variant="text" width="8%" />
          <Skeleton variant="text" width="18%" />
          <Skeleton variant="text" width="14%" />
          <Skeleton variant="text" width="10%" />
          <Skeleton variant="text" width="12%" />
          <Skeleton variant="text" width="14%" />
          <Skeleton variant="rectangular" width="12%" height={8} />
          <Skeleton variant="text" width="10%" />
        </Box>
      ))}
    </Box>
  );
}


/* -------------------------------------------------------------------------- */
/* Summary Card                                                               */
/* -------------------------------------------------------------------------- */

function SummaryCard({
  title,
  value,
  subtitle,
  icon,
  iconClass = '',
  valueClass = '',
}) {
  return (
    <Card
      elevation={0}
      className={`finora-loan-summary-card ${iconClass}`}
    >
      <CardContent className="finora-loan-summary-content">
        <Box className="finora-summary-top">
          <Typography
            variant="body2"
            className="finora-summary-title"
          >
            {title}
          </Typography>

          <Box className="finora-summary-icon">
            {icon}
          </Box>
        </Box>

        <Typography
          variant="h4"
          className={`finora-summary-value ${valueClass}`}
        >
          {value}
        </Typography>

        <Typography
          variant="caption"
          className="finora-summary-subtitle"
        >
          {subtitle}
        </Typography>
      </CardContent>
    </Card>
  );
}


/* -------------------------------------------------------------------------- */
/* Loan Progress                                                              */
/* -------------------------------------------------------------------------- */

function LoanProgress({ loan }) {
  const progress = getProgress(
    loan?.totalAmount,
    loan?.remainingAmount
  );

  const paidAmount =
    (Number(loan?.totalAmount) || 0) -
    (Number(loan?.remainingAmount) || 0);

  return (
    <Box className="finora-loan-progress">
      <Box className="finora-progress-header">
        <Typography
          variant="caption"
          fontWeight={700}
          color="text.primary"
        >
          {progress}% paid
        </Typography>

        <Typography
          variant="caption"
          color="text.secondary"
        >
          {formatCurrency(paidAmount)}
        </Typography>
      </Box>

      <LinearProgress
        variant="determinate"
        value={progress}
        className="finora-progress-bar"
      />
    </Box>
  );
}


/* -------------------------------------------------------------------------- */
/* Status Chip                                                                */
/* -------------------------------------------------------------------------- */

function LoanStatus({ status }) {
  const normalizedStatus = normalizeStatus(status);

  const isActive = normalizedStatus === 'active';

  return (
    <Chip
      icon={
        isActive ? (
          <Pending fontSize="small" />
        ) : (
          <CheckCircle fontSize="small" />
        )
      }
      label={isActive ? 'Active' : 'Closed'}
      size="small"
      className={
        isActive
          ? 'finora-status-chip active'
          : 'finora-status-chip closed'
      }
    />
  );
}


/* -------------------------------------------------------------------------- */
/* Mobile Loan Card                                                           */
/* -------------------------------------------------------------------------- */

function MobileLoanCard({ loan, index, onView }) {
  const progress = getProgress(
    loan?.totalAmount,
    loan?.remainingAmount
  );

  const normalizedStatus = normalizeStatus(loan?.status);

  return (
    <Card
      elevation={0}
      className="finora-mobile-loan-card"
      onClick={() => onView(loan?._id)}
    >
      <Box className="finora-mobile-loan-header">
        <Box sx={{ minWidth: 0 }}>
          <Typography
            variant="subtitle1"
            fontWeight={700}
            noWrap
          >
            {loan?.loanDetails || 'Unnamed Loan'}
          </Typography>

          <Typography
            variant="caption"
            color="text.secondary"
            noWrap
          >
            {loan?.lenderName || 'Unknown lender'}
          </Typography>
        </Box>

        <LoanStatus status={loan?.status} />
      </Box>

      <Box className="finora-mobile-loan-info">
        <Box>
          <Typography variant="caption" color="text.secondary">
            Outstanding
          </Typography>

          <Typography
            variant="body1"
            fontWeight={800}
            color="error.main"
          >
            {formatCurrency(loan?.remainingAmount)}
          </Typography>
        </Box>

        <Box>
          <Typography variant="caption" color="text.secondary">
            Monthly EMI
          </Typography>

          <Typography variant="body1" fontWeight={700}>
            {formatCurrency(loan?.emiAmount)}
          </Typography>
        </Box>
      </Box>

      <LoanProgress loan={loan} />

      <Box className="finora-mobile-loan-footer">
        <Box>
          <Typography variant="caption" color="text.secondary">
            {loan?.loanType || 'Loan'} · #{index + 1}
          </Typography>
        </Box>

        <Box className="finora-view-loan">
          View details
          <ArrowForwardIos sx={{ fontSize: 12 }} />
        </Box>
      </Box>
    </Card>
  );
}


/* -------------------------------------------------------------------------- */
/* Main Component                                                             */
/* -------------------------------------------------------------------------- */

const LoanManagement = () => {
  const navigate = useNavigate();

  const [loanList, setLoanList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [menuAnchor, setMenuAnchor] = useState(null);

  /* ---------------------------------------------------------------------- */
  /* Fetch loans                                                            */
  /* ---------------------------------------------------------------------- */

  const getLoanList = useCallback(async () => {
    try {
      setLoading(true);
      setError('');

      const res = await loanApi?.getAllNewLoans();

      if (res?.success) {
        setLoanList(Array.isArray(res?.data) ? res.data : []);
      } else {
        setLoanList([]);
        setError(res?.message || 'Unable to load loans.');
      }
    } catch (err) {
      console.error('Error fetching loans:', err);

      setLoanList([]);
      setError('Unable to load your loans. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);


  useEffect(() => {
    getLoanList();
  }, [getLoanList]);


  /* ---------------------------------------------------------------------- */
  /* Navigate                                                               */
  /* ---------------------------------------------------------------------- */

  const handleNavigateLoanDetails = useCallback(
    (loanId) => {
      if (!loanId) return;

      navigate(`/loan/${loanId}`);
    },
    [navigate]
  );


  const handleAddLoan = useCallback(() => {
    navigate('/loan/add');
  }, [navigate]);


  /* ---------------------------------------------------------------------- */
  /* Calculated values                                                      */
  /* ---------------------------------------------------------------------- */

  const summary = useMemo(() => {
    const totalBorrowed = loanList.reduce(
      (sum, loan) => sum + (Number(loan?.totalAmount) || 0),
      0
    );

    const totalOutstanding = loanList.reduce(
      (sum, loan) => sum + (Number(loan?.remainingAmount) || 0),
      0
    );

    const activeLoans = loanList.filter(
      (loan) => normalizeStatus(loan?.status) === 'active'
    ).length;

    const closedLoans = loanList.length - activeLoans;

    const totalPaid = Math.max(
      totalBorrowed - totalOutstanding,
      0
    );

    const overallProgress =
      totalBorrowed > 0
        ? Math.round((totalPaid / totalBorrowed) * 100)
        : 0;

    const monthlyEMI = loanList
      .filter(
        (loan) => normalizeStatus(loan?.status) === 'active'
      )
      .reduce(
        (sum, loan) => sum + (Number(loan?.emiAmount) || 0),
        0
      );

    return {
      totalBorrowed,
      totalOutstanding,
      activeLoans,
      closedLoans,
      totalPaid,
      overallProgress,
      monthlyEMI,
    };
  }, [loanList]);


  /* ---------------------------------------------------------------------- */
  /* Menu                                                                   */
  /* ---------------------------------------------------------------------- */

  const handleMenuOpen = (event) => {
    setMenuAnchor(event.currentTarget);
  };

  const handleMenuClose = () => {
    setMenuAnchor(null);
  };


  return (
    <Box className="finora-loans-container">

      {/* ================================================================ */}
      {/* HEADER                                                            */}
      {/* ================================================================ */}

      <Box className="finora-loans-header">

        <Box className="finora-loans-heading">

          <Typography
            variant="h4"
            className="finora-loans-title"
          >
            Loans Management
          </Typography>

          <Typography
            variant="body2"
            className="finora-loans-description"
          >
            Monitor your loans, debts, EMIs and repayment progress
            from one place.
          </Typography>

        </Box>


        <Box className="finora-loans-header-actions">

          <IconButton
            className="finora-mobile-more"
            onClick={handleMenuOpen}
          >
            <MoreHoriz />
          </IconButton>

          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleAddLoan}
            className="finora-add-loan-btn"
          >
            Add New Loan
          </Button>

        </Box>

      </Box>


      {/* Mobile menu */}

      <Menu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={handleMenuClose}
      >
        <MenuItem
          onClick={() => {
            handleMenuClose();
            handleAddLoan();
          }}
        >
          <AddIcon sx={{ mr: 1 }} fontSize="small" />
          Add New Loan
        </MenuItem>
      </Menu>


      {/* ================================================================ */}
      {/* ERROR                                                             */}
      {/* ================================================================ */}

      {error && !loading && (
        <Card className="finora-loan-error" elevation={0}>
          <Typography variant="body2">
            {error}
          </Typography>

          <Button
            size="small"
            onClick={getLoanList}
            sx={{ textTransform: 'none', fontWeight: 700 }}
          >
            Try again
          </Button>
        </Card>
      )}


      {/* ================================================================ */}
      {/* SUMMARY CARDS                                                     */}
      {/* ================================================================ */}

      <Box className="finora-loan-summary-grid">

        <SummaryCard
          title="Outstanding Balance"
          value={formatCurrency(summary.totalOutstanding)}
          subtitle={`${summary.activeLoans} active ${summary.activeLoans === 1 ? 'loan' : 'loans'
            }`}
          icon={<TrendingDown />}
          iconClass="outstanding"
        />

        <SummaryCard
          title="Total Borrowed"
          value={formatCurrency(summary.totalBorrowed)}
          subtitle="Total loan principal"
          icon={<AccountBalance />}
          iconClass="borrowed"
        />

        <SummaryCard
          title="Monthly EMI"
          value={formatCurrency(summary.monthlyEMI)}
          subtitle="Active monthly commitment"
          icon={<CreditScore />}
          iconClass="emi"
        />

        <SummaryCard
          title="Repayment Progress"
          value={`${summary.overallProgress}%`}
          subtitle={`${formatCurrency(summary.totalPaid)} paid`}
          icon={<Wallet />}
          iconClass="progress"
        />

      </Box>


      {/* ================================================================ */}
      {/* OVERALL PROGRESS                                                  */}
      {/* ================================================================ */}

      {!loading && loanList.length > 0 && (
        <Card
          elevation={0}
          className="finora-overall-progress-card"
        >
          <Box className="finora-overall-progress-content">

            <Box>
              <Typography
                variant="subtitle1"
                fontWeight={800}
              >
                Overall repayment progress
              </Typography>

              <Typography
                variant="body2"
                color="text.secondary"
              >
                {formatCurrency(summary.totalPaid)} paid out of{' '}
                {formatCurrency(summary.totalBorrowed)}
              </Typography>
            </Box>

            <Typography
              variant="h6"
              fontWeight={800}
              className="finora-overall-progress-value"
            >
              {summary.overallProgress}%
            </Typography>

          </Box>

          <LinearProgress
            variant="determinate"
            value={summary.overallProgress}
            className="finora-overall-progress-bar"
          />

          <Box className="finora-overall-progress-footer">
            <Typography variant="caption" color="text.secondary">
              {summary.activeLoans} active
            </Typography>

            <Typography variant="caption" color="text.secondary">
              {summary.closedLoans} closed
            </Typography>

            <Typography
              variant="caption"
              fontWeight={700}
              color="error.main"
            >
              {formatCurrency(summary.totalOutstanding)} remaining
            </Typography>
          </Box>

        </Card>
      )}


      {/* ================================================================ */}
      {/* LOAN LIST                                                         */}
      {/* ================================================================ */}

      <Card
        elevation={0}
        className="finora-loans-table-card"
      >

        {/* Table header */}

        <Box className="finora-loans-table-header">

          <Box>
            <Typography
              variant="h6"
              fontWeight={800}
            >
              Your Loans
            </Typography>

            <Typography
              variant="body2"
              color="text.secondary"
            >
              {loading
                ? 'Loading your loans...'
                : `${loanList.length} ${loanList.length === 1 ? 'loan' : 'loans'
                } tracked`}
            </Typography>
          </Box>

        </Box>


        {/* Loading */}

        {loading && <LoanTableSkeleton />}


        {/* Empty */}

        {!loading && loanList.length === 0 && (
          <EmptyLoanState onAddLoan={handleAddLoan} />
        )}


        {/* ============================================================ */}
        {/* DESKTOP TABLE                                                 */}
        {/* ============================================================ */}

        {!loading && loanList.length > 0 && (
          <TableContainer className="finora-loan-table-wrapper">

            <Table className="finora-loan-table">

              <TableHead>

                <TableRow>

                  <TableCell>#</TableCell>
                  <TableCell>Loan</TableCell>
                  <TableCell>Lender</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell>Total</TableCell>
                  <TableCell>Outstanding</TableCell>
                  <TableCell>Progress</TableCell>
                  <TableCell>Monthly EMI</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell />

                </TableRow>

              </TableHead>


              <TableBody>

                {loanList.map((loan, index) => {

                  const progress = getProgress(
                    loan?.totalAmount,
                    loan?.remainingAmount
                  );

                  return (
                    <TableRow
                      key={loan?._id || index}
                      hover
                      className="finora-loan-table-row"
                      onClick={() =>
                        handleNavigateLoanDetails(loan?._id)
                      }
                    >

                      <TableCell>
                        <Typography
                          variant="caption"
                          fontWeight={700}
                          color="text.secondary"
                        >
                          {String(index + 1).padStart(2, '0')}
                        </Typography>
                      </TableCell>


                      <TableCell>

                        <Box className="finora-loan-name-cell">

                          <Box className="finora-loan-mini-icon">
                            <AccountBalance fontSize="small" />
                          </Box>

                          <Box sx={{ minWidth: 0 }}>

                            <Typography
                              variant="body2"
                              fontWeight={800}
                              noWrap
                            >
                              {loan?.loanDetails ||
                                'Unnamed Loan'}
                            </Typography>

                            <Typography
                              variant="caption"
                              color="text.secondary"
                              noWrap
                            >
                              {loan?.lenderName ||
                                'Unknown lender'}
                            </Typography>

                          </Box>

                        </Box>

                      </TableCell>


                      <TableCell>
                        {loan?.lenderName || '-'}
                      </TableCell>


                      <TableCell>
                        <Chip
                          label={loan?.loanType || 'Loan'}
                          size="small"
                          className="finora-loan-type-chip"
                        />
                      </TableCell>


                      <TableCell>
                        <Typography
                          variant="body2"
                          fontWeight={700}
                        >
                          {formatCurrency(
                            loan?.totalAmount
                          )}
                        </Typography>
                      </TableCell>


                      <TableCell>

                        <Typography
                          variant="body2"
                          fontWeight={800}
                          color="error.main"
                        >
                          {formatCurrency(
                            loan?.remainingAmount
                          )}
                        </Typography>

                      </TableCell>


                      <TableCell sx={{ minWidth: 170 }}>

                        <LoanProgress loan={loan} />

                      </TableCell>


                      <TableCell>

                        <Typography
                          variant="body2"
                          fontWeight={700}
                        >
                          {formatCurrency(
                            loan?.emiAmount
                          )}
                        </Typography>

                      </TableCell>


                      <TableCell>
                        <LoanStatus status={loan?.status} />
                      </TableCell>


                      <TableCell>

                        <IconButton
                          size="small"
                          className="finora-row-arrow"
                          onClick={(event) => {
                            event.stopPropagation();
                            handleNavigateLoanDetails(
                              loan?._id
                            );
                          }}
                        >
                          <ArrowForwardIos sx={{ fontSize: 14 }} />
                        </IconButton>

                      </TableCell>

                    </TableRow>
                  );
                })}

              </TableBody>

            </Table>

          </TableContainer>
        )}


        {/* ============================================================ */}
        {/* MOBILE CARDS                                                  */}
        {/* ============================================================ */}

        {!loading && loanList.length > 0 && (
          <Box className="finora-mobile-loans-list">

            {loanList.map((loan, index) => (
              <MobileLoanCard
                key={loan?._id || index}
                loan={loan}
                index={index}
                onView={handleNavigateLoanDetails}
              />
            ))}

          </Box>
        )}

      </Card>


      {/* ================================================================ */}
      {/* MOBILE BOTTOM SUMMARY                                             */}
      {/* ================================================================ */}

      {!loading && loanList.length > 0 && (
        <Box className="finora-mobile-loan-footer-summary">

          <Box>
            <Typography variant="caption" color="text.secondary">
              Active loans
            </Typography>

            <Typography variant="body1" fontWeight={800}>
              {summary.activeLoans}
            </Typography>
          </Box>

          <Box>
            <Typography variant="caption" color="text.secondary">
              Monthly EMI
            </Typography>

            <Typography variant="body1" fontWeight={800}>
              {formatCurrency(summary.monthlyEMI)}
            </Typography>
          </Box>

          <Box>
            <Typography variant="caption" color="text.secondary">
              Remaining
            </Typography>

            <Typography
              variant="body1"
              fontWeight={800}
              color="error.main"
            >
              {formatCurrency(summary.totalOutstanding)}
            </Typography>
          </Box>

        </Box>
      )}

    </Box>
  );
};


export default LoanManagement;