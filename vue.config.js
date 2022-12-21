const NodePolyfillPlugin = require("node-polyfill-webpack-plugin");

module.exports = {
  productionSourceMap: false,
  css: {
    sourceMap: true,
    loaderOptions: {
      sass: {
        prependData: `
            @use "sass:math";
            @import "@/assets/styles/_variables.scss";
          `,
      },
    },
  },

  // Add polyfill (webpack 5 doesn't import it automatically)
  transpileDependencies: true,
  lintOnSave: false,
  configureWebpack: {
    plugins: [ new NodePolyfillPlugin() ],
    optimization: {
      splitChunks: {
        chunks: "all",
      },
    },
  },
};
