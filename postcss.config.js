module.exports = {
    plugins: {
      'postcss-import': {},
      'postcss-extend-rule': {},
      'postcss-preset-env': {
        features: {
          'nesting-rules': true,
          'focus-within-pseudo-class': false,
        },
      },
    },
  };
  