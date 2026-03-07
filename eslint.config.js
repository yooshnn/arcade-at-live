import antfu from '@antfu/eslint-config';

export default antfu({
  react: true,
  typescript: true,
  stylistic: {
    indent: 2,
    quotes: 'single',
    semi: true,
  },
  rules: {
    'no-empty-pattern': ['warn', { allowObjectPatternsAsParameters: true }],
    'ts/no-use-before-define': 'off',
    'react-refresh/only-export-components': 'off',
  },
  ignores: [
    '.wrangler/**',
    '.react-router/**',
    'build/**',
    'dist/**',
    'worker-configuration.d.ts',
    'react-router.config.ts',
  ],
});
