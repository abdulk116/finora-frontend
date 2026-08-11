import {
  Box,
  Chip,
  Container,
  LinearProgress,
  Stack,
  Typography,
} from "@mui/material";

import {
  AccountBalanceRounded,
  CalendarMonthRounded,
  CheckCircleRounded,
  ArrowForwardRounded,
  TrendingDownRounded
} from "@mui/icons-material";

import "./style.css";

const LoanEMI = () => {
  return (
    <section
      id="loans"
      className="loan-emi-section"
    >
      <Container
        maxWidth="lg"
        className="loan-emi-container"
      >
        <Box className="loan-emi-grid">

          {/* =====================================
              LEFT CONTENT
          ===================================== */}

          <Box className="loan-emi-content">

            <Chip
              label="Loans & EMI tracking"
              className="loan-emi-chip"
            />

            <Typography
              component="h2"
              className="loan-emi-title"
            >
              Never lose track of
              <span>what you owe.</span>
            </Typography>

            <Typography
              component="p"
              className="loan-emi-description"
            >
              Keep every loan, EMI and repayment schedule
              organized. Finora shows you exactly what you
              have paid, what remains and what's coming next.
            </Typography>

            {/* Benefits */}

            <Stack
              spacing={2}
              className="loan-benefits"
            >
              <Box className="loan-benefit">
                <Box className="benefit-icon">
                  <CheckCircleRounded />
                </Box>

                <Box>
                  <Typography>
                    Automatic EMI tracking
                  </Typography>

                  <span>
                    Know your next payment and due date.
                  </span>
                </Box>
              </Box>

              <Box className="loan-benefit">
                <Box className="benefit-icon">
                  <TrendingDownRounded />
                </Box>

                <Box>
                  <Typography>
                    Track your debt progress
                  </Typography>

                  <span>
                    See your outstanding balance decrease over time.
                  </span>
                </Box>
              </Box>

              <Box className="loan-benefit">
                <Box className="benefit-icon">
                  <CalendarMonthRounded />
                </Box>

                <Box>
                  <Typography>
                    Stay ahead of due dates
                  </Typography>

                  <span>
                    Upcoming payments are always visible.
                  </span>
                </Box>
              </Box>
            </Stack>

            <Box className="loan-emi-link">
              Explore loan management

              <ArrowForwardRounded />
            </Box>
          </Box>

          {/* =====================================
              RIGHT PRODUCT PREVIEW
          ===================================== */}

          <Box className="loan-preview-wrapper">

            {/* Main Card */}
            <Box className="loan-preview-card">

              {/* Header */}
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
              >
                <Box>
                  <Typography className="loan-preview-label">
                    Active Loan
                  </Typography>

                  <Typography className="loan-preview-name">
                    Education Loan
                  </Typography>
                </Box>

                <Box className="loan-bank-icon">
                  <AccountBalanceRounded />
                </Box>
              </Stack>

              {/* Amount */}
              <Box className="loan-amount-section">

                <Typography>
                  Outstanding balance
                </Typography>

                <Typography className="loan-amount">
                  ₹1,64,000
                </Typography>

                <Stack
                  direction="row"
                  spacing={1}
                  alignItems="center"
                  className="loan-change"
                >
                  <TrendingDownRounded />

                  <Typography>
                    ₹32,000 paid this year
                  </Typography>
                </Stack>

              </Box>

              {/* Progress */}
              <Box className="loan-progress-section">

                <Stack
                  direction="row"
                  justifyContent="space-between"
                >
                  <Typography>
                    Repayment progress
                  </Typography>

                  <strong>
                    64%
                  </strong>
                </Stack>

                <LinearProgress
                  variant="determinate"
                  value={64}
                  className="main-loan-progress"
                />

                <Stack
                  direction="row"
                  justifyContent="space-between"
                  className="loan-progress-meta"
                >
                  <span>
                    ₹2,92,000 paid
                  </span>

                  <span>
                    ₹4,56,000 total
                  </span>
                </Stack>

              </Box>

              {/* EMI Info */}
              <Box className="loan-emi-info">

                <Box>
                  <Typography>
                    Monthly EMI
                  </Typography>

                  <strong>
                    ₹4,250
                  </strong>
                </Box>

                <Box>
                  <Typography>
                    Interest rate
                  </Typography>

                  <strong>
                    8.5%
                  </strong>
                </Box>

                <Box>
                  <Typography>
                    Remaining
                  </Typography>

                  <strong>
                    38 months
                  </strong>
                </Box>

              </Box>

            </Box>

            {/* Upcoming EMI Floating Card */}

            <Box className="upcoming-emi-card">

              <Box className="upcoming-emi-date">
                <strong>
                  15
                </strong>

                <span>
                  AUG
                </span>
              </Box>

              <Box className="upcoming-emi-details">
                <Typography>
                  Upcoming EMI
                </Typography>

                <strong>
                  ₹4,250
                </strong>

                <span>
                  Education Loan
                </span>
              </Box>

              <Box className="upcoming-emi-check">
                <CheckCircleRounded />
              </Box>

            </Box>

            {/* Timeline */}

            <Box className="loan-timeline">

              <Box className="timeline-line" />

              <Box className="timeline-step completed">
                <span />
                <Typography>
                  Loan started
                </Typography>
              </Box>

              <Box className="timeline-step completed">
                <span />
                <Typography>
                  64% completed
                </Typography>
              </Box>

              <Box className="timeline-step">
                <span />
                <Typography>
                  Final payment
                </Typography>
              </Box>

            </Box>

          </Box>
        </Box>
      </Container>
    </section>
  );
};

export default LoanEMI;