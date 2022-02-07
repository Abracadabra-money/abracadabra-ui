module.exports = {
  productionSourceMap: false,
  css: {
    sourceMap: true,
    loaderOptions: {
      sass: {
        prependData: `
            @import "@/assets/styles/_variables.scss";
          `,
      },
    },
  },
};
