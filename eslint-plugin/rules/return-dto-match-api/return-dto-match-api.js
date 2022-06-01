const {
  RESPONSE_DECORATOR_NAMES,
} = require('../../constants/apiResponseDecorators');

const unwrapPromiseTypeAnnotations = (node) => {
  const isPromise =
    node.value.returnType.typeAnnotation.typeName.name === 'Promise';

  if (isPromise) {
    return node.value.returnType.typeAnnotation.typeParameters.params[0];
  }

  return node.value.returnType.typeAnnotation;
};

const normalizeToUnion = (node) => {
  if (node.type === 'TSUnionType') {
    return node.types;
  }

  return [node];
};

module.exports = {
  meta: {
    messages: {
      typeDoesntMatch:
        "@ApiResponse test and return type of the controller don't match.",
    },
    hasSuggestions: true,
  },
  create(context) {
    return {
      MethodDefinition(node) {
        if (!node.decorators) {
          return;
        }

        const apiResponseDecorators = node.decorators.filter((decorator) =>
          RESPONSE_DECORATOR_NAMES.includes(decorator.expression.callee.name),
        );

        const decoratorsWithTypes = apiResponseDecorators.map((decorator) => {
          const args = decorator.expression.arguments[0];

          const typeProperty = args.properties.find(
            (prop) => prop.key.name === 'type',
          );

          return { decorator, type: typeProperty?.value.name, typeProperty };
        });

        const isTypeDefinedInAnyDecorator = decoratorsWithTypes.some(
          ({ type }) => type !== undefined,
        );

        if (!isTypeDefinedInAnyDecorator) {
          return;
        }

        const endpointReturnTypes = normalizeToUnion(
          unwrapPromiseTypeAnnotations(node),
        )
          .map((t) => t.typeName?.name)
          .filter(Boolean);

        const unmatchedDecorators = decoratorsWithTypes.filter(
          ({ type }) => !endpointReturnTypes.includes(type),
        );

        if (unmatchedDecorators.length === 0) {
          return;
        }

        unmatchedDecorators.forEach(({ decorator, typeProperty }) => {
          context.report({
            loc: decorator.loc,
            messageId: 'typeDoesntMatch',
            suggest: endpointReturnTypes.map((returnType) => ({
              desc: `Replace @${decorator.expression.callee.name} type to ${returnType}`,
              *fix(fixer) {
                yield fixer.replaceText(typeProperty.value, returnType);
              },
            })),
          });
        });
      },
    };
  },
};
