import useSWR from 'swr';
import { InstructorFindAllResponseDto } from '@osk/shared';
import { useState } from 'react';
import { addQueryParams } from '../../utils/addQueryParams';
import { GeneralAPIError } from '../GeneralAPIError/GeneralAPIError';
import { FAutocomplete } from '../FAutocomplete/FAutocomplete';
import { useDebounce } from '../../hooks/useDebounce/useDebounce';

interface InstructorsAutocompleteProps {
  required: boolean;
}

export const InstructorsAutocomplete = ({
  required,
}: InstructorsAutocompleteProps) => {
  const [inputValue, setInputValue] = useState<string>('');

  const debouncedValue = useDebounce(inputValue);
  const { data, error, isValidating } = useSWR<InstructorFindAllResponseDto>(
    debouncedValue
      ? addQueryParams('/api/instructors', {
          filters: { fullName: debouncedValue },
        })
      : null,
  );
  const traineesOptions =
    data?.instructors?.map((option) => {
      return {
        label: `${option.user.firstName} ${option.user.lastName}`,
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
      label="Instruktor"
      name="instructor"
      id="instructorId"
      required={required}
    />
  );
};
