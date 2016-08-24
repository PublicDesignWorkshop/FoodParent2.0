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
var LIBRARIES_DIR = path.resolve(__dirname, './libraries');
var MODULES_DIR = path.resolve(__dirname, './node_modules');

var devDefinePlugin = new webpack.DefinePlugin({
  __DEV__: true,
  L_PREFER_CANVAS: true,
});

var productionDefinePlugin = new webpack.DefinePlugin({
  __DEV__: false,
  "process.env": {
     NODE_ENV: JSON.stringify("production")
   },
   L_PREFER_CANVAS: true,
});

var vendorList = [
  "jquery",
  "leaflet",
  "leaflet.markercluster",
  "leaflet-canvas-marker",
  "googletile",
  "image-preloader-promise",
  "underscore",
  "moment",
  "react-fontawesome",
  "react-tooltip",
  "react-select",
  "react-textarea-autosize",
  "react-tooltip",
  "react-image-gallery",
  "iscroll"
];

var corePluginList = [
  new webpack.optimize.CommonsChunkPlugin(/* chunkName= */"vendor", /* filename= */"vendor-bundle.js"),
  new webpack.ProvidePlugin({
    'googletile': 'imports?this=>global!exports?googletile!googletile',
    'leaflet-canvas-marker': 'imports?this=>global!exports?leaflet-canvas-marker!leaflet-canvas-marker',
    'iscroll': 'imports?this=>global!exports?iscroll!iscroll',
    // 'chartjs': 'imports?this=>global!exports?chartjs!chartjs',
    // 'createjs': 'imports?this=>global!exports?createjs!createjs',
  }),
  new CopyWebpackPlugin([
    { from: SETTING_DIR, to: path.join(BUILD_DIR, "./setting/") },
    { from: path.join(LIBRARIES_DIR, "./chart-core.js"), to: path.join(BUILD_DIR, "./js/chart-core.js") },
    { from: path.join(LIBRARIES_DIR, "./chart-scatter.js"), to: path.join(BUILD_DIR, "./js/chart-scatter.js") },
  ])
];

var devPluginList = [
  devDefinePlugin,
  new ExtractTextPlugin('./../css/client-bundle.css', {
    allChunks: true
  }),
  new BrowserSyncPlugin({
    host: process.env.IP + ServerSetting.uBaseForRouter || 'localhost' + ServerSetting.uBaseForRouter,
    port: process.env.PORT || 3000,
    open: false,
    // server: {
    //   baseDir: "./",
    //   middleware: [ HistoryApiFallback() ]
    // }
    proxy: 'http://localhost'
  })
];

var productionPluginList = [
  productionDefinePlugin,
  new ExtractTextPlugin('./../css/broken-bundle.css', {
    allChunks: true
  }),
  new webpack.optimize.DedupePlugin(),
  new webpack.optimize.UglifyJsPlugin({
    // sourceMap: false,
    compress: {
      warnings: false,
      properties: true,
      sequences: true,
      dead_code: true,
      conditionals: true,
      comparisons: true,
      evaluate: true,
      booleans: true,
      unused: true,
      loops: true,
      hoist_funs: true,
      cascade: true,
      if_return: true,
      join_vars: true,
      //drop_console: true,
      drop_debugger: true,
      unsafe: true,
      hoist_vars: true,
      negate_iife: true,
      //side_effects: true
    },
    mangle: {
      toplevel: true,
      sort: true,
      eval: true,
      properties: true
    },
    output: {
      space_colon: false,
      comments: function(node, comment) {
        var text = comment.value;
        var type = comment.type;
        if (type == "comment2") {
          // multiline comment
          return /@copyright/i.test(text);
        }
      }
    }
  })
];

var loaderList = [
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
];

module.exports = {
    vendorList: vendorList,
    corePluginList: corePluginList,
    devPluginList: devPluginList,
    productionPluginList: productionPluginList,
    loaderList: loaderList,
}
