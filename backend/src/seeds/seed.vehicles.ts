import { Vehicle } from '../vehicles/entities/vehicle.entity';
import { Factory } from './seed.utils';

class VehicleFactory extends Factory<Vehicle> {
  constructor() {
    super('Vehicle');
  }

  public generate() {
    const vehicle = new Vehicle();
    vehicle.licensePlate = this.faker.vehicle.vrm();
    vehicle.notes = this.faker.random.words(10);
    this.entities.push(vehicle);

    return vehicle;
  }
}

export const vehiclesFactory = new VehicleFactory();

export const seedVehicles = () => {
  Array.from({ length: 11 }).forEach(() => vehiclesFactory.generate());
};
