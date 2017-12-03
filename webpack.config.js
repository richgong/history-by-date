const path = require('path')
const webpack = require('webpack')
const ExtractTextPlugin = require("extract-text-webpack-plugin")
const HtmlWebpackPlugin = require('html-webpack-plugin')


const IS_PROD = (process.env.NODE_ENV == 'production')

const extractText = new ExtractTextPlugin({
  filename: "[name].css",
  disable: !IS_PROD
});

module.exports = {
  entry: {
    loadApp: './app/loadApp'
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
      },
      {
        test: /\.less$/,
        use: extractText.extract({
          use: [{
            loader: "css-loader"
          }, {
            loader: "less-loader"
          }],
          // use style-loader in development
          fallback: "style-loader"
        })
      },
      {
        test: /\.css$/,
        use: extractText.extract({
          use: [{
            loader: "css-loader"
          }],
          // use style-loader in development
          fallback: "style-loader"
        })
      },
      {
        test: /\.(png|jpe?g|gif|htm|html|woff2?|eot|ttf|otf|svg)(\?.*)?$/,
        use: {
          loader: 'file-loader',
          options: {
            name: '[path][name].[ext]'
          }
        }
      },
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
    extractText,
    new HtmlWebpackPlugin({
      template: './app/index.ejs',
      filename: 'index.html'
    })
  ]
}
