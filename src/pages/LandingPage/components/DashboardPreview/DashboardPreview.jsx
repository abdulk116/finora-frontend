import {
  Box,
  Chip,
  Divider,
  LinearProgress,
  Stack,
  Typography,
} from "@mui/material";

import {
  TrendingUpRounded,
  TrendingDownRounded,
  AccountBalanceRounded,
  CreditCardRounded,
  CalendarMonthRounded,
  ArrowUpwardRounded,
  ArrowDownwardRounded
} from "@mui/icons-material";

import "./DashboardPreview.css";

const DashboardPreview = () => {
  return (
    <section
      id="features"
      className="dashboard-preview-section"
    >
      <div className="dashboard-preview-container">

        {/* Section Heading */}
        <Box className="dashboard-section-heading">
          <Chip
            label="Your financial command center"
            className="dashboard-heading-chip"
          />

          <Typography
            component="h2"
            className="dashboard-heading-title"
          >
            See your entire financial life
            <span>at a glance.</span>
          </Typography>

          <Typography
            component="p"
            className="dashboard-heading-description"
          >
            Finora brings your accounts, loans, EMIs,
            income and expenses together into one
            beautifully organized dashboard.
          </Typography>
        </Box>

        {/* Dashboard */}
        <Box className="preview-dashboard">

          {/* Dashboard Header */}
          <Box className="preview-header">
            <Box>
              <Typography className="preview-greeting">
                Good morning 👋
              </Typography>

              <Typography className="preview-user-name">
                Here's your financial overview
              </Typography>
            </Box>

            <Box className="preview-date">
              <CalendarMonthRounded />

              <Typography>
                August 2026
              </Typography>
            </Box>
          </Box>

          {/* Balance Cards */}
          <Box className="balance-grid">

            {/* Net Worth */}
            <Box className="balance-card primary-balance">
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="flex-start"
              >
                <Box>
                  <Typography className="balance-label">
                    Total Net Worth
                  </Typography>

                  <Typography className="balance-value">
                    ₹5,43,200
                  </Typography>
                </Box>

                <Box className="balance-icon">
                  <AccountBalanceRounded />
                </Box>
              </Stack>

              <Stack
                direction="row"
                alignItems="center"
                spacing={0.5}
                className="balance-growth"
              >
                <TrendingUpRounded />

                <Typography>
                  12.4%
                </Typography>

                <span>
                  this month
                </span>
              </Stack>
            </Box>

            {/* Income */}
            <Box className="balance-card">
              <Stack
                direction="row"
                justifyContent="space-between"
              >
                <Box>
                  <Typography className="balance-label">
                    Monthly Income
                  </Typography>

                  <Typography className="balance-value">
                    ₹52,800
                  </Typography>
                </Box>

                <Box className="income-icon">
                  <TrendingUpRounded />
                </Box>
              </Stack>

              <Typography className="balance-subtitle">
                +8.2% from last month
              </Typography>
            </Box>

            {/* Expenses */}
            <Box className="balance-card">
              <Stack
                direction="row"
                justifyContent="space-between"
              >
                <Box>
                  <Typography className="balance-label">
                    Monthly Expenses
                  </Typography>

                  <Typography className="balance-value">
                    ₹28,450
                  </Typography>
                </Box>

                <Box className="expense-icon">
                  <TrendingDownRounded />
                </Box>
              </Stack>

              <Typography className="balance-subtitle">
                6.4% lower than last month
              </Typography>
            </Box>
          </Box>

          {/* Main Dashboard Grid */}
          <Box className="dashboard-content-grid">

            {/* Cash Flow */}
            <Box className="dashboard-panel cashflow-panel">
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="flex-start"
              >
                <Box>
                  <Typography className="panel-title">
                    Cash Flow
                  </Typography>

                  <Typography className="panel-subtitle">
                    Income vs expenses
                  </Typography>
                </Box>

                <Chip
                  label="This year"
                  size="small"
                  className="panel-filter"
                />
              </Stack>

              <Box className="cashflow-chart">

                <Box className="chart-y-axis">
                  <span>60K</span>
                  <span>40K</span>
                  <span>20K</span>
                  <span>0</span>
                </Box>

                <Box className="chart-area">

                  <Box className="chart-grid-line line-one" />
                  <Box className="chart-grid-line line-two" />
                  <Box className="chart-grid-line line-three" />
                  <Box className="chart-grid-line line-four" />

                  <Box className="income-line">
                    <span />
                    <span />
                    <span />
                    <span />
                    <span />
                    <span />
                    <span />
                  </Box>

                  <Box className="expense-line">
                    <span />
                    <span />
                    <span />
                    <span />
                    <span />
                    <span />
                  </Box>

                  <Box className="chart-labels">
                    <span>Jan</span>
                    <span>Feb</span>
                    <span>Mar</span>
                    <span>Apr</span>
                    <span>May</span>
                    <span>Jun</span>
                    <span>Jul</span>
                  </Box>

                </Box>
              </Box>

              <Stack
                direction="row"
                spacing={3}
                className="chart-legend"
              >
                <Box>
                  <span className="legend-income" />
                  Income
                </Box>

                <Box>
                  <span className="legend-expense" />
                  Expenses
                </Box>
              </Stack>
            </Box>

            {/* Loan Overview */}
            <Box className="dashboard-panel loan-panel">

              <Stack
                direction="row"
                justifyContent="space-between"
              >
                <Box>
                  <Typography className="panel-title">
                    Loan Overview
                  </Typography>

                  <Typography className="panel-subtitle">
                    Your active debts
                  </Typography>
                </Box>

                <CreditCardRounded className="panel-icon" />
              </Stack>

              <Box className="loan-total">
                <Typography>
                  Outstanding
                </Typography>

                <strong>
                  ₹2,86,400
                </strong>
              </Box>

              <Stack spacing={2.5} className="loan-items">

                <Box>
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                  >
                    <Typography>
                      Education Loan
                    </Typography>

                    <strong>
                      ₹1,64,000
                    </strong>
                  </Stack>

                  <LinearProgress
                    variant="determinate"
                    value={64}
                    className="loan-progress-bar"
                  />

                  <Typography className="loan-meta">
                    64% paid
                  </Typography>
                </Box>

                <Box>
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                  >
                    <Typography>
                      Bike Loan
                    </Typography>

                    <strong>
                      ₹1,22,400
                    </strong>
                  </Stack>

                  <LinearProgress
                    variant="determinate"
                    value={42}
                    className="loan-progress-bar"
                  />

                  <Typography className="loan-meta">
                    42% paid
                  </Typography>
                </Box>

              </Stack>
            </Box>
          </Box>

          {/* Bottom Grid */}
          <Box className="dashboard-bottom-grid">

            {/* Upcoming EMI */}
            <Box className="dashboard-panel emi-panel">

              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
              >
                <Box>
                  <Typography className="panel-title">
                    Upcoming EMI
                  </Typography>

                  <Typography className="panel-subtitle">
                    Next payments
                  </Typography>
                </Box>

                <Chip
                  label="3 payments"
                  size="small"
                  className="emi-count"
                />
              </Stack>

              <Box className="emi-list">

                <Box className="emi-item">
                  <Box className="emi-date">
                    <strong>15</strong>
                    <span>AUG</span>
                  </Box>

                  <Box className="emi-info">
                    <strong>
                      Education Loan
                    </strong>

                    <span>
                      Monthly EMI
                    </span>
                  </Box>

                  <strong className="emi-amount">
                    ₹4,250
                  </strong>
                </Box>

                <Divider />

                <Box className="emi-item">
                  <Box className="emi-date">
                    <strong>20</strong>
                    <span>AUG</span>
                  </Box>

                  <Box className="emi-info">
                    <strong>
                      Bike Loan
                    </strong>

                    <span>
                      Monthly EMI
                    </span>
                  </Box>

                  <strong className="emi-amount">
                    ₹3,800
                  </strong>
                </Box>

              </Box>
            </Box>

            {/* Recent Transactions */}
            <Box className="dashboard-panel transactions-panel">

              <Stack
                direction="row"
                justifyContent="space-between"
              >
                <Box>
                  <Typography className="panel-title">
                    Recent Transactions
                  </Typography>

                  <Typography className="panel-subtitle">
                    Latest activity
                  </Typography>
                </Box>
              </Stack>

              <Box className="transaction-list">

                <Box className="transaction-item">
                  <Box className="transaction-icon income">
                    <ArrowDownwardRounded />
                  </Box>

                  <Box className="transaction-info">
                    <strong>
                      Salary
                    </strong>

                    <span>
                      Today · Bank
                    </span>
                  </Box>

                  <strong className="transaction-income">
                    +₹42,000
                  </strong>
                </Box>

                <Box className="transaction-item">
                  <Box className="transaction-icon expense">
                    <ArrowUpwardRounded />
                  </Box>

                  <Box className="transaction-info">
                    <strong>
                      Fuel
                    </strong>

                    <span>
                      Yesterday · Wallet
                    </span>
                  </Box>

                  <strong className="transaction-expense">
                    -₹1,200
                  </strong>
                </Box>

                <Box className="transaction-item">
                  <Box className="transaction-icon expense">
                    <ArrowUpwardRounded />
                  </Box>

                  <Box className="transaction-info">
                    <strong>
                      Groceries
                    </strong>

                    <span>
                      Yesterday · Card
                    </span>
                  </Box>

                  <strong className="transaction-expense">
                    -₹2,450
                  </strong>
                </Box>

              </Box>
            </Box>
          </Box>

        </Box>
      </div>
    </section>
  );
};

export default DashboardPreview;