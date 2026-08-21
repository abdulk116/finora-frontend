// utils/generateEmiSchedule.js

export const generateEmiSchedule = ({
  emiAmount,
  tenureMonths,
  startDate,
}) => {
  const amount = Number(emiAmount);
  const tenure = Number(tenureMonths);

  if (!Number.isFinite(amount) || amount <= 0) {
    return [];
  }

  if (!Number.isInteger(tenure) || tenure <= 0) {
    return [];
  }

  const start = new Date(startDate);

  if (Number.isNaN(start.getTime())) {
    return [];
  }

  return Array.from({ length: tenure }, (_, index) => {
    const dueDate = new Date(start);

    // Prevent Jan 31 → March issue
    const originalDay = dueDate.getDate();

    dueDate.setDate(1);
    dueDate.setMonth(dueDate.getMonth() + index + 1);

    const lastDayOfMonth = new Date(
      dueDate.getFullYear(),
      dueDate.getMonth() + 1,
      0
    ).getDate();

    dueDate.setDate(
      Math.min(originalDay, lastDayOfMonth)
    );

    return {
      installmentNo: index + 1,
      dueDate: dueDate.toISOString(),
      amount,
      status: 'pending',
      paidDate: null,
    };
  });
};

export const getMonthDateRange = (month, year = new Date().getFullYear()) => {
  const startDate = new Date(year, month - 1, 1);
  const endDate = new Date(year, month, 0);

  const formatDate = (date) => {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();

    return `${day}-${month}-${year}`;
  };

  return {
    startDate: formatDate(startDate),
    endDate: formatDate(endDate),
  };
};