const webpack = require('webpack');
const config = require('../webpack.config');
const path = require('path');
const fs = require('fs');

let entry = {};



let compiler = webpack(config);

compiler.run((err, stats) => {
    
});