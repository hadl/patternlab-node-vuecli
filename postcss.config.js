/* eslint-disable import/no-extraneous-dependencies */
const purgecss = require('@fullhuman/postcss-purgecss');
const autoprefixer = require('autoprefixer');

module.exports = {
  plugins: [
    autoprefixer,
    purgecss({
      content: ['./public/**/*.html', './src/**/*.vue', './source/**/*.twig'],
      defaultExtractor(content) {
        const contentWithoutStyleBlocks = content.replace(
          /<style[^]+?<\/style>/gi,
          '',
        );
        return (
          contentWithoutStyleBlocks.match(
            /[A-Za-z0-9-_/:]*[A-Za-z0-9-_/]+/g,
          ) || []
        );
      },
      safelist: {
        standard: [
          /-(leave|enter|appear)(|-(to|from|active))$/,
          /^(?!(|.*?:)cursor-move).+-move$/,
          /^router-link(|-exact)-active$/,
          /data-v-.*/,
          /^(svg-inline--fa|fa-)/, // fontawesome
        ],
        deep: [
          /^(flickity-)/,
        ],
      },
    }),
  ],
};
