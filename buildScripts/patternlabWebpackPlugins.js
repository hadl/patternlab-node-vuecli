const PatternLabPlugin = require('./PatternlabPlugin');

const { getIfUtils } = require('webpack-config-utils');
const { join } = require('path');
const VueService = process.VUE_CLI_SERVICE;

const plConfig = require('../patternlab-config.json');
const { ifDevelopment } = getIfUtils(process.env.NODE_ENV);
const contentBaseDir = join(VueService.context, plConfig.paths.public.root);

const patternlabVuePluginConfig = (config) => {
  config
    .plugin('html')
    .tap(args => {
      args[0].template = join(contentBaseDir, 'index.html');
      return args;
    });

  if (ifDevelopment()) {
    config.plugin('patternlabplugin').use(PatternLabPlugin)
  }

  config.devServer.contentBase(contentBaseDir);
};

exports.patternlabVuePluginConfig = patternlabVuePluginConfig;
