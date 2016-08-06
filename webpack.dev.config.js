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

var configs = require('./webpack.config');

var config = {
  entry: {
    client: path.join(CLIENT_DIR, './client.js'),
    vendor: configs.vendorList
  },
  output: {
    path: path.join(BUILD_DIR, "./js/"),
    filename: '[name]-bundle.js'
  },
  plugins: configs.corePluginList.concat(configs.devPluginList),
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
    loaders : configs.loaderList
  }
};

module.exports = config;
