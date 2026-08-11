import {
  Box,
  Card,
  CardContent,
  Typography,
  Chip,
  Button,
  IconButton,
  LinearProgress,
  Divider,
  Tooltip,
} from "@mui/material";

import {
  TrendingUpRounded,
  TrendingDownRounded,
  AccountBalanceRounded,
  PaymentsRounded,
  AddRounded,
  ArrowUpwardRounded,
  ArrowDownwardRounded,
  MoreHorizRounded,
  CalendarMonthRounded,
  WalletRounded,
  ReceiptLongRounded,
  SavingsRounded,
  ArrowForwardRounded,
} from "@mui/icons-material";

import "./Dashboard.css";


/* =========================================================
   MOCK DASHBOARD DATA

   Later these values can come from:
   - Redux
   - Dashboard API
   - Loan API
   - EMI API
   - Income API
   - Expense API
========================================================= */

const dashboardStats = [
  {
    title: "Monthly Income",
    value: "₹84,500",
    change: "+12.4%",
    description: "vs last month",
    positive: true,
    icon: <TrendingUpRounded />,
    iconType: "income",
  },

  {
    title: "Monthly Expenses",
    value: "₹42,850",
    change: "-5.8%",
    description: "vs last month",
    positive: true,
    icon: <TrendingDownRounded />,
    iconType: "expense",
  },

  {
    title: "Outstanding Loans",
    value: "₹12.45 L",
    change: "-2.5%",
    description: "vs last month",
    positive: true,
    icon: <AccountBalanceRounded />,
    iconType: "loan",
  },

  {
    title: "Upcoming EMIs",
    value: "₹21,800",
    change: "4 due",
    description: "next 30 days",
    positive: false,
    icon: <PaymentsRounded />,
    iconType: "emi",
  },
];


/* =========================================================
   MONTHLY CASH FLOW
========================================================= */

const monthlyCashFlow = {
  income: 84500,
  expenses: 42850,
  emi: 21800,
};


/* =========================================================
   UPCOMING EMIS
========================================================= */

const upcomingEmis = [
  {
    id: 1,
    title: "Home Loan EMI",
    lender: "HDFC Bank",
    amount: "₹18,500",
    dueDate: "Aug 15",
    daysLeft: 3,
    status: "Due Soon",
  },

  {
    id: 2,
    title: "Car Loan EMI",
    lender: "ICICI Bank",
    amount: "₹7,800",
    dueDate: "Aug 20",
    daysLeft: 8,
    status: "Upcoming",
  },

  {
    id: 3,
    title: "Personal Loan EMI",
    lender: "SBI",
    amount: "₹4,200",
    dueDate: "Aug 25",
    daysLeft: 13,
    status: "Upcoming",
  },
];


/* =========================================================
   RECENT ACTIVITIES
========================================================= */

const recentActivities = [
  {
    id: 1,
    title: "Home Loan EMI",
    category: "EMI",
    amount: "₹18,500",
    type: "expense",
    status: "Paid",
    date: "Aug 10, 2026",
  },

  {
    id: 2,
    title: "Software Consulting",
    category: "Income",
    amount: "₹35,000",
    type: "income",
    status: "Received",
    date: "Aug 08, 2026",
  },

  {
    id: 3,
    title: "Car Loan EMI",
    category: "EMI",
    amount: "₹7,800",
    type: "expense",
    status: "Pending",
    date: "Aug 05, 2026",
  },

  {
    id: 4,
    title: "Freelance Design",
    category: "Income",
    amount: "₹12,000",
    type: "income",
    status: "Received",
    date: "Aug 03, 2026",
  },

  {
    id: 5,
    title: "Grocery Shopping",
    category: "Food",
    amount: "₹3,450",
    type: "expense",
    status: "Paid",
    date: "Aug 01, 2026",
  },
];


/* =========================================================
   HELPER
========================================================= */

const formatCurrency = (value) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);
};


