const path = require('path')
const webpack = require('webpack')

module.exports = {
  entry: {
    loadApp: './loadApp'
  },
  output: {
    path: path.resolve(__dirname, 'chrome_ext/dist'),
    filename: '[name].js',
    library: '[name]'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [ // order matters (runs last to first)
              ['es2015', { modules: false }],
              'stage-2',
              'react'
            ],
            plugins: [
              "transform-decorators-legacy" // for Mobx decorators like @observer
            ],
            babelrc: false
          }
        }
      }
    ]
  },
  resolve: {
    alias: {
      '~': path.resolve(__dirname)
    },
    extensions: ['.js']
  },
  devtool: 'eval',
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
    }),
  ]
}
