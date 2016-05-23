var path = require('path');
var webpack = require('webpack');
var Settings = require('./src/constraints/settings.json');

module.exports = {
  entry: "./src/client.js",
  output: {
    filename: "foodparent.js",
    path: __dirname + "/dist",
  },
  plugins: [
    new webpack.ProvidePlugin({
      'googletile': 'imports?this=>global!exports?googletile!googletile',
    })
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
      { test: /\.woff(\?v=\d+\.\d+\.\d+)?$/, loader: "url?limit=10000&mimetype=application/font-woff&name=" + Settings.uBaseNameForWebPack + "dist/[name].[ext]" },
      { test: /\.woff2(\?v=\d+\.\d+\.\d+)?$/, loader: "url?limit=10000&mimetype=application/font-woff&name=" + Settings.uBaseNameForWebPack + "dist/[name].[ext]" },
      { test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/, loader: "url?limit=10000&mimetype=application/octet-stream&name=" + Settings.uBaseNameForWebPack + "dist/[name].[ext]" },
      { test: /\.eot(\?v=\d+\.\d+\.\d+)?$/, loader: "file?name=" + Settings.uBaseNameForWebPack + "dist/[name].[ext]" },
      { test: /\.svg(\?v=\d+\.\d+\.\d+)?$/, loader: "url?limit=10000&mimetype=image/svg+xml&name=" + Settings.uBaseNameForWebPack + "dist/[name].[ext]" }
    ],
  },
}
