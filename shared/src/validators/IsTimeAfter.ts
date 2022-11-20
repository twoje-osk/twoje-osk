/* eslint-disable @typescript-eslint/ban-types */
import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
  buildMessage,
} from 'class-validator';
import { Time } from '../types/Time';

function getProperty<T>(object: any, key: string) {
  return object[key] as T;
}

const isAfter = (time: Time, timeToCompare: Time) => {
  return time.getSeconds() > timeToCompare.getSeconds();
};

export function IsTimeAfter(
  property: string,
  validationOptions?: ValidationOptions,
) {
  return (object: any, propertyName: string) => {
    registerDecorator({
      name: 'isTimeAfter',
      target: object.constructor,
      propertyName,
      constraints: [property],
      options: validationOptions,
      validator: {
        validate(to: Time, args: ValidationArguments) {
          const [comparedToProperty] = args.constraints;
          const comparedTo = getProperty<Time>(args.object, comparedToProperty);

          return isAfter(to, comparedTo);
        },
        defaultMessage: buildMessage(
          (eachPrefix) =>
            `${eachPrefix}$property has to be after then ${eachPrefix}${property}`,
          validationOptions,
        ),
      },
    });
  };
}
