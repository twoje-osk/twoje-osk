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

const TRANSACTIONAL_DECORATOR = 'Transactional';
const TRANSACTIONAL_WITH_TRY_DECORATOR = 'TransactionalWithTry';
const TRY_TYPE = 'Try';

module.exports = {
  meta: {
    messages: {
      usingTransactional: `When using Try use @${TRANSACTIONAL_WITH_TRY_DECORATOR} instead of @${TRANSACTIONAL_DECORATOR}`,
    },
    hasSuggestions: true,
  },
  create(context) {
    return {
      MethodDefinition(node) {
        if (!node.decorators) {
          return;
        }

        const endpointReturnTypes = normalizeToUnion(
          unwrapPromiseTypeAnnotations(node),
        )
          .map((t) => t.typeName?.name)
          .filter(Boolean);

        const isReturningTry = endpointReturnTypes.includes(TRY_TYPE);

        if (!isReturningTry) {
          return;
        }

        const normalTransactional = node.decorators.find(
          (decorator) =>
            decorator.expression.callee.name === TRANSACTIONAL_DECORATOR,
        );

        if (normalTransactional === undefined) {
          return;
        }

        context.report({
          node: normalTransactional,
          messageId: 'usingTransactional',
          suggest: [
            {
              desc: `Replace @${TRANSACTIONAL_DECORATOR} with @${TRANSACTIONAL_WITH_TRY_DECORATOR}`,
              *fix(fixer) {
                yield fixer.replaceText(
                  normalTransactional.expression.callee,
                  TRANSACTIONAL_WITH_TRY_DECORATOR,
                );
              },
            },
          ],
        });
      },
    };
  },
};
