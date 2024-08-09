const path = require("path");
const webpack = require("webpack");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const ReactRefreshWebpackPlugin = require("@pmmmwh/react-refresh-webpack-plugin");

const IS_PROD = process.env.NODE_ENV == "production";

console.log("==== IS_PROD:", IS_PROD);

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
          options: {
            presets: ["@babel/preset-react"],
            plugins: [
              ["@babel/plugin-proposal-decorators", { version: "2023-05" }],
              ...(IS_PROD ? [] : ["react-refresh/babel"]),
            ],
            babelrc: false,
          },
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
  devtool: "source-map",
  devServer: {
    hot: true,
    allowedHosts: "all",
  },
  plugins: [
    ...(IS_PROD ? [] : [new ReactRefreshWebpackPlugin()]),
    ...[
      miniCssExtractPlugin,
      new HtmlWebpackPlugin({
        template: "./app/index.ejs",
        filename: "index.html",
      }),
    ],
  ],
};
