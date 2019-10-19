const webpack = require('webpack');
const config = require('../webpack.config');
const Plugin = require('./plugin');

module.exports = {
    async run(callback) {
        config.plugins.push(new Plugin(callback))
        let compiler = webpack(config);

        await compiler.run((err, stats) => {
            console.log('run build');

            // callback();
        })
    }
}