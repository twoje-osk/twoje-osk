module.exports = {
  meta: {
    messages: {
      typeDoesntMatch:
        "@ApiResponse and return type of the controller don't match.",
    },
  },
  create(context) {
    return {
      MethodDefinition(node) {
        if (!node.decorators) {
          return;
        }

        const apiResponseDecorator = node.decorators?.find(
          (decorator) => decorator.expression.callee.name === 'ApiResponse',
        );

        if (!apiResponseDecorator) {
          return;
        }

        const apiResponseArguments = apiResponseDecorator?.expression.arguments;
        const apiResponseTypeArgument = apiResponseArguments?.reduce(
          (acc, argument) => {
            if (acc !== undefined) {
              return acc;
            }

            const typeProperty = argument.properties.find(
              (property) => property.key.name === 'type',
            );

            if (typeProperty === undefined) {
              return undefined;
            }

            return typeProperty.value.name;
          },
          undefined,
        );

        const isAsync = node.value.async;

        const returnType = isAsync
          ? node.value.returnType.typeAnnotation.typeParameters?.params[0].typeName.name
          : node.value.returnType.typeAnnotation.typeName.name;

        if (returnType === apiResponseTypeArgument) {
          return;
        }

        context.report({
          loc: apiResponseDecorator.loc,
          messageId: 'typeDoesntMatch',
        });
      },
    };
  },
};
