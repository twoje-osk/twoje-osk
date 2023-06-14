import { Autocomplete } from '@mui/lab';
import { AutocompleteInputChangeReason, TextField } from '@mui/material';
import { useField, useFormikContext } from 'formik';
import { useMemo } from 'react';

export interface FAutocompleteOption {
  label: string;
  id: number;
}
interface FAutocompleteProps {
  onInputChange: (
    newValue: string | undefined,
    reason: AutocompleteInputChangeReason,
  ) => void;
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
  const [field, meta] = useField<number | undefined>(name);
  const hasError = Boolean(meta.error && meta.touched);
  const helperText = hasError ? meta.error : '';
  const { setFieldValue } = useFormikContext();

  const handleChange = (
    e: any,
    value: FAutocompleteOption | FAutocompleteOption[] | null,
  ) => {
    if (value === null) {
      setFieldValue(name, null);
    } else if (Array.isArray(value)) {
      setFieldValue(name, value[0]?.id ?? null);
    } else {
      setFieldValue(name, value.id);
    }
  };

  const optionsMap = useMemo(
    () =>
      Object.fromEntries(
        options.map((option) => [option.id, option]),
      ) as Record<number, FAutocompleteOption>,
    [options],
  );

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
      noOptionsText={inputValue ? 'Brak wyników' : 'Wpisz aby wyszukać...'}
      loadingText="Ładowanie..."
      options={options}
      loading={loading}
      value={field.value === undefined ? null : optionsMap[field.value] ?? null}
      onChange={handleChange}
      onInputChange={(e, currentValue, reason) => {
        if (currentValue === '' && reason === 'reset') {
          setFieldValue(name, null);
        }
        setExternalValue(currentValue, reason);
      }}
    />
  );
};
