import { Vehicle } from '../vehicles/entities/vehicle.entity';
import { Factory } from './seed.utils';
import { organizationsFactory } from './seed.organization';

class VehicleFactory extends Factory<Vehicle> {
  constructor() {
    super('Vehicle');
  }

  public generate() {
    const vehicle = new Vehicle();
    vehicle.licensePlate = this.faker.vehicle.vrm();
    vehicle.notes =
      this.faker.datatype.number({ max: 1, min: 0, precision: 0.0000001 }) < 0.2
        ? this.faker.random.words(10)
        : null;
    vehicle.organization = this.faker.helpers.arrayElement(
      organizationsFactory.getAll(),
    );

    this.entities.push(vehicle);
    return vehicle;
  }
}

export const vehiclesFactory = new VehicleFactory();

export const seedVehicles = () => {
  Array.from({ length: 11 }).forEach(() => vehiclesFactory.generate());
};
