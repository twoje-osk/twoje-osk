/* eslint-disable @typescript-eslint/ban-types */
import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
  buildMessage,
} from 'class-validator';
import { isAfter } from 'date-fns';

function getProperty<T>(object: any, key: string) {
  return object[key] as T;
}

export function IsDateAfter(
  property: string,
  validationOptions?: ValidationOptions,
) {
  return (object: any, propertyName: string) => {
    registerDecorator({
      name: 'isDateAfter',
      target: object.constructor,
      propertyName,
      constraints: [property],
      options: validationOptions,
      validator: {
        validate(to: Date, args: ValidationArguments) {
          const [comparedToProperty] = args.constraints;
          const comparedTo = getProperty<ApiDate>(
            args.object,
            comparedToProperty,
          );

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
