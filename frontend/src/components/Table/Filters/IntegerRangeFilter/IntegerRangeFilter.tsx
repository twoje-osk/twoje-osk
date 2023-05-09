import { Flex } from 'reflexbox';
import { Slider, Typography } from '@mui/material';
import { useCallback, useEffect, useRef, useState } from 'react';

interface IntegerRangeFilterProps {
  label: string;
  setValue: (newValue: { from: number; to: number }) => void;
  min: number;
  max: number;
}
const DEBOUNCE_TIME = 500;

export const IntegerRangeFilter = ({
  label,
  setValue,
  min,
  max,
}: IntegerRangeFilterProps) => {
  const [sliderValue, setSliderValue] = useState<number[]>([min, max]);
  const debounceRef = useRef<number | undefined>(undefined);

  useEffect(function clearTimeoutOnUnmount() {
    return () => window.clearTimeout(debounceRef.current);
  }, []);

  const setExternalValue = useCallback(() => {
    window.clearTimeout(debounceRef.current);
    debounceRef.current = undefined;

    setValue({ from: sliderValue[0] || min, to: sliderValue[1] || max });
  }, [min, max, sliderValue, setValue]);

  const handleChange = (event: any, newValue: number | number[]) => {
    setSliderValue(newValue as number[]);
    window.clearTimeout(debounceRef.current);
    debounceRef.current = window.setTimeout(setExternalValue, DEBOUNCE_TIME);
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
      />
    </Flex>
  );
};
