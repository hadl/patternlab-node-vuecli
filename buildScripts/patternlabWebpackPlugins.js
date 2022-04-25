/* eslint-disable no-param-reassign */
const { join, resolve } = require('path');
const PatternLabPlugin = require('./PatternlabPlugin');

const plConfig = require('../patternlab-config.json');

const ifDevelopment = process.env.NODE_ENV !== 'production';
const contentBaseDir = resolve('./', plConfig.paths.public.root);

/**
 * update and add plugins
 * @param config
 */
const patternlabVuePluginConfig = (config) => {
  config
    .plugin('html')
    .tap((args) => {
      args[0].template = join(contentBaseDir, 'index.html');
      return args;
    });

  if (ifDevelopment) {
    config.plugin('patternlabplugin')
      .use(PatternLabPlugin)
      .before('html');
  }
};

/**
 * Change dev server directory in configureWebpack
 * @param config
 */
const patternlabVueWebpackConfig = (config) => {
  if (!config.devServer) {
    config.devServer = {};
  }
  if (!config.devServer.static) {
    config.devServer.static = {};
  }
  config.devServer.static.directory = contentBaseDir;
};

exports.patternlabVuePluginConfig = patternlabVuePluginConfig;
exports.patternlabVueWebpackConfig = patternlabVueWebpackConfig;
