import { wrapInTransaction } from 'typeorm-transactional-cls-hooked';
import { Options } from 'typeorm-transactional-cls-hooked/dist/wrapInTransaction';
import { getFailure, Try } from '../types/Try';

class FailureError<T> extends Error {
  constructor(public data: T) {
    super('FailureError');
  }
}

const hasProperty = <T extends string>(
  value: object,
  propertyName: T,
): value is Record<T, unknown> => {
  return Object.hasOwn(value, propertyName);
};

function isTry<Data = any, ErrorData = any>(
  data: unknown,
): data is Try<Data, ErrorData> {
  if (typeof data !== 'object' || data == null) {
    return false;
  }

  const hasOk = hasProperty(data, 'ok');
  if (!hasOk) {
    return false;
  }

  if (hasOk === true) {
    return hasProperty(data, 'data');
  }

  if (hasOk === false) {
    return hasProperty(data, 'error');
  }

  return false;
}

/**
 * Used to declare a Transaction operation. In order to use it, you must use {@link BaseRepository} custom repository in order to use the Transactional decorator
 * @param connectionName - the typeorm connection name. 'default' by default
 * @param propagation - The transaction propagation type. see {@link Propagation}
 * @param isolationLevel - The transaction isolation level. see {@link IsolationLevel}
 */
export function TransactionalWithTry(options?: Options): MethodDecorator {
  return (
    target: any,
    methodName: string | symbol,
    descriptor: TypedPropertyDescriptor<any>,
  ) => {
    const originalMethod = descriptor.value;

    function wrapInThrowTryError(fn: Function) {
      // eslint-disable-next-line func-names
      return async function (this: any, ...args: any[]) {
        const result = await fn.apply(this, args);

        if (!isTry(result)) {
          return result;
        }

        if (!result.ok) {
          throw new FailureError(result.error);
        }

        return result;
      };
    }

    function wrapInCatchTryErrorAfterTransaction(fn: Function) {
      // eslint-disable-next-line func-names
      return async function (this: any, ...args: any[]) {
        try {
          const result = await fn.apply(this, args);

          return result;
        } catch (error) {
          if (error instanceof FailureError) {
            return getFailure(error.data);
          }

          throw error;
        }
      };
    }

    // eslint-disable-next-line no-param-reassign
    descriptor.value = wrapInCatchTryErrorAfterTransaction(
      wrapInTransaction(wrapInThrowTryError(originalMethod), {
        ...options,
        name: methodName,
      }),
    );

    Reflect.getMetadataKeys(originalMethod).forEach((previousMetadataKey) => {
      const previousMetadata = Reflect.getMetadata(
        previousMetadataKey,
        originalMethod,
      );
      Reflect.defineMetadata(
        previousMetadataKey,
        previousMetadata,
        descriptor.value,
      );
    });

    Object.defineProperty(descriptor.value, 'name', {
      value: originalMethod.name,
      writable: false,
    });
  };
}
