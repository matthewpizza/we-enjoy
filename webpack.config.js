const webpack = require('webpack');

module.exports = {
  entry: {
    app: [
      `${__dirname}/scripts/main.js`,
    ]
  },
  output: {
    path: `${__dirname}/scripts`,
    filename: '[name].js',
  },
  resolve: {
    alias: {
      jquery: 'vendor/jquery.min',
      pjax  : 'vendor/jquery.pjax'
    },
    modulesDirectories: ['scripts']
  },
  module: {
    preLoaders: [
      // pass sourcemaps along
      {
        test  : /\.js$/,
        loader: 'source-map-loader'
      }
    ]
  },
  plugins: [
    // explicitly expose global variables
    new webpack.ProvidePlugin({
      $     : 'jquery',
      jQuery: 'jquery'
    })
  ],
  // write sourcemaps to file
  devtool: '#source-map'
};
