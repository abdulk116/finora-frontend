import { useEffect, useMemo, useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Grid,
  Chip,
  LinearProgress,
  // Divider,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tabs,
  Tab,
  IconButton,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  CheckCircle,
  Pending,
  AccountBalance as BankIcon,
  Event as CalendarIcon,
  Percent as RateIcon,
  Payment as EmiIcon,
  Download as DownloadIcon,
} from '@mui/icons-material';
import './LoanDetails.css';
import { useNavigate, useParams } from 'react-router';
import loanApi from '../../../../api/loanApi';
import AddTransactionModal from '../../Modal/AddTransactionModal';
import EmiScheduleTable from '../EmiScheduleTable/EmiScheduleTable';

// Mock detailed loan data (Matches LN-1001 from Loan Tracker)
const mockLoanData = {
  id: 'LN-1001',
  title: 'Home Loan',
  lender: 'HDFC Bank',
  accountNumber: 'XXXX-XXXX-8921',
  principal: 2500000,
  remainingAmount: 1850000,
  paidAmount: 650000,
  interestRate: 8.5,
  emiAmount: 22500,
  startDate: '2022-08-05',
  endDate: '2042-08-05',
  tenureMonths: 240,
  paidEMIs: 48,
  remainingEMIs: 192,
  status: 'Active',
  nextDueDate: '2026-08-05',
  // Amortization/Payment Schedule
  schedule: [
    { installmentNo: 49, dueDate: '2026-08-05', principalPortion: 9380, interestPortion: 13120, totalEmi: 22500, status: 'Upcoming' },
    { installmentNo: 48, dueDate: '2026-07-05', principalPortion: 9314, interestPortion: 13186, totalEmi: 22500, status: 'Paid' },
    { installmentNo: 47, dueDate: '2026-06-05', principalPortion: 9248, interestPortion: 13252, totalEmi: 22500, status: 'Paid' },
    { installmentNo: 46, dueDate: '2026-05-05', principalPortion: 9183, interestPortion: 13317, totalEmi: 22500, status: 'Paid' },
  ],
};

