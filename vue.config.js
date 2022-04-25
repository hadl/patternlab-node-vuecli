const { defineConfig } = require('@vue/cli-service');

const StyleLintPlugin = require('stylelint-webpack-plugin');
const {
  patternlabVuePluginConfig,
  patternlabVueWebpackConfig,
} = require('./buildScripts/patternlabWebpackPlugins');

const ifProduction = process.env.NODE_ENV === 'production';

module.exports = defineConfig({
  transpileDependencies: true,
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
    if (!ifProduction) {
      patternlabVuePluginConfig(config);
    }
    config.plugin('stylelint-webpack-plugin').use(new StyleLintPlugin({
      files: ['**/*.{vue,scss}'],
    }));
  },

  configureWebpack: (config) => {
    if (!ifProduction) {
      patternlabVueWebpackConfig(config);
    }
  },

  devServer: {
    client: {
      overlay: {
        warnings: true,
        errors: true,
      },
    },
  },
});
