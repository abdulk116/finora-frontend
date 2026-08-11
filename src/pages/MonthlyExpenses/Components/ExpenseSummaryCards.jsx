import { useMemo } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  LinearProgress,
} from '@mui/material';

import {
  ReceiptLong,
  CheckCircle,
  AccountBalanceWallet,
  TrendingUp,
  WarningAmber,
  CalendarToday,
} from '@mui/icons-material';

import './ExpenseSummaryCards.css';

const formatCurrency = (amount = 0) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(Number(amount) || 0);
};

const getRemainingDays = (endDate) => {
  const today = new Date();

  today.setHours(0, 0, 0, 0);

  const end = endDate ? new Date(endDate) : new Date();

  end.setHours(0, 0, 0, 0);

  const diff = end.getTime() - today.getTime();

  if (diff <= 0) {
    return 1;
  }

  return Math.ceil(diff / (1000 * 60 * 60 * 24));
};

export default function ExpenseSummaryCards({
  totalExpenses = 0,
  paidAmount = 0,
  outstandingAmount = 0,

  totalExpensesCount = 0,
  completedCount = 0,
  pendingCount = 0,
  overdueCount = 0,

  startDate,
  endDate,
}) {
  /**
   * ---------------------------------------------------------
   * Calculations
   * ---------------------------------------------------------
   */

  const paymentProgress = useMemo(() => {
    if (!totalExpenses || totalExpenses <= 0) {
      return 0;
    }

    return Math.min(
      100,
      Math.round((paidAmount / totalExpenses) * 100)
    );
  }, [totalExpenses, paidAmount]);

  const remainingDays = useMemo(() => {
    return getRemainingDays(endDate);
  }, [endDate]);

  const pendingPerDay = useMemo(() => {
    if (!outstandingAmount || outstandingAmount <= 0) {
      return 0;
    }

    return Math.ceil(
      outstandingAmount / remainingDays
    );
  }, [outstandingAmount, remainingDays]);

  const dailyTargetText = useMemo(() => {
    if (!outstandingAmount) {
      return 'No pending amount';
    }

    if (remainingDays === 1) {
      return 'Due by period end';
    }

    return `${remainingDays} days remaining`;
  }, [outstandingAmount, remainingDays]);

  /**
   * ---------------------------------------------------------
   * Cards
   * ---------------------------------------------------------
   */

  const cards = [
    {
      key: 'total',

      title: 'Total Expenses',

      value: formatCurrency(totalExpenses),

      subtitle: `${totalExpensesCount} total expenses`,

      icon: <ReceiptLong />,

      className: 'total',

      iconClass: 'blue',

      footer: 'All expenses in selected period',
    },

    {
      key: 'paid',

      title: 'Paid Amount',

      value: formatCurrency(paidAmount),

      subtitle: `${completedCount} completed`,

      icon: <CheckCircle />,

      className: 'paid',

      iconClass: 'green',

      footer: `${paymentProgress}% of total expenses`,
    },

    {
      key: 'outstanding',

      title: 'Outstanding',

      value: formatCurrency(outstandingAmount),

      subtitle: `${pendingCount} pending • ${overdueCount} overdue`,

      icon: <AccountBalanceWallet />,

      className: 'outstanding',

      iconClass: 'red',
    },

    {
      key: 'progress',

      title: 'Payment Progress',

      value: `${paymentProgress}%`,

      subtitle: 'Expenses completed',

      icon: <TrendingUp />,

      className: 'progress',

      iconClass: 'teal',
    },
  ];

  return (
    <Box className="finora-expense-summary">
      {cards.map((card) => {
        /**
         * Special Outstanding Card
         */
        if (card.key === 'outstanding') {
          return (
            <Card
              key={card.key}
              className={`expense-summary-card ${card.className}`}
              elevation={0}
            >
              <CardContent className="expense-summary-content">

                {/* Header */}
                <Box className="expense-card-header">

                  <Box>
                    <Typography
                      className="expense-card-title"
                    >
                      {card.title}
                    </Typography>

                    <Typography
                      className="expense-card-value"
                    >
                      {card.value}
                    </Typography>
                  </Box>

                  <Box
                    className={`expense-card-icon ${card.iconClass}`}
                  >
                    {card.icon}
                  </Box>

                </Box>

                {/* Pending Information */}
                {/* <Box className="pending-info">

                  <Box className="pending-main">

                    <Box className="pending-icon">
                      <CalendarToday fontSize="small" />
                    </Box>

                    <Box>
                      <Typography className="pending-label">
                        Daily pending target
                      </Typography>

                      <Typography className="pending-value">
                        {formatCurrency(pendingPerDay)}
                        <span>/day</span>
                      </Typography>
                    </Box>

                  </Box>

                  <Typography className="pending-days">
                    {dailyTargetText}
                  </Typography>

                </Box> */}

                {/* Pending Progress */}
                <Box className="pending-progress">

                  <Box className="pending-progress-header">

                    <Typography>
                      {pendingCount} pending
                    </Typography>

                    {overdueCount > 0 && (
                      <Typography className="overdue-text">
                        <WarningAmber fontSize="inherit" />
                        {overdueCount} overdue
                      </Typography>
                    )}

                  </Box>

                  <LinearProgress
                    variant="determinate"
                    value={paymentProgress}
                    className="expense-progress-bar outstanding-progress"
                  />

                </Box>

              </CardContent>
            </Card>
          );
        }

        /**
         * Normal Cards
         */
        return (
          <Card
            key={card.key}
            className={`expense-summary-card ${card.className}`}
            elevation={0}
          >
            <CardContent className="expense-summary-content">

              <Box className="expense-card-header">

                <Box>
                  <Typography className="expense-card-title">
                    {card.title}
                  </Typography>

                  <Typography className="expense-card-value">
                    {card.value}
                  </Typography>
                </Box>

                <Box
                  className={`expense-card-icon ${card.iconClass}`}
                >
                  {card.icon}
                </Box>

              </Box>

              <Typography className="expense-card-subtitle">
                {card.subtitle}
              </Typography>

              {card.key === 'paid' && (
                <LinearProgress
                  variant="determinate"
                  value={paymentProgress}
                  className="expense-progress-bar"
                />
              )}

              {card.key === 'progress' && (
                <Box className="progress-card-footer">

                  <Box className="progress-circle">

                    <Typography>
                      {paymentProgress}%
                    </Typography>

                  </Box>

                  <Typography>
                    {paymentProgress >= 75
                      ? 'Great progress!'
                      : paymentProgress >= 40
                        ? 'Keep going!'
                        : 'Needs attention'}
                  </Typography>

                </Box>
              )}

              {card.footer && card.key !== 'progress' && (
                <Typography className="expense-card-footer">
                  {card.footer}
                </Typography>
              )}

            </CardContent>
          </Card>
        );
      })}
    </Box>
  );
}