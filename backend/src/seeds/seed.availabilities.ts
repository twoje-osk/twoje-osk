import { Availability } from '../availability/entities/availability.entity';
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
export const seedAvailabilities = () => [
  availabilitiesFactory.generateFromData({
    from: new Date('2022-07-04T10:00:00.00Z'),
    to: new Date('2022-07-04T18:00:00.00Z'),
  }),
  availabilitiesFactory.generateFromData({
    from: new Date('2022-07-05 10:00:00.00Z'),
    to: new Date('2022-07-05 18:00:00.00Z'),
  }),
  availabilitiesFactory.generateFromData({
    from: new Date('2022-07-06 10:00:00.00Z'),
    to: new Date('2022-07-06 18:00:00.00Z'),
  }),
  availabilitiesFactory.generateFromData({
    from: new Date('2022-07-07 10:00:00.00Z'),
    to: new Date('2022-07-07 18:00:00.00Z'),
  }),
  availabilitiesFactory.generateFromData({
    from: new Date('2022-07-08 10:00:00.00Z'),
    to: new Date('2022-07-08 18:00:00.00Z'),
  }),
];
