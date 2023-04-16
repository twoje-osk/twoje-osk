import { wrapInTransaction } from 'typeorm-transactional-cls-hooked';
import { Options } from 'typeorm-transactional-cls-hooked/dist/wrapInTransaction';
import { FailureError, getFailure, getFailureError } from '../types/Try';

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

        if (!result.ok) {
          throw getFailureError(result.error);
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
