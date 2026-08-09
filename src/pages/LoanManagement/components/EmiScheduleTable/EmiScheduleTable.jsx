import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Typography,
  Box,
} from '@mui/material';
import { CheckCircleOutlined, AccessTime, ErrorOutlined } from '@mui/icons-material';
import { useState } from 'react';
import MarkEmiPaidModal from '../../Modal/MarkEmiPaidModal';
import loanApi from '../../../../api/loanApi';

// Helper to render styled status chips
const StatusChip = ({ status }) => {
  switch (status.toLowerCase()) {
    case 'paid':
      return (
        <Chip
          icon={<CheckCircleOutlined fontSize="small" />}
          label="Paid"
          color="success"
          variant="soft" // or 'filled' / 'outlined'
          size="small"
        />
      );
    case 'overdue':
      return (
        <Chip
          icon={<ErrorOutlined fontSize="small" />}
          label="Overdue"
          color="error"
          size="small"
        />
      );
    case 'pending':
    default:
      return (
        <Chip
          icon={<AccessTime fontSize="small" />}
          label="Pending"
          color="warning"
          size="small"
        />
      );
  }
};

export default function EmiScheduleTable({ emiSchedule = [], loanId, fetchLoanDetails }) {
  const [selectedEmi, setSelectedEmi] = useState(null);
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [paymentLoading, setPaymentLoading] = useState(false);

  const handleOpenPaymentModal = (emi) => {
    if (emi.status === 'paid') {
      return;
    }

    setSelectedEmi(emi);
    setPaymentModalOpen(true);
  };

  const handleClosePaymentModal = () => {
    if (paymentLoading) return;

    setPaymentModalOpen(false);
    setSelectedEmi(null);
  };

  const handleConfirmPayment = async ({
    installmentNo,
    amount,
    paidDate,
  }) => {
    try {
      setPaymentLoading(true);

      // API call goes here
      const response = await loanApi.markEmiAsPaid(
        loanId,
        installmentNo,
        {
          amount,
          paidDate,
        }
      );

      if (!response?.success) {
        throw new Error(
          response?.message || 'Failed to update EMI.'
        );
      }

      handleClosePaymentModal();
      fetchLoanDetails();

    } catch (error) {
      console.error(
        'Mark EMI paid error:',
        error
      );

      // You can pass this error back to the modal
      // if required.
    } finally {
      setPaymentLoading(false);
    }
  };

  if (!emiSchedule.length) {
    return (
      <Typography variant="body2" color="text.secondary" sx={{ p: 2, textAlign: 'center' }}>
        No EMI schedule generated yet.
      </Typography>
    );
  }

  return (
    <>
      <TableContainer component={Paper} elevation={1} sx={{ borderRadius: 2, overflow: 'hidden' }}>
        <Table aria-label="EMI Schedule Table">
          <TableHead sx={{ backgroundColor: (theme) => theme.palette.action.hover }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold' }}>#</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Due Date</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Amount</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Paid Date</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {emiSchedule.map((row) => (
              <TableRow
                key={row.installmentNo}
                hover
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {row.installmentNo}
                </TableCell>

                <TableCell>
                  {new Date(row.dueDate).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  })}
                </TableCell>

                <TableCell>
                  ₹{Number(row.amount).toLocaleString('en-IN')}
                </TableCell>

                <TableCell>
                  {row.status === 'paid' ? (
                    <StatusChip status={row.status} />
                  ) : (
                    <Box
                      component="span"
                      onClick={() => handleOpenPaymentModal(row)}
                      sx={{
                        cursor: 'pointer',
                        display: 'inline-flex',
                      }}
                    >
                      <StatusChip status={row.status} />
                    </Box>
                  )}
                </TableCell>

                <TableCell>
                  {row.paidDate ? (
                    new Date(row.paidDate).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })
                  ) : (
                    <Typography variant="body2" color="text.disabled">
                      —
                    </Typography>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <MarkEmiPaidModal
        open={paymentModalOpen}
        emi={selectedEmi}
        loading={paymentLoading}
        onClose={handleClosePaymentModal}
        onConfirm={handleConfirmPayment}
      />
    </>
  );
}