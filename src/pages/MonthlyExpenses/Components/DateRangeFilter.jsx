import { useCallback, useMemo, useState } from 'react';

import {
  Box,
  Button,
  Divider,
  IconButton,
  Popover,
  Stack,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';

import {
  CalendarMonth,
  Check,
  Close,
  FilterAlt,
  RestartAlt,
  Today,
} from '@mui/icons-material';

import './DateRangeFilter.css';


// ============================================================================
// DATE HELPERS
// ============================================================================

// IMPORTANT:
// Do not use:
// new Date(...).toISOString().split('T')[0]
//
// toISOString() converts the date to UTC and can shift the date in
// Indian timezone and other timezones.
//
// This function keeps the date in local timezone.
const formatDateInput = (date) => {
  const year = date.getFullYear();

  const month = String(
    date.getMonth() + 1
  ).padStart(2, '0');

  const day = String(
    date.getDate()
  ).padStart(2, '0');

  return `${year}-${month}-${day}`;
};


const getStartOfMonth = (date) => {
  return new Date(
    date.getFullYear(),
    date.getMonth(),
    1
  );
};


const getEndOfMonth = (date) => {
  return new Date(
    date.getFullYear(),
    date.getMonth() + 1,
    0
  );
};


const getStartOfDay = (date) => {
  return new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate()
  );
};


const getEndOfDay = (date) => {
  return new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate()
  );
};


const getDateRange = (type) => {
  const today = new Date();

  switch (type) {

    case 'today': {
      return {
        startDate: formatDateInput(
          getStartOfDay(today)
        ),
        endDate: formatDateInput(
          getEndOfDay(today)
        ),
      };
    }


    case 'this_month': {
      return {
        startDate: formatDateInput(
          getStartOfMonth(today)
        ),
        endDate: formatDateInput(
          getEndOfMonth(today)
        ),
      };
    }


    case 'last_month': {
      const start = new Date(
        today.getFullYear(),
        today.getMonth() - 1,
        1
      );

      const end = new Date(
        today.getFullYear(),
        today.getMonth(),
        0
      );

      return {
        startDate: formatDateInput(start),
        endDate: formatDateInput(end),
      };
    }


    case 'last_7_days': {
      const start = new Date(today);

      start.setDate(
        start.getDate() - 6
      );

      return {
        startDate: formatDateInput(start),
        endDate: formatDateInput(today),
      };
    }


    case 'last_30_days': {
      const start = new Date(today);

      start.setDate(
        start.getDate() - 29
      );

      return {
        startDate: formatDateInput(start),
        endDate: formatDateInput(today),
      };
    }


    default:
      return {
        startDate: formatDateInput(
          getStartOfMonth(today)
        ),
        endDate: formatDateInput(
          getEndOfMonth(today)
        ),
      };
  }
};


const getCurrentMonthValue = () => {
  const today = new Date();

  return `${today.getFullYear()}-${String(
    today.getMonth() + 1
  ).padStart(2, '0')}`;
};


const formatDisplayDate = (dateString) => {
  if (!dateString) {
    return '';
  }

  const [year, month, day] =
    dateString.split('-').map(Number);

  const date = new Date(
    year,
    month - 1,
    day
  );

  return date.toLocaleDateString(
    'en-IN',
    {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    }
  );
};


const formatMonthLabel = (monthValue) => {
  if (!monthValue) {
    return '';
  }

  const [year, month] =
    monthValue.split('-').map(Number);

  const date = new Date(
    year,
    month - 1,
    1
  );

  return date.toLocaleDateString(
    'en-IN',
    {
      month: 'long',
      year: 'numeric',
    }
  );
};


// ============================================================================
// COMPONENT
// ============================================================================

