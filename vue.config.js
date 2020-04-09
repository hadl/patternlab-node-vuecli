const {
  patternlabVuePluginConfig
} = require('./buildScripts/patternlabWebpackPlugins');

// vue.config.js
module.exports = {
  chainWebpack: (config) => {
    patternlabVuePluginConfig(config);
  }
};
