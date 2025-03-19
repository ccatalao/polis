module.exports = {
  name: "Polis",
  slug: "polis",
  web: {
    bundler: "metro",
    build: {
      publicPath: "/polis/"  // This is critical for GitHub Pages deployment
    },
    router: {
      origin: "https://ccatalao.github.io",
      basePath: "/polis"
    }
  },
  plugins: [
    [
      "expo-router",
      {
        origin: "https://ccatalao.github.io/polis",
        asyncRoutes: false // This is important for static exports
      }
    ]
  ]
};