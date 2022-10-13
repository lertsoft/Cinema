const preprocess = require('svelte-preprocess');

module.exports = {
  extensions: ['.svelte'],
  preprocess: preprocess({
    defaults: {
      css: 'postcss',
    },
    postcss: true,
  }),
};


