import {
  Box,
  Chip,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectProps,
} from '@mui/material';
import { useField } from 'formik';

export type PicklistOption = {
  value: number;
  label: string;
};

type FPicklistFieldProps = Omit<
  SelectProps,
  'value' | 'onChange' | 'renderValue'
> & {
  name: string;
  options: PicklistOption[];
  predefinedValues: number[];
};

export const FPicklistField = (props: FPicklistFieldProps) => {
  const { name, type, label, options, predefinedValues, ...remainingProps } =
    props;
  const [field] = useField({
    name,
  });

  return (
    <FormControl sx={{ m: 1, width: '100%' }}>
      <InputLabel id="label" sx={{ background: 'white', px: '0.4rem' }}>
        {label}
      </InputLabel>
      <Select
        {...remainingProps}
        {...field}
        renderValue={(selected) => (
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
            {selected.map((value: number) => (
              <Chip
                key={value}
                label={options.find((el) => el.value === value)?.label}
              />
            ))}
          </Box>
        )}
      >
        {options.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};
