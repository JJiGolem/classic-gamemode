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
let changedFiles = [];

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
            changedFiles.push('browser/js/' + file);
            obfuscateFile(path.resolve(__dirname, PATHS.basePath, 'browser', 'js', file));
        }
    });

    if (fs.statSync(path.resolve(__dirname, PATHS.basePath, 'browser', 'index.js')).mtime > DATE_CHANGE) {
        changedFiles.push('browser/js/' + file);
        obfuscateFile(path.resolve(__dirname, PATHS.basePath, 'browser', 'index.js'));
    }
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
                    changedFiles.push(updatedPath);
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

function rewriteFile(dir, file) {
    let content = fs.readFileSync(path.resolve(__dirname, PATHS.buildPath, dir, file), 'utf8').toString();

    let regImport = new RegExp(dir + '\/', 'g');
    let regExport = new RegExp(`exports`, 'g');

    if (dir != 'tuning') {
        content = content.replace(regImport, `./`);
    } else {
        content = content.replace('carshow/', '../carshow/')
    }

    content = content.replace(regExport, 'module.exports');

    fs.writeFileSync(path.resolve(__dirname, PATHS.buildPath, dir, file), content);
}

function getEntry() {
    fs.readdirSync(path.resolve(__dirname, PATHS.buildPath)).forEach(dir => {
        if (fs.lstatSync(path.resolve(__dirname, PATHS.buildPath, dir)).isDirectory() && !ignoreModules.includes(dir)) {
            let directory = fs.readdirSync(path.resolve(__dirname, PATHS.buildPath, dir));
            let isChange = false;

            directory.forEach(file => {
                if (fs.statSync(path.resolve(__dirname, PATHS.basePath, dir, file)).mtime > DATE_CHANGE) {
                    isChange = true;
                }
            })

            if (isChange) {
                directory.forEach(file => {
                    rewriteFile(dir, file);
                });

                changedFiles.push(`${dir}/index.js`);
                entry[`${dir}/index`] = `./client_build/${dir}/index.js`;
            }
        }
    });
}

copyOnlyChangedFiles();
getEntry();

if (Object.keys(entry).length > 0) {
    config.entry = entry;
    let compiler = webpack(config);

    compiler.run((err, stats) => {
        if (err) console.log(err);

        console.log('CHANGED FILES: ', changedFiles.length);
        changedFiles.forEach(file => {
            console.log(file);
        });

    });
} else {
    if (fs.existsSync(path.resolve(__dirname, PATHS.buildPath))) {
        rimraf.sync(path.resolve(__dirname, PATHS.buildPath));
    }
    console.log('CHANGED FILES: ', changedFiles.length);
    changedFiles.forEach(file => {
        console.log(file);
    });
    console.log('Webpack не был запущен, поскольку изменений в клиентских файлах, кроме браузера, нет');
}