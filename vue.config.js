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
  transpileDependencies: true,
  configureWebpack: {
    plugins: [ new NodePolyfillPlugin() ],
    optimization: {
      splitChunks: {
        chunks: "all",
      },
    },
  },
};
