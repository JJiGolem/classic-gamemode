const path = require('path');
const FilesPlugin = require('./scripts/plugin');

require('babel-core').transform("code", {
    plugins: ["transform-remove-strict-mode"]
});

require('babel-polyfill');

const finalPath = 'client_packages';

let config = {
    output: {
        path: path.resolve(__dirname, finalPath),
        filename: '[name].js',
        publicPath: ''
    },
    module: {
        rules: [{
            test: /\.js$/,
            loader: 'babel-loader',
            exclude: ['/node_modules/', '/build/']
        }]
    },
    plugins: [
        new FilesPlugin()
    ],
    devtool: false
};

module.exports = config;