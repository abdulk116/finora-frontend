import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Chip,
  Button,
} from '@mui/material';
import {
  TrendingUp,
  AccountBalance,
  Payment,
  Add,
  ArrowUpward,
  ArrowDownward,
} from '@mui/icons-material';
import '../../layouts/Layout.css';

const stats = [
  {
    title: 'Total Monthly Income',
    value: '$8,450.00',
    change: '+12%',
    isPositive: true,
    icon: <TrendingUp color="success" />,
  },
  {
    title: 'Total Active Loans',
    value: '$124,500.00',
    change: '-2.5%',
    isPositive: true,
    icon: <AccountBalance color="primary" />,
  },
  {
    title: 'Upcoming Monthly EMIs',
    value: '$2,180.00',
    change: '4 Due Soon',
    isPositive: false,
    icon: <Payment color="warning" />,
  },
];

const recentActivities = [
  { id: 1, title: 'Home Loan EMI', type: 'EMI', amount: '$1,200.00', status: 'Paid', date: '2026-07-20' },
  { id: 2, title: 'Software Consulting', type: 'Income', amount: '$3,500.00', status: 'Received', date: '2026-07-18' },
  { id: 3, title: 'Car Loan EMI', type: 'EMI', amount: '$450.00', status: 'Pending', date: '2026-07-25' },
  { id: 4, title: 'Freelance Design', type: 'Income', amount: '$1,200.00', status: 'Received', date: '2026-07-15' },
];

export default function Dashboard() {
  return (
    <Box>
      {/* Header with Quick Action */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h5" fontWeight="700">
            Welcome back, Alex! 👋
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Here is your financial tracker summary for this month.
          </Typography>
        </Box>
        <Button variant="contained" startIcon={<Add />} sx={{ borderRadius: '8px', textTransform: 'none' }}>
          Add Transaction
        </Button>
      </Box>

      {/* Overview Stat Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {stats.map((stat, idx) => (
          <Grid item xs={12} sm={4} key={idx}>
            <Card className="finora-stat-card" elevation={0}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Typography variant="body2" color="text.secondary" fontWeight="500">
                    {stat.title}
                  </Typography>
                  {stat.icon}
                </Box>
                <Typography variant="h4" fontWeight="700" sx={{ mb: 1 }}>
                  {stat.value}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  {stat.isPositive ? (
                    <ArrowUpward fontSize="small" color="success" />
                  ) : (
                    <ArrowDownward fontSize="small" color="error" />
                  )}
                  <Typography variant="caption" fontWeight="600" color={stat.isPositive ? 'success.main' : 'error.main'}>
                    {stat.change}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    vs last month
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Recent Activity Table */}
      <Card elevation={0} sx={{ borderRadius: '12px', border: '1px solid #e2e8f0' }}>
        <CardContent>
          <Typography variant="h6" fontWeight="600" sx={{ mb: 2 }}>
            Recent Activity & EMIs
          </Typography>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Description</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Amount</TableCell>
                <TableCell>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {recentActivities.map((row) => (
                <TableRow key={row.id} hover>
                  <TableCell fontWeight="500">{row.title}</TableCell>
                  <TableCell>{row.type}</TableCell>
                  <TableCell>{row.date}</TableCell>
                  <TableCell fontWeight="600">{row.amount}</TableCell>
                  <TableCell>
                    <Chip
                      label={row.status}
                      size="small"
                      color={
                        row.status === 'Paid' || row.status === 'Received'
                          ? 'success'
                          : 'warning'
                      }
                      variant="soft"
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </Box>
  );
}