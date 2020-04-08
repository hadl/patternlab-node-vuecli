const {
  patternlabWebpackPlugins,
  patternlabVuePluginConfig
} = require('./buildScripts/patternlabWebpackPlugins');

// vue.config.js
module.exports = {
  configureWebpack: {
    plugins: [
      ...patternlabWebpackPlugins,
    ]
  },
  chainWebpack: (config) => {
    patternlabVuePluginConfig(config);
  }
};
