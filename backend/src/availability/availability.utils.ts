import { isAfter, isBefore, isEqual } from 'date-fns';
import { Lesson } from 'lessons/entities/lesson.entity';
import { Availability } from './entities/availability.entity';

export interface SimpleAvailabilityBatch {
  from: Date;
  to: Date;
}

const mapAvailabilityToSimpleAvailabilityBatch = (
  availabilities: Availability[],
): SimpleAvailabilityBatch[] => {
  return availabilities.map(({ from, to }) => ({ from, to }));
};

const subtractFromAvailability = (
  availability: SimpleAvailabilityBatch,
  from: Date,
  to: Date,
): SimpleAvailabilityBatch[] => {
  // Covers completely
  if (isEqual(availability.from, from) && isEqual(availability.to, to)) {
    return [];
  }

  // Cut from start
  if (isEqual(availability.from, from)) {
    return [
      {
        from: to,
        to: availability.to,
      },
    ];
  }

  // Cut from end
  if (isEqual(availability.to, to)) {
    return [
      {
        from: availability.from,
        to: from,
      },
    ];
  }

  // Cut from middle
  return [
    {
      from: availability.from,
      to: from,
    },
    {
      from: to,
      to: availability.to,
    },
  ];
};

export const subtractLessonsFromAvailabilities = (
  availabilities: Availability[],
  lessons: Lesson[],
): SimpleAvailabilityBatch[] => {
  let simpleAvailabilities =
    mapAvailabilityToSimpleAvailabilityBatch(availabilities);

  for (const lesson of lessons) {
    simpleAvailabilities = simpleAvailabilities.flatMap((availability) => {
      const beforeCondition =
        isBefore(availability.from, lesson.from) ||
        isEqual(availability.from, lesson.from);
      const afterCondition =
        isAfter(availability.to, lesson.to) ||
        isEqual(availability.to, lesson.to);

      const shouldUpdate = beforeCondition && afterCondition;

      if (!shouldUpdate) {
        return availability;
      }

      return subtractFromAvailability(availability, lesson.from, lesson.to);
    });
  }

  return simpleAvailabilities;
};
