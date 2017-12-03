var path = require('path')
var webpack = require('webpack')
var express = require('express')

var config = require('./webpack.config')

var port = 3000
var publicPath = '/dist/'

var entry = config.entry;
for (var key in entry) {
  if (key.startsWith('load')) {
    console.warn("hotLoading:", key)
    entry[key] = [
      'webpack-hot-middleware/client?path=http://localhost:' + port + '/__webpack_hmr',
      'react-hot-loader/patch',
      entry[key]]
  }
}
config.module.rules[0].use.options.plugins.push('react-hot-loader/babel')
config.plugins.push(new webpack.HotModuleReplacementPlugin())
config.plugins.push(new webpack.WatchIgnorePlugin([
  path.resolve(__dirname, '../node_modules/')
]))

config.output.publicPath = 'http://localhost:' + port + publicPath
var compiled = webpack(config)
var app = express()

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  next();
});

app.use(require('webpack-dev-middleware')(compiled, {
  noInfo: true,
  publicPath: publicPath
}))

app.use(require('webpack-hot-middleware')(compiled))

//app.get('/', function(req, res) { res.sendFile(path.resolve(__dirname, 'chrome_ext/front/index.html')) });

//app.use('/', express.static('chrome_ext/'))


app.listen(port, 'localhost', function(err) {
  if (err)
    return console.error(err)
  console.log('HotLoader running on port', port)
})
