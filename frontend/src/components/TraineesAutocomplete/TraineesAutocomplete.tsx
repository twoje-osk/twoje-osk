import useSWR from 'swr';
import { TraineeFindAllResponseDto } from '@osk/shared';
import { useState } from 'react';
import { addQueryParams } from '../../utils/addQueryParams';
import { GeneralAPIError } from '../GeneralAPIError/GeneralAPIError';
import {
  FAutocomplete,
  FAutocompleteOption,
} from '../FAutocomplete/FAutocomplete';
import { useDebounce } from '../../hooks/useDebounce/useDebounce';

interface TraineesAutocompleteProps {
  required: boolean;
}

export const TraineesAutocomplete = ({
  required,
}: TraineesAutocompleteProps) => {
  const [inputValue, setInputValue] = useState<string>('');
  const [traineesOptions, setTraineesOptions] = useState<FAutocompleteOption[]>(
    [],
  );
  const debouncedValue = useDebounce(inputValue);
  const { data, error, isValidating } = useSWR<TraineeFindAllResponseDto>(
    debouncedValue
      ? addQueryParams('/api/trainees', {
          filters: { fullName: debouncedValue },
        })
      : null,
  );
  if (error) {
    return <GeneralAPIError />;
  }
  if (data) {
    const options = data?.trainees?.map((option) => {
      return {
        label: `${option.user.firstName} ${option.user.lastName}`,
        id: option.id,
      };
    });
    setTraineesOptions(options ?? []);
  }

  return (
    <FAutocomplete
      onInputChange={(newValue) => {
        console.log(newValue);
        setInputValue(newValue ?? '');
      }}
      inputValue={inputValue}
      options={traineesOptions}
      loading={isValidating}
      label="Kursant"
      name="trainee"
      id="traineeId"
      required={required}
    />
  );
};
