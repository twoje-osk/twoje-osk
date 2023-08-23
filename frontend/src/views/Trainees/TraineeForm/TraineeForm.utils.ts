/* eslint-disable no-restricted-syntax */
const PESEL_WEIGHTS = [1, 3, 7, 9, 1, 3, 7, 9, 1, 3];

export function validatePesel(pesel: string | undefined) {
  if (pesel === undefined) {
    return true;
  }

  if (pesel.length !== PESEL_WEIGHTS.length + 1) {
    return false;
  }

  const digits = pesel.split('');
  const lastDigit = Number.parseInt(digits.at(-1) ?? '0', 10);

  const multipliedDigits = PESEL_WEIGHTS.map(
    (weight, i) => Number.parseInt(digits[i] ?? '0', 10) * weight,
  );

  const sum = sumLastDigits(multipliedDigits);
  const comparisonValue = 10 - getLastDigit(sum);

  return lastDigit === comparisonValue;
}

const sumLastDigits = (numbers: number[]) => {
  let sum = 0;

  for (const number of numbers) {
    sum += getLastDigit(number);
  }

  return sum;
};

const getLastDigit = (number: number) => number % 10;
