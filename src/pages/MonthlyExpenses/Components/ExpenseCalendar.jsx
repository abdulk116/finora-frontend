import { useMemo } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';

import './ExpenseCalendar.css';


// -----------------------------------------------------------------------------
// Currency
// -----------------------------------------------------------------------------

const formatCurrency = (amount = 0) => {
  return `₹${Number(amount || 0).toLocaleString('en-IN')}`;
};


// -----------------------------------------------------------------------------
// Status configuration
// -----------------------------------------------------------------------------

const getStatusConfig = (status = '') => {
  const normalizedStatus = status
    .toString()
    .trim()
    .toLowerCase();

  switch (normalizedStatus) {

    // Green
    case 'paid':
    case 'received':
    case 'completed':
    case 'success':
      return {
        className: 'expense-event-success',
        backgroundColor: '#dcfce7',
        borderColor: '#86efac',
        textColor: '#166534',
      };


    // Yellow
    case 'pending':
    case 'upcoming':
    case 'due':
      return {
        className: 'expense-event-warning',
        backgroundColor: '#fef3c7',
        borderColor: '#fcd34d',
        textColor: '#92400e',
      };


    // Red
    case 'overdue':
    case 'failed':
    case 'cancelled':
    case 'canceled':
      return {
        className: 'expense-event-danger',
        backgroundColor: '#fee2e2',
        borderColor: '#fca5a5',
        textColor: '#991b1b',
      };


    // Default
    default:
      return {
        className: 'expense-event-default',
        backgroundColor: '#e0f2fe',
        borderColor: '#7dd3fc',
        textColor: '#075985',
      };
  }
};


// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

export default function ExpenseCalendar({
  expenses = [],
  onExpenseClick,
  onDateClick,
}) {

  // ---------------------------------------------------------------------------
  // Convert Finora expenses into FullCalendar events
  // ---------------------------------------------------------------------------

  const events = useMemo(() => {

    return expenses
      .filter((expense) => expense?.dueDate)
      .map((expense) => {

        const status =
          expense?.status || 'Pending';

        const statusConfig =
          getStatusConfig(status);

        return {

          id: String(expense?._id),

          title:
            expense?.related ||
            expense?.title ||
            'Expense',

          start: expense.dueDate,

          allDay: true,

          backgroundColor:
            statusConfig.backgroundColor,

          borderColor:
            statusConfig.borderColor,

          textColor:
            statusConfig.textColor,

          classNames: [
            statusConfig.className,
          ],

          extendedProps: {
            expense,
            status,
          },
        };
      });

  }, [expenses]);


  // ---------------------------------------------------------------------------
  // Event click
  // ---------------------------------------------------------------------------

  const handleEventClick = (info) => {

    const expense =
      info?.event?.extendedProps?.expense;

    if (expense && onExpenseClick) {
      onExpenseClick(expense);
    }
  };


  // ---------------------------------------------------------------------------
  // Date click
  // ---------------------------------------------------------------------------

  const handleDateClick = (info) => {

    if (onDateClick) {
      onDateClick(info.dateStr);
    }
  };


  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------

  return (
    <div className="finora-expense-calendar-wrapper">

      <FullCalendar

        plugins={[
          dayGridPlugin,
          interactionPlugin,
        ]}

        initialView="dayGridMonth"

        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth',
        }}

        height="auto"

        events={events}

        eventClick={handleEventClick}

        dateClick={handleDateClick}

        dayMaxEvents={3}

        moreLinkClick="popover"

        eventDisplay="block"

        displayEventTime={false}

        fixedWeekCount={false}

        showNonCurrentDates

        firstDay={1}

        nowIndicator

        selectable

        eventContent={(eventInfo) => {

          const expense =
            eventInfo.event.extendedProps?.expense;

          return (
            <div className="finora-calendar-event-content">

              <div className="finora-calendar-event-title">
                {expense?.related ||
                  expense?.title ||
                  'Expense'}
              </div>

              <div className="finora-calendar-event-amount">
                {formatCurrency(
                  expense?.amount
                )}
              </div>

            </div>
          );
        }}

      />

    </div>
  );
}