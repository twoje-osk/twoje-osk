import { addDays, setHours, startOfHour } from 'date-fns';
import { Availability } from '../availability/entities/availability.entity';
import { instructorsFactory } from './seed.instructors';
import { Factory } from './seed.utils';

class AvailabilitiesFactory extends Factory<Availability> {
  constructor() {
    super('Availabilities');
  }

  public generate() {
    const availability = new Availability();
    this.entities.push(availability);
    return availability;
  }
}
export const availabilitiesFactory = new AvailabilitiesFactory();

const today = startOfHour(new Date());
export const seedAvailabilities = () =>
  Array.from({ length: 5 }).map((_, i) =>
    availabilitiesFactory.generateFromData({
      from: addDays(setHours(today, 10), i),
      to: addDays(setHours(today, 18), i),
      instructor: instructorsFactory.getAll()[0],
      userDefined: true,
    }),
  );
