import {
  registerDecorator,
  ValidationOptions,
  buildMessage,
} from 'class-validator';

const hasProperty = <T extends string>(
  value: object,
  propertyName: T,
): value is Record<T, unknown> => {
  return Object.hasOwn(value, propertyName);
};

export function IsTime(validationOptions?: ValidationOptions) {
  return (object: any, propertyName: string) => {
    registerDecorator({
      name: 'isTime',
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: {
        validate(value: unknown) {
          if (typeof value !== 'object' || value === null) {
            return false;
          }

          if (
            !hasProperty(value, 'hours') ||
            !hasProperty(value, 'minutes') ||
            !hasProperty(value, 'seconds')
          ) {
            return false;
          }

          if (
            typeof value.hours !== 'number' ||
            typeof value.minutes !== 'number' ||
            typeof value.seconds !== 'number'
          ) {
            return false;
          }

          return true;
        },
        defaultMessage: buildMessage(
          (eachPrefix) => `${eachPrefix}$property must be a Time instance`,
          validationOptions,
        ),
      },
    });
  };
}
