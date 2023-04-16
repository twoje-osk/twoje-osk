const { RuleTester } = require('eslint');
const requireDocsRule = require('./require-docs.js');
const ruleTester = new RuleTester({
  parser: require.resolve('@typescript-eslint/parser'),
});

ruleTester.run('require-docs', requireDocsRule, {
  valid: [
    {
      code: `
          class Controller {
            constructor() {}
          }
        `,
    },
    {
      code: `
          class Controller {
            @ApiResponse({
              type: Dto,
            })
            correct(): Dto {}
          }
        `,
    },
    {
      code: `
          class Controller {
            @ApiOkResponse({
              type: Dto,
            })
            async asyncCorrect(): Promise<Dto> {}
          }
        `,
    },
    {
      code: `
          class Controller {
            @SomeOtherDecorator({
              type: Dto,
            })
            @ApiOkResponse({
              type: Dto,
            })
            async asyncCorrect(): Promise<Dto> {}
          }
        `,
    },
    {
      code: `
          class Controller {
            correct(): Dto {}
          }
    `,
    },
  ],
  invalid: [
    {
      code: `
        class Controller {
          @Get()
          incorrect(): Dto {}
        }
      `,
      errors: [
        {
          messageId: 'missingDecorator',
          data: {
            method: 'incorrect',
          },
        },
      ],
      output: `
        class Controller {
          @ApiResponse() \r\n @Get()
          incorrect(): Dto {}
        }
      `,
    },
  ],
});
