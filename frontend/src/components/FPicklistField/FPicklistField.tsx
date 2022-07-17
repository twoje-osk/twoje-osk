import {
  Box,
  Chip,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  SelectProps,
} from '@mui/material';
import { useField } from 'formik';
import { useState } from 'react';

type FPicklistFieldProps = Omit<
  SelectProps,
  'value' | 'onChange' | 'renderValue'
> & {
  name: string;
  options: string[];
  predefinedValues: string[];
};

export const FPicklistField = (props: FPicklistFieldProps) => {
  const { name, type, label, options, predefinedValues, ...remainingProps } =
    props;
  const [field] = useField({
    name,
  });

  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    predefinedValues ?? [],
  );

  const handleChange = (
    event: SelectChangeEvent<typeof selectedCategories>,
  ) => {
    const {
      target: { value },
    } = event;
    if (typeof value !== 'string') {
      setSelectedCategories(value);
      field.onChange(event);
    }
  };

  return (
    <FormControl sx={{ m: 1, width: '100%' }}>
      <InputLabel id="label" sx={{ background: 'white', px: '0.4rem' }}>
        {label}
      </InputLabel>
      <Select
        {...remainingProps}
        value={selectedCategories}
        name={name}
        onChange={handleChange}
        defaultValue={undefined}
        renderValue={(selected) => (
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
            {selected.map((option: string) => (
              <Chip key={option} label={option} />
            ))}
          </Box>
        )}
      >
        {options.map((option) => (
          <MenuItem key={option} value={option}>
            {option}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};
