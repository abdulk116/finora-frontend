import {
  Box,
  Chip,
  Container,
  Stack,
  Typography,
} from "@mui/material";

import {
  TrendingUpRounded,
  PieChartRounded,
  InsightsRounded,
  ArrowForwardRounded
} from "@mui/icons-material";

import "./Analytics.css";

const spendingCategories = [
  {
    name: "Housing",
    amount: "₹10,000",
    percentage: 35,
    className: "housing",
  },
  {
    name: "Food",
    amount: "₹5,250",
    percentage: 18,
    className: "food",
  },
  {
    name: "Transport",
    amount: "₹3,850",
    percentage: 14,
    className: "transport",
  },
  {
    name: "Shopping",
    amount: "₹3,100",
    percentage: 11,
    className: "shopping",
  },
  {
    name: "Other",
    amount: "₹6,250",
    percentage: 22,
    className: "other",
  },
];

const months = [
  { month: "Mar", income: 68, expense: 42 },
  { month: "Apr", income: 76, expense: 48 },
  { month: "May", income: 64, expense: 40 },
  { month: "Jun", income: 82, expense: 53 },
  { month: "Jul", income: 88, expense: 49 },
  { month: "Aug", income: 94, expense: 46 },
];

const Analytics = () => {
  return (
    <section
      id="analytics"
      className="analytics-section"
    >
      <Container
        maxWidth="lg"
        className="analytics-container"
      >
        {/* =====================================
            HEADING
        ===================================== */}

        <Box className="analytics-heading">
          <Chip
            label="Analytics & insights"
            className="analytics-chip"
          />

          <Typography
            component="h2"
            className="analytics-title"
          >
            Turn your financial data
            <span>into better decisions.</span>
          </Typography>

          <Typography
            component="p"
            className="analytics-description"
          >
            Finora transforms your financial activity into
            simple visual insights, helping you understand
            your habits and make smarter decisions.
          </Typography>
        </Box>

        {/* =====================================
            ANALYTICS DASHBOARD
        ===================================== */}

        <Box className="analytics-dashboard">

          {/* ===================================
              TOP SUMMARY
          =================================== */}

          <Box className="analytics-summary">

            <Box className="summary-card">
              <Box className="summary-icon income">
                <TrendingUpRounded />
              </Box>

              <Box>
                <Typography>
                  Monthly Income
                </Typography>

                <strong>
                  ₹52,800
                </strong>

                <span className="positive">
                  ↑ 8.2% from last month
                </span>
              </Box>
            </Box>

            <Box className="summary-card">
              <Box className="summary-icon expense">
                <TrendingUpRounded />
              </Box>

              <Box>
                <Typography>
                  Monthly Expenses
                </Typography>

                <strong>
                  ₹28,450
                </strong>

                <span>
                  ↓ 4.6% from last month
                </span>
              </Box>
            </Box>

            <Box className="summary-card">
              <Box className="summary-icon savings">
                <InsightsRounded />
              </Box>

              <Box>
                <Typography>
                  Savings Rate
                </Typography>

                <strong>
                  46%
                </strong>

                <span className="positive">
                  +5.4% improvement
                </span>
              </Box>
            </Box>

            <Box className="summary-card">
              <Box className="summary-icon networth">
                <PieChartRounded />
              </Box>

              <Box>
                <Typography>
                  Net Worth
                </Typography>

                <strong>
                  ₹8.42L
                </strong>

                <span className="positive">
                  ↑ 12.8% this year
                </span>
              </Box>
            </Box>

          </Box>

          {/* ===================================
              CHART AREA
          =================================== */}

          <Box className="analytics-main-grid">

            {/* Income Expense Chart */}

            <Box className="analytics-chart-card">

              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="flex-start"
              >
                <Box>
                  <Typography className="analytics-card-label">
                    Cash Flow
                  </Typography>

                  <Typography className="analytics-card-title">
                    Income vs Expenses
                  </Typography>
                </Box>

                <Chip
                  label="Last 6 months"
                  size="small"
                  className="analytics-period-chip"
                />
              </Stack>

              <Box className="cashflow-chart">

                <Box className="chart-y-axis">
                  <span>₹80k</span>
                  <span>₹60k</span>
                  <span>₹40k</span>
                  <span>₹20k</span>
                  <span>₹0</span>
                </Box>

                <Box className="chart-area">

                  <Box className="chart-grid-lines">
                    <span />
                    <span />
                    <span />
                    <span />
                    <span />
                  </Box>

                  <Box className="chart-bars">
                    {months.map((item) => (
                      <Box
                        key={item.month}
                        className="chart-month"
                      >
                        <Box className="bars">
                          <span
                            className="income-bar"
                            style={{
                              height: `${item.income}%`,
                            }}
                          />

                          <span
                            className="expense-bar"
                            style={{
                              height: `${item.expense}%`,
                            }}
                          />
                        </Box>

                        <label>
                          {item.month}
                        </label>
                      </Box>
                    ))}
                  </Box>

                </Box>

              </Box>

              <Box className="chart-legend">
                <Box>
                  <span className="legend-dot income-dot" />
                  Income
                </Box>

                <Box>
                  <span className="legend-dot expense-dot" />
                  Expenses
                </Box>
              </Box>

            </Box>

            {/* Spending Breakdown */}

            <Box className="analytics-spending-card">

              <Typography className="analytics-card-label">
                Spending breakdown
              </Typography>

              <Typography className="analytics-card-title">
                Where your money goes
              </Typography>

              <Box className="spending-visual">

                <Box className="spending-ring">
                  <Box className="spending-ring-inner">
                    <strong>
                      ₹28.4k
                    </strong>

                    <span>
                      Total
                    </span>
                  </Box>
                </Box>

              </Box>

              <Box className="category-list">

                {spendingCategories.map((category) => (
                  <Box
                    key={category.name}
                    className="category-item"
                  >
                    <Box className="category-name">
                      <span
                        className={`category-dot ${category.className}`}
                      />

                      {category.name}
                    </Box>

                    <Box className="category-value">
                      <strong>
                        {category.amount}
                      </strong>

                      <span>
                        {category.percentage}%
                      </span>
                    </Box>
                  </Box>
                ))}

              </Box>

            </Box>

          </Box>

          {/* ===================================
              BOTTOM INSIGHT
          =================================== */}

          <Box className="analytics-insight">

            <Box className="insight-icon">
              <InsightsRounded />
            </Box>

            <Box className="insight-content">
              <Typography>
                Finora insight
              </Typography>

              <strong>
                Your spending decreased by 4.6% this month.
              </strong>

              <span>
                You're saving more while maintaining your
                current income level.
              </span>
            </Box>

            <Box className="insight-action">
              View detailed report

              <ArrowForwardRounded />
            </Box>

          </Box>

        </Box>

        {/* =====================================
            BOTTOM
        ===================================== */}

        <Box className="analytics-bottom">
          <Typography>
            Clear numbers. Better decisions.
          </Typography>
        </Box>

      </Container>
    </section>
  );
};

export default Analytics;
