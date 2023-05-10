import { Flex } from 'reflexbox';
import { Slider, Typography } from '@mui/material';
import { useState } from 'react';

interface IntegerRangeFilterProps {
  label: string;
  setValue: (newValue: { from: number; to: number }) => void;
  min: number;
  max: number;
}

export const IntegerRangeFilter = ({
  label,
  setValue,
  min,
  max,
}: IntegerRangeFilterProps) => {
  const [sliderValue, setSliderValue] = useState<number[]>([min, max]);

  const handleChange = (event: any, newValue: number | number[]) => {
    setSliderValue(newValue as number[]);
  };

  const handleChangeCommitted = () => {
    setValue({ from: sliderValue[0] || min, to: sliderValue[1] || max });
  };

  return (
    <Flex
      flexDirection="column"
      style={{ width: '300px', padding: '16px 32px', gap: '8px' }}
    >
      <Typography>{label}</Typography>
      <Slider
        value={sliderValue}
        min={min}
        max={max}
        valueLabelDisplay="auto"
        onChange={handleChange}
        onChangeCommitted={handleChangeCommitted}
      />
    </Flex>
  );
};
