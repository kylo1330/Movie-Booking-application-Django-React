const { override, addWebpackAlias } = require('customize-cra');
const NodePolyfillPlugin = require('node-polyfill-webpack-plugin');

module.exports = override(
  (config) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      stream: require.resolve('stream-browserify'),
      buffer: require.resolve('buffer')
    };
    config.plugins = (config.plugins || []).concat([
      new NodePolyfillPlugin()
    ]);
    return config;
  }
);
