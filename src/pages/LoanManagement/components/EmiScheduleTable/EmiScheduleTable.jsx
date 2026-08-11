import { useMemo, useState } from 'react';

import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';

import {
  CheckCircleOutlined,
  AccessTime,
  ErrorOutlined,
  Payment,
  CalendarMonth,
} from '@mui/icons-material';

import MarkEmiPaidModal from '../../Modal/MarkEmiPaidModal';
import loanApi from '../../../../api/loanApi';

import './EmiScheduleTable.css';


// =========================================================
// Currency Formatter
// =========================================================

const currencyFormatter = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 0,
});

const formatCurrency = (amount) => {
  return currencyFormatter.format(Number(amount) || 0);
};


// =========================================================
// Date Formatter
// =========================================================

const formatDate = (date) => {
  if (!date) return '—';

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return '—';
  }

  return new Intl.DateTimeFormat('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(parsedDate);
};


// =========================================================
// Status Configuration
// =========================================================

const STATUS_CONFIG = {
  paid: {
    label: 'Paid',
    color: 'success',
    icon: <CheckCircleOutlined fontSize="small" />,
  },

  pending: {
    label: 'Pending',
    color: 'warning',
    icon: <AccessTime fontSize="small" />,
  },

  overdue: {
    label: 'Overdue',
    color: 'error',
    icon: <ErrorOutlined fontSize="small" />,
  },
};


// =========================================================
// Status Chip
// =========================================================

const StatusChip = ({ status }) => {
  const normalizedStatus = String(
    status || 'pending'
  ).toLowerCase();

  const config =
    STATUS_CONFIG[normalizedStatus] ||
    STATUS_CONFIG.pending;

  return (
    <Chip
      icon={config.icon}
      label={config.label}
      color={config.color}
      size="small"
      className={`finora-emi-status-chip finora-emi-status-${normalizedStatus}`}
    />
  );
};


// =========================================================
// Mobile EMI Card
// =========================================================

