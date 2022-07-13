/* eslint-disable @typescript-eslint/ban-types */
import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';
import { isAfter } from 'date-fns';

function getProperty<T>(object: any, key: string) {
  return object[key] as T;
}

@ValidatorConstraint({ name: 'isToGreaterThenFrom', async: false })
export class IsToGreaterThenFrom implements ValidatorConstraintInterface {
  validate(to: Date, args: ValidationArguments) {
    const comparedToProperty = args.constraints[0];
    const comparedTo = getProperty<Date>(args.object, comparedToProperty);

    return isAfter(to, comparedTo);
  }

  defaultMessage(args: ValidationArguments) {
    const comparedToProperty = args.constraints[0];

    return `Property $property has to be earlier then ${comparedToProperty}`;
  }
}
