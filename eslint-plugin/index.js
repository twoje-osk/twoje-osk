module.exports = {
  rules: {
    'return-dto-match-api': require('./rules/return-dto-match-api/return-dto-match-api.js'),
    'require-docs': require('./rules/require-docs/require-docs.js'),
    'use-transactional-with-try': require('./rules/use-transactional-with-try/use-transactional-with-try.js'),
  },
};
