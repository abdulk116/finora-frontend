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
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  AccountBalance as BankIcon,
  Save as SaveIcon,
} from '@mui/icons-material';
import './AddLoan.css';
import { useNavigate } from 'react-router';
import loanApi from '../../../../api/loanApi';
import { useSelector } from 'react-redux';
import { generateEmiSchedule } from '../../../../utils/helper';

// Predefined Loan Categories
// const loanCategories = [
//   { name: "Bank loan", value: 'bank_loan' },
//   { name: "EMI", value: 'emi' },
//   { name: "App loan", value: 'app_loan' },
//   { name: "Personal Debt", value: 'personal_debt' }
// ];

// const generateEmiSchedule = (emiStartDate, emiAmt, tenure) => {
//   if (!emiStartDate || !emiAmt || !tenure) return [];

//   const schedule = [];
//   const [year, month, day] = emiStartDate.split('-').map(Number);

//   // Get today's date in "YYYY-MM-DD" format using local time
//   const now = new Date();
//   const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;

//   for (let i = 0; i < tenure; i++) {
//     const targetDate = new Date(year, (month - 1) + i, day);

//     const formattedYear = targetDate.getFullYear();
//     const formattedMonth = String(targetDate.getMonth() + 1).padStart(2, '0');
//     const formattedDay = String(targetDate.getDate()).padStart(2, '0');

//     const dueDate = `${formattedYear}-${formattedMonth}-${formattedDay}`;

//     // If due date is strictly before today, it's considered paid
//     const isPast = dueDate < todayStr;

//     const installment = {
//       installmentNo: i + 1,
//       dueDate,
//       amount: Number(emiAmt),
//       status: isPast ? 'paid' : 'pending',
//     };

//     // Optionally attach a paidDate for historical past payments
//     if (isPast) {
//       installment.paidDate = dueDate;
//     }

//     schedule.push(installment);
//   }

//   return schedule;
// }


