module.exports = {
  transpileDependencies: ["vuetify"],
  devServer: {
    proxy: {
      "/pet-care": {
        target: "http://localhost:3000",
        ws: true,
        changeOrigin: true,
      },
    },
  },
};
