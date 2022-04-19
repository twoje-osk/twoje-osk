# Migrations
## Create migration
```bash
yarn create-migration src/migrations/EntityMigrationName
```

## Create seed
1. Create an empty migration
```bash
yarn create-empty-migration src/seeds/EntitySeed
```
2. Set the faker rng seed for the migration seed execution using
```bash
faker.seed(getSeedFromString('SomethingConstant'));
```
3. Update newly created migration to generate data

## Run migrations
```bash
yarn migrate
```

## Drop database
```bash
yarn typeorm schema:drop
```

## Reference
https://typeorm.io/migrations
