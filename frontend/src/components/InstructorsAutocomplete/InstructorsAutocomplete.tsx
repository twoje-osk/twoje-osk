import { FocusEventHandler, useMemo, useState } from 'react';
import { Autocomplete } from '@mui/lab';
import { TextField } from '@mui/material';
import { FAutocompleteOption } from '../FAutocomplete/FAutocomplete';

interface InstructorsAutocompleteProps {
  options: FAutocompleteOption[];
  handleInputChange: (newValue: string) => void;
  selectedInstructorId: number | null;
  setSelectedInstructorId: (newValue: number | null) => void;
  isLoading: boolean;
  onBlur: FocusEventHandler<HTMLDivElement>;
}

export const InstructorsAutocomplete = ({
  options,
  handleInputChange: setExternalInputChange,
  selectedInstructorId: externalValue,
  setSelectedInstructorId: setExternalValue,
  isLoading,
  onBlur,
}: InstructorsAutocompleteProps) => {
  const [inputValue, setInputValue] = useState<string>('');

  const handleChange = (
    e: any,
    value: FAutocompleteOption | FAutocompleteOption[] | null,
  ) => {
    if (value === null) {
      setExternalValue(null);
    } else if (Array.isArray(value)) {
      setExternalValue(value[0]?.id ?? null);
    } else {
      setExternalValue(value.id);
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
      renderInput={(params) => <TextField {...params} label="Instructor" />}
      noOptionsText="Brak wyników"
      loadingText="Ładowanie..."
      options={options}
      loading={isLoading}
      value={externalValue === null ? null : optionsMap[externalValue] ?? null}
      onChange={handleChange}
      inputValue={inputValue}
      onBlur={onBlur}
      onInputChange={(e, newValue, reason) => {
        const currentSelectionLabel =
          externalValue === null ? null : optionsMap[externalValue]?.label;
        if (reason === 'reset') {
          setInputValue(
            inputValue === '' || newValue === currentSelectionLabel
              ? newValue
              : inputValue,
          );
        } else {
          setInputValue(newValue);
          setExternalInputChange(newValue);
          setExternalValue(null);
        }
      }}
    />
  );
};
