const { getDefaultConfig } = require('expo/metro-config');

const defaultConfig = getDefaultConfig(__dirname);

// Add WebP to the list of asset extensions
defaultConfig.resolver.assetExts.push('webp');

module.exports = defaultConfig; 