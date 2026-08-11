import { useEffect, useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Grid,
  InputAdornment,
  IconButton,
  Alert,
  Paper,
  Checkbox,
  FormGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  Divider,
} from '@mui/material';

import {
  ArrowBack as ArrowBackIcon,
  AccountBalance as BankIcon,
  Save as SaveIcon,
  AccountBalanceWallet as WalletIcon,
  CalendarMonth as CalendarIcon,
  Payments as PaymentIcon,
  Percent as PercentIcon,
} from '@mui/icons-material';

import './AddLoan.css';
import { useNavigate } from 'react-router';
import loanApi from '../../../../api/loanApi';
import { useSelector } from 'react-redux';
import { generateEmiSchedule } from '../../../../utils/helper';

export default function AddLoan() {
  const user = useSelector((state) => state?.auth?.user);

  const [formData, setFormData] = useState({
    title: '',
    lender: '',
    principal: '',
    startDate: new Date().toISOString().split('T')[0],
    emiAmount: 0,
    tenureMonths: 0,
    interestAmount: 0
  });

  const navigate = useNavigate();

  const [error, setError] = useState('');
  const [loanType, setLoanType] = useState('loan');
  const [monthlyPayment, setMonthlyPayment] = useState("emi");

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePaymentTypeChange = (e) => {
    setMonthlyPayment(e?.target?.name);
  };

  const buildLoanPayload = () => {
    const {
      title,
      lender,
      principal,
      startDate,
      tenureMonths,
      emiAmount,
      interestAmount,
    } = formData;

    const payload = {
      userId: user?._id,
      loanDetails: title.trim(),
      lenderName: lender.trim(),
      loanType,
      totalAmount: Number(principal),
      startDate,
    };

    if (loanType !== 'loan') {
      return payload;
    }

    payload.paymentType = monthlyPayment;

    if (monthlyPayment === 'emi') {
      const emi = Number(emiAmount) || 0;
      const tenure = Number(tenureMonths) || 0;

      payload.emiAmount = emi;
      payload.tenureMonths = tenure;

      payload.emiSchedule = generateEmiSchedule({
        emiAmount: emi,
        tenureMonths: tenure,
        startDate,
      });
    }

    if (monthlyPayment === 'interest') {
      payload.interestAmount =
        Number(interestAmount) || 0;
    }

    return payload;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      if (
        !formData.title?.trim() ||
        !formData.lender?.trim() ||
        !formData.principal
      ) {
        setError('Please fill out all required fields.');
        return;
      }

      const payload = buildLoanPayload();

      console.log('Creating loan:', payload);

      const res = await loanApi.createNewLoan(payload);

      if (!res?.success) {
        setError(res?.message || 'Failed to create loan.');
        return;
      }

      navigate('/loans');
    } catch (error) {
      console.error('Create loan error:', error);

      setError(
        error?.response?.data?.message ||
        error?.message ||
        'Something went wrong while creating the loan.'
      );
    }
  };

  const handleLoanTypeChange = (value) => {
    setLoanType(value);
  };

  useEffect(() => {
    if (loanType !== 'loan' || monthlyPayment !== 'emi') {
      return;
    }

    const emiAmount = Number(formData.emiAmount) || 0;
    const tenureMonths = Number(formData.tenureMonths) || 0;

    const principalAmount = emiAmount * tenureMonths;

    setFormData((prev) => {
      if (prev.principal === principalAmount) {
        return prev;
      }

      return {
        ...prev,
        principal: principalAmount,
      };
    });
  }, [
    loanType,
    monthlyPayment,
    formData.emiAmount,
    formData.tenureMonths,
  ]);

  return (
    <Box className="finora-add-loan-container">

      {/* ================= HEADER ================= */}
      <Box className="finora-add-loan-header">

        <IconButton
          onClick={() => navigate(-1)}
          className="finora-back-button"
        >
          <ArrowBackIcon />
        </IconButton>

        <Box className="finora-header-content">
          <Typography
            variant="h5"
            className="finora-page-title"
          >
            Add New Loan
          </Typography>

          <Typography
            variant="body2"
            className="finora-page-subtitle"
          >
            Enter your loan details. Monthly EMIs and totals
            will be calculated automatically.
          </Typography>
        </Box>

      </Box>

      {/* ================= ERROR ================= */}
      {error && (
        <Alert
          severity="error"
          className="finora-loan-alert"
          onClose={() => setError('')}
        >
          {error}
        </Alert>
      )}

      <Box
        component="form"
        onSubmit={handleSubmit}
        noValidate
      >

        <Grid
          container
          spacing={3}
          className="finora-add-loan-grid"
        >

          {/* ================= LEFT FORM ================= */}
          <Grid item xs={12} md={8}>

            <Card
              elevation={0}
              className="finora-card finora-loan-form-card"
            >

              <CardContent className="finora-card-content">

                {/* Section Header */}
                <Box className="finora-section-header">

                  <Box className="finora-section-icon">
                    <WalletIcon />
                  </Box>

                  <Box>
                    <Typography
                      variant="h6"
                      className="finora-section-title"
                    >
                      Loan Specifications
                    </Typography>

                    <Typography
                      variant="body2"
                      className="finora-section-description"
                    >
                      Add the basic information about this loan.
                    </Typography>
                  </Box>

                </Box>

                <Divider className="finora-section-divider" />

                {/* ================= LOAN TYPE ================= */}
                <Box className="finora-loan-type-section">

                  <Typography
                    className="finora-field-section-label"
                  >
                    Loan Type
                  </Typography>

                  <Box className="finora-type-options">

                    <Box
                      className={`finora-type-option ${loanType === 'loan'
                          ? 'selected'
                          : ''
                        }`}
                      onClick={() =>
                        handleLoanTypeChange('loan')
                      }
                    >
                      <Checkbox
                        checked={loanType === 'loan'}
                        onChange={() =>
                          handleLoanTypeChange('loan')
                        }
                      />

                      <Box>
                        <Typography
                          className="finora-option-title"
                        >
                          Loan
                        </Typography>

                        <Typography
                          className="finora-option-description"
                        >
                          EMI based borrowing
                        </Typography>
                      </Box>
                    </Box>

                    <Box
                      className={`finora-type-option ${loanType === 'debt'
                          ? 'selected'
                          : ''
                        }`}
                      onClick={() =>
                        handleLoanTypeChange('debt')
                      }
                    >
                      <Checkbox
                        checked={loanType === 'debt'}
                        onChange={() =>
                          handleLoanTypeChange('debt')
                        }
                      />

                      <Box>
                        <Typography
                          className="finora-option-title"
                        >
                          Debt
                        </Typography>

                        <Typography
                          className="finora-option-description"
                        >
                          Personal borrowing
                        </Typography>
                      </Box>
                    </Box>

                  </Box>

                </Box>

                {/* ================= BASIC DETAILS ================= */}
                <Box className="finora-form-section">

                  <Typography className="finora-subsection-title">
                    Basic Details
                  </Typography>

                  <Grid container spacing={2}>

                    <Grid item xs={12} sm={6}>

                      <TextField
                        fullWidth
                        required
                        label="Loan Title"
                        name="title"
                        placeholder="e.g., Home Renovation Loan"
                        value={formData.title}
                        onChange={handleChange}
                      />

                    </Grid>

                    <Grid item xs={12} sm={6}>

                      <TextField
                        fullWidth
                        required
                        label="Lender / Bank Name"
                        name="lender"
                        placeholder="e.g., HDFC Bank"
                        value={formData.lender}
                        onChange={handleChange}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <BankIcon color="action" />
                            </InputAdornment>
                          ),
                        }}
                      />

                    </Grid>

                    <Grid item xs={12} sm={6}>

                      <TextField
                        fullWidth
                        required
                        type="number"
                        label="Loan Amount"
                        name="principal"
                        value={formData.principal}
                        onChange={handleChange}
                        disabled={
                          loanType === "loan" &&
                          monthlyPayment === "emi"
                        }
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              ₹
                            </InputAdornment>
                          ),
                        }}
                      />

                    </Grid>

                    <Grid item xs={12} sm={6}>

                      <TextField
                        fullWidth
                        type="date"
                        label="Disbursement Date"
                        name="startDate"
                        value={formData.startDate}
                        onChange={handleChange}
                        InputLabelProps={{
                          shrink: true
                        }}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <CalendarIcon color="action" />
                            </InputAdornment>
                          ),
                        }}
                      />

                    </Grid>

                  </Grid>

                </Box>

                {/* ================= PAYMENT TYPE ================= */}
                {loanType === "loan" && (
                  <Box className="finora-form-section">

                    <Typography className="finora-subsection-title">
                      Monthly Payment
                    </Typography>

                    <FormControl
                      component="fieldset"
                      className="finora-payment-control"
                    >

                      <FormLabel component="legend">
                        Choose payment method
                      </FormLabel>

                      <FormGroup className="finora-payment-options">

                        <FormControlLabel
                          className={`finora-payment-option ${monthlyPayment === "emi"
                              ? "selected"
                              : ""
                            }`}
                          control={
                            <Checkbox
                              checked={
                                monthlyPayment === "emi"
                              }
                              onChange={
                                handlePaymentTypeChange
                              }
                              name="emi"
                            />
                          }
                          label={
                            <Box>
                              <Typography
                                fontWeight={600}
                              >
                                EMI
                              </Typography>

                              <Typography
                                variant="caption"
                                color="text.secondary"
                              >
                                Fixed monthly payment
                              </Typography>
                            </Box>
                          }
                        />

                        <FormControlLabel
                          className={`finora-payment-option ${monthlyPayment === "interest"
                              ? "selected"
                              : ""
                            }`}
                          control={
                            <Checkbox
                              checked={
                                monthlyPayment === "interest"
                              }
                              onChange={
                                handlePaymentTypeChange
                              }
                              name="interest"
                            />
                          }
                          label={
                            <Box>
                              <Typography
                                fontWeight={600}
                              >
                                Interest only
                              </Typography>

                              <Typography
                                variant="caption"
                                color="text.secondary"
                              >
                                Pay interest periodically
                              </Typography>
                            </Box>
                          }
                        />

                      </FormGroup>

                    </FormControl>

                  </Box>
                )}

                {/* ================= EMI DETAILS ================= */}
                {loanType === "loan" && (
                  <Box className="finora-form-section">

                    {monthlyPayment === 'emi' ? (
                      <>

                        <Typography className="finora-subsection-title">
                          EMI Details
                        </Typography>

                        <Grid container spacing={2}>

                          <Grid item xs={12} sm={6}>

                            <TextField
                              fullWidth
                              type="number"
                              label="EMI Amount"
                              name="emiAmount"
                              value={formData.emiAmount}
                              onChange={handleChange}
                              InputLabelProps={{
                                shrink: true
                              }}
                              InputProps={{
                                startAdornment: (
                                  <InputAdornment position="start">
                                    <PaymentIcon color="action" />
                                  </InputAdornment>
                                ),
                              }}
                            />

                          </Grid>

                          <Grid item xs={12} sm={6}>

                            <TextField
                              fullWidth
                              type="number"
                              label="Tenure Months"
                              name="tenureMonths"
                              value={formData.tenureMonths}
                              onChange={handleChange}
                              InputLabelProps={{
                                shrink: true
                              }}
                              InputProps={{
                                endAdornment: (
                                  <InputAdornment position="end">
                                    months
                                  </InputAdornment>
                                ),
                              }}
                            />

                          </Grid>

                        </Grid>

                      </>
                    ) : (
                      <>

                        <Typography className="finora-subsection-title">
                          Interest Details
                        </Typography>

                        <Grid container spacing={2}>

                          <Grid item xs={12} sm={6}>

                            <TextField
                              fullWidth
                              type="number"
                              label="Interest Amount"
                              name="interestAmount"
                              value={formData?.interestAmount}
                              onChange={handleChange}
                              InputLabelProps={{
                                shrink: true
                              }}
                              InputProps={{
                                startAdornment: (
                                  <InputAdornment position="start">
                                    <PercentIcon color="action" />
                                  </InputAdornment>
                                ),
                              }}
                            />

                          </Grid>

                        </Grid>

                      </>
                    )}

                  </Box>
                )}

              </CardContent>

            </Card>

          </Grid>

          {/* ================= SUMMARY ================= */}
          <Grid item xs={12} md={4}>

            <Paper
              elevation={0}
              className="finora-summary-card"
            >

              <Box className="finora-summary-header">

                <Box className="finora-summary-icon">
                  <PaymentIcon />
                </Box>

                <Box>

                  <Typography
                    className="finora-summary-title"
                  >
                    Loan Summary
                  </Typography>

                  <Typography
                    className="finora-summary-description"
                  >
                    Review your loan before saving.
                  </Typography>

                </Box>

              </Box>

              <Divider sx={{ my: 2 }} />

              <Box className="finora-summary-content">

                <Box className="finora-summary-row">
                  <Typography>
                    Loan Type
                  </Typography>

                  <Typography fontWeight={600}>
                    {loanType === 'loan'
                      ? 'Loan'
                      : 'Debt'}
                  </Typography>
                </Box>

                <Box className="finora-summary-row">
                  <Typography>
                    Payment Type
                  </Typography>

                  <Typography fontWeight={600}>
                    {loanType === 'loan'
                      ? monthlyPayment === 'emi'
                        ? 'EMI'
                        : 'Interest Only'
                      : '—'}
                  </Typography>
                </Box>

                <Box className="finora-summary-row">
                  <Typography>
                    Loan Amount
                  </Typography>

                  <Typography
                    fontWeight={700}
                    className="finora-summary-amount"
                  >
                    ₹
                    {Number(
                      formData.principal || 0
                    ).toLocaleString('en-IN')}
                  </Typography>
                </Box>

                {loanType === 'loan' &&
                  monthlyPayment === 'emi' && (
                    <>
                      <Box className="finora-summary-row">

                        <Typography>
                          Monthly EMI
                        </Typography>

                        <Typography fontWeight={600}>
                          ₹
                          {Number(
                            formData.emiAmount || 0
                          ).toLocaleString('en-IN')}
                        </Typography>

                      </Box>

                      <Box className="finora-summary-row">

                        <Typography>
                          Tenure
                        </Typography>

                        <Typography fontWeight={600}>
                          {formData.tenureMonths || 0}{' '}
                          months
                        </Typography>

                      </Box>
                    </>
                  )}

              </Box>

              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                startIcon={<SaveIcon />}
                className="finora-save-loan-button"
              >
                Save & Link EMI
              </Button>

              <Typography
                className="finora-summary-note"
              >
                Your EMI schedule will be generated
                automatically after saving.
              </Typography>

            </Paper>

          </Grid>

        </Grid>

      </Box>

    </Box>
  );
}