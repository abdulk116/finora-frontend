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