var path = require('path'),
    webpack = require('webpack');

module.exports = {
    devtool: 'eval-source-map',
    entry: {
        main: [
            './examples/index.js'
        ]
    },
    output: {
        filename: 'bundle.js',
        path: path.join(__dirname, 'examples')
    },
    module: {
        loaders: [
            {
                test: /\.js$/,
                exclude: /(node_modules|bower_components)/,
                loader: 'babel'
            }
        ]
    },
    stats: {
        errorDetails: true
    }
};