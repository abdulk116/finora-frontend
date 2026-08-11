import { useEffect, useMemo, useState } from 'react';
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
  Chip,
} from '@mui/material';

import {
  Close,
  CalendarToday,
  Description,
  CurrencyRupee,
  Notes,
  CheckCircle,
  Schedule,
  WarningAmber,
  Save,
} from '@mui/icons-material';

import './AddExpenseModal.css';

const getTodayString = () => {
  const date = new Date();

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
};

const initialForm = () => ({
  dueDate: getTodayString(),
  related: '',
  amount: '',
  status: 'Pending',
  notes: '',
});

export default function AddExpenseModal({
  open,
  onClose,
  onSubmit,
  loading = false,
}) {
  const [formData, setFormData] = useState(initialForm);
  const [errors, setErrors] = useState({});

  /**
   * ---------------------------------------------------------
   * Reset form whenever modal opens
   * ---------------------------------------------------------
   */
  useEffect(() => {
    if (open) {
      setFormData(initialForm());
      setErrors({});
    }
  }, [open]);

  /**
   * ---------------------------------------------------------
   * Current date
   * ---------------------------------------------------------
   */
  const today = useMemo(() => getTodayString(), []);

  /**
   * ---------------------------------------------------------
   * Date status
   * ---------------------------------------------------------
   */
  const dateStatus = useMemo(() => {
    if (!formData.dueDate) return null;

    if (formData.dueDate < today) {
      return {
        label: 'Past due date',
        color: 'error',
        icon: <WarningAmber fontSize="small" />,
      };
    }

    if (formData.dueDate === today) {
      return {
        label: 'Due today',
        color: 'warning',
        icon: <Schedule fontSize="small" />,
      };
    }

    return {
      label: 'Upcoming',
      color: 'success',
      icon: <CheckCircle fontSize="small" />,
    };
  }, [formData.dueDate, today]);

  /**
   * ---------------------------------------------------------
   * Date change
   * ---------------------------------------------------------
   */
  const handleDateChange = (event) => {
    const selectedDate = event.target.value;

    setFormData((prev) => {
      let nextStatus = prev.status;

      /**
       * Don't automatically overwrite Completed.
       *
       * If user has selected Completed,
       * keep it completed.
       */
      if (prev.status !== 'Completed') {
        nextStatus =
          selectedDate < today
            ? 'Overdue'
            : 'Pending';
      }

      return {
        ...prev,
        dueDate: selectedDate,
        status: nextStatus,
      };
    });

    setErrors((prev) => ({
      ...prev,
      dueDate: undefined,
    }));
  };

  /**
   * ---------------------------------------------------------
   * Generic input change
   * ---------------------------------------------------------
   */
  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  /**
   * ---------------------------------------------------------
   * Amount change
   * ---------------------------------------------------------
   */
  const handleAmountChange = (event) => {
    const value = event.target.value;

    /**
     * Prevent negative values.
     */
    if (Number(value) < 0) {
      return;
    }

    setFormData((prev) => ({
      ...prev,
      amount: value,
    }));

    if (errors.amount) {
      setErrors((prev) => ({
        ...prev,
        amount: undefined,
      }));
    }
  };

  /**
   * ---------------------------------------------------------
   * Validation
   * ---------------------------------------------------------
   */
  const validate = () => {
    const newErrors = {};

    if (!formData.dueDate) {
      newErrors.dueDate = 'Due date is required';
    }

    if (!formData.related.trim()) {
      newErrors.related =
        'Expense description is required';
    } else if (formData.related.trim().length < 2) {
      newErrors.related =
        'Description must contain at least 2 characters';
    }

    if (!formData.amount) {
      newErrors.amount = 'Amount is required';
    } else if (Number(formData.amount) <= 0) {
      newErrors.amount =
        'Amount must be greater than ₹0';
    }

    if (formData.notes.length > 500) {
      newErrors.notes =
        'Notes cannot exceed 500 characters';
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  /**
   * ---------------------------------------------------------
   * Submit
   * ---------------------------------------------------------
   */
  const handleSubmit = (event) => {
    event.preventDefault();

    if (loading) return;

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

  /**
   * ---------------------------------------------------------
   * Close
   * ---------------------------------------------------------
   */
  const handleClose = () => {
    if (loading) return;

    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="add-expense-modal-title"
      aria-describedby="add-expense-modal-description"
      closeAfterTransition
    >
      <Box className="finora-expense-modal">

        {/* =================================================
            HEADER
        ================================================= */}

        <Box className="finora-expense-modal-header">

          <Box className="finora-modal-title-wrapper">

            <Box className="finora-modal-icon">
              <ReceiptIcon />
            </Box>

            <Box>
              <Typography
                id="add-expense-modal-title"
                className="finora-modal-title"
              >
                Add New Expense
              </Typography>

              <Typography
                id="add-expense-modal-description"
                className="finora-modal-subtitle"
              >
                Record a new payment or upcoming expense.
              </Typography>
            </Box>

          </Box>

          <IconButton
            onClick={handleClose}
            disabled={loading}
            className="finora-modal-close"
            aria-label="Close modal"
          >
            <Close />
          </IconButton>

        </Box>


        <Divider />


        {/* =================================================
            FORM
        ================================================= */}

        <Box
          component="form"
          onSubmit={handleSubmit}
          className="finora-expense-form"
        >

          {/* =================================================
              BASIC INFORMATION
          ================================================= */}

          <Box className="finora-form-section">

            <Typography className="finora-form-section-title">
              Expense Details
            </Typography>

            <Typography className="finora-form-section-description">
              Enter the basic information about this expense.
            </Typography>


            <Stack spacing={2}>

              {/* Due Date */}

              <Box>

                <TextField
                  fullWidth
                  label="Due Date"
                  name="dueDate"
                  type="date"
                  value={formData.dueDate}
                  onChange={handleDateChange}
                  error={Boolean(errors.dueDate)}
                  helperText={errors.dueDate}
                  disabled={loading}
                  required
                  InputLabelProps={{
                    shrink: true,
                  }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <CalendarToday fontSize="small" />
                      </InputAdornment>
                    ),
                  }}
                />

                {dateStatus && !errors.dueDate && (
                  <Chip
                    icon={dateStatus.icon}
                    label={dateStatus.label}
                    color={dateStatus.color}
                    size="small"
                    variant="outlined"
                    className="finora-date-status"
                  />
                )}

              </Box>


              {/* Description */}

              <TextField
                fullWidth
                label="Expense Description"
                name="related"
                placeholder="e.g. Phone EMI, Room Rent, Bike EMI"
                value={formData.related}
                onChange={handleChange}
                error={Boolean(errors.related)}
                helperText={
                  errors.related ||
                  'Give your expense a short meaningful name'
                }
                disabled={loading}
                required
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Description fontSize="small" />
                    </InputAdornment>
                  ),
                }}
              />


              {/* Amount */}

              <TextField
                fullWidth
                label="Amount"
                name="amount"
                type="number"
                placeholder="0"
                value={formData.amount}
                onChange={handleAmountChange}
                error={Boolean(errors.amount)}
                helperText={errors.amount}
                disabled={loading}
                required
                inputProps={{
                  min: 0,
                  step: '0.01',
                  inputMode: 'decimal',
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <CurrencyRupee fontSize="small" />
                    </InputAdornment>
                  ),
                }}
              />

            </Stack>

          </Box>


          <Divider />


          {/* =================================================
              STATUS
          ================================================= */}

          <Box className="finora-form-section">

            <FormControl
              component="fieldset"
              disabled={loading}
              fullWidth
            >

              <FormLabel className="finora-status-label">
                Payment Status
              </FormLabel>

              <Typography className="finora-status-description">
                Choose the current payment status.
              </Typography>


              <RadioGroup
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="finora-status-group"
              >

                <FormControlLabel
                  value="Pending"
                  control={
                    <Radio color="warning" />
                  }
                  label={
                    <Box>
                      <Typography className="status-option-title">
                        Pending
                      </Typography>

                      <Typography className="status-option-description">
                        Payment is not completed
                      </Typography>
                    </Box>
                  }
                  className={`finora-status-option ${
                    formData.status === 'Pending'
                      ? 'selected pending'
                      : ''
                  }`}
                />


                <FormControlLabel
                  value="Completed"
                  control={
                    <Radio color="success" />
                  }
                  label={
                    <Box>
                      <Typography className="status-option-title">
                        Completed
                      </Typography>

                      <Typography className="status-option-description">
                        Payment has been completed
                      </Typography>
                    </Box>
                  }
                  className={`finora-status-option ${
                    formData.status === 'Completed'
                      ? 'selected completed'
                      : ''
                  }`}
                />


                <FormControlLabel
                  value="Overdue"
                  control={
                    <Radio color="error" />
                  }
                  label={
                    <Box>
                      <Typography className="status-option-title">
                        Overdue
                      </Typography>

                      <Typography className="status-option-description">
                        Payment has passed its due date
                      </Typography>
                    </Box>
                  }
                  className={`finora-status-option ${
                    formData.status === 'Overdue'
                      ? 'selected overdue'
                      : ''
                  }`}
                />

              </RadioGroup>

            </FormControl>

          </Box>


          <Divider />


          {/* =================================================
              NOTES
          ================================================= */}

          <Box className="finora-form-section">

            <TextField
              fullWidth
              label="Notes"
              name="notes"
              placeholder="Add additional information..."
              value={formData.notes}
              onChange={handleChange}
              error={Boolean(errors.notes)}
              helperText={
                errors.notes ||
                `${formData.notes.length}/500`
              }
              disabled={loading}
              multiline
              minRows={3}
              maxRows={6}
              InputProps={{
                startAdornment: (
                  <InputAdornment
                    position="start"
                    sx={{
                      alignSelf: 'flex-start',
                      mt: 1.5,
                    }}
                  >
                    <Notes fontSize="small" />
                  </InputAdornment>
                ),
              }}
            />

          </Box>


          {/* =================================================
              FOOTER
          ================================================= */}

          <Box className="finora-expense-modal-footer">

            <Button
              type="button"
              onClick={handleClose}
              disabled={loading}
              className="finora-cancel-button"
            >
              Cancel
            </Button>

            <Button
              type="submit"
              variant="contained"
              disabled={loading}
              className="finora-save-button"
              startIcon={<Save />}
            >
              {loading
                ? 'Saving...'
                : 'Save Expense'}
            </Button>

          </Box>

        </Box>

      </Box>
    </Modal>
  );
}


/**
 * Small local icon component.
 *
 * Keeping it here avoids another import just for the
 * modal header icon.
 */
function ReceiptIcon() {
  return <CurrencyRupee />;
}