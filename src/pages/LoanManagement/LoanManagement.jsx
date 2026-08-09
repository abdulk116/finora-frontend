import { CheckCircle, Pending, Add as AddIcon, TrendingDown, AccountBalance as BankIcon } from "@mui/icons-material";
import { Box, Button, Card, CardContent, Chip, Grid, LinearProgress, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material"
import { useEffect, useState } from "react"
import './LoanManagement.css';
import { useNavigate } from "react-router";
import loanApi from "../../api/loanApi";

const mockLoanList = [
  {
    loanDetails: "test loan",
    lenderName: "test lender",
    loanType: "loan",
    totalAmount: 10000,
    remainingAmount: 7000,
    emiAmount: 1500,
    status: "active"
  },
  {
    loanDetails: "test debt",
    lenderName: "test debt lender",
    loanType: "Debt",
    totalAmount: 1000,
    remainingAmount: 1000,
    emiAmount: 0,
    status: "active"
  }
]
const LoanManagement = () => {
  const navigate = useNavigate();
  const [loanList, setLoanList] = useState(mockLoanList);

  // Calculate High-level Summary Metrics
  const totalPrincipal = loanList.reduce((acc, curr) => acc + curr?.totalAmount, 0);
  const totalOutstanding = loanList.reduce((acc, curr) => acc + curr?.remainingAmount, 0);
  const activeLoansCount = loanList.filter((l) => l.status === 'active').length;

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getLoanList = async () => {
    try {
      const res = await loanApi?.  getAllNewLoans();
      if (res?.success) {
        setLoanList(res?.data || [])
      }
    } catch (error) {
      setLoanList([])
      console.log(`Error in get loan => ${error}`)
    }
  }

  const handleNavigateLoanDetails = (loanId) => {
    if(loanId) {
      navigate(`/loan/${loanId}`)
    }
  }

  useEffect(() => {
    getLoanList();
  },[]);

  return (
    <Box className="finora-loans-container">
      {/* Header Section */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h5" fontWeight="700">
            Loans Management
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Monitor and manage your active loans, remaining balances, and progress.
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate("/loan/add")}
          sx={{ borderRadius: '8px', textTransform: 'none', px: 2.5, fontWeight: 600 }}
        >
          Add New Loan
        </Button>
      </Box>

      {/* Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={4}>
          <Card className="finora-loan-card" elevation={0}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  Total Outstanding Balance
                </Typography>
                <TrendingDown color="error" />
              </Box>
              <Typography variant="h4" fontWeight="700">
                {formatCurrency(totalOutstanding)}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Across {activeLoansCount} active loans
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={4}>
          <Card className="finora-loan-card" elevation={0}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  Total Borrowed Amount
                </Typography>
                <BankIcon color="primary" />
              </Box>
              <Typography variant="h4" fontWeight="700">
                {formatCurrency(totalPrincipal)}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Lifetime loan principal
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={4}>
          <Card className="finora-loan-card" elevation={0}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  Active vs Closed
                </Typography>
                <CheckCircle color="success" />
              </Box>
              <Typography variant="h4" fontWeight="700">
                {activeLoansCount} / {loanList.length}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {loanList.length - activeLoansCount} loans fully paid off
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Loans Data Table */}
      <Card elevation={0} sx={{ borderRadius: '12px', border: '1px solid #e2e8f0' }}>
        <TableContainer component={Paper}>
          <Table
            // sx={{ minWidth: 650 }} 
            aria-label="simple table"
          >
            <TableHead>
              <TableRow>
                <TableCell>S.No</TableCell>
                <TableCell>Loan Details</TableCell>
                <TableCell>Lender</TableCell>
                <TableCell>Loan Type</TableCell>
                <TableCell>Total Amount</TableCell>
                <TableCell>Remaining Balance</TableCell>
                <TableCell>Progress</TableCell>
                <TableCell>Monthly EMI</TableCell>
                <TableCell>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loanList?.length > 0 && loanList?.map((loan, index) => {
                const progressPercentage = Math.round(
                  ((loan.totalAmount - loan.remainingAmount) / loan.totalAmount) * 100
                );
                return (
                  <TableRow key={index} onClick={() => handleNavigateLoanDetails(loan?._id)} >
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>
                      <Typography variant="subtitle2" fontWeight="600">{loan?.loanDetails || "-"}</Typography>
                    </TableCell>
                    <TableCell>{loan?.lenderName || "-"}</TableCell>
                    <TableCell>{loan?.loanType || "-"}</TableCell>
                    <TableCell>{formatCurrency(loan?.totalAmount)}</TableCell>
                    <TableCell>
                      <Typography variant="body2" fontWeight="600" color="error.main">{formatCurrency(loan?.remainingAmount)}</Typography>
                    </TableCell>
                    <TableCell sx={{ width: 140 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <LinearProgress
                          variant="determinate"
                          value={progressPercentage}
                          sx={{ flexGrow: 1, height: 6, borderRadius: 3 }}
                        />
                        <Typography variant="caption" color="text.secondary">
                          {progressPercentage}%
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>{formatCurrency(loan?.emiAmount)}</TableCell>
                    <TableCell>
                      <Chip
                        icon={loan?.status === 'active' ? <Pending fontSize="small" /> : <CheckCircle fontSize="small" />}
                        label={loan?.status}
                        size="small"
                        color={loan?.status === 'active' ? 'warning' : 'success'}
                        variant="soft"
                      />
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>
    </Box>
  )
}

export default LoanManagement