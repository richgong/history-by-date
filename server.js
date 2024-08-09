const express = require('express');
const webpack = require('webpack');
const path = require('path');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');
const webpackConfig = require('./webpack.config.js');

const app = express();
const mode = process.env.NODE_ENV || 'development'; // Set mode based on NODE_ENV
webpackConfig.mode = mode; // Pass mode to webpack config
const compiler = webpack(webpackConfig);

// Use webpack-dev-middleware
app.use(
  webpackDevMiddleware(compiler, {
    publicPath: webpackConfig.output.publicPath,
  })
);

// Use webpack-hot-middleware
app.use(webpackHotMiddleware(compiler));

// Serve static files from the chrome_ext directory
app.use(express.static(path.join(__dirname, 'chrome_ext')));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`===== Server is running on http://localhost:${PORT} in ${mode} mode`);
});