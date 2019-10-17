const path = require('path');
const fs = require('fs');
const rimraf = require('rimraf');
const FilesPlugin = require('./scripts/plugin');
const wrench = require('wrench');
const obfuscator = require('javascript-obfuscator');

const PATHS = require('./scripts/paths');

require('babel-core').transform("code", {
    plugins: ["transform-remove-strict-mode"]
});

require('babel-polyfill');

let entry = {};

let DATE_CHANGE = null;

let ignoreModules = ['browser'];

const copyPath = './client_build';
const basePath = './client_files';
const finalPath = './client_packages';

function copyFiles() {
    if (!fs.existsSync(copyPath)) {
        fs.mkdirSync(copyPath);
    }

    if (fs.existsSync(finalPath)) {
        DATE_CHANGE = fs.statSync(path.resolve(__dirname, finalPath, '.listcache')).mtime
    } else {
        fs.mkdirSync(finalPath);
        DATE_CHANGE = 0;
        entry.babelPolyfill = 'babel-polyfill';
    }

    if (!fs.existsSync(`./client_packages/browser`)) {
        fs.mkdirSync(`./client_packages/browser`);
    }

    wrench.copyDirSyncRecursive(basePath, copyPath, {
        forceDelete: true
    });

    wrench.copyDirSyncRecursive(`${basePath}/browser`, `${finalPath}/browser`, {
        forceDelete: true
    });

    fs.readdirSync(`${finalPath}/browser/js`).forEach(file => {
        let result = obfuscator.obfuscate(
            fs.readFileSync(`${finalPath}/browser/js/${file}`, 'utf8').toString(),
            {
                compact: true,
                controlFlowFlattening: true
            }
        );

        fs.writeFileSync(`${finalPath}/browser/js/${file}`, result.getObfuscatedCode());
    })

    fs.copyFileSync(`${basePath}/index.js`, `${finalPath}/index.js`);

    let indexResult = obfuscator.obfuscate(
        fs.readFileSync(`${finalPath}/index.js`, 'utf8').toString(),
        {
            compact: true,
            controlFlowFlattening: true
        }
    );

    fs.writeFileSync(`${finalPath}/index.js`, indexResult.getObfuscatedCode());
}

function getEntry() {

    copyFiles();

    console.log(DATE_CHANGE);

    fs.readdirSync(copyPath).forEach(dir => {
        if (fs.lstatSync(path.resolve(copyPath, dir)).isDirectory() && !ignoreModules.includes(dir)) {
            let directory = fs.readdirSync(path.resolve(__dirname, copyPath, dir));
            let isChange = false;

            directory.forEach(file => {
                if (fs.statSync(path.resolve(__dirname, basePath, dir, file)).mtime > DATE_CHANGE) {
                    console.log(`${dir}/${file}: `, fs.statSync(path.resolve(__dirname, basePath, dir, file)).mtime);

                    isChange = true;
                }
            })

            if (isChange) {
                directory.forEach(file => {
                    rewriteFile(dir, file);
                });

                entry[`${dir}/index`] = `${copyPath}/${dir}/index.js`;
            }
        }
    });

    console.log(entry);
    return entry;
}

function rewriteFile(dir, file) {
    let content = fs.readFileSync(path.resolve(__dirname, copyPath, dir, file), 'utf8').toString();

    let regImport = new RegExp(dir + '\/', 'g');
    let regExport = new RegExp(`exports`, 'g');

    if (dir != 'tuning') {
        content = content.replace(regImport, `./`);
    } else {
        content = content.replace('carshow/', '../carshow/')
    }

    content = content.replace(regExport, 'module.exports');

    fs.writeFileSync(path.resolve(copyPath, dir, file), content);
}

let config = {
    entry: getEntry(),
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