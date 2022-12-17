import * as fs from 'node:fs/promises';
import * as path from 'node:path';
import { parse as parseCSV, Options as ParseCSVOptions } from 'csv-parse';

const DATA_PATH = path.join(__dirname, 'data');

const parseCSVAsync = <T>(
  input: string | Buffer,
  options?: ParseCSVOptions,
): Promise<T[]> =>
  new Promise((resolve, reject) => {
    parseCSV(input, options, (err, records: T[]) => {
      if (err) {
        return reject(err);
      }

      return resolve(records);
    });
  });

const castValue = (value: string) => {
  if (value === '') {
    return null;
  }

  const isNumericRegExp = /^\d+(\.\d+)?$/;
  if (isNumericRegExp.test(value)) {
    return Number.parseInt(value, 10);
  }

  return value;
};

export const fetchAndParse = async <T>(
  fileName: string,
  useProductionData: boolean,
) => {
  const folder = useProductionData ? 'production' : 'test';
  const data = await fs.readFile(path.join(DATA_PATH, folder, fileName));
  return parseCSVAsync<T>(data, {
    delimiter: ';',
    cast: castValue,
    columns: true,
  });
};
