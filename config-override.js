const path = require('path');

module.exports = function override(config, env) {
  // Add the source map loader rule
  config.module.rules.push({
    test: /\.js$/,
    enforce: 'pre',
    use: ['source-map-loader'],
    exclude: [path.resolve(__dirname, 'node_modules/chart.js')],
  });

  return config;
};
