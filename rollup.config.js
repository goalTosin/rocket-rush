module.exports =  [
  {
    input: 'js/index.js',
    output: {
      file: 'build/bundle.min.js',
      format: 'iife',
      plugins: [
        require('@rollup/plugin-terser')()
      ]
    }
  }
];
