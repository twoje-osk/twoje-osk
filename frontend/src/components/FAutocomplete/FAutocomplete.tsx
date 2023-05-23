import { Autocomplete } from '@mui/lab';
import { TextField } from '@mui/material';
import { useField, useFormikContext } from 'formik';

export interface FAutocompleteOption {
  label: string;
  id: number;
}
interface FAutocompleteProps {
  onInputChange: (newValue: string | undefined) => void;
  inputValue: string;
  options: FAutocompleteOption[];
  loading: boolean;
  label: string;
  name: string;
  id: string;
  required: boolean;
}
export const FAutocomplete = ({
  onInputChange: setExternalValue,
  inputValue,
  options,
  loading,
  label,
  name,
  required,
}: FAutocompleteProps) => {
  const [field, meta] = useField(name);
  const hasError = Boolean(meta.error && meta.touched);
  const helperText = hasError ? meta.error : '';
  const { setFieldValue } = useFormikContext();

  const handleChange = (e: any, val: FAutocompleteOption) => {
    setFieldValue(name, val.id);
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
      {...field}
      isOptionEqualToValue={(option, value) => option.id === value.id}
      noOptionsText="Brak wyników"
      loadingText="Ładowanie..."
      options={options}
      loading={loading}
      value={field.value}
      inputValue={inputValue}
      onChange={handleChange}
      onInputChange={(e, currentValue) => setExternalValue(currentValue)}
      on
    />
  );
};