export default function AddLoan() {
  const user = useSelector((state) => state?.auth?.user)
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

  // Handle Form Inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePaymentTypeChange = (e) => {
    setMonthlyPayment(e?.target?.name)
  }

  // build payload for create loan
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

  // ---------------------------------
  // Base payload
  // ---------------------------------

  const payload = {
    userId: user?._id,
    loanDetails: title.trim(),
    lenderName: lender.trim(),
    loanType,
    totalAmount: Number(principal),
    startDate,
  };

  // ---------------------------------
  // Non-loan transaction
  // ---------------------------------

  if (loanType !== 'loan') {
    return payload;
  }

  // ---------------------------------
  // Loan payment type
  // ---------------------------------

  payload.paymentType = monthlyPayment;

  // ---------------------------------
  // EMI-based loan
  // ---------------------------------

  if (monthlyPayment === 'emi') {
    const emi = Number(emiAmount) || 0;
    const tenure = Number(tenureMonths) || 0;

    payload.emiAmount = emi;
    payload.tenureMonths = tenure;

    // Generate EMI schedule
    payload.emiSchedule = generateEmiSchedule({
      emiAmount: emi,
      tenureMonths: tenure,
      startDate,
    });
  }

  // ---------------------------------
  // Interest-only loan
  // ---------------------------------

  if (monthlyPayment === 'interest') {
    payload.interestAmount =
      Number(interestAmount) || 0;
  }

  return payload;
};

  // Form Submit Handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      // Validate
      if (!formData.title?.trim() ||
        !formData.lender?.trim() ||
        !formData.principal) {
        setError('Please fill out all required fields.');
        return;
      }

      // Build payload
      const payload = buildLoanPayload();

      console.log('Creating loan:', payload);

      // API call
      const res = await loanApi.createNewLoan(payload);

      if (!res?.success) {
        setError(res?.message || 'Failed to create loan.');
        return;
      }

      // Success
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
  }

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
      {/* Top Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
        <IconButton onClick={() => navigate(-1)} sx={{ bgcolor: '#ffffff', border: '1px solid #e2e8f0' }}>
          <ArrowBackIcon />
        </IconButton>
        <Box>
          <Typography variant="h5" fontWeight="700">
            Add New Loan
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Enter your loan details. Monthly EMIs and totals will be calculated automatically.
          </Typography>
        </Box>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Box component="form" onSubmit={handleSubmit} noValidate>
        <Grid container spacing={3}>
          {/* Form Inputs (Left Column) */}
          <Grid item xs={12} md={8}>
            <Card elevation={0} className="finora-card" sx={{ p: 1 }}>
              <CardContent>
                <Typography variant="h6" fontWeight="600" mb={2}>
                  Loan Specifications
                </Typography>
                <div style={{ display: "flex", gap: "20px" }} >
                  <Typography variant="h6" fontWeight="600" mb={2}>
                    Loan Type
                  </Typography>
                  <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                    <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                      <Checkbox checked={loanType === 'loan'} onChange={() => handleLoanTypeChange('loan')} />
                      <Typography fontWeight="600" mb={2}>
                        Loan
                      </Typography>
                    </div>
                    <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                      <Checkbox checked={loanType === 'debt'} onChange={() => handleLoanTypeChange('debt')} />
                      <Typography fontWeight="600" mb={2}>
                        Debt
                      </Typography>
                    </div>
                  </div>
                </div>

                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6} size={6}>
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

                  <Grid item xs={12} sm={6} size={6}>
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

                  <Grid item xs={12} sm={6} size={6}>
                    <TextField
                      fullWidth
                      required
                      type="number"
                      label="Loan Amount"
                      name="principal"
                      value={formData.principal}
                      onChange={handleChange}
                      disabled={loanType === "loan" && monthlyPayment === "emi"}
                      InputProps={{
                        startAdornment: <InputAdornment position="start">₹</InputAdornment>,
                      }}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6} size={6}>
                    <TextField
                      fullWidth
                      type="date"
                      label="Disbursement Date"
                      name="startDate"
                      value={formData.startDate}
                      onChange={handleChange}
                      InputLabelProps={{ shrink: true }}
                    />
                  </Grid>

                  <Grid item size={12}>
                    <FormControl sx={{ m: 3 }} component="fieldset" variant="standard">
                      <FormLabel component="legend">Monthly payment</FormLabel>
                      <FormGroup sx={{ display: 'flex', flexDirection: "row", gap: "1em" }} >
                        <FormControlLabel
                          control={
                            <Checkbox checked={monthlyPayment === "emi"} onChange={handlePaymentTypeChange} name="emi" />
                          }
                          label="EMI"
                        />
                        <FormControlLabel
                          control={
                            <Checkbox checked={monthlyPayment === "interest"} onChange={handlePaymentTypeChange} name="interest" />
                          }
                          label="Interest only "
                        />
                      </FormGroup>
                    </FormControl>
                  </Grid>
                  {loanType === "loan" && (
                    <>
                      {monthlyPayment === 'emi' ? <>
                        <Grid item xs={12} sm={6} size={6}>
                          <TextField
                            fullWidth
                            type="number"
                            label="EMI Amount"
                            name="emiAmount"
                            value={formData.emiAmount}
                            onChange={handleChange}
                            InputLabelProps={{ shrink: true }}
                          />
                        </Grid>
                        <Grid item xs={12} sm={6} size={6}>
                          <TextField
                            fullWidth
                            type="number"
                            label="Tenure Months"
                            name="tenureMonths"
                            value={formData.tenureMonths}
                            onChange={handleChange}
                            InputLabelProps={{ shrink: true }}
                          />
                        </Grid>
                      </> : <>
                        <Grid item xs={12} sm={6} size={6}>
                          <TextField
                            fullWidth
                            type="number"
                            label="Interest Amount"
                            name="interestAmount"
                            value={formData?.interestAmount}
                            onChange={handleChange}
                            InputLabelProps={{ shrink: true }}
                          />
                        </Grid>
                      </>}
                    </>
                  )}
                </Grid>
                {/* {loanType === "loan" && (
                  <div style={{margin: "10px"}}>
                    <EmiScheduleTable emiSchedule={emiSchedule} />
                  </div>
                )} */}
              </CardContent>
            </Card>
          </Grid>
          {/* Dynamic Summary Sidebar (Right Column) */}
          <Grid item xs={12} md={4}>
            <Paper elevation={0} className="finora-summary-card">

              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                startIcon={<SaveIcon />}
                sx={{ borderRadius: '8px', py: 1.2, fontWeight: 600, textTransform: 'none' }}
              >
                Save & Link EMI
              </Button>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}