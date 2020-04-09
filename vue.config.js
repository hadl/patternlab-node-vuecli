const {
  patternlabVuePluginConfig
} = require('./buildScripts/patternlabWebpackPlugins');

// vue.config.js
module.exports = {
  css: {
    loaderOptions: {
      sass: {
        prependData: `
          @import "@/scss/_variables.scss";
        `,
      },
    },
  },

  chainWebpack: (config) => {
    patternlabVuePluginConfig(config);
  }
};
