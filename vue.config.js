const { defineConfig } = require('@vue/cli-service');

const StyleLintPlugin = require('stylelint-webpack-plugin');
const {
  patternlabVuePluginConfig,
  patternlabVueWebpackConfig,
} = require('./buildScripts/patternlabWebpackPlugins');

// eslint-disable-next-line no-unused-vars
const ifProduction = process.env.NODE_ENV === 'production';
const ifDevelopment = process.env.NODE_ENV === 'development';

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
    if (ifDevelopment) {
      patternlabVuePluginConfig(config);
    }
    config.plugin('stylelint-webpack-plugin').use(new StyleLintPlugin({
      files: ['**/*.{vue,scss}'],
    }));
  },

  configureWebpack: (config) => {
    if (ifDevelopment) {
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
