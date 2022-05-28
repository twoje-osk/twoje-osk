const { RuleTester } = require('eslint');
const returnDtoMatchApiRule = require('./return-dto-match-api.js');
const ruleTester = new RuleTester({
  parser: require.resolve('@typescript-eslint/parser'),
});

ruleTester.run('return-dto-match-api', returnDtoMatchApiRule, {
  valid: [
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
            @ApiResponse({
              type: Dto,
            })
            async asyncCorrect(): Promise<Dto> {}
          }
        `,
    },
    {
      code: `
          class Controller {
            async asyncCorrect(): Promise<Dto> {}
          }
        `,
    },
    {
      code: `
          class Controller {
            async asyncCorrect()
          }
        `,
    },
    {
      code: `
          class Controller {
            @Test()
            async asyncCorrect()
          }
        `,
    },
  ],
  invalid: [
    {
      code: `
        class Controller {
          @ApiResponse({
            type: OtherDto
          })
          incorrect(): Dto {}
        }
      `,
      errors: [{ messageId: 'typeDoesntMatch' }],
    },
    {
      code: `
        class Controller {
          @ApiResponse({
            type: OtherDto
          })
          async asyncIncorrect(): Promise<Dto> {}
        }
      `,
      errors: [{ messageId: 'typeDoesntMatch' }],
    },
  ],
});
