import { TextField, Icon, Button } from '@mui/material';
import { format } from 'date-fns';
import React, { useEffect, useState } from 'react';
import { Flex } from 'reflexbox';

interface DateFilterProps {
  valueFrom: Date | undefined;
  valueTo: Date | undefined;
  setValue: (
    newValueFrom: Date | undefined,
    newValueTo: Date | undefined,
  ) => void;
  toggleOpen: () => void;
}
export const DateFilter = ({
  valueFrom,
  valueTo,
  setValue: setExternalValue,
  toggleOpen,
}: DateFilterProps) => {
  const [fromDate, setFromDate] = useState<Date | undefined>(undefined);
  const [toDate, setToDate] = useState<Date | undefined>(undefined);

  useEffect(() => {
    setFromDate(valueFrom);
  }, [valueFrom]);

  useEffect(() => {
    setToDate(valueTo);
  }, [valueTo]);

  const onFromChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value === '') {
      setFromDate(undefined);
      setToDate(undefined);
      return;
    }

    const { valueAsNumber } = e.target as any;
    const newFromDate = new Date(valueAsNumber);
    setFromDate(newFromDate);

    if (toDate !== undefined && toDate.getTime() < newFromDate.getTime()) {
      setToDate(undefined);
    }
  };

  const onToChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value === '') {
      setToDate(undefined);
    } else {
      const { valueAsNumber } = e.target as any;
      setToDate(new Date(valueAsNumber));
    }
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setExternalValue(fromDate, toDate);
    toggleOpen();
  };

  const onClear = () => {
    setFromDate(undefined);
    setToDate(undefined);

    setExternalValue(undefined, undefined);
  };

  return (
    <Flex
      p={2}
      pt={3}
      style={{ gap: '8px' }}
      flexDirection="column"
      as="form"
      onSubmit={onSubmit}
    >
      <Flex style={{ gap: '8px' }}>
        <TextField
          id="from"
          label="Od"
          type="date"
          value={fromDate ? format(fromDate, 'yyyy-MM-dd') : ''}
          onChange={onFromChanged}
          InputLabelProps={{
            shrink: true,
          }}
        />
        <TextField
          id="to"
          label="Do"
          type="date"
          value={toDate ? format(toDate, 'yyyy-MM-dd') : ''}
          onChange={onToChanged}
          InputLabelProps={{
            shrink: true,
          }}
          inputProps={{
            min: fromDate ? format(fromDate, 'yyyy-MM-dd') : '',
          }}
        />
      </Flex>
      <Flex style={{ gap: '8px' }} justifyContent="flex-end">
        <Button
          type="submit"
          variant="contained"
          startIcon={<Icon>search</Icon>}
          disabled={toDate === undefined || fromDate === undefined}
        >
          Filtruj
        </Button>
        <Button
          type="button"
          variant="outlined"
          onClick={onClear}
          startIcon={<Icon>clear</Icon>}
        >
          Wyczyść
        </Button>
      </Flex>
    </Flex>
  );
};
