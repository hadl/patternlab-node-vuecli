const { getIfUtils } = require('webpack-config-utils');
const StyleLintPlugin = require('stylelint-webpack-plugin');
const {
  patternlabVuePluginConfig
} = require('./buildScripts/patternlabWebpackPlugins');
const { ifProduction } = getIfUtils(process.env.NODE_ENV || '');

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
    if (!ifProduction()) {
      patternlabVuePluginConfig(config);
    }
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
