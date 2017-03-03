
var webpackConf = require('./webpack.config.js');

module.exports = function(config) {
  config.set({
  	browsers: ['Chrome'],
    frameworks: ['mocha', 'chai'],
    preprocessors: {
      'test/*.js': ['webpack', 'sourcemap']
    },
	webpack: webpackConf,
    webpackServer: { noInfo: true },
    webpackMiddleware: { noInfo: true },
    files: [
      'test/*.js'
    ]
  });
};
