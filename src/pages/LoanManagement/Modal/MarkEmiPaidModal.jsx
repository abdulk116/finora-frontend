import { useEffect, useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Stack,
  Typography,
  InputAdornment,
} from '@mui/material';

const MarkEmiPaidModal = ({
  open,
  emi,
  onClose,
  onConfirm,
  loading = false,
}) => {
  const [amount, setAmount] = useState('');
  const [paidDate, setPaidDate] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!emi || !open) return;

    setAmount(emi.amount || '');

    // Default paid date to today
    setPaidDate(
      new Date(emi?.dueDate).toISOString().split('T')[0] || new Date().toISOString().split('T')[0]
    );

    setError('');
  }, [emi, open]);

  const handleConfirm = () => {
    const numericAmount = Number(amount);

    if (!numericAmount || numericAmount <= 0) {
      setError('Please enter a valid payment amount.');
      return;
    }

    if (!paidDate) {
      setError('Please select the payment date.');
      return;
    }

    onConfirm({
      installmentNo: emi.installmentNo,
      amount: numericAmount,
      paidDate,
    });
  };

  if (!emi) {
    return null;
  }

  return (
    <Dialog
      open={open}
      onClose={loading ? undefined : onClose}
      fullWidth
      maxWidth="sm"
    >
      <DialogTitle>
        Mark EMI as Paid
      </DialogTitle>

      <DialogContent>
        <Stack spacing={2.5} sx={{ pt: 1 }}>
          {/* Installment */}
          <Stack spacing={0.5}>
            <Typography
              variant="body2"
              color="text.secondary"
            >
              Installment
            </Typography>

            <Typography variant="body1" fontWeight={600}>
              #{emi.installmentNo}
            </Typography>
          </Stack>

          {/* Due Date */}
          <Stack spacing={0.5}>
            <Typography
              variant="body2"
              color="text.secondary"
            >
              Due Date
            </Typography>

            <Typography variant="body1">
              {new Date(
                emi.dueDate
              ).toLocaleDateString('en-IN', {
                day: '2-digit',
                month: 'short',
                year: 'numeric',
              })}
            </Typography>
          </Stack>

          {/* Payment Amount */}
          <TextField
            label="Paid Amount"
            type="number"
            value={amount}
            onChange={(e) => {
              setAmount(e.target.value);
              setError('');
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  ₹
                </InputAdornment>
              ),
            }}
            inputProps={{
              min: 0,
              step: '0.01',
            }}
            error={Boolean(error)}
            helperText={error}
            fullWidth
            required
          />

          {/* Paid Date */}
          <TextField
            label="Payment Date"
            type="date"
            value={paidDate}
            onChange={(e) => {
              setPaidDate(e.target.value);
              setError('');
            }}
            InputLabelProps={{
              shrink: true,
            }}
            fullWidth
            required
          />
        </Stack>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button
          onClick={onClose}
          disabled={loading}
        >
          Cancel
        </Button>

        <Button
          variant="contained"
          color="success"
          onClick={handleConfirm}
          loading={loading}
        >
          Mark as Paid
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default MarkEmiPaidModal;