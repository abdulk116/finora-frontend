import {
  Box,
  Button,
  Chip,
  Container,
  Stack,
  Typography,
} from "@mui/material";
import { ArrowForwardRounded, CheckCircleRounded, TrendingUpRounded } from "@mui/icons-material";

import "./LandingPage.css";
import Navbar from "./components/Navbar/Navbar";
import DashboardPreview from "./components/DashboardPreview/DashboardPreview";
import Features from "./components/Features/Features";
import LoanEMI from "./components/LoanEMI/LoanEMI";
import MoneyFlow from "./components/MoneyFlow/MoneyFlow";
import Analytics from "./components/Analytics/Analytics";
import Footer from "./components/Footer/Footer";

const LandingPage = () => {
  return (
    <Box component="main" className="finora-landing">
      <Navbar />
      {/* Background */}
      <Box className="landing-background">
        <Box className="background-orb background-orb-one" />
        <Box className="background-orb background-orb-two" />
        <Box className="background-grid" />
      </Box>

      {/* Hero */}
      <Container maxWidth="lg" className="landing-container">
        <Box className="hero-section">
          {/* Hero Content */}
          <Box className="hero-content">
            <Chip
              icon={<CheckCircleRounded />}
              label="Smart personal finance"
              className="hero-chip"
            />

            <Typography
              component="h1"
              className="hero-title"
            >
              Take control of
              <Box component="span">
                your money.
              </Box>
            </Typography>

            <Typography
              component="p"
              className="hero-description"
            >
              Manage your loans, EMIs, accounts, income and
              expenses in one simple financial workspace.
            </Typography>

            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={2}
              className="hero-actions"
            >
              <Button
                variant="contained"
                size="large"
                endIcon={<ArrowForwardRounded />}
                className="primary-cta"
              >
                Get Started
              </Button>

              <Button
                variant="outlined"
                size="large"
                className="secondary-cta"
              >
                Explore Finora
              </Button>
            </Stack>

            {/* Trust */}
            <Stack
              direction="row"
              alignItems="center"
              spacing={2}
              className="hero-trust"
            >
              <Stack direction="row" className="trust-avatars">
                <Box>F</Box>
                <Box>₹</Box>
                <Box>✓</Box>
              </Stack>

              <Box>
                <Typography className="trust-title">
                  Everything in one place
                </Typography>

                <Typography className="trust-description">
                  Loans · EMI · Accounts · Expenses
                </Typography>
              </Box>
            </Stack>
          </Box>

          {/* Dashboard Visual */}
          <Box className="hero-visual">

            {/* Main Dashboard */}
            <Box className="dashboard-card">

              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="flex-start"
              >
                <Box>
                  <Typography className="dashboard-label">
                    Total balance
                  </Typography>

                  <Typography className="dashboard-balance">
                    ₹84,520.00
                  </Typography>
                </Box>

                <Button
                  className="dashboard-menu"
                  size="small"
                >
                  •••
                </Button>
              </Stack>

              <Stack
                direction="row"
                alignItems="center"
                spacing={1}
                className="balance-change"
              >
                <TrendingUpRounded />

                <Typography>
                  12.4%
                </Typography>

                <Typography>
                  vs last month
                </Typography>
              </Stack>

              {/* Chart */}
              <Box className="dashboard-chart">
                <Box className="chart-bars">
                  {[35, 50, 42, 75, 60, 88, 100].map(
                    (height, index) => (
                      <Box
                        key={index}
                        className="chart-bar"
                        sx={{
                          height: `${height}%`,
                        }}
                      />
                    )
                  )}
                </Box>
              </Box>

              {/* Stats */}
              <Box className="dashboard-stats">
                <Box className="stat-item">
                  <Typography>Income</Typography>
                  <strong>₹52,800</strong>
                </Box>

                <Box className="stat-item">
                  <Typography>Expenses</Typography>
                  <strong>₹28,450</strong>
                </Box>

                <Box className="stat-item">
                  <Typography>Savings</Typography>
                  <strong>₹24,350</strong>
                </Box>
              </Box>
            </Box>

            {/* EMI Floating Card */}
            <Box className="floating-card emi-card">
              <Box className="floating-icon">
                ₹
              </Box>

              <Box>
                <Typography>
                  Upcoming EMI
                </Typography>

                <strong>
                  ₹4,250
                </strong>

                <small>
                  Due in 3 days
                </small>
              </Box>
            </Box>

            {/* Loan Floating Card */}
            <Box className="floating-card loan-card">
              <Box className="loan-progress">
                <Box />
              </Box>

              <Box>
                <Typography>
                  Loan progress
                </Typography>

                <strong>
                  68%
                </strong>
              </Box>
            </Box>

          </Box>
        </Box>
      </Container>

      {/* Dashboard Preview */}
      <DashboardPreview />

      {/* Features */}
      <Features />

      {/* Loans + EMI */}
      <LoanEMI />

      {/* Accounts + Income + Expenses */}
      <MoneyFlow />

      {/* Analytics + Reports */}
      <Analytics />

      {/* CTA + Footer */}
      <Footer />
    </Box>
  );
};

export default LandingPage;