const EmiMobileCard = ({
  emi,
  onPay,
  paymentLoading,
}) => {
  const isPaid = emi.status === 'paid';
  const isOverdue = emi.status === 'overdue';

  return (
    <Paper
      elevation={0}
      className={[
        'finora-emi-mobile-card',
        isPaid ? 'is-paid' : '',
        isOverdue ? 'is-overdue' : '',
        !isPaid && !isOverdue ? 'is-pending' : '',
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {/* =========================
          Card Header
      ========================== */}

      <Box className="finora-emi-mobile-header">
        <Box className="finora-emi-installment">
          <Box className="finora-emi-installment-icon">
            <Payment fontSize="small" />
          </Box>

          <Box>
            <Typography
              variant="caption"
              className="finora-emi-label"
            >
              Installment
            </Typography>

            <Typography
              variant="subtitle1"
              fontWeight={700}
              className="finora-emi-installment-number"
            >
              #{emi.installmentNo}
            </Typography>
          </Box>
        </Box>

        <StatusChip status={emi.status} />
      </Box>


      {/* =========================
          Amount
      ========================== */}

      <Box className="finora-emi-mobile-amount">
        <Typography
          variant="caption"
          className="finora-emi-label"
        >
          EMI Amount
        </Typography>

        <Typography
          variant="h5"
          fontWeight={800}
          className="finora-emi-amount"
        >
          {formatCurrency(emi.amount)}
        </Typography>
      </Box>


      {/* =========================
          Dates
      ========================== */}

      <Box className="finora-emi-mobile-details">

        <Box className="finora-emi-detail-item">
          <Typography
            variant="caption"
            className="finora-emi-label"
          >
            Due Date
          </Typography>

          <Typography
            variant="body2"
            fontWeight={600}
            className="finora-emi-detail-value"
          >
            {formatDate(emi.dueDate)}
          </Typography>
        </Box>


        <Box className="finora-emi-detail-item">
          <Typography
            variant="caption"
            className="finora-emi-label"
          >
            Paid Date
          </Typography>

          <Typography
            variant="body2"
            fontWeight={600}
            className={`finora-emi-detail-value ${!emi.paidDate ? 'not-paid' : ''
              }`}
          >
            {emi.paidDate
              ? formatDate(emi.paidDate)
              : 'Not paid'}
          </Typography>
        </Box>

      </Box>


      {/* =========================
          Action
      ========================== */}

      {!isPaid && (
        <Button
          fullWidth
          variant="contained"
          startIcon={
            paymentLoading ? (
              <CircularProgress
                size={18}
                color="inherit"
              />
            ) : (
              <Payment fontSize="small" />
            )
          }
          disabled={paymentLoading}
          onClick={() => onPay(emi)}
          className="finora-emi-pay-button"
        >
          {paymentLoading
            ? 'Processing...'
            : 'Mark EMI as Paid'}
        </Button>
      )}


      {/* =========================
          Paid State
      ========================== */}

      {isPaid && (
        <Box className="finora-emi-paid-message">
          <CheckCircleOutlined fontSize="small" />

          <Typography
            variant="body2"
            fontWeight={700}
          >
            Payment Completed
          </Typography>
        </Box>
      )}
    </Paper>
  );
};


// =========================================================
// Main Component
// =========================================================

export default function EmiScheduleTable({
  emiSchedule = [],
  loanId,
  fetchLoanDetails,
}) {

  const [selectedEmi, setSelectedEmi] = useState(null);

  const [paymentModalOpen, setPaymentModalOpen] =
    useState(false);

  const [paymentLoading, setPaymentLoading] =
    useState(false);

  const [errorMessage, setErrorMessage] =
    useState('');


  // =======================================================
  // Normalize EMI Data
  // =======================================================

  const normalizedSchedule = useMemo(() => {
    return emiSchedule.map((emi) => ({
      ...emi,
      status: String(
        emi.status || 'pending'
      ).toLowerCase(),
    }));
  }, [emiSchedule]);


  // =======================================================
  // Summary
  // =======================================================

  const summary = useMemo(() => {

    const paid = normalizedSchedule.filter(
      (emi) => emi.status === 'paid'
    ).length;

    const pending = normalizedSchedule.filter(
      (emi) => emi.status === 'pending'
    ).length;

    const overdue = normalizedSchedule.filter(
      (emi) => emi.status === 'overdue'
    ).length;

    const remainingAmount =
      normalizedSchedule
        .filter((emi) => emi.status !== 'paid')
        .reduce(
          (total, emi) =>
            total + Number(emi.amount || 0),
          0
        );

    return {
      paid,
      pending,
      overdue,
      remainingAmount,
    };

  }, [normalizedSchedule]);


  // =======================================================
  // Open Payment Modal
  // =======================================================

  const handleOpenPaymentModal = (emi) => {

    if (
      !emi ||
      emi.status === 'paid' ||
      paymentLoading
    ) {
      return;
    }

    setErrorMessage('');
    setSelectedEmi(emi);
    setPaymentModalOpen(true);
  };


  // =======================================================
  // Close Payment Modal
  // =======================================================

  const handleClosePaymentModal = () => {

    if (paymentLoading) {
      return;
    }

    setPaymentModalOpen(false);
    setSelectedEmi(null);
  };


  // =======================================================
  // Confirm Payment
  // =======================================================

  const handleConfirmPayment = async ({
    installmentNo,
    amount,
    paidDate,
  }) => {

    if (paymentLoading) {
      return;
    }

    try {

      setErrorMessage('');
      setPaymentLoading(true);

      const response =
        await loanApi.markEmiAsPaid(
          loanId,
          installmentNo,
          {
            amount,
            paidDate,
          }
        );

      if (!response?.success) {
        throw new Error(
          response?.message ||
          'Failed to update EMI.'
        );
      }

      setPaymentModalOpen(false);
      setSelectedEmi(null);

      if (
        typeof fetchLoanDetails === 'function'
      ) {
        await fetchLoanDetails();
      }

    } catch (error) {

      console.error(
        'Mark EMI paid error:',
        error
      );

      setErrorMessage(
        error?.message ||
        'Unable to mark EMI as paid. Please try again.'
      );

    } finally {

      setPaymentLoading(false);
    }
  };


  // =======================================================
  // Empty State
  // =======================================================

  if (!normalizedSchedule.length) {

    return (
      <Paper
        elevation={0}
        className="finora-emi-empty"
      >
        <Box className="finora-emi-empty-icon">
          <CalendarMonth />
        </Box>

        <Typography
          variant="h6"
          fontWeight={700}
        >
          No EMI Schedule
        </Typography>

        <Typography
          variant="body2"
          color="text.secondary"
        >
          No EMI installments have been generated
          for this loan yet.
        </Typography>
      </Paper>
    );
  }


  // =======================================================
  // Render
  // =======================================================

  return (
    <Box className="finora-emi-wrapper">

      {/* =================================================
          SUMMARY
      ================================================== */}

      <Box className="finora-emi-summary">

        <Box className="finora-emi-summary-item">
          <Typography
            variant="caption"
            className="finora-emi-summary-label"
          >
            Total EMIs
          </Typography>

          <Typography
            variant="h6"
            fontWeight={800}
          >
            {normalizedSchedule.length}
          </Typography>
        </Box>


        <Box className="finora-emi-summary-item paid">
          <Typography
            variant="caption"
            className="finora-emi-summary-label"
          >
            Paid
          </Typography>

          <Typography
            variant="h6"
            fontWeight={800}
            color="success.main"
          >
            {summary.paid}
          </Typography>
        </Box>


        <Box className="finora-emi-summary-item pending">
          <Typography
            variant="caption"
            className="finora-emi-summary-label"
          >
            Pending
          </Typography>

          <Typography
            variant="h6"
            fontWeight={800}
            color="warning.main"
          >
            {summary.pending}
          </Typography>
        </Box>


        <Box className="finora-emi-summary-item overdue">
          <Typography
            variant="caption"
            className="finora-emi-summary-label"
          >
            Overdue
          </Typography>

          <Typography
            variant="h6"
            fontWeight={800}
            color="error.main"
          >
            {summary.overdue}
          </Typography>
        </Box>


        <Box className="finora-emi-summary-item amount">
          <Typography
            variant="caption"
            className="finora-emi-summary-label"
          >
            Remaining EMI
          </Typography>

          <Typography
            variant="h6"
            fontWeight={800}
            className="finora-emi-summary-amount"
          >
            {formatCurrency(
              summary.remainingAmount
            )}
          </Typography>
        </Box>

      </Box>


      {/* =================================================
          ERROR
      ================================================== */}

      {errorMessage && (
        <Alert
          severity="error"
          onClose={() => setErrorMessage('')}
          className="finora-emi-error"
        >
          {errorMessage}
        </Alert>
      )}


      {/* =================================================
          DESKTOP TABLE
      ================================================== */}

      <Box className="finora-emi-desktop">

        <TableContainer
          component={Paper}
          elevation={0}
          className="finora-emi-table-container"
        >

          <Table
            aria-label="EMI Schedule"
            stickyHeader
          >

            <TableHead>

              <TableRow>

                <TableCell>#</TableCell>

                <TableCell>
                  Due Date
                </TableCell>

                <TableCell>
                  Amount
                </TableCell>

                <TableCell>
                  Status
                </TableCell>

                <TableCell>
                  Paid Date
                </TableCell>

                <TableCell align="right">
                  Action
                </TableCell>

              </TableRow>

            </TableHead>


            <TableBody>

              {normalizedSchedule.map((row) => {

                const isPaid =
                  row.status === 'paid';

                const isOverdue =
                  row.status === 'overdue';

                return (
                  <TableRow
                    key={row.installmentNo}
                    hover
                    className={[
                      isPaid
                        ? 'finora-emi-row-paid'
                        : '',
                      isOverdue
                        ? 'finora-emi-row-overdue'
                        : '',
                    ]
                      .filter(Boolean)
                      .join(' ')}
                  >

                    {/* Number */}

                    <TableCell>

                      <Box className="finora-emi-number">
                        {row.installmentNo}
                      </Box>

                    </TableCell>


                    {/* Due Date */}

                    <TableCell>

                      <Box className="finora-emi-date-wrapper">

                        <Typography
                          variant="body2"
                          fontWeight={600}
                        >
                          {formatDate(
                            row.dueDate
                          )}
                        </Typography>

                        {isOverdue && (
                          <Typography
                            variant="caption"
                            color="error.main"
                            fontWeight={600}
                          >
                            Payment overdue
                          </Typography>
                        )}

                      </Box>

                    </TableCell>


                    {/* Amount */}

                    <TableCell>

                      <Typography
                        variant="body1"
                        fontWeight={800}
                        className="finora-emi-table-amount"
                      >
                        {formatCurrency(
                          row.amount
                        )}
                      </Typography>

                    </TableCell>


                    {/* Status */}

                    <TableCell>

                      <Box
                        component="button"
                        type="button"
                        onClick={() =>
                          handleOpenPaymentModal(row)
                        }
                        disabled={isPaid || paymentLoading}
                        className={[
                          'finora-emi-status-button',
                          isPaid
                            ? 'is-disabled'
                            : '',
                        ]
                          .filter(Boolean)
                          .join(' ')}
                      >
                        <StatusChip
                          status={row.status}
                        />
                      </Box>

                    </TableCell>


                    {/* Paid Date */}

                    <TableCell>

                      <Typography
                        variant="body2"
                        color={
                          row.paidDate
                            ? 'text.primary'
                            : 'text.disabled'
                        }
                      >
                        {formatDate(
                          row.paidDate
                        )}
                      </Typography>

                    </TableCell>


                    {/* Action */}

                    <TableCell align="right">

                      {!isPaid ? (

                        <Button
                          size="small"
                          variant="outlined"
                          startIcon={
                            paymentLoading &&
                              selectedEmi?.installmentNo ===
                              row.installmentNo ? (
                              <CircularProgress
                                size={15}
                              />
                            ) : (
                              <Payment fontSize="small" />
                            )
                          }
                          disabled={paymentLoading}
                          onClick={() =>
                            handleOpenPaymentModal(row)
                          }
                          className="finora-emi-action-button"
                        >
                          Pay EMI
                        </Button>

                      ) : (

                        <Box className="finora-emi-completed">
                          <CheckCircleOutlined fontSize="small" />

                          <Typography
                            variant="caption"
                            fontWeight={700}
                          >
                            Completed
                          </Typography>
                        </Box>

                      )}

                    </TableCell>

                  </TableRow>
                );
              })}

            </TableBody>

          </Table>

        </TableContainer>

      </Box>


      {/* =================================================
          MOBILE CARDS
      ================================================== */}

      <Box className="finora-emi-mobile-list">

        {normalizedSchedule.map((emi) => (

          <EmiMobileCard
            key={emi.installmentNo}
            emi={emi}
            onPay={handleOpenPaymentModal}
            paymentLoading={
              paymentLoading &&
              selectedEmi?.installmentNo ===
              emi.installmentNo
            }
          />

        ))}

      </Box>


      {/* =================================================
          PAYMENT MODAL
      ================================================== */}

      <MarkEmiPaidModal
        open={paymentModalOpen}
        emi={selectedEmi}
        loading={paymentLoading}
        onClose={handleClosePaymentModal}
        onConfirm={handleConfirmPayment}
      />

    </Box>
  );
}