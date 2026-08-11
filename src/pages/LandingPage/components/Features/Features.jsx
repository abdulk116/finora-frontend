import {
  Box,
  Container,
  Typography,
} from "@mui/material";

import {
  AccountBalanceWalletRounded,
  PaymentsRounded,
  ReceiptLongRounded,
  AccountBalanceRounded,
  EventRepeatRounded,
  InsightsRounded,
  AssessmentRounded,
  NotificationsActiveRounded,
  ArrowForwardRounded
} from "@mui/icons-material";

import "./Features.css";

const features = [
  {
    icon: AccountBalanceWalletRounded,
    title: "Accounts",
    description:
      "Keep your bank accounts, cash, wallets and credit cards organized in one place.",
    tag: "Money",
  },
  {
    icon: PaymentsRounded,
    title: "Income",
    description:
      "Track salary, freelance income and other sources to understand exactly where your money comes from.",
    tag: "Cash Flow",
  },
  {
    icon: ReceiptLongRounded,
    title: "Expenses",
    description:
      "Record everyday spending and organize it into meaningful categories for better control.",
    tag: "Spending",
  },
  {
    icon: AccountBalanceRounded,
    title: "Loans",
    description:
      "Manage borrowed money, loan balances, interest, lenders and repayment progress effortlessly.",
    tag: "Debt",
  },
  {
    icon: EventRepeatRounded,
    title: "EMI Tracking",
    description:
      "Automatically track upcoming EMIs, payment schedules, remaining balances and due dates.",
    tag: "Payments",
  },
  {
    icon: InsightsRounded,
    title: "Analytics",
    description:
      "Understand your financial habits with clear charts, trends and spending insights.",
    tag: "Insights",
  },
  {
    icon: AssessmentRounded,
    title: "Reports",
    description:
      "Turn your financial activity into useful monthly and yearly reports.",
    tag: "Overview",
  },
  {
    icon: NotificationsActiveRounded,
    title: "Reminders",
    description:
      "Never miss an important EMI, loan payment or recurring financial commitment.",
    tag: "Stay Ahead",
  },
];

const Features = () => {
  return (
    <section
      id="how-it-works"
      className="features-section"
    >
      <Container
        maxWidth="lg"
        className="features-container"
      >
        {/* Heading */}
        <Box className="features-heading">
          <Box className="features-eyebrow">
            Everything you need
          </Box>

          <Typography
            component="h2"
            className="features-title"
          >
            One place for your
            <span>entire financial life.</span>
          </Typography>

          <Typography
            component="p"
            className="features-description"
          >
            From your everyday expenses to long-term
            loans, Finora gives you a clear picture of
            where your money is going and where it can go.
          </Typography>
        </Box>

        {/* Feature Grid */}
        <Box className="features-grid">
          {features.map((feature, index) => {
            const Icon = feature.icon;

            return (
              <Box
                key={feature.title}
                className={`feature-card feature-card-${index + 1}`}
              >
                <Box className="feature-card-top">
                  <Box className="feature-icon">
                    <Icon />
                  </Box>

                  <Box className="feature-number">
                    {String(index + 1).padStart(2, "0")}
                  </Box>
                </Box>

                <Box className="feature-content">
                  <Typography
                    component="h3"
                    className="feature-title"
                  >
                    {feature.title}
                  </Typography>

                  <Typography
                    component="p"
                    className="feature-description"
                  >
                    {feature.description}
                  </Typography>
                </Box>

                <Box className="feature-footer">
                  <Typography>
                    {feature.tag}
                  </Typography>

                  <ArrowForwardRounded />
                </Box>
              </Box>
            );
          })}
        </Box>

        {/* Bottom Message */}
        <Box className="features-bottom">
          <Typography>
            Built around the things that matter most to your money.
          </Typography>
        </Box>
      </Container>
    </section>
  );
};

export default Features;