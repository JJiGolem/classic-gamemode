const webpack = require('webpack');
const config = require('../webpack.config');
const path = require('path');
const fs = require('fs');
const wrench = require('wrench');
const rimraf = require('rimraf');
const obfuscator = require('javascript-obfuscator');
const PATHS = require('./paths');
require('babel-polyfill');

let entry = {
    babelPolyfill: 'babel-polyfill'
};
let buildDirectory;

let DATE_CHANGE = null;

let ignoreModules = ['attaches', 'dlcpacks'];
let ignoreFiles = [ '.listcache', 'babelPolyfill.js' ];
let changedFiles = [];

function deleteUnusedFiles(currentPath) {
    fs.readdirSync(currentPath).forEach(item => {
        let updatePath = path.resolve(currentPath, item);
        let baseCurrentPath = updatePath.replace('client_packages', 'client_files');

        if (fs.existsSync(baseCurrentPath)) {
            if (fs.lstatSync(updatePath).isDirectory()) {
                deleteUnusedFiles(updatePath);
            }
        } else if (!ignoreFiles.includes(item)) {
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
        changedFiles.push('browser/js/index.js');
        obfuscateFile(path.resolve(__dirname, PATHS.basePath, 'browser', 'index.js'));
    }
}


function copyChangedBrowserFiles(currentPath) {
    fs.readdirSync(currentPath).forEach(item => {
        if (currentPath !== path.resolve(__dirname, PATHS.basePath, 'browser', 'js') && item != 'index.js') {
            let updatedPath = path.resolve(currentPath, item);
            if (fs.lstatSync(updatedPath).isDirectory()) {
                let finalPathDir = updatedPath.replace('client_files', 'client_packages');
                if (!fs.existsSync(finalPathDir)) {
                    fs.mkdirSync(finalPathDir)
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

function copyFolderRecursive(folderPath) {
    fs.readdirSync(folderPath).forEach(item => {
        let updatedPath = path.resolve(folderPath, item);
        if (fs.lstatSync(updatedPath).isDirectory()) {
            let finalPahDir = updatedPath.replace('client_files', 'client_packages');
            if (!fs.existsSync(finalPahDir)) {
                fs.mkdirSync(finalPahDir)
            }
            copyFolderRecursive(updatedPath);
        } else {
            if (fs.statSync(updatedPath).mtime > DATE_CHANGE || !fs.existsSync(updatedPath.replace('client_files', 'client_packages'))) {
                changedFiles.push(updatedPath);
                copyFile(updatedPath);
            }
        }
    });
}

function copyIgnoreModules() {
    ignoreModules.forEach(module => {
        if (!fs.existsSync(path.resolve(__dirname, PATHS.finalPath, module))) {
            fs.mkdirSync(path.resolve(__dirname, PATHS.finalPath, module));
        }
        copyFolderRecursive(path.resolve(__dirname, PATHS.basePath, module));
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
    }

    wrench.copyDirSyncRecursive(path.resolve(__dirname, PATHS.basePath), path.resolve(__dirname, PATHS.buildPath), {
        forceDelete: true
    });

    copyIgnoreModules();

    obfuscateBrowserScripts();
    copyChangedBrowserFiles(path.resolve(__dirname, PATHS.basePath, 'browser'));

    if (fs.statSync(path.resolve(__dirname, PATHS.basePath, 'index.js')).mtime > DATE_CHANGE) {
        obfuscateFile(path.resolve(__dirname, PATHS.basePath, 'index.js'));
    }

    deleteUnusedFiles(path.resolve(__dirname, PATHS.finalPath));

    console.log('[WEBPACK] COPY DONE');
}

function rewriteFile(dir, file) {
    let content = fs.readFileSync(path.resolve(__dirname, PATHS.buildPath, dir, file), 'utf8').toString();

    let regImport = new RegExp(dir + '\/', 'g');
    let regExport = new RegExp(`exports`, 'g');

    content = content.replace(regImport, `./`);

    buildDirectory.forEach(module => {
        if (module !== dir) {
            content = content.replace(`require('${module}`, `require('../${module}`);
        }
    });

    content = content.replace(regExport, 'module.exports');

    fs.writeFileSync(path.resolve(__dirname, PATHS.buildPath, dir, file), content);
}

function getEntry() {
    buildDirectory = fs.readdirSync(path.resolve(__dirname, PATHS.buildPath));
    
    buildDirectory.forEach(dir => {
        if (fs.lstatSync(path.resolve(__dirname, PATHS.buildPath, dir)).isDirectory() && !ignoreModules.includes(dir) && dir != 'browser') {
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

    console.log('[WEBPACK] ENTRIES CREATE');
}

copyOnlyChangedFiles();
getEntry();

if (Object.keys(entry).length > 0) {
    config.entry = entry;
    console.log(config);
    let compiler = webpack(config);

    compiler.run((err, stats) => {
        if (err) console.log(err);

        console.log('CHANGED FILES: ', changedFiles.length);
    });
} else {
    if (fs.existsSync(path.resolve(__dirname, PATHS.buildPath))) {
        rimraf.sync(path.resolve(__dirname, PATHS.buildPath));
    }
    console.log('CHANGED FILES: ', changedFiles.length);
    console.log('Webpack не был запущен, поскольку изменений в клиентских файлах, кроме браузера, нет');
}