module.exports = {
  module: {
    rules: [
      // ... other rules

      // this will apply to both plain `.scss` files
      // AND `<style lang="scss">` blocks in `.vue` files
      {
        test: /\.scss$/,
        use: [
          'vue-style-loader',
          'css-loader',
          'sass-loader',
        ],
      },
      // Using this because Vue said so? Guess it solves some issues.
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: (file) => (
          /node_modules/.test(file)
          && !/\.vue\.js/.test(file)
        ),
      },
    ],
  },
  // plugin omitted
};
