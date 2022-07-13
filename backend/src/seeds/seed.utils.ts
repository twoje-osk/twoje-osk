import { Faker, faker } from '@faker-js/faker';
import { EntityManager, EntityTarget } from 'typeorm';

const getSeedFromString = (text: string): number =>
  text.split('').reduce((sum, c) => sum + c.charCodeAt(0), 0);

export abstract class Factory<T> {
  protected entities: T[] = [];

  protected faker: Faker;

  public static factories: Factory<unknown>[] = [];

  constructor(private entityType: EntityTarget<T>) {
    const seedKey = (entityType.valueOf() as Function).name;

    this.faker = new Faker({
      locales: faker.locales,
    });

    Factory.factories.push(this);

    this.faker.seed(getSeedFromString(seedKey));
    this.faker.setLocale('pl');
  }

  abstract generate(): T;
  public generateFromData(data: Partial<T>): T {
    const entity = this.generate();

    // eslint-disable-next-line no-restricted-syntax
    for (const key in entity) {
      if (
        Object.prototype.hasOwnProperty.call(entity, key) &&
        data[key] !== undefined
      ) {
        entity[key] = data[key]!;
      }
    }

    return entity;
  }

  public remove(entityToRemove: T) {
    this.entities = this.entities.filter((e) => e !== entityToRemove);
  }

  public getAll = () => this.entities;

  public truncate(trx: EntityManager) {
    const { tableName } = trx.getRepository(this.entityType).metadata;

    return trx.query(`TRUNCATE "${tableName}" CASCADE`);
  }

  public save(trx: EntityManager) {
    return trx.save(this.entities);
  }
}
