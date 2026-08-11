import { useState, useEffect } from 'react';
import {
  Modal,
  Box,
  Typography,
  TextField,
  Button,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Stack,
  IconButton,
  InputAdornment,
  Divider,
  Fade,
} from '@mui/material';

import {
  Close as CloseIcon,
  PaymentsOutlined,
  CalendarMonthOutlined,
  NotesOutlined,
  TitleOutlined,
  AccountBalanceWalletOutlined,
} from '@mui/icons-material';

import loanApi from '../../../api/loanApi';

import './AddTransactionModal.css';

export default function AddTransactionModal({
  open,
  onClose,
  loanId,
  onSave,
  loanDetails,
}) {
  const [formData, setFormData] = useState({
    title: '',
    type: 'paid',
    amount: '',
    date: new Date().toISOString().split('T')[0],
    notes: '',
  });

  const [errors, setErrors] = useState({});
  const [paymentType, setPaymentType] = useState('interest');

  const interestOnlyType =
    loanDetails?.loanType === 'loan' &&
    loanDetails?.paymentType === 'interest';

  const amountLabel = interestOnlyType
    ? paymentType === 'interest'
      ? 'Interest Amount'
      : 'Principal Amount'
    : 'Amount';

  useEffect(() => {
    if (open) {
      setFormData({
        title: '',
        type: 'paid',
        amount: '',
        date: new Date().toISOString().split('T')[0],
        notes: '',
      });

      setErrors({});
      setPaymentType('interest');
    }
  }, [open]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: null,
      }));
    }
  };

  const handlePaymentTypeChange = (e) => {
    const { value } = e.target;
    setPaymentType(value);
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!formData.amount || Number(formData.amount) <= 0) {
      newErrors.amount = 'Enter a valid amount greater than 0';
    }

    if (!formData.date) {
      newErrors.date = 'Date is required';
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const saveNewTransaction = async () => {
    try {
      const payload = {
        title: formData.title.trim(),
        type: formData.type,
        amount: Number(formData.amount),
        date: new Date(formData.date).toISOString(),
        notes: formData.notes.trim() || undefined,
      };

      if (interestOnlyType) {
        payload['amountType'] = paymentType;
      }

      const res = await loanApi?.addTransactionByLoanId(
        loanId,
        payload
      );

      if (res?.success) {
        onSave();
      }
    } catch (error) {
      console.log(
        'error in save transaction',
        error?.message
      );
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validate()) return;

    saveNewTransaction();
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      closeAfterTransition
      aria-labelledby="transaction-modal-title"
      aria-describedby="transaction-modal-description"
    >
      <Fade in={open}>
        <Box className="finora-transaction-modal">

          {/* ================= HEADER ================= */}

          <Box className="finora-transaction-header">

            <Box className="finora-transaction-title-wrapper">

              <Box className="finora-transaction-icon">
                <PaymentsOutlined />
              </Box>

              <Box>
                <Typography
                  id="transaction-modal-title"
                  className="finora-transaction-title"
                >
                  Record {loanDetails?.loanType === 'loan' ? 'Paid' : ''}{' '}
                  Transaction
                </Typography>

                <Typography
                  id="transaction-modal-description"
                  className="finora-transaction-subtitle"
                >
                  Add payment details to this loan
                </Typography>
              </Box>

            </Box>

            <IconButton
              onClick={onClose}
              className="finora-modal-close"
              aria-label="Close modal"
            >
              <CloseIcon />
            </IconButton>

          </Box>

          <Divider />

          {/* ================= FORM ================= */}

          <Box
            component="form"
            onSubmit={handleSubmit}
            className="finora-transaction-form"
          >

            {/* ================= DEBT TRANSACTION TYPE ================= */}

            {loanDetails?.loanType === 'debt' && (
              <FormControl className="finora-radio-section">

                <FormLabel className="finora-form-label">
                  Transaction Type
                </FormLabel>

                <RadioGroup
                  row
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  className="finora-option-group"
                >

                  <FormControlLabel
                    value="paid"
                    control={
                      <Radio
                        color="success"
                        size="small"
                      />
                    }
                    label="Paid"
                    className="finora-option"
                  />

                  <FormControlLabel
                    value="borrowed"
                    control={
                      <Radio
                        color="error"
                        size="small"
                      />
                    }
                    label="Borrowed"
                    className="finora-option"
                  />

                </RadioGroup>

              </FormControl>
            )}

            {/* ================= INTEREST TYPE ================= */}

            {interestOnlyType && (
              <FormControl className="finora-radio-section">

                <FormLabel className="finora-form-label">
                  Payment type
                </FormLabel>

                <RadioGroup
                  row
                  name="type"
                  value={paymentType}
                  onChange={handlePaymentTypeChange}
                  className="finora-option-group"
                >

                  <FormControlLabel
                    value="interest"
                    control={
                      <Radio
                        color="success"
                        size="small"
                      />
                    }
                    label="Interest only"
                    className="finora-option"
                  />

                  <FormControlLabel
                    value="principal"
                    control={
                      <Radio
                        color="error"
                        size="small"
                      />
                    }
                    label="principal Amount"
                    className="finora-option"
                  />

                </RadioGroup>

              </FormControl>
            )}

            {/* ================= TITLE ================= */}

            <TextField
              label="Title"
              name="title"
              placeholder='e.g., "Paid via UPI"'
              value={formData.title}
              onChange={handleChange}
              error={Boolean(errors.title)}
              helperText={errors.title}
              fullWidth
              required
              className="finora-transaction-field"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <TitleOutlined fontSize="small" />
                  </InputAdornment>
                ),
              }}
            />

            {/* ================= AMOUNT ================= */}

            <TextField
              label={amountLabel}
              name="amount"
              type="number"
              placeholder="0.00"
              value={formData.amount}
              onChange={handleChange}
              error={Boolean(errors.amount)}
              helperText={errors.amount}
              fullWidth
              required
              className="finora-transaction-field"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <AccountBalanceWalletOutlined fontSize="small" />
                    <Typography className="finora-currency-symbol">
                      ₹
                    </Typography>
                  </InputAdornment>
                ),
              }}
              inputProps={{
                min: 0,
                step: '0.01',
              }}
            />

            {/* ================= DATE ================= */}

            <TextField
              label="Date"
              name="date"
              type="date"
              value={formData.date}
              onChange={handleChange}
              error={Boolean(errors.date)}
              helperText={errors.date}
              InputLabelProps={{
                shrink: true,
              }}
              fullWidth
              required
              className="finora-transaction-field"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <CalendarMonthOutlined fontSize="small" />
                  </InputAdornment>
                ),
              }}
            />

            {/* ================= NOTES ================= */}

            <TextField
              label="Notes (Optional)"
              name="notes"
              placeholder="Add extra context..."
              value={formData.notes}
              onChange={handleChange}
              multiline
              rows={3}
              fullWidth
              className="finora-transaction-field"
              InputProps={{
                startAdornment: (
                  <InputAdornment
                    position="start"
                    sx={{
                      alignSelf: 'flex-start',
                      mt: 1.5,
                    }}
                  >
                    <NotesOutlined fontSize="small" />
                  </InputAdornment>
                ),
              }}
            />

            {/* ================= ACTIONS ================= */}

            <Box className="finora-transaction-actions">

              <Button
                onClick={onClose}
                variant="outlined"
                color="inherit"
                className="finora-transaction-cancel"
              >
                Cancel
              </Button>

              <Button
                type="submit"
                variant="contained"
                className="finora-transaction-save"
              >
                Save Transaction
              </Button>

            </Box>

          </Box>

        </Box>
      </Fade>
    </Modal>
  );
}