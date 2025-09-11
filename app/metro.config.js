const { getDefaultConfig } = require('@expo/metro-config');

const config = getDefaultConfig(__dirname);

config.resolver.alias = {
  '@': './src',
};

// 添加以下配置以解决 protocol 属性问题
config.resolver.sourceExts = ['jsx', 'js', 'ts', 'tsx', 'json'];
config.transformer.minifierPath = 'metro-minify-terser';
config.resolver.assetExts = ['bmp', 'gif', 'jpg', 'jpeg', 'png', 'psd', 'svg', 'webp', 'ttf'];

module.exports = config;