export default function Dashboard() {

  /* =======================================================
     CALCULATIONS
  ======================================================= */

  const availableBalance =
    monthlyCashFlow.income -
    monthlyCashFlow.expenses;

  const savingsRate =
    monthlyCashFlow.income > 0
      ? Math.round(
          (availableBalance /
            monthlyCashFlow.income) *
            100
        )
      : 0;

  const emiPercentage =
    monthlyCashFlow.income > 0
      ? Math.round(
          (monthlyCashFlow.emi /
            monthlyCashFlow.income) *
            100
        )
      : 0;


  return (
    <Box className="finora-dashboard">

      {/* ===================================================
          HEADER
      =================================================== */}

      <Box className="finora-dashboard-header">

        <Box>
          <Typography
            component="h1"
            className="finora-dashboard-title"
          >
            Welcome back, Alex! 👋
          </Typography>

          <Typography className="finora-dashboard-subtitle">
            Here's your financial overview for August 2026.
          </Typography>
        </Box>


        {/* Quick Actions */}

        <Box className="finora-dashboard-actions">

          <Button
            variant="outlined"
            startIcon={<ReceiptLongRounded />}
            className="finora-secondary-action"
          >
            Add Expense
          </Button>

          <Button
            variant="contained"
            startIcon={<AddRounded />}
            className="finora-primary-action"
          >
            Add Transaction
          </Button>

        </Box>

      </Box>


      {/* ===================================================
          STAT CARDS
      =================================================== */}

      <Box className="finora-stat-grid">

        {dashboardStats.map((stat) => (

          <Card
            key={stat.title}
            className={`finora-dashboard-stat-card ${stat.iconType}`}
            elevation={0}
          >

            <CardContent>

              <Box className="finora-stat-top">

                <Box className="finora-stat-icon">
                  {stat.icon}
                </Box>

                <Tooltip title="More options">
                  <IconButton
                    size="small"
                    className="finora-stat-more"
                  >
                    <MoreHorizRounded />
                  </IconButton>
                </Tooltip>

              </Box>


              <Typography className="finora-stat-title">
                {stat.title}
              </Typography>


              <Typography className="finora-stat-value">
                {stat.value}
              </Typography>


              <Box className="finora-stat-change">

                {stat.positive ? (
                  <ArrowUpwardRounded />
                ) : (
                  <ArrowDownwardRounded />
                )}

                <Typography
                  component="span"
                  className={
                    stat.positive
                      ? "positive"
                      : "negative"
                  }
                >
                  {stat.change}
                </Typography>

                <Typography>
                  {stat.description}
                </Typography>

              </Box>

            </CardContent>

          </Card>

        ))}

      </Box>


      {/* ===================================================
          FINANCIAL HEALTH + CASH FLOW
      =================================================== */}

      <Box className="finora-dashboard-main-grid">

        {/* -------------------------------------------------
            CASH FLOW
        ------------------------------------------------- */}

        <Card
          className="finora-dashboard-card cash-flow-card"
          elevation={0}
        >

          <CardContent>

            <Box className="finora-section-header">

              <Box>
                <Typography className="finora-section-title">
                  Cash Flow
                </Typography>

                <Typography className="finora-section-description">
                  Income and spending overview
                </Typography>
              </Box>

              <Chip
                label="This Month"
                size="small"
                className="finora-period-chip"
              />

            </Box>


            {/* Income */}

            <Box className="finora-cash-flow-row">

              <Box className="finora-cash-flow-label">

                <Box className="cash-flow-icon income">
                  <TrendingUpRounded />
                </Box>

                <Box>
                  <Typography>
                    Income
                  </Typography>

                  <Typography>
                    This month
                  </Typography>
                </Box>

              </Box>

              <Typography className="cash-flow-amount income">
                {formatCurrency(
                  monthlyCashFlow.income
                )}
              </Typography>

            </Box>


            {/* Expenses */}

            <Box className="finora-cash-flow-row">

              <Box className="finora-cash-flow-label">

                <Box className="cash-flow-icon expense">
                  <TrendingDownRounded />
                </Box>

                <Box>
                  <Typography>
                    Expenses
                  </Typography>

                  <Typography>
                    This month
                  </Typography>
                </Box>

              </Box>

              <Typography className="cash-flow-amount expense">
                {formatCurrency(
                  monthlyCashFlow.expenses
                )}
              </Typography>

            </Box>


            <Divider className="finora-dashboard-divider" />


            {/* Available */}

            <Box className="finora-available-balance">

              <Box>

                <Typography className="available-label">
                  Available Balance
                </Typography>

                <Typography className="available-description">
                  Income − Expenses
                </Typography>

              </Box>

              <Typography className="available-value">
                {formatCurrency(
                  availableBalance
                )}
              </Typography>

            </Box>


            {/* Progress */}

            <Box className="finora-progress-section">

              <Box className="finora-progress-header">

                <Typography>
                  Savings rate
                </Typography>

                <Typography>
                  {savingsRate}%
                </Typography>

              </Box>

              <LinearProgress
                variant="determinate"
                value={Math.min(
                  savingsRate,
                  100
                )}
                className="finora-savings-progress"
              />

            </Box>

          </CardContent>

        </Card>


        {/* -------------------------------------------------
            FINANCIAL HEALTH
        ------------------------------------------------- */}

        <Card
          className="finora-dashboard-card"
          elevation={0}
        >

          <CardContent>

            <Box className="finora-section-header">

              <Box>
                <Typography className="finora-section-title">
                  Financial Health
                </Typography>

                <Typography className="finora-section-description">
                  Your monthly financial position
                </Typography>
              </Box>

              <Box className="finora-health-icon">
                <SavingsRounded />
              </Box>

            </Box>


            {/* Savings */}

            <Box className="finora-health-item">

              <Box className="health-item-header">

                <Typography>
                  Savings
                </Typography>

                <Typography>
                  {savingsRate}%
                </Typography>

              </Box>

              <LinearProgress
                variant="determinate"
                value={Math.min(
                  savingsRate,
                  100
                )}
                className="finora-health-progress savings"
              />

            </Box>


            {/* EMI */}

            <Box className="finora-health-item">

              <Box className="health-item-header">

                <Typography>
                  EMI burden
                </Typography>

                <Typography>
                  {emiPercentage}%
                </Typography>

              </Box>

              <LinearProgress
                variant="determinate"
                value={Math.min(
                  emiPercentage,
                  100
                )}
                className="finora-health-progress emi"
              />

            </Box>


            {/* Balance */}

            <Box className="finora-health-summary">

              <Box className="health-summary-icon">
                <WalletRounded />
              </Box>

              <Box>

                <Typography className="health-summary-title">
                  Available after EMI
                </Typography>

                <Typography className="health-summary-value">
                  {formatCurrency(
                    availableBalance -
                      monthlyCashFlow.emi
                  )}
                </Typography>

              </Box>

            </Box>


            <Button
              fullWidth
              endIcon={<ArrowForwardRounded />}
              className="finora-view-details"
            >
              View financial details
            </Button>

          </CardContent>

        </Card>

      </Box>


      {/* ===================================================
          UPCOMING EMI
      =================================================== */}

      <Card
        className="finora-dashboard-card finora-emi-card"
        elevation={0}
      >

        <CardContent>

          <Box className="finora-section-header">

            <Box>

              <Typography className="finora-section-title">
                Upcoming EMI Payments
              </Typography>

              <Typography className="finora-section-description">
                Stay ahead of your upcoming loan payments
              </Typography>

            </Box>

            <Button
              endIcon={<ArrowForwardRounded />}
              className="finora-view-all-button"
            >
              View all
            </Button>

          </Box>


          <Box className="finora-emi-list">

            {upcomingEmis.map((emi) => (

              <Box
                key={emi.id}
                className="finora-emi-item"
              >

                <Box className="emi-info">

                  <Box className="emi-icon">
                    <CalendarMonthRounded />
                  </Box>

                  <Box>

                    <Typography className="emi-title">
                      {emi.title}
                    </Typography>

                    <Typography className="emi-lender">
                      {emi.lender}
                    </Typography>

                  </Box>

                </Box>


                <Box className="emi-date">

                  <Typography>
                    {emi.dueDate}
                  </Typography>

                  <Typography>
                    {emi.daysLeft} days left
                  </Typography>

                </Box>


                <Typography className="emi-amount">
                  {emi.amount}
                </Typography>


                <Chip
                  label={emi.status}
                  size="small"
                  className={
                    emi.status === "Due Soon"
                      ? "finora-status-warning"
                      : "finora-status-info"
                  }
                />

              </Box>

            ))}

          </Box>

        </CardContent>

      </Card>


      {/* ===================================================
          RECENT ACTIVITY
      =================================================== */}

      <Card
        className="finora-dashboard-card finora-activity-card"
        elevation={0}
      >

        <CardContent>

          <Box className="finora-section-header">

            <Box>

              <Typography className="finora-section-title">
                Recent Activity
              </Typography>

              <Typography className="finora-section-description">
                Your latest income, expenses and EMI activity
              </Typography>

            </Box>

            <Button
              endIcon={<ArrowForwardRounded />}
              className="finora-view-all-button"
            >
              View all
            </Button>

          </Box>


          {/* Desktop Table */}

          <Box className="finora-activity-table-wrapper">

            <table className="finora-activity-table">

              <thead>

                <tr>
                  <th>Description</th>
                  <th>Category</th>
                  <th>Date</th>
                  <th>Amount</th>
                  <th>Status</th>
                </tr>

              </thead>


              <tbody>

                {recentActivities.map(
                  (activity) => (

                    <tr key={activity.id}>

                      <td>
                        <Box className="activity-description">

                          <Box
                            className={`activity-icon ${activity.type}`}
                          >
                            {activity.type ===
                            "income" ? (
                              <TrendingUpRounded />
                            ) : (
                              <ReceiptLongRounded />
                            )}
                          </Box>

                          <Box>
                            <Typography className="activity-title">
                              {activity.title}
                            </Typography>

                            <Typography className="activity-category-mobile">
                              {activity.category}
                            </Typography>
                          </Box>

                        </Box>
                      </td>


                      <td>
                        <Typography className="activity-category">
                          {activity.category}
                        </Typography>
                      </td>


                      <td>
                        <Typography className="activity-date">
                          {activity.date}
                        </Typography>
                      </td>


                      <td>
                        <Typography
                          className={`activity-amount ${activity.type}`}
                        >
                          {activity.type ===
                          "income"
                            ? "+"
                            : "-"}
                          {activity.amount}
                        </Typography>
                      </td>


                      <td>

                        <Chip
                          label={activity.status}
                          size="small"
                          className={
                            activity.status ===
                              "Paid" ||
                            activity.status ===
                              "Received"
                              ? "finora-status-success"
                              : "finora-status-warning"
                          }
                        />

                      </td>

                    </tr>

                  )
                )}

              </tbody>

            </table>

          </Box>

        </CardContent>

      </Card>


      {/* ===================================================
          MOBILE QUICK ACTIONS
      =================================================== */}

      <Box className="finora-mobile-quick-actions">

        <Button
          variant="contained"
          startIcon={<AddRounded />}
          className="finora-primary-action"
          fullWidth
        >
          Add Transaction
        </Button>

      </Box>

    </Box>
  );
}