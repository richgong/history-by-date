const path = require("path");
const webpack = require("webpack");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const ReactRefreshWebpackPlugin = require("@pmmmwh/react-refresh-webpack-plugin");

const IS_PROD = process.env.NODE_ENV == "production";

const miniCssExtractPlugin = new MiniCssExtractPlugin({
  filename: "[name].css",
});

module.exports = {
  entry: {
    loadApp: "./app/loadApp",
  },
  output: {
    path: path.resolve(__dirname, "chrome_ext/dist"),
    filename: "[name].js",
    library: "[name]",
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
        },
      },
      {
        test: /\.less$/,
        use: [
          IS_PROD ? MiniCssExtractPlugin.loader : "style-loader",
          "css-loader",
          "less-loader",
        ],
      },
      {
        test: /\.css$/,
        use: [
          IS_PROD ? MiniCssExtractPlugin.loader : "style-loader",
          "css-loader",
        ],
      },
      {
        test: /\.(png|jpe?g|gif|htm|html|woff2?|eot|ttf|otf|svg)(\?.*)?$/,
        use: {
          loader: "file-loader",
          options: {
            name: "[path][name].[ext]",
          },
        },
      },
    ],
  },
  resolve: {
    alias: {
      "~": path.resolve(__dirname),
    },
    extensions: [".js", ".jsx"],
  },
  devtool: "eval",
  devServer: {
    hot: true,
    allowedHosts: "all",
  },
  plugins: [
    miniCssExtractPlugin,
    IS_PROD ? null : new ReactRefreshWebpackPlugin(),
    new HtmlWebpackPlugin({
      template: "./app/index.ejs",
      filename: "index.html",
    }),
  ],
};