export default function DateRangeFilter({
  onFilterChange,
}) {

  const theme = useTheme();

  const isMobile = useMediaQuery(
    theme.breakpoints.down('sm')
  );


  // --------------------------------------------------------------------------
  // Initial range
  // --------------------------------------------------------------------------

  const initialRange = useMemo(
    () => getDateRange('this_month'),
    []
  );


  // --------------------------------------------------------------------------
  // State
  // --------------------------------------------------------------------------

  const [anchorEl, setAnchorEl] =
    useState(null);

  const [filterMode, setFilterMode] =
    useState('this_month');

  const [startDate, setStartDate] =
    useState(initialRange.startDate);

  const [endDate, setEndDate] =
    useState(initialRange.endDate);

  const [selectedMonth, setSelectedMonth] =
    useState(getCurrentMonthValue());


  // --------------------------------------------------------------------------
  // Derived state
  // --------------------------------------------------------------------------

  const open = Boolean(anchorEl);


  const displayLabel = useMemo(() => {

    if (
      filterMode === 'this_month'
    ) {
      return 'This Month';
    }

    if (
      filterMode === 'last_month'
    ) {
      return 'Last Month';
    }

    if (
      filterMode === 'today'
    ) {
      return 'Today';
    }

    if (
      filterMode === 'last_7_days'
    ) {
      return 'Last 7 Days';
    }

    if (
      filterMode === 'last_30_days'
    ) {
      return 'Last 30 Days';
    }

    if (
      filterMode === 'month_picker'
    ) {
      return formatMonthLabel(
        selectedMonth
      );
    }

    return `${formatDisplayDate(
      startDate
    )} – ${formatDisplayDate(
      endDate
    )}`;

  }, [
    filterMode,
    startDate,
    endDate,
    selectedMonth,
  ]);


  const isInvalidRange =
    Boolean(
      startDate &&
      endDate &&
      startDate > endDate
    );


  // --------------------------------------------------------------------------
  // Open / Close
  // --------------------------------------------------------------------------

  const handleOpen = useCallback((event) => {
    setAnchorEl(event.currentTarget);
  }, []);


  const handleClose = useCallback(() => {
    setAnchorEl(null);
  }, []);


  // --------------------------------------------------------------------------
  // Notify parent
  // --------------------------------------------------------------------------

  const applyFilter = useCallback(
    ({
      start,
      end,
      mode,
      year,
      month,
    }) => {

      onFilterChange?.({
        startDate: start,
        endDate: end,
        mode,
        ...(year && { year }),
        ...(month && { month }),
      });

    },
    [onFilterChange]
  );


  // --------------------------------------------------------------------------
  // Quick filter
  // --------------------------------------------------------------------------

  const handlePreset = useCallback(
    (mode) => {

      const range =
        getDateRange(mode);

      setStartDate(
        range.startDate
      );

      setEndDate(
        range.endDate
      );

      setFilterMode(mode);

      if (mode === 'this_month') {
        setSelectedMonth(
          getCurrentMonthValue()
        );
      }

      applyFilter({
        start: range.startDate,
        end: range.endDate,
        mode,
      });

      if (isMobile) {
        handleClose();
      }
    },
    [
      applyFilter,
      handleClose,
      isMobile,
    ]
  );


  // --------------------------------------------------------------------------
  // Month picker
  // --------------------------------------------------------------------------

  const handleMonthPickerChange =
    useCallback(
      (event) => {

        const value =
          event.target.value;

        if (!value) {
          return;
        }

        const [
          year,
          month,
        ] = value
          .split('-')
          .map(Number);


        const start = formatDateInput(
          new Date(
            year,
            month - 1,
            1
          )
        );


        const end = formatDateInput(
          new Date(
            year,
            month,
            0
          )
        );


        setSelectedMonth(value);

        setStartDate(start);

        setEndDate(end);

        setFilterMode(
          'month_picker'
        );

        applyFilter({
          start,
          end,
          mode: 'month_picker',
          year,
          month,
        });


        if (isMobile) {
          handleClose();
        }

      },
      [
        applyFilter,
        handleClose,
        isMobile,
      ]
    );


  // --------------------------------------------------------------------------
  // Custom range
  // --------------------------------------------------------------------------

  const handleApplyCustom =
    useCallback(() => {

      if (
        !startDate ||
        !endDate ||
        isInvalidRange
      ) {
        return;
      }

      setFilterMode('custom');

      applyFilter({
        start: startDate,
        end: endDate,
        mode: 'custom',
      });

      handleClose();

    }, [
      startDate,
      endDate,
      isInvalidRange,
      applyFilter,
      handleClose,
    ]);


  // --------------------------------------------------------------------------
  // Reset
  // --------------------------------------------------------------------------

  const handleReset = useCallback(() => {

    const range =
      getDateRange('this_month');

    setStartDate(
      range.startDate
    );

    setEndDate(
      range.endDate
    );

    setSelectedMonth(
      getCurrentMonthValue()
    );

    setFilterMode(
      'this_month'
    );

    applyFilter({
      start: range.startDate,
      end: range.endDate,
      mode: 'this_month',
    });

    handleClose();

  }, [
    applyFilter,
    handleClose,
  ]);


  // ==========================================================================
  // RENDER
  // ==========================================================================

  return (
    <Box className="finora-date-filter">

      {/* ------------------------------------------------------------------ */}
      {/* Trigger */}
      {/* ------------------------------------------------------------------ */}

      <Button
        className={`finora-date-filter-trigger ${
          open ? 'is-open' : ''
        }`}
        variant="outlined"
        onClick={handleOpen}
        startIcon={
          <CalendarMonth />
        }
        endIcon={
          <FilterAlt
            fontSize="small"
          />
        }
        aria-label="Select date range"
        aria-expanded={open}
        aria-haspopup="dialog"
      >

        <Box
          className="finora-date-filter-trigger-content"
        >

          <Typography
            component="span"
            className="finora-date-filter-label"
          >
            {displayLabel}
          </Typography>

          {!isMobile && (
            <Typography
              component="span"
              className="finora-date-filter-range"
            >
              {formatDisplayDate(
                startDate
              )}{' '}
              –{' '}
              {formatDisplayDate(
                endDate
              )}
            </Typography>
          )}

        </Box>

      </Button>


      {/* ------------------------------------------------------------------ */}
      {/* Filter Popup */}
      {/* ------------------------------------------------------------------ */}

      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: isMobile
            ? 'center'
            : 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: isMobile
            ? 'center'
            : 'right',
        }}
        marginThreshold={12}
        slotProps={{
          paper: {
            className:
              'finora-date-filter-popover',
          },
        }}
      >

        <Box className="finora-date-filter-panel">

          {/* -------------------------------------------------------------- */}
          {/* Header */}
          {/* -------------------------------------------------------------- */}

          <Box className="finora-date-filter-header">

            <Box>

              <Typography
                variant="subtitle1"
                className="finora-date-filter-title"
              >
                Filter Period
              </Typography>

              <Typography
                variant="caption"
                className="finora-date-filter-subtitle"
              >
                Choose a date range for your
                expenses
              </Typography>

            </Box>


            <IconButton
              size="small"
              onClick={handleClose}
              aria-label="Close date filter"
            >
              <Close fontSize="small" />
            </IconButton>

          </Box>


          <Divider />


          {/* -------------------------------------------------------------- */}
          {/* Quick Presets */}
          {/* -------------------------------------------------------------- */}

          <Box className="finora-filter-section">

            <Typography
              className="finora-filter-section-title"
            >
              Quick Select
            </Typography>


            <Box className="finora-filter-presets">

              {[
                {
                  label: 'Today',
                  value: 'today',
                  icon: <Today />,
                },
                {
                  label: 'This Month',
                  value: 'this_month',
                  icon: <CalendarMonth />,
                },
                {
                  label: 'Last Month',
                  value: 'last_month',
                  icon: <CalendarMonth />,
                },
                {
                  label: 'Last 7 Days',
                  value: 'last_7_days',
                  icon: <CalendarMonth />,
                },
                {
                  label: 'Last 30 Days',
                  value: 'last_30_days',
                  icon: <CalendarMonth />,
                },
              ].map((preset) => {

                const active =
                  filterMode ===
                  preset.value;

                return (
                  <Button
                    key={preset.value}
                    className={`finora-filter-preset ${
                      active
                        ? 'active'
                        : ''
                    }`}
                    onClick={() =>
                      handlePreset(
                        preset.value
                      )
                    }
                    startIcon={
                      preset.icon
                    }
                    endIcon={
                      active ? (
                        <Check />
                      ) : null
                    }
                  >
                    {preset.label}
                  </Button>
                );

              })}

            </Box>

          </Box>


          <Divider />


          {/* -------------------------------------------------------------- */}
          {/* Month Picker */}
          {/* -------------------------------------------------------------- */}

          <Box className="finora-filter-section">

            <Typography
              className="finora-filter-section-title"
            >
              Select Month
            </Typography>


            <TextField
              fullWidth
              type="month"
              size="small"
              value={selectedMonth}
              onChange={
                handleMonthPickerChange
              }
              slotProps={{
                inputLabel: {
                  shrink: true,
                },
              }}
            />

          </Box>


          <Divider />


          {/* -------------------------------------------------------------- */}
          {/* Custom Range */}
          {/* -------------------------------------------------------------- */}

          <Box className="finora-filter-section">

            <Typography
              className="finora-filter-section-title"
            >
              Custom Date Range
            </Typography>


            <Stack
              direction={{
                xs: 'column',
                sm: 'row',
              }}
              spacing={1.5}
            >

              <TextField
                label="From"
                type="date"
                size="small"
                fullWidth
                value={startDate}
                onChange={(event) =>
                  setStartDate(
                    event.target.value
                  )
                }
                slotProps={{
                  inputLabel: {
                    shrink: true,
                  },
                }}
                error={isInvalidRange}
              />


              <TextField
                label="To"
                type="date"
                size="small"
                fullWidth
                value={endDate}
                onChange={(event) =>
                  setEndDate(
                    event.target.value
                  )
                }
                slotProps={{
                  inputLabel: {
                    shrink: true,
                  },
                }}
                error={isInvalidRange}
              />

            </Stack>


            {isInvalidRange && (
              <Typography
                className="finora-date-filter-error"
              >
                The end date must be after
                the start date.
              </Typography>
            )}


            <Button
              fullWidth
              variant="contained"
              className="finora-apply-button"
              onClick={
                handleApplyCustom
              }
              disabled={
                !startDate ||
                !endDate ||
                isInvalidRange
              }
              startIcon={<Check />}
            >
              Apply Date Range
            </Button>

          </Box>


          <Divider />


          {/* -------------------------------------------------------------- */}
          {/* Footer */}
          {/* -------------------------------------------------------------- */}

          <Box className="finora-date-filter-footer">

            <Button
              size="small"
              startIcon={
                <RestartAlt />
              }
              onClick={handleReset}
              className="finora-reset-button"
            >
              Reset
            </Button>


            <Typography
              className="finora-active-range"
            >
              {formatDisplayDate(
                startDate
              )}
              {' – '}
              {formatDisplayDate(
                endDate
              )}
            </Typography>

          </Box>

        </Box>

      </Popover>

    </Box>
  );
}