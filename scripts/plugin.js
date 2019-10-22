const rimraf = require('rimraf');
const PATHS = require('./paths');
const path = require('path');

module.exports = class FilesPlugin {
    constructor(options) {
        this.options = options;
    }

    apply(compiler) {
        compiler.hooks.beforeRun.tap('FilesPlugin', () => {
            console.log('before');
        });

        compiler.hooks.done.tap('FilesPlugin', () => {
            console.log('done');
            rimraf.sync(path.resolve(__dirname, PATHS.buildPath));
        });

        compiler.hooks.failed.tap('FilesPlugin', () => {
            console.log('fail');
            rimraf.sync(path.resolve(__dirname, PATHS.buildPath));
        });
    }
};