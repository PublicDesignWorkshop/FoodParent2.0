var path = require('path');
var webpack = require('webpack');
var CopyWebpackPlugin = require('copy-webpack-plugin');
var Settings = require('./src/constraints/settings.json');
var BrowserSyncPlugin = require('browser-sync-webpack-plugin');
var HistoryApiFallback = require('connect-history-api-fallback');

module.exports = {
  entry: "./src/client.js",
  output: {
    filename: "foodparent.js",
    path: __dirname + "/dist",
    publicPath: Settings.uBaseNameForWebPack + "dist/",
  },
  plugins: [
    // In case you want to use browsersync to refresh page whenever you change files.
    // new BrowserSyncPlugin({
    //   proxy: process.env.IP || 'localhost',
    //   open:  true,
    // }),
    new webpack.ProvidePlugin({
      'googletile': 'imports?this=>global!exports?googletile!googletile',
    }),
    new CopyWebpackPlugin([
      { from: './src/constraints/settings.json', to: __dirname + "/dist" },
    ])
  ],
  resolve: {
    // Absolute path that contains modules
    root: __dirname,
    // Directory names to be searched for modules
    modulesDirectories: ['lib', 'node_modules'],
    alias: {
      'googletile' : path.join(__dirname, './node_modules/leaflet-plugins/layer/tile/Google.js'),
    }
  },
  devtool: 'eval',
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: "babel-loader",
        publicPath: '../',
        query: {
          presets: ['es2015', 'react']
        }
      },
      { test: /\.json$/, loader: 'json' },
      { test: /\.css$/, loader: "style-loader!css-loader" },
      { test: /\.png$/, loader: "url-loader?limit=100000" },
      { test: /\.jpg$/, loader: "file-loader" },
      { test: /\.woff(\?v=\d+\.\d+\.\d+)?$/, loader: "url?limit=10000&mimetype=application/font-woff" },
      { test: /\.woff2(\?v=\d+\.\d+\.\d+)?$/, loader: "url?limit=10000&mimetype=application/font-woff" },
      { test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/, loader: "url?limit=10000&mimetype=application/octet-stream" },
      { test: /\.eot(\?v=\d+\.\d+\.\d+)?$/, loader: "file" },
      { test: /\.svg(\?v=\d+\.\d+\.\d+)?$/, loader: "url?limit=10000&mimetype=image/svg+xml" }
    ],
  },
}
