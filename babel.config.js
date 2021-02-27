const dotenv = require('dotenv');

dotenv.config();

const production = process.env['ENV'] === 'production';

module.exports = function(api) {
  api.cache(false);
  const presets = [
    [
      '@babel/preset-env',
      {
        corejs: {
          version: "3",
          proposals: true
        },
        useBuiltIns: 'usage',
        modules: false,
        debug: production ? false : true
      }
    ],
    ['@babel/preset-react', { development: production ? false : true }],
  ];
  const plugins = [
    ["@babel/transform-runtime"],
    ["@babel/plugin-transform-modules-commonjs"],
  ];
  return {presets, plugins};
}
