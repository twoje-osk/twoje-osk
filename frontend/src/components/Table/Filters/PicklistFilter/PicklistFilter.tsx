import { Flex } from 'reflexbox';
import { MenuItem, MenuList } from '@mui/material';
import { PicklistOption } from '../../../FPicklistField/FPicklistField';

interface PicklistFilterOptions {
  value: number | undefined;
  setValue: (newValue: number | undefined) => void;
  toggleOpen: () => void;
  options: PicklistOption[];
}
export const PicklistFilter = ({
  value,
  setValue,
  toggleOpen,
  options,
}: PicklistFilterOptions) => {
  const handleClick = (newValue: number) => {
    setValue(newValue);
    toggleOpen();
  };
  return (
    <Flex p={0} flexDirection="column" minWidth="200px">
      <MenuList>
        {options.map((option) => {
          return (
            <MenuItem
              value={option.value}
              selected={option.value === value}
              onClick={() => handleClick(option.value)}
            >
              {option.label}
            </MenuItem>
          );
        })}
      </MenuList>
    </Flex>
  );
};
