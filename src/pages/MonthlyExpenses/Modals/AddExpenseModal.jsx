import React, { useState, useEffect } from 'react';
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

// Modal Backdrop Styling
const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: { xs: '90%', sm: 420 },
  bgcolor: 'background.paper',
  borderRadius: 2,
  boxShadow: 24,
  p: 3,
};

export default function AddExpenseModal({ open, onClose, onSubmit, loading = false }) {
  const [formData, setFormData] = useState({
    dueDate: new Date().toISOString().split('T')[0],
    related: '',
    amount: '',
    status: 'Pending',
    notes: '',
  });

  const [errors, setErrors] = useState({});

  // Reset/populate form when modal opens
  useEffect(() => {
    if (open) {
      const todayStr = new Date().toISOString().split('T')[0];
      setFormData({
        dueDate: todayStr,
        related: '',
        amount: '',
        status: 'Pending',
        notes: '',
      });
      setErrors({});
    }
  }, [open]);

  // Dynamic Status Auto-update based on Due Date selection
  const handleDateChange = (e) => {
    const selectedDate = e.target.value;
    const todayStr = new Date().toISOString().split('T')[0];

    setFormData((prev) => {
      let autoStatus = prev.status;
      // If user hasn't explicitly marked as Completed, auto-detect Overdue vs Pending
      if (prev.status !== 'Completed') {
        autoStatus = selectedDate < todayStr ? 'Overdue' : 'Pending';
      }
      return {
        ...prev,
        dueDate: selectedDate,
        status: autoStatus,
      };
    });

    if (errors.dueDate) setErrors((prev) => ({ ...prev, dueDate: null }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: null }));
  };

  // Validation Logic
  const validate = () => {
    const newErrors = {};
    if (!formData.related.trim()) newErrors.related = 'Expense description/title is required';
    if (!formData.amount || Number(formData.amount) <= 0) {
      newErrors.amount = 'Enter a valid amount greater than 0';
    }
    if (!formData.dueDate) newErrors.dueDate = 'Due date is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const payload = {
      dueDate: formData.dueDate,
      related: formData.related.trim(),
      amount: Number(formData.amount),
      status: formData.status,
      notes: formData.notes.trim() || undefined,
    };

    onSubmit(payload);
  };

  return (
    <Modal open={open} onClose={onClose} aria-labelledby="add-expense-modal-title">
      <Box sx={modalStyle}>
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography id="add-expense-modal-title" variant="h6" fontWeight="bold">
            Add New Expense
          </Typography>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>

        {/* Form Form Body */}
        <form onSubmit={handleSubmit}>
          <Stack spacing={2}>
            {/* Serial Number & Due Date */}
            <TextField
              label="Due Date"
              name="dueDate"
              type="date"
              value={formData.dueDate}
              onChange={handleDateChange}
              error={Boolean(errors.dueDate)}
              helperText={errors.dueDate}
              InputLabelProps={{ shrink: true }}
              sx={{ width: '70%' }}
              required
            />

            {/* Expense Description / Related */}
            <TextField
              label="Related (Description)"
              name="related"
              placeholder="e.g., Phone EMI, Room Rent, Bike EMI"
              value={formData.related}
              onChange={handleChange}
              error={Boolean(errors.related)}
              helperText={errors.related}
              fullWidth
              required
            />

            {/* Amount */}
            <TextField
              label="Amount"
              name="amount"
              type="number"
              placeholder="0"
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

            {/* Status Selector */}
            <FormControl component="fieldset">
              <FormLabel sx={{ fontSize: '0.85rem', fontWeight: 500, mb: 0.5 }}>
                Status
              </FormLabel>
              <RadioGroup row name="status" value={formData.status} onChange={handleChange}>
                <FormControlLabel
                  value="Completed"
                  control={<Radio color="success" size="small" />}
                  label="Completed"
                />
                <FormControlLabel
                  value="Pending"
                  control={<Radio color="warning" size="small" />}
                  label="Pending"
                />
                <FormControlLabel
                  value="Overdue"
                  control={<Radio color="error" size="small" />}
                  label="Overdue"
                />
              </RadioGroup>
            </FormControl>

            {/* Notes (Optional) */}
            <TextField
              label="Notes (Optional)"
              name="notes"
              placeholder="Add extra comments..."
              value={formData.notes}
              onChange={handleChange}
              multiline
              rows={2}
              fullWidth
            />

            {/* Buttons */}
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, pt: 1 }}>
              <Button onClick={onClose} color="inherit" disabled={loading}>
                Cancel
              </Button>
              <Button type="submit" variant="contained" loading={loading}>
                Save Expense
              </Button>
            </Box>
          </Stack>
        </form>
      </Box>
    </Modal>
  );
}