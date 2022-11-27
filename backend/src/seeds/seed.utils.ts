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

  public async truncate(trx: EntityManager) {
    await this.clearSequences(trx);
    await this.truncateData(trx);
  }

  private truncateData(trx: EntityManager) {
    const { tableName } = trx.getRepository(this.entityType).metadata;

    return trx.query(`TRUNCATE "${tableName}" CASCADE`);
  }

  private async clearSequences(trx: EntityManager) {
    if (trx.queryRunner === undefined) {
      throw new Error('Query runner not defined');
    }

    const { metadata } = trx.getRepository(this.entityType);
    const { tableName, generatedColumns } = metadata;

    for (const column of generatedColumns) {
      const columnName = column.databaseName;

      // Casting to any to access a protected method
      const sequence = (trx.queryRunner as any).buildSequenceName(
        tableName,
        columnName,
      );

      // eslint-disable-next-line no-await-in-loop
      await trx.query(`
        SELECT SETVAL(c.oid, s.start_value, false) FROM pg_class c
          JOIN pg_namespace pn on c.relnamespace = pn.oid
          JOIN pg_sequences s on s.sequencename = c.relname
        WHERE c.relkind = 'S' AND c.relname = '${sequence}';
      `);
    }
  }

  public save(trx: EntityManager) {
    return trx.save(this.entities);
  }
}
