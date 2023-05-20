import { Autocomplete } from '@mui/lab';
import { TextField } from '@mui/material';
import { useRef, useState } from 'react';
import { useField, useFormikContext } from 'formik';

const DEBOUNCE_TIME = 500;

export interface FAutocompleteOption {
  label: string;
  id: number;
}
interface FAutocompleteProps {
  onInputChange: (newValue: string | undefined) => void;
  options: FAutocompleteOption[];
  loading: boolean;
  label: string;
  name: string;
  id: string;
  required: boolean;
}
export const FAutocomplete = ({
  onInputChange: setExternalValue,
  options,
  loading,
  label,
  name,
  required,
}: FAutocompleteProps) => {
  const [value, setValueState] = useState('');
  const [field, meta] = useField({
    name,
  });
  const hasError = Boolean(meta.error && meta.touched);
  const helperText = hasError ? meta.error : '';
  const valueRef = useRef<typeof value>(value);
  const { setFieldValue } = useFormikContext();
  const debounceRef = useRef<number | undefined>(undefined);
  const handleInputChange = (event: React.SyntheticEvent, val: string) => {
    valueRef.current = val;
    setValueState(val);
    window.clearTimeout(debounceRef.current);
    debounceRef.current = window.setTimeout(updateExternalValue, DEBOUNCE_TIME);
  };

  const handleChange = (e: any, val: FAutocompleteOption) => {
    setFieldValue(name, val.id);
  };
  const updateExternalValue = () => {
    window.clearTimeout(debounceRef.current);
    debounceRef.current = undefined;

    const currentValue = valueRef.current;
    const cleanedUpValue =
      currentValue.trim() === '' ? undefined : currentValue;
    setExternalValue(cleanedUpValue);
  };

  return (
    <Autocomplete
      renderInput={(params) => (
        <TextField
          {...params}
          required={required}
          error={hasError}
          label={label}
          helperText={helperText}
        />
      )}
      noOptionsText="Brak wyników"
      loadingText="Ładowanie..."
      options={options}
      loading={loading}
      value={field.value}
      onChange={handleChange}
      onInputChange={handleInputChange}
    />
  );
};
