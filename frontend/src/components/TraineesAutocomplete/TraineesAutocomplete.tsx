import useSWR from 'swr';
import { TraineeFindAllQueryDto, TraineeFindAllResponseDto } from '@osk/shared';
import { useState } from 'react';
import { addQueryParams } from '../../utils/addQueryParams';
import { GeneralAPIError } from '../GeneralAPIError/GeneralAPIError';
import { FAutocomplete } from '../FAutocomplete/FAutocomplete';
import { useDebounce } from '../../hooks/useDebounce/useDebounce';

interface TraineesAutocompleteProps {
  required: boolean;
  label: string;
  id: string;
  name: string;
}

export const TraineesAutocomplete = ({
  required,
  label,
  id,
  name,
}: TraineesAutocompleteProps) => {
  const [inputValue, setInputValue] = useState<string>('');
  const [savedInputValue, setSavedInputValue] = useState<string | null>(null);
  const debouncedValue = useDebounce(inputValue);
  const { data, error, isValidating } = useSWR<TraineeFindAllResponseDto>(
    debouncedValue
      ? addQueryParams<TraineeFindAllQueryDto>('/api/trainees', {
          filters: { searchedPhrase: savedInputValue ?? debouncedValue },
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
      onInputChange={(newValue, reason) => {
        if (reason === 'reset') {
          setSavedInputValue(inputValue);
        } else {
          setSavedInputValue(null);
        }
        setInputValue(newValue ?? '');
      }}
      inputValue={inputValue}
      options={traineesOptions}
      loading={isValidating}
      label={label}
      name={name}
      id={id}
      required={required}
    />
  );
};
