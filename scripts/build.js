const webpack = require('webpack');
const config = require('../webpack.config');
const path = require('path');
const fs = require('fs');
const PATHS = require('./paths');

let entry = {};

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

    let finalPath = copyPath.toString().replace('client_files', 'client_packages');

    if (fs.existsSync(finalPath)) {
        fs.unlinkSync(finalPath);
    }

    fs.copyFileSync(copyPath, finalPath);
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
    fs.readdirSync(path.resolve(__dirname, basePath, 'browser', 'js')).forEach(file => {
        if (fs.statSync(path.resolve(__dirname, basePath, 'browser', 'js', file)).mtime > DATE_CHANGE) {
            obfuscateFile(path.resolve(__dirname, basePath, 'browser', 'js', file))
        }
    });

    obfuscateFile(path.resolve(__dirname, basePath, 'browser', 'index.js'));
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
    if (!fs.existsSync(buildPath)) {
        fs.mkdirSync(buildPath);
    }

    if (fs.existsSync(finalPath)) {
        if (fs.existsSync(path.resolve(__dirname, finalPath, '.listcache'))) {
            DATE_CHANGE = fs.statSync(path.resolve(__dirname, finalPath, '.listcache')).mtime
        } else {
            return console.log('.listcache не найден, перезапустите сервер');
        }
    } else {
        fs.mkdirSync(finalPath);
        fs.mkdirSync(path.resolve(__dirname, finalPath, 'browser'));
        fs.mkdirSync(path.resolve(__dirname, finalPath, 'browser', 'js'));
        DATE_CHANGE = 0;
        entry.babelPolyfill = 'babel-polyfill';
    }

    wrench.copyDirSyncRecursive(basePath, buildPath, {
        forceDelete: true
    });

    obfuscateBrowserScripts();
    copyChangedBrowserFiles(path.resolve(__dirname, basePath, 'browser'));

    if (fs.statSync(path.resolve(__dirname, basePath, 'index.js')).mtime > DATE_CHANGE) {
        obfuscateFile(path.resolve(__dirname, basePath, 'index.js'));
    }

    deleteUnusedFiles(path.resolve(__dirname, finalPath));
}