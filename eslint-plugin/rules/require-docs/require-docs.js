const {
  RESPONSE_DECORATOR_NAMES,
  REQUEST_INDICATOR_DECORATOR_NAMES,
  DEFAULT_DECORATOR,
} = require('../../constants/apiResponseDecorators');

module.exports = {
  name: 'require-decorator',
  meta: {
    fixable: 'code',
    type: 'suggestion',
    docs: {
      description: 'Add swagger docs to controller',
      recommended: 'error',
    },
    messages: {
      missingDecorator:
        "'{{method}}' has missing API Response decorator (See: https://docs.nestjs.com/openapi/operations#responses)",
    },
  },
  create(context) {
    return {
      MethodDefinition(node) {
        if (node.key.name === 'constructor') {
          return;
        }

        const decoratorNames = (node.decorators ?? []).map(
          (decorator) => decorator.expression.callee.name,
        );

        const isRequestMethod = decoratorNames.some((name) =>
          REQUEST_INDICATOR_DECORATOR_NAMES.includes(name),
        );

        if (!isRequestMethod) {
          return;
        }

        const hasRequiredDecorator = decoratorNames.some((name) =>
          RESPONSE_DECORATOR_NAMES.includes(name),
        );

        if (hasRequiredDecorator) {
          return;
        }

        context.report({
          node,
          messageId: 'missingDecorator',
          data: {
            method: node.key.name,
          },
          fix: function (fixer) {
            const decoratorToInsert = `@${DEFAULT_DECORATOR}() \r\n `;
            return fixer.insertTextBefore(node, decoratorToInsert);
          },
        });
      },
    };
  },
};
