import { Autocomplete } from '@mui/lab';
import { TextField } from '@mui/material';
import { useField, useFormikContext } from 'formik';
import { useMemo } from 'react';

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
  const [field, meta] = useField<number | undefined>(name);
  const hasError = Boolean(meta.error && meta.touched);
  const helperText = hasError ? meta.error : '';
  const { setFieldValue } = useFormikContext();

  const handleChange = (
    e: any,
    value: FAutocompleteOption | FAutocompleteOption[] | null,
  ) => {
    console.log(value);

    if (value === null) {
      setFieldValue(name, null);
    } else if (Array.isArray(value)) {
      setFieldValue(name, value[0]?.id ?? null);
    } else {
      setFieldValue(name, value.id);
    }
  };
  console.log(inputValue);
  //
  // const optionsMap = useMemo(
  //   () =>
  //     Object.fromEntries(
  //       options.map((option) => [option.id, option]),
  //     ) as Record<number, FAutocompleteOption>,
  //   [options],
  // );

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
      noOptionsText="Brak wyników"
      loadingText="Ładowanie..."
      options={options}
      loading={loading}
      value={options.find((option) => option.id === field.value) ?? null}
      inputValue={inputValue}
      onChange={handleChange}
      onInputChange={(e, currentValue) => setExternalValue(currentValue)}
    />
  );
};
