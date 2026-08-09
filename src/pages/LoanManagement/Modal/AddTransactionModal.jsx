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
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import loanApi from '../../../api/loanApi';

// Styling object for the modal content container
const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: { xs: '90%', sm: 400 },
  bgcolor: 'background.paper',
  borderRadius: 2,
  boxShadow: 24,
  p: 3,
};

export default function AddTransactionModal({ open, onClose, loanId, onSave, loanDetails }) {
  const [formData, setFormData] = useState({
    title: '',
    type: 'paid',
    amount: '',
    date: new Date().toISOString().split('T')[0],
    notes: '',
  });

  const [errors, setErrors] = useState({});
  const [paymentType, setPaymentType] = useState('interest')

  const interestOnlyType = loanDetails?.loanType === "loan" && loanDetails?.paymentType === "interest";

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
    }
  }, [open]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: null }));
  };

  const handlePaymentTypeChange = (e) => {
    const { value } = e.target;
    setPaymentType(value);
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.amount || Number(formData.amount) <= 0) {
      newErrors.amount = 'Enter a valid amount greater than 0';
    }
    if (!formData.date) newErrors.date = 'Date is required';

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
      }

      if (interestOnlyType) {
        payload["amountType"] = paymentType;
      }
      const res = await loanApi?.addTransactionByLoanId(loanId, payload);
      if (res?.success) {
        onSave()
      }
    } catch (error) {
      console.log("error in save transaction", error?.message)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    saveNewTransaction();
  };

  return (
    <Modal open={open} onClose={onClose} aria-labelledby="modal-title">
      <Box sx={modalStyle}>
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography id="modal-title" variant="h6" component="h2" fontWeight="bold">
            Record {loanDetails?.loanType === "loan" ? "Paid" : ""} Transaction
          </Typography>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>

        {/* Form Inputs */}
        <form onSubmit={handleSubmit}>
          <Stack spacing={2.5}>
            {loanDetails?.loanType === "debt" && (
              <FormControl component="fieldset">
                <FormLabel sx={{ fontSize: '0.875rem', fontWeight: 500, mb: 0.5 }}>
                  Transaction Type
                </FormLabel>
                <RadioGroup row name="type" value={formData.type} onChange={handleChange}>
                  <FormControlLabel value="paid" control={<Radio color="success" />} label="Paid" />
                  <FormControlLabel value="borrowed" control={<Radio color="error" />} label="Borrowed" />
                </RadioGroup>
              </FormControl>
            )}

            {interestOnlyType && (
              <FormControl component="fieldset">
                <FormLabel sx={{ fontSize: '0.875rem', fontWeight: 500, mb: 0.5 }}>
                  Payment type
                </FormLabel>
                <RadioGroup row name="type" value={paymentType} onChange={handlePaymentTypeChange}>
                  <FormControlLabel value="interest" control={<Radio color="success" />} label="Interest only" />
                  <FormControlLabel value="principal" control={<Radio color="error" />} label="principal Amount" />
                </RadioGroup>
              </FormControl>
            )}

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
            />

            <TextField
              label={amountLabel}
              name="amount"
              type="number"
              placeholder="0.00"
              value={formData.amount}
              onChange={handleChange}
              error={Boolean(errors.amount)}
              helperText={errors.amount}
              InputProps={{
                startAdornment: <InputAdornment position="start">₹</InputAdornment>,
              }}
              fullWidth
              required
            />

            <TextField
              label="Date"
              name="date"
              type="date"
              value={formData.date}
              onChange={handleChange}
              error={Boolean(errors.date)}
              helperText={errors.date}
              InputLabelProps={{ shrink: true }}
              fullWidth
              required
            />

            <TextField
              label="Notes (Optional)"
              name="notes"
              placeholder="Add extra context..."
              value={formData.notes}
              onChange={handleChange}
              multiline
              rows={2}
              fullWidth
            />

            {/* Action Buttons */}
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, pt: 1 }}>
              <Button onClick={onClose} variant="contained" color="error">
                Cancel
              </Button>
              <Button type="submit" variant="contained">
                Save Transaction
              </Button>
            </Box>
          </Stack>
        </form>
      </Box>
    </Modal>
  );
}