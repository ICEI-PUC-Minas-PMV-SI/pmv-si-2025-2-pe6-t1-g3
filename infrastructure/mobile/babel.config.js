module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        'module-resolver',
        {
          root: ['./src'],
          extensions: ['.js', '.jsx', '.json'],
          alias: {
            '@': './src',
            '@components': './src/components',
            '@screens': './src/screens',
            '@services': './src/services',
            '@contexts': './src/contexts',
            '@hooks': './src/hooks',
            '@utils': './src/utils',
            '@theme': './src/theme',
            '@navigation': './src/navigation'
          }
        }
      ]
    ]
  };
};

