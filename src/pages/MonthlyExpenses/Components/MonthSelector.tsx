import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
} from '@mui/material';
import { memo, useCallback } from 'react';

const months = [
  { value: 1, label: 'Jan' },
  { value: 2, label: 'Feb' },
  { value: 3, label: 'Mar' },
  { value: 4, label: 'Apr' },
  { value: 5, label: 'May' },
  { value: 6, label: 'Jun' },
  { value: 7, label: 'Jul' },
  { value: 8, label: 'Aug' },
  { value: 9, label: 'Sep' },
  { value: 10, label: 'Oct' },
  { value: 11, label: 'Nov' },
  { value: 12, label: 'Dec' },
];

type MonthSelectorProps = {
  selectedMonth: number;
  setSelectedMonth: React.Dispatch<React.SetStateAction<number>>;
};

const MonthSelector = memo(function MonthSelector({
  selectedMonth,
  setSelectedMonth,
}: MonthSelectorProps) {
  const handleChange = useCallback(
    (event: SelectChangeEvent<number>) => {
      setSelectedMonth(Number(event.target.value));
    },
    [setSelectedMonth]
  );

  return (
    <Box sx={{ minWidth: 120 }}>
      <FormControl fullWidth size="small">
        <InputLabel id="month-select-label">Month</InputLabel>

        <Select
          labelId="month-select-label"
          id="month-select"
          value={selectedMonth}
          label="Month"
          onChange={handleChange}
        >
          {months.map((month) => (
            <MenuItem key={month.value} value={month.value}>
              {month.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
});

export default MonthSelector;