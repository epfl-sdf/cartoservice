const webpack = require('webpack')

module.exports = {
  entry: './index.js',
  output: {
    path: 'public',
    filename: 'bundle.js',
    publicPath: '/'
  },
  resolve: {
    extensions: ['', '.jsx', '.js'] // along the way, subsequent file(s) to be consumed by webpack
  },
  plugins: process.env.NODE_ENV === 'production' ? [
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.optimize.UglifyJsPlugin()
  ] : [],
  module: {
    loaders: [
      { test: /\.js$/, exclude: [/node_modules/, /flexboxgrid/], loader: 'babel-loader?presets[]=es2015&presets[]=react' }
    ]
  }
}
