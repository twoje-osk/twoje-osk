import { TextField, InputAdornment, Icon, IconButton } from '@mui/material';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Flex } from 'reflexbox';

const DEBOUNCE_TIME = 1000;
interface TextFilterProps {
  label: string;
  value: string | undefined;
  setValue: (newValue: string | undefined) => void;
  toggleOpen: () => void;
  isOpen: boolean;
}
export const TextFilter = ({
  label,
  value: externalValue,
  setValue: setExternalValue,
  isOpen,
  toggleOpen,
}: TextFilterProps) => {
  const [value, setValueState] = useState('');
  const valueRef = useRef<typeof value>(value);

  const debounceRef = useRef<number | undefined>(undefined);

  const setValue = useCallback((newValue: string) => {
    valueRef.current = newValue;
    setValueState(newValue);
  }, []);

  useEffect(() => {
    setValue(externalValue ?? '');
  }, [externalValue, setValue]);

  useEffect(function clearTimeoutOnUnmount() {
    return () => window.clearTimeout(debounceRef.current);
  }, []);

  const inputRef = useRef<HTMLInputElement>(null);

  const onClearClick = () => {
    inputRef.current?.focus();
    setValue('');
    updateExternalValue();
  };

  const updateExternalValue = useCallback(() => {
    window.clearTimeout(debounceRef.current);
    debounceRef.current = undefined;

    const currentValue = valueRef.current;
    const cleanedUpValue =
      currentValue.trim() === '' ? undefined : currentValue;

    setExternalValue(cleanedUpValue);
  }, [setExternalValue]);

  useEffect(
    function updateExternalValueOnClose() {
      if (isOpen === false) {
        updateExternalValue();
      }
    },
    [isOpen, updateExternalValue],
  );

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);

    window.clearTimeout(debounceRef.current);
    debounceRef.current = window.setTimeout(updateExternalValue, DEBOUNCE_TIME);
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateExternalValue();
    toggleOpen();
  };

  return (
    <Flex p={2} as="form" onSubmit={onSubmit}>
      <TextField
        size="small"
        autoFocus
        inputRef={inputRef}
        placeholder={label}
        onChange={onChange}
        value={value}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Icon>search</Icon>
            </InputAdornment>
          ),
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                aria-label="wyczyść"
                size="small"
                onClick={onClearClick}
                type="button"
              >
                <Icon fontSize="inherit">clear</Icon>
              </IconButton>
            </InputAdornment>
          ),
        }}
      />
    </Flex>
  );
};
