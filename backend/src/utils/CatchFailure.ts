import { FailureError, getFailure } from '../types/Try';

export function CatchFailure() {
  // eslint-disable-next-line func-names
  return function (
    target: unknown,
    propertyKey: string,
    descriptor: PropertyDescriptor,
  ) {
    const { value } = descriptor;
    // eslint-disable-next-line no-param-reassign, func-names
    descriptor.value = async function (...args: any[]) {
      try {
        // eslint-disable-next-line @typescript-eslint/return-await
        return await value.apply(this, args);
      } catch (error) {
        if (error instanceof FailureError) {
          return getFailure(error.data);
        }

        throw error;
      }
    };
  };
}
