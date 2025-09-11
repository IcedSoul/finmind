const { getDefaultConfig } = require('@expo/metro-config');
const path = require('path');

const config = getDefaultConfig(__dirname);

// Web平台polyfill
config.resolver.alias = {
  ...config.resolver.alias,
  'react-native$': 'react-native-web',
};

config.transformer.getTransformOptions = async () => ({
  transform: {
    experimentalImportSupport: false,
    inlineRequires: true,
  },
});

// 路径别名
config.resolver.alias = {
  ...config.resolver.alias,
  '@': './src',
};

// 文件扩展支持
config.resolver.sourceExts = ['jsx', 'js', 'ts', 'tsx', 'json'];

// 图片/字体资源支持
config.resolver.assetExts = [
  'bmp',
  'gif',
  'jpg',
  'jpeg',
  'png',
  'psd',
  'svg',
  'webp',
  'ttf',
];

// 自定义压缩器
config.transformer.minifierPath = 'metro-minify-terser';

// 解决protocol错误的配置
config.resolver.resolverMainFields = ['react-native', 'browser', 'main'];
config.resolver.platforms = ['ios', 'android', 'native', 'web'];

module.exports = config;
