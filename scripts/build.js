const webpack = require('webpack');
const config = require('../webpack.config');
const path = require('path');
const fs = require('fs');
const wrench = require('wrench');
const rimraf = require('rimraf');
const obfuscator = require('javascript-obfuscator');
const PATHS = require('./paths');

let entry = {};

let DATE_CHANGE = null;

let ignoreModules = ['browser'];

function deleteUnusedFiles(currentPath) {
    fs.readdirSync(currentPath).forEach(item => {
        let updatePath = path.resolve(currentPath, item);
        let baseCurrentPath = updatePath.replace('client_packages', 'client_files');

        if (fs.existsSync(baseCurrentPath)) {
            if (fs.lstatSync(updatePath).isDirectory()) {
                deleteUnusedFiles(updatePath);
            }
        } else if (item != '.listcache') {
           rimraf.sync(updatePath);
        }
    });
}

function copyFile(copyPath) {

    let finalFilePath = copyPath.toString().replace('client_files', 'client_packages');

    if (fs.existsSync(finalFilePath)) {
        fs.unlinkSync(finalFilePath);
    }

    fs.copyFileSync(copyPath, finalFilePath);
}

function obfuscateFile(filePath) {
    let finalFilePath = filePath.toString().replace('client_files', 'client_packages');

    let result = obfuscator.obfuscate(
    fs.readFileSync(filePath, 'utf8').toString(),
        {
            compact: true,
            controlFlowFlattening: true
        }
    );

    fs.writeFileSync(finalFilePath, result.getObfuscatedCode());
}

function obfuscateBrowserScripts() {
    fs.readdirSync(path.resolve(__dirname, PATHS.basePath, 'browser', 'js')).forEach(file => {
        if (fs.statSync(path.resolve(__dirname, PATHS.basePath, 'browser', 'js', file)).mtime > DATE_CHANGE) {
            obfuscateFile(path.resolve(__dirname, PATHS.basePath, 'browser', 'js', file))
        }
    });

    obfuscateFile(path.resolve(__dirname, PATHS.basePath, 'browser', 'index.js'));
}


function copyChangedBrowserFiles(currentPath) {
    fs.readdirSync(currentPath).forEach(item => {
        if (item != 'js' && item != 'index.js') {
            let updatedPath = path.resolve(currentPath, item);
            if (fs.lstatSync(updatedPath).isDirectory()) {
                let finalPahDir = updatedPath.replace('client_files', 'client_packages');
                if (!fs.existsSync(finalPahDir)) {
                    fs.mkdirSync(finalPahDir)
                }
                copyChangedBrowserFiles(updatedPath);
            } else {
                if (fs.statSync(updatedPath).mtime > DATE_CHANGE) {
                    copyFile(updatedPath);
                }
            }
        }
    });
}

function copyOnlyChangedFiles() {
    if (!fs.existsSync(path.resolve(__dirname, PATHS.buildPath))) {
        fs.mkdirSync(path.resolve(__dirname, PATHS.buildPath));
    }

    if (fs.existsSync(path.resolve(__dirname, PATHS.finalPath))) {
        if (fs.existsSync(path.resolve(__dirname, PATHS.finalPath, '.listcache'))) {
            DATE_CHANGE = fs.statSync(path.resolve(__dirname, PATHS.finalPath, '.listcache')).mtime
        } else {
            return console.log('.listcache не найден, перезапустите сервер');
        }
    } else {
        fs.mkdirSync(path.resolve(__dirname, PATHS.finalPath));
        fs.mkdirSync(path.resolve(__dirname, PATHS.finalPath, 'browser'));
        fs.mkdirSync(path.resolve(__dirname, PATHS.finalPath, 'browser', 'js'));
        DATE_CHANGE = 0;
        entry.babelPolyfill = 'babel-polyfill';
    }

    wrench.copyDirSyncRecursive(path.resolve(__dirname, PATHS.basePath), path.resolve(__dirname, PATHS.buildPath), {
        forceDelete: true
    });

    obfuscateBrowserScripts();
    copyChangedBrowserFiles(path.resolve(__dirname, PATHS.basePath, 'browser'));

    if (fs.statSync(path.resolve(__dirname, PATHS.basePath, 'index.js')).mtime > DATE_CHANGE) {
        obfuscateFile(path.resolve(__dirname, PATHS.basePath, 'index.js'));
    }

    deleteUnusedFiles(path.resolve(__dirname, PATHS.finalPath));
}

function getEntry() {

    copyOnlyChangedFiles();

    fs.readdirSync(PATHS.buildPath).forEach(dir => {
        if (fs.lstatSync(path.resolve(PATHS.buildPath, dir)).isDirectory() && !ignoreModules.includes(dir)) {
            let directory = fs.readdirSync(path.resolve(__dirname, PATHS.buildPath, dir));
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

                entry[`${dir}/index`] = `${PATHS.buildPath}/${dir}/index.js`;
            }
        }
    });
}

getEntry();

if (Object.keys(entry).length > 0) {
    config.entry = entry;
    let compiler = webpack(config);

    compiler.run((err, stats) => {
        console.log('webpack run');
    });
} else {
    console.log('Webpack не был запущен, посколько узменений в клиентских файлах, кроме браузера, нет');
}