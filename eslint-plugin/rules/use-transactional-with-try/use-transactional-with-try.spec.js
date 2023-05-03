const { RuleTester } = require('eslint');
const useTransactionalWithTryRule = require('./use-transactional-with-try.js');
const ruleTester = new RuleTester({
  parser: require.resolve('@typescript-eslint/parser'),
});

ruleTester.run('use-transactional-with-try', useTransactionalWithTryRule, {
  valid: [
    {
      code: `
          class Controller {
            @Transactional()
            correct(): Dto {}
          }
        `,
    },
    {
      code: `
        class Controller {
          @TransactionalWithTry()
          correct(): Try<Dto> {}
        }
      `,
    },
    {
      code: `
        class Controller {
          @TransactionalWithTry()
          correct(): Promise<Try<Dto>> {}
        }
      `,
    },
  ],
  invalid: [
    {
      code: `
          class Controller {
            @Transactional()
            incorrect(): Try<Dto> {}
          }
        `,
      errors: [
        {
          messageId: 'usingTransactional',
          data: {
            method: 'incorrect',
          },
        },
      ],
    },
    {
      code: `
          class Controller {
            @Transactional()
            incorrect(): Promise<Try<Dto>> {}
          }
        `,
      errors: [
        {
          messageId: 'usingTransactional',
        },
      ],
    },
  ],
});
