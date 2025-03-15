const createExpoWebpackConfigAsync = require('@expo/webpack-config');
const path = require('path');

module.exports = async function (env, argv) {
  const config = await createExpoWebpackConfigAsync(
    {
      ...env,
      babel: {
        dangerouslyAddModulePathsToTranspile: ['@ui-kitten/components']
      }
    },
    argv
  );

  // Customize the config for GitHub Pages
  config.output.publicPath = './';

  // Fix asset paths
  if (config.module && config.module.rules) {
    config.module.rules.forEach(rule => {
      if (rule.oneOf) {
        rule.oneOf.forEach(oneOfRule => {
          if (oneOfRule.use && Array.isArray(oneOfRule.use)) {
            oneOfRule.use.forEach(loader => {
              if (loader.loader && loader.loader.includes('file-loader')) {
                if (loader.options) {
                  loader.options.name = '[name].[ext]';
                  loader.options.outputPath = 'static/media/';
                  loader.options.publicPath = '../static/media/';
                }
              }
            });
          }
        });
      }
    });
  }

  // Add a plugin to create .nojekyll file
  config.plugins.push({
    apply: (compiler) => {
      compiler.hooks.afterEmit.tap('CreateNoJekyllFile', (compilation) => {
        const fs = require('fs');
        const outputPath = compilation.outputOptions.path;
        const noJekyllPath = path.join(outputPath, '.nojekyll');
        fs.writeFileSync(noJekyllPath, '');
      });
    }
  });

  return config;
}; 