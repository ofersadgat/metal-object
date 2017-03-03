const path = require('path');

const dirs = {
  src: path.join(__dirname, '/src'),
  dist: path.join(__dirname, '/dist')
};

var config = {
  entry:  './src/metal.js',
  output: {
    path: dirs.dist,
    filename: 'bundle.js'
  },
  resolve: {
    extensions: ['.js'],
    modules: ['./bower_components', './node_modules'],
    alias: {

    }
  },
  resolveLoader: {
    modules: ['node_modules']
  },
  module: {
    loaders: [
      //Comment out this block if you dont want to use es6
      // {
      //   test: /\.js$/,
      //   exclude: /node_modules|bower_components|(spec\.js$)/,
      //   loader: 'babel',
      //   query: {
      //     presets: ['es2015', 'stage-0'],
      //   }
      // },
      // { test: /\.json/, loader: 'json-loader' },
    ]
  }
};

module.exports = config;