export default function LoanDetails() {
  const [activeTab, setActiveTab] = useState(2);
  const loan = mockLoanData; // In real app, fetch based on `loanId`
  const navigate = useNavigate();
  const { id } = useParams();
  const [loanDetails, setLoanDetails] = useState({});
  const [transactions, setTransactions] = useState([]);
  const [isAddTransactionOpen, setIsAddTransactionOpen] = useState(false);

  const loanPaidAmount = useMemo(() => {
    return (loanDetails?.totalAmount || 0) - (loanDetails?.remainingAmount || 0)
  }, [loanDetails]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const progressPercentage = useMemo(() => {
    const total = Number(loanDetails?.totalAmount || 0);
    const remaining = Number(loanDetails?.remainingAmount || 0);

    if (total <= 0) return 0;

    const paid = Math.max(0, total - remaining);

    return Math.min(100, Math.round((paid / total) * 100));
  }, [
    loanDetails?.totalAmount,
    loanDetails?.remainingAmount,
  ]);

  const getTransactions = async () => {
    try {
      const res = await loanApi?.getTransactionByLoanId(id);

      if (res?.success && res?.data?.transactions?.length > 0) {
        const transData = res?.data;
        const data = transData?.transactions?.map((item) => (
          {
            ...item
          }
        ))

        const sortedData = data.sort((a, b) => new Date(a?.date) - new Date(b?.date))
        setTransactions(sortedData || []);
      } else {
        setTransactions([]);
      }
    } catch (error) {
      console.log(`Error in get transactions`, error?.message)
      setTransactions([]);
    }
  }

  const getLoanDetails = async () => {
    try {
      const res = await loanApi?.getNewLoanById(id);
      if (res?.success) {
        getTransactions();
        setLoanDetails(res?.data || {});
      } else {
        setLoanDetails({});
      }
    } catch (error) {
      console.log(`Error in get loan details`, error?.message)
      setLoanDetails({});
    }
  }

  useEffect(() => {
    if (id) {
      getLoanDetails();
    }
  }, [id]);

  return (
    <Box className="finora-loan-details-container">
      {/* Top Header & Actions */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <IconButton onClick={() => navigate(-1)} sx={{ bgcolor: '#ffffff', border: '1px solid #e2e8f0' }}>
            <ArrowBackIcon />
          </IconButton>
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Typography variant="h5" fontWeight="700">
                {/* {loan.title} */}
                {loanDetails?.loanDetails || "-"}
              </Typography>
              <Chip
                icon={loanDetails?.status === 'Active' ? <Pending fontSize="small" /> : <CheckCircle fontSize="small" />}
                label={loanDetails?.status}
                size="small"
                color={loanDetails?.status === 'Active' ? 'warning' : 'success'}
              />
            </Box>
            <Typography variant="body2" color="text.secondary">
              ID: {loanDetails?.lenderName || "-"} ({loanDetails?.loanType || "-"})
            </Typography>
          </Box>
        </Box>

        <Button
          variant="outlined"
          startIcon={<DownloadIcon />}
          sx={{ borderRadius: '8px', textTransform: 'none', fontWeight: 600 }}
        >
          Download Statement
        </Button>
      </Box>

      {/* Progress Card */}
      <Card elevation={0} className="finora-card" sx={{ mb: 3, p: 1 }}>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
            <Typography variant="body2" fontWeight="600" color="text.secondary">
              Repayment Progress
            </Typography>
            <Typography variant="body2" fontWeight="700" color="primary.main">
              {progressPercentage}% Paid Off
            </Typography>
          </Box>
          <LinearProgress
            variant="determinate"
            value={progressPercentage}
            sx={{ height: 10, borderRadius: 5, mb: 2 }}
          />
          <Grid container spacing={2}>
            <Grid item xs={6} sm={3}>
              <Typography variant="caption" color="text.secondary">Total Amount</Typography>
              <Typography variant="body1" fontWeight="600">{formatCurrency(loanDetails?.totalAmount)}</Typography>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Typography variant="caption" color="text.secondary">Paid Amount</Typography>
              <Typography variant="body1" fontWeight="600" color="success.main">{formatCurrency(loanPaidAmount || 0)}</Typography>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Typography variant="caption" color="text.secondary">Remaining Balance</Typography>
              <Typography variant="body1" fontWeight="600" color="error.main">{formatCurrency(loanDetails?.remainingAmount)}</Typography>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Typography variant="caption" color="text.secondary">EMIs Paid</Typography>
              <Typography variant="body1" fontWeight="600">{loanDetails?.paidEMIs} / {loanDetails?.tenureMonths} Months</Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Metric Cards Grid */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={3}>
          <Card elevation={0} className="finora-card">
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <EmiIcon color="primary" />
                <Box>
                  <Typography variant="caption" color="text.secondary">Monthly EMI</Typography>
                  <Typography variant="h6" fontWeight="700">{formatCurrency(loanDetails?.emiAmount)}</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={3}>
          <Card elevation={0} className="finora-card">
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <RateIcon color="primary" />
                <Box>
                  <Typography variant="caption" color="text.secondary">Interest Rate</Typography>
                  <Typography variant="h6" fontWeight="700">{loanDetails?.interestRate || 0}% p.a.</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={3}>
          <Card elevation={0} className="finora-card">
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <CalendarIcon color="warning" />
                <Box>
                  <Typography variant="caption" color="text.secondary">Next Due Date</Typography>
                  <Typography variant="h6" fontWeight="700">{loanDetails?.nextDueDate || "-"}</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={3}>
          <Card elevation={0} className="finora-card">
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <BankIcon color="primary" />
                <Box>
                  <Typography variant="caption" color="text.secondary">Lender Bank/Name</Typography>
                  <Typography variant="h6" fontWeight="700">{loanDetails?.lenderName}</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Tabs & Table Section */}
      <Card elevation={0} className="finora-card">
        <Box sx={{ borderBottom: 1, borderColor: 'divider', px: 2 }}>
          <Tabs value={activeTab} onChange={(e, val) => setActiveTab(val)}>
            <Tab label="Payment Schedule" sx={{ textTransform: 'none', fontWeight: 600 }} />
            <Tab label="Loan Overview & Terms" sx={{ textTransform: 'none', fontWeight: 600 }} />
            <Tab label="Transactions" sx={{ textTransform: 'none', fontWeight: 600 }} />
          </Tabs>
        </Box>

        {/* Tab 1: Payment Schedule Table */}
        {activeTab === 0 && (
          loanDetails?.loanType === 'loan' ? (
            <EmiScheduleTable
              emiSchedule={loanDetails?.emiSchedule || []}
              loanId={id}
              fetchLoanDetails={getLoanDetails}
            />
          ) : (
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                p: 3,
                textAlign: 'center',
              }}
            >
              Payment schedule is not available for this type of transaction.
            </Typography>
          )
        )}

        {/* Tab 2: General Terms & Overview */}
        {activeTab === 1 && (
          <Box sx={{ p: 3 }}>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="text.secondary">Start Date</Typography>
                <Typography variant="body1" fontWeight="600" sx={{ mb: 2 }}>{loan.startDate}</Typography>

                <Typography variant="subtitle2" color="text.secondary">Expected End Date</Typography>
                <Typography variant="body1" fontWeight="600" sx={{ mb: 2 }}>{loan.endDate}</Typography>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="text.secondary">Remaining Months</Typography>
                <Typography variant="body1" fontWeight="600" sx={{ mb: 2 }}>{loan.remainingEMIs} Months</Typography>

                <Typography variant="subtitle2" color="text.secondary">Account / Loan Reference</Typography>
                <Typography variant="body1" fontWeight="600" sx={{ mb: 2 }}>{loan.accountNumber}</Typography>
              </Grid>
            </Grid>
          </Box>
        )}

        {/* Tab 3: Transaction for loan */}
        {activeTab === 2 && (
          <div>
            <div>
              <TableContainer component={Paper} elevation={0}>
                <Table>
                  <TableHead sx={{ bgcolor: '#f8fafc' }}>
                    <TableRow>
                      <TableCell fontWeight="600">S.No</TableCell>
                      <TableCell fontWeight="600">Date</TableCell>
                      <TableCell fontWeight="600">Title</TableCell>
                      <TableCell fontWeight="600">Amount</TableCell>
                      <TableCell fontWeight="600">Notes</TableCell>
                      <TableCell fontWeight="600">Type</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {transactions?.map((item, index) => (
                      <TableRow key={index} hover>
                        <TableCell fontWeight="600">{index + 1}</TableCell>
                        <TableCell>
                          {item?.date ? (
                            new Date(item?.date).toLocaleDateString('en-US', {
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
                        <TableCell>{item?.title || "-"}</TableCell>
                        <TableCell>{formatCurrency(item?.amount || 0)}</TableCell>
                        <TableCell fontWeight="600">{item?.notes || "-"}</TableCell>
                        <TableCell>
                          <Chip
                            label={item?.type}
                            size="small"
                            color={item?.type === 'paid' ? 'success' : 'warning'}
                            variant="soft"
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </div>
            <div style={{ padding: '0.5em', display: 'flex', justifyContent: 'end' }}>
              <Button variant="contained" onClick={() => setIsAddTransactionOpen(true)} >Add Transaction</Button>
            </div>
            {isAddTransactionOpen && <AddTransactionModal
              open={isAddTransactionOpen}
              onClose={() => setIsAddTransactionOpen(false)}
              loanId={id}
              loanDetails={loanDetails}
              onSave={() => {
                getLoanDetails();
                setIsAddTransactionOpen(false);
              }}
            // onSubmit={handleAddTransaction}
            // loading={submitting}
            />}
          </div>
        )}
      </Card>
    </Box>
  );
}