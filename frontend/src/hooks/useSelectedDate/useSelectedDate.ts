import { addDays, startOfWeek } from 'date-fns';
import { useState } from 'react';
import { getTodayWeek } from '../../utils/getTodayWeek';

export const useSelectedDate = () => {
  const [selectedDate, setSelectedDate] = useState(getTodayWeek());

  const onPrevWeekClick = () => {
    setSelectedDate(addDays(selectedDate, -7));
  };

  const onTodayClick = () => {
    setSelectedDate(startOfWeek(new Date(), { weekStartsOn: 1 }));
  };

  const onNextWeekClick = () => {
    setSelectedDate(addDays(selectedDate, 7));
  };

  return {
    selectedDate,
    onPrevWeekClick,
    onTodayClick,
    onNextWeekClick,
  };
};
