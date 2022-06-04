import * as Yup from 'yup';
import { LocaleObject } from 'yup/lib/locale';
import printValue from './setupYupLocale.utils';

export const setupYupLocale = () => {
  Yup.setLocale(PL_LOCALE);
};

/* eslint-disable no-template-curly-in-string */
const mixed: Required<LocaleObject['mixed']> = {
  default: 'To pole jest niepoprawne',
  required: 'To pole jest wymagane',
  oneOf: 'To pole musi mieć jedną z następujących wartości: ${values}',
  notOneOf: 'To pole nie może mieć jednej z następujących wartości: ${values}',
  defined: 'To pole musi być zdefiniowane',
  notType: ({ type, value, originalValue }) => {
    const isCast = originalValue != null && originalValue !== value;
    let msg =
      `To pole musi być typu \`${type}\`, ` +
      `ale ostateczna wartość to: \`${printValue(value, true)}\`${
        isCast
          ? ` (zamienione z wartości \`${printValue(originalValue, true)}\`).`
          : '.'
      }`;

    if (value === null) {
      msg += `\n If "null" is intended as an empty value be sure to mark the schema as \`.nullable()\``;
    }

    return msg;
  },
};

const string: Required<LocaleObject['string']> = {
  length: 'To pole musi mieć dokładnie ${length} znaków',
  min: 'To pole musi mieć co najmniej ${min} znaków',
  max: 'To pole może mieć co najwyżej ${max} znaków',
  matches: 'To pole musi pasować do następującego wzorca: "${regex}"',
  email: 'To pole musi być poprawnym adresem email',
  url: 'To pole musi być poprawnym adresem URL',
  uuid: 'To pole musi być poprawnym identyfikatorem UUID',
  trim: 'To pole musi być tekstem bez spacji na początku i na końcu',
  lowercase: 'To pole może mieć tylko małe litery',
  uppercase: 'To pole może mieć tylko wielkie litery',
};

const number: Required<LocaleObject['number']> = {
  min: 'To pole musi być liczbą większą lub równą ${min}',
  max: 'To pole musi być liczą mniejszą lub równą ${max}',
  lessThan: 'To pole musi być liczbą mniejszą od ${less}',
  moreThan: 'To pole musi być liczbą większą od ${more}',
  positive: 'To pole musi być liczbą dodatnią',
  negative: 'To pole musi być liczbą ujemną',
  integer: 'To pole musi być liczbą całkowitą',
};

const date: Required<LocaleObject['date']> = {
  min: 'To pole musi zawierać datę późniejszą niż ${min}',
  max: 'To pole musi zawierać datę wcześniejszą niż ${max}',
};

const boolean: Required<LocaleObject['boolean']> = {
  isValue: 'To pole musi być ${value}',
};

const object: Required<LocaleObject['object']> = {
  noUnknown: 'To pole zawiera nieznane klucze: ${unknown}',
};

const array: Required<LocaleObject['array']> = {
  min: 'To pole musi zawierać co najmniej ${min} elementów',
  max: 'To pole może zawierać co najwyżej ${max} elementów',
  length: 'To pole musi mieć dokładnie ${length} elementów',
};

const PL_LOCALE: Required<LocaleObject> = {
  mixed,
  string,
  number,
  date,
  object,
  array,
  boolean,
};
