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
  Box,
  IconButton,
  Divider,
  Chip,
} from '@mui/material';

import {
  Close as CloseIcon,
  CheckCircleOutlined as CheckCircleOutlineIcon,
  CalendarToday as CalendarTodayIcon,
  ReceiptLong as ReceiptLongIcon,
  CurrencyRupee as CurrencyRupeeIcon,
} from '@mui/icons-material';

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

    setPaidDate(
      new Date(emi?.dueDate).toISOString().split('T')[0] ||
      new Date().toISOString().split('T')[0]
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

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(Number(value) || 0);
  };

  const formattedDueDate = new Date(
    emi.dueDate
  ).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

  return (
    <Dialog
      open={open}
      onClose={loading ? undefined : onClose}
      fullWidth
      maxWidth="sm"
      scroll="paper"
      PaperProps={{
        sx: {
          borderRadius: { xs: 0, sm: 3 },
          width: '100%',
          margin: { xs: 0, sm: 2 },
          maxHeight: { xs: '100dvh', sm: 'calc(100% - 64px)' },
        },
      }}
    >
      {/* Header */}
      <DialogTitle
        sx={{
          px: { xs: 2, sm: 3 },
          pt: { xs: 2, sm: 2.5 },
          pb: 1.5,
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            gap: 2,
          }}
        >
          <Box>
            <Stack
              direction="row"
              spacing={1}
              alignItems="center"
              sx={{ mb: 0.5 }}
            >
              <Box
                sx={{
                  width: 38,
                  height: 38,
                  borderRadius: 2,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  bgcolor: 'success.lighter',
                  color: 'success.main',
                  flexShrink: 0,
                }}
              >
                <CheckCircleOutlineIcon fontSize="small" />
              </Box>

              <Typography
                variant="h6"
                fontWeight={700}
                sx={{
                  fontSize: { xs: '1.05rem', sm: '1.2rem' },
                }}
              >
                Mark EMI as Paid
              </Typography>
            </Stack>

            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ ml: { xs: 0, sm: 5 } }}
            >
              Confirm the payment details for this installment.
            </Typography>
          </Box>

          <IconButton
            onClick={onClose}
            disabled={loading}
            size="small"
            sx={{
              border: '1px solid',
              borderColor: 'divider',
              flexShrink: 0,
            }}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent
        sx={{
          px: { xs: 2, sm: 3 },
          py: 1.5,
        }}
      >
        <Stack spacing={2.5}>
          {/* EMI Summary */}
          <Box
            sx={{
              p: { xs: 1.5, sm: 2 },
              borderRadius: 2.5,
              border: '1px solid',
              borderColor: 'divider',
              bgcolor: 'background.default',
            }}
          >
            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              spacing={2}
              justifyContent="space-between"
            >
              {/* Installment */}
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1.25,
                }}
              >
                <Box
                  sx={{
                    width: 36,
                    height: 36,
                    borderRadius: 1.5,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    bgcolor: 'primary.main',
                    color: 'primary.contrastText',
                  }}
                >
                  <ReceiptLongIcon fontSize="small" />
                </Box>

                <Box>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                  >
                    Installment
                  </Typography>

                  <Typography
                    variant="body1"
                    fontWeight={700}
                  >
                    #{emi.installmentNo}
                  </Typography>
                </Box>
              </Box>

              {/* Due Date */}
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1.25,
                }}
              >
                <Box
                  sx={{
                    width: 36,
                    height: 36,
                    borderRadius: 1.5,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    bgcolor: 'warning.lighter',
                    color: 'warning.main',
                  }}
                >
                  <CalendarTodayIcon fontSize="small" />
                </Box>

                <Box>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                  >
                    Due Date
                  </Typography>

                  <Typography
                    variant="body1"
                    fontWeight={600}
                  >
                    {formattedDueDate}
                  </Typography>
                </Box>
              </Box>

              {/* EMI Amount */}
              <Box
                sx={{
                  textAlign: { xs: 'left', sm: 'right' },
                }}
              >
                <Typography
                  variant="caption"
                  color="text.secondary"
                >
                  EMI Amount
                </Typography>

                <Typography
                  variant="h6"
                  fontWeight={800}
                  color="primary.main"
                >
                  {formatCurrency(emi.amount)}
                </Typography>
              </Box>
            </Stack>
          </Box>

          <Divider />

          {/* Payment Amount */}
          <Box>
            <Typography
              variant="subtitle2"
              fontWeight={700}
              sx={{ mb: 1 }}
            >
              Payment Details
            </Typography>

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
                    <CurrencyRupeeIcon fontSize="small" />
                  </InputAdornment>
                ),
              }}
              inputProps={{
                min: 0,
                step: '0.01',
              }}
              error={Boolean(error)}
              helperText={
                error ||
                `Expected EMI: ${formatCurrency(emi.amount)}`
              }
              fullWidth
              required
              autoFocus
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                },
              }}
            />
          </Box>

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
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
              },
            }}
          />

          {/* Difference Indicator */}
          {Number(amount) > 0 &&
            Number(amount) !== Number(emi.amount) && (
              <Box
                sx={{
                  px: 1.5,
                  py: 1.25,
                  borderRadius: 2,
                  bgcolor:
                    Number(amount) > Number(emi.amount)
                      ? 'info.lighter'
                      : 'warning.lighter',
                }}
              >
                <Stack
                  direction="row"
                  alignItems="center"
                  justifyContent="space-between"
                  gap={1}
                >
                  <Typography
                    variant="body2"
                    color="text.secondary"
                  >
                    Payment difference
                  </Typography>

                  <Chip
                    size="small"
                    label={formatCurrency(
                      Math.abs(
                        Number(amount) -
                        Number(emi.amount)
                      )
                    )}
                    color={
                      Number(amount) > Number(emi.amount)
                        ? 'info'
                        : 'warning'
                    }
                    sx={{ fontWeight: 700 }}
                  />
                </Stack>
              </Box>
            )}
        </Stack>
      </DialogContent>

      {/* Actions */}
      <DialogActions
        sx={{
          px: { xs: 2, sm: 3 },
          py: { xs: 2, sm: 2.5 },
          gap: 1,
          flexDirection: { xs: 'column-reverse', sm: 'row' },
          '& > button': {
            width: { xs: '100%', sm: 'auto' },
            minHeight: 44,
            borderRadius: 2,
            textTransform: 'none',
            fontWeight: 600,
          },
        }}
      >
        <Button
          onClick={onClose}
          disabled={loading}
          color="inherit"
          variant="outlined"
        >
          Cancel
        </Button>

        <Button
          variant="contained"
          color="success"
          onClick={handleConfirm}
          loading={loading}
          startIcon={<CheckCircleOutlineIcon />}
          disableElevation
        >
          Mark as Paid
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default MarkEmiPaidModal;