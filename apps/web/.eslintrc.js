module.exports = {
  root: true,
  extends: ['@hr-dashboard/eslint-config/react'],
  parserOptions: {
    project: './tsconfig.json',
    tsconfigRootDir: __dirname,
  },
};
