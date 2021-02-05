const StyleLintPlugin = require('stylelint-webpack-plugin');
const {
  patternlabVuePluginConfig
} = require('./buildScripts/patternlabWebpackPlugins');

// vue.config.js
module.exports = {
  css: {
    loaderOptions: {
      sass: {
        additionalData: `
          @import "~@/scss/_variables.scss";
        `,
      },
    },
  },

  chainWebpack: (config) => {
    patternlabVuePluginConfig(config);
    config.plugin('stylelint-webpack-plugin').use(new StyleLintPlugin({
      files: ['**/*.{vue,scss}'],
    }));
  },

  devServer: {
    overlay: {
      warnings: true,
      errors: true,
    },
  },
};
