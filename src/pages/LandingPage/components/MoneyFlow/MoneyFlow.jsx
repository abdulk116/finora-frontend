import {
  Box,
  Chip,
  Container,
  Divider,
  Stack,
  Typography,
} from "@mui/material";

import {
  AccountBalanceRounded,
  WalletRounded,
  CreditCardRounded,
  TrendingUpRounded,
  ShoppingCartRounded,
  RestaurantRounded,
  DirectionsBikeRounded,
  ArrowForwardRounded
} from "@mui/icons-material"

import "./MoneyFlow.css";

const accounts = [
  {
    icon: AccountBalanceRounded,
    name: "HDFC Bank",
    type: "Bank Account",
    amount: "₹42,850",
  },
  {
    icon: WalletRounded,
    name: "Cash Wallet",
    type: "Cash",
    amount: "₹8,240",
  },
  {
    icon: CreditCardRounded,
    name: "ICICI Credit Card",
    type: "Credit Card",
    amount: "₹12,650",
  },
];

const transactions = [
  {
    icon: TrendingUpRounded,
    title: "Salary",
    category: "Income",
    amount: "+₹42,000",
    type: "income",
  },
  {
    icon: ShoppingCartRounded,
    title: "Groceries",
    category: "Food & Shopping",
    amount: "-₹2,450",
    type: "expense",
  },
  {
    icon: RestaurantRounded,
    title: "Restaurant",
    category: "Food",
    amount: "-₹850",
    type: "expense",
  },
  {
    icon: DirectionsBikeRounded,
    title: "Fuel",
    category: "Transport",
    amount: "-₹1,200",
    type: "expense",
  },
];

const MoneyFlow = () => {
  return (
    <section
      id="money-flow"
      className="money-flow-section"
    >
      <Container
        maxWidth="lg"
        className="money-flow-container"
      >
        {/* =====================================
            HEADING
        ===================================== */}

        <Box className="money-flow-heading">
          <Chip
            label="Your money, organized"
            className="money-flow-chip"
          />

          <Typography
            component="h2"
            className="money-flow-title"
          >
            Know where your money
            <span>comes from and goes.</span>
          </Typography>

          <Typography
            component="p"
            className="money-flow-description"
          >
            Connect your financial picture from income
            and accounts to everyday spending. Finora
            keeps everything simple and easy to understand.
          </Typography>
        </Box>

        {/* =====================================
            MAIN GRID
        ===================================== */}

        <Box className="money-flow-grid">

          {/* ===================================
              ACCOUNTS
          =================================== */}

          <Box className="money-card accounts-card">

            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
            >
              <Box>
                <Typography className="money-card-label">
                  My Accounts
                </Typography>

                <Typography className="money-card-title">
                  ₹63,740
                </Typography>

                <Typography className="money-card-subtitle">
                  Total available balance
                </Typography>
              </Box>

              <Box className="money-card-main-icon">
                <AccountBalanceRounded />
              </Box>
            </Stack>

            <Stack
              spacing={1}
              className="account-list"
            >
              {accounts.map((account) => {
                const Icon = account.icon;

                return (
                  <Box
                    key={account.name}
                    className="account-item"
                  >
                    <Box className="account-icon">
                      <Icon />
                    </Box>

                    <Box className="account-details">
                      <Typography>
                        {account.name}
                      </Typography>

                      <span>
                        {account.type}
                      </span>
                    </Box>

                    <strong>
                      {account.amount}
                    </strong>
                  </Box>
                );
              })}
            </Stack>

            <Box className="money-card-link">
              Manage accounts

              <ArrowForwardRounded />
            </Box>
          </Box>

          {/* ===================================
              INCOME
          =================================== */}

          <Box className="money-card income-card">

            <Box className="income-card-background">
              <TrendingUpRounded />
            </Box>

            <Typography className="money-card-label">
              Monthly Income
            </Typography>

            <Typography className="income-total">
              ₹52,800
            </Typography>

            <Stack
              direction="row"
              spacing={1}
              alignItems="center"
              className="income-growth"
            >
              <TrendingUpRounded />

              <Typography>
                8.2%
              </Typography>

              <span>
                vs last month
              </span>
            </Stack>

            <Divider className="money-divider" />

            <Box className="income-source">
              <Box>
                <Typography>
                  Salary
                </Typography>

                <span>
                  Primary income
                </span>
              </Box>

              <strong>
                ₹42,000
              </strong>
            </Box>

            <Box className="income-source">
              <Box>
                <Typography>
                  Other Income
                </Typography>

                <span>
                  Freelance & side income
                </span>
              </Box>

              <strong>
                ₹10,800
              </strong>
            </Box>

          </Box>

          {/* ===================================
              EXPENSES
          =================================== */}

          <Box className="money-card expense-card">

            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="flex-start"
            >
              <Box>
                <Typography className="money-card-label">
                  Monthly Expenses
                </Typography>

                <Typography className="expense-total">
                  ₹28,450
                </Typography>

                <Typography className="money-card-subtitle">
                  Across 8 categories
                </Typography>
              </Box>

              <Box className="expense-icon">
                <ShoppingCartRounded />
              </Box>
            </Stack>

            {/* Expense chart */}

            <Box className="expense-chart">

              <Box className="expense-chart-bar">
                <span style={{ height: "75%" }} />
                <label>Food</label>
              </Box>

              <Box className="expense-chart-bar">
                <span style={{ height: "55%" }} />
                <label>Fuel</label>
              </Box>

              <Box className="expense-chart-bar">
                <span style={{ height: "90%" }} />
                <label>Rent</label>
              </Box>

              <Box className="expense-chart-bar">
                <span style={{ height: "42%" }} />
                <label>Bills</label>
              </Box>

              <Box className="expense-chart-bar">
                <span style={{ height: "62%" }} />
                <label>Other</label>
              </Box>

            </Box>

            <Box className="expense-summary">
              <span>
                Top category
              </span>

              <strong>
                Housing · ₹10,000
              </strong>
            </Box>

          </Box>

          {/* ===================================
              TRANSACTIONS
          =================================== */}

          <Box className="money-card transactions-card">

            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
            >
              <Box>
                <Typography className="money-card-label">
                  Recent Activity
                </Typography>

                <Typography className="money-card-title small-title">
                  Transactions
                </Typography>
              </Box>

              <Chip
                label="Today"
                size="small"
                className="today-chip"
              />
            </Stack>

            <Box className="money-transactions">

              {transactions.map((transaction) => {
                const Icon = transaction.icon;

                return (
                  <Box
                    key={transaction.title}
                    className="money-transaction"
                  >
                    <Box
                      className={`transaction-money-icon ${transaction.type}`}
                    >
                      <Icon />
                    </Box>

                    <Box className="money-transaction-details">
                      <Typography>
                        {transaction.title}
                      </Typography>

                      <span>
                        {transaction.category}
                      </span>
                    </Box>

                    <strong
                      className={transaction.type}
                    >
                      {transaction.amount}
                    </strong>
                  </Box>
                );
              })}

            </Box>

            <Box className="money-card-link">
              View all transactions

              <ArrowForwardRounded />
            </Box>

          </Box>

        </Box>

        {/* =====================================
            BOTTOM MESSAGE
        ===================================== */}

        <Box className="money-flow-bottom">
          <Box className="money-flow-dot" />

          <Typography>
            One clear view of your financial flow.
          </Typography>
        </Box>
      </Container>
    </section>
  );
};

export default MoneyFlow;