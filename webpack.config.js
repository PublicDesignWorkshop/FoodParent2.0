var webpack = require('webpack');
var path = require('path');

var BrowserSyncPlugin = require('browser-sync-webpack-plugin');
var CopyWebpackPlugin = require('copy-webpack-plugin');
var HistoryApiFallback = require('connect-history-api-fallback');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var ServerSetting = require('./setting/server.json');

var BUILD_DIR = path.resolve(__dirname, './dist');
var SEVER_DIR = path.resolve(__dirname, './server');
var CLIENT_DIR = path.resolve(__dirname, './client');
var SETTING_DIR = path.resolve(__dirname, './setting');
var MODULES_DIR = path.resolve(__dirname, './node_modules');

var definePlugin = new webpack.DefinePlugin({
  __DEV__: JSON.stringify(JSON.parse(process.env.BUILD_DEV || 'true'))
});

var config = {
  entry: {
    client: path.join(CLIENT_DIR, './client.js'),
    vendor: [
      "jquery",
      "leaflet",
      "leaflet.markercluster",
      "googletile"
    ],
  },
  output: {
    path: path.join(BUILD_DIR, "./js/"),
    filename: '[name]-bundle.js'
  },
  plugins: [
    definePlugin,
    new webpack.optimize.CommonsChunkPlugin(/* chunkName= */"vendor", /* filename= */"vendor-bundle.js"),
    new BrowserSyncPlugin({
      host: process.env.IP + ServerSetting.uBaseForRouter || 'localhost' + ServerSetting.uBaseForRouter,
      port: process.env.PORT || 3000,
      open: false,
      // server: {
      //   baseDir: "./",
      //   middleware: [ HistoryApiFallback() ]
      // }
      proxy: 'http://localhost'
    }),
    new ExtractTextPlugin('./../css/client-bundle.css', {
      allChunks: true
    }),
    new webpack.ProvidePlugin({
      'googletile': 'imports?this=>global!exports?googletile!googletile',
      // 'createjs': 'imports?this=>global!exports?createjs!createjs',
    }),
    new CopyWebpackPlugin([
      { from: SETTING_DIR, to: path.join(BUILD_DIR, "./setting/") },
    ])
  ],
  devtool: 'eval',
  resolve: {
    // Absolute path that contains modules
    root: __dirname,
    // Directory names to be searched for modules
    modulesDirectories: ['libraries', 'node_modules'],
    extensions: ['', '.js', '.jsx'],
    alias: {
      'googletile' : path.join(__dirname, './node_modules/leaflet-plugins/layer/tile/Google.js'),
      // 'createjs' : path.join(__dirname, './libraries/createjs.js')
    }
  },
  module : {
    loaders : [
      { test: /\.png$/, loader: "url-loader?limit=10000" },
      { test: /\.jpg$/, loader: "file-loader?limit=10000" },
      { test: /\.json$/, loader: 'json' },
      { test: /\.jsx?/, include: CLIENT_DIR, exclude: MODULES_DIR, loader: 'babel' },
      { test: /\.scss$/, loader: ExtractTextPlugin.extract('css!sass') },
      { test: /\.woff(\?v=\d+\.\d+\.\d+)?$/, loader: "url?limit=10000&mimetype=application/font-woff&name=./../font/[hash].[ext]" },
      { test: /\.woff2(\?v=\d+\.\d+\.\d+)?$/, loader: "url?limit=10000&mimetype=application/font-woff&name=./../font/[hash].[ext]" },
      { test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/, loader: "url?limit=10000&mimetype=application/octet-stream&name=./../font/[hash].[ext]" },
      { test: /\.eot(\?v=\d+\.\d+\.\d+)?$/, loader: "file?limit=10000&&name=./../font/[hash].[ext]" },
      { test: /\.svg(\?v=\d+\.\d+\.\d+)?$/, loader: "url?limit=10000&mimetype=image/svg+xml&name=./../font/[hash].[ext]" }
    ]
  }
};

module.exports = config;
