import useSWR from 'swr';
import { TraineeFindAllResponseDto } from '@osk/shared';
import { useState } from 'react';
import { addQueryParams } from '../../utils/addQueryParams';
import { GeneralAPIError } from '../GeneralAPIError/GeneralAPIError';
import { FAutocomplete } from '../FAutocomplete/FAutocomplete';
import { useDebounce } from '../../hooks/useDebounce/useDebounce';

interface TraineesAutocompleteProps {
  required: boolean;
}

export const TraineesAutocomplete = ({
  required,
}: TraineesAutocompleteProps) => {
  const [inputValue, setInputValue] = useState<string>('');

  const debouncedValue = useDebounce(inputValue);
  const { data, error, isValidating } = useSWR<TraineeFindAllResponseDto>(
    debouncedValue
      ? addQueryParams('/api/trainees', {
          filters: { searchedPhrase: debouncedValue },
        })
      : null,
  );
  const traineesOptions =
    data?.trainees?.map((option) => {
      return {
        label: `${option.user.firstName} ${option.user.lastName} (tel: ${option.user.phoneNumber})`,
        id: option.id,
      };
    }) ?? [];

  if (error) {
    return <GeneralAPIError />;
  }

  return (
    <FAutocomplete
      onInputChange={(newValue) => setInputValue(newValue ?? '')}
      inputValue={inputValue}
      options={traineesOptions}
      loading={isValidating}
      label="Kursant"
      name="traineeId"
      id="traineeId"
      required={required}
    />
  );
};
