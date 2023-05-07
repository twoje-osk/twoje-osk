import { MenuItem, MenuList } from '@mui/material';
import { Flex } from 'reflexbox';

interface BooleanFilterProps {
  value: boolean | undefined;
  setValue: (newValue: boolean | undefined) => void;
  trueLabel: string;
  falseLabel: string;
  toggleOpen: () => void;
}
export const BooleanFilter = ({
  value,
  setValue,
  trueLabel,
  falseLabel,
  toggleOpen,
}: BooleanFilterProps) => {
  const onClickTrue = () => {
    setValue(true);
    toggleOpen();
  };
  const onClickFalse = () => {
    setValue(false);
    toggleOpen();
  };
  return (
    <Flex p={0} flexDirection="column" minWidth="200px">
      <MenuList>
        <MenuItem selected={value === true} onClick={onClickTrue}>
          {trueLabel}
        </MenuItem>
        <MenuItem selected={value === false} onClick={onClickFalse}>
          {falseLabel}
        </MenuItem>
      </MenuList>
    </Flex>
  );
};
