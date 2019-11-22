const path = require('path');
const fs = require('fs');
const wrench = require('wrench');
const rimraf = require('rimraf');
const PATHS = require('./paths');

let changedFiles = [];
let files = [];
let ignoreFiles = [ '.listcache', 'babelPolyfill.js' ];

let DATE_CHANGE = null;

function copyAllFiles() {
    fs.mkdirSync(path.resolve(__dirname, PATHS.finalPath));
    wrench.copyDirSyncRecursive(path.resolve(__dirname, PATHS.basePath), path.resolve(__dirname, PATHS.finalPath), { forceDelete: true });
}

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

    let finalPath = copyPath.toString().replace('client_files', 'client_packages');

    if (fs.existsSync(finalPath)) {
        fs.unlinkSync(finalPath);
    }

    fs.copyFileSync(copyPath, finalPath);
}

function copyOnlyChangedFiles(currentPath) {
    fs.readdirSync(currentPath).forEach(item => {
        let updatedPath = path.resolve(currentPath, item);
        if (fs.lstatSync(updatedPath).isDirectory()) {
            let finalPahDir = updatedPath.replace('client_files', 'client_packages');
            if (!fs.existsSync(finalPahDir)) {
                fs.mkdirSync(finalPahDir)
            }
            copyOnlyChangedFiles(updatedPath);
        } else {
            files.push(updatedPath);
            if (fs.statSync(updatedPath).mtime > DATE_CHANGE || !fs.existsSync(updatedPath.replace('client_files', 'client_packages'))) {
                changedFiles.push(updatedPath);
                copyFile(updatedPath);
            }
        }
    });
}

module.exports = {
    compile() {
        let startTime = new Date();
        console.log('START COPY CLIENT-SIDE');

        try {
            if (!fs.existsSync(path.resolve(__dirname, PATHS.finalPath))) {
                copyAllFiles();
            } else {
                if (fs.existsSync(path.resolve(__dirname, PATHS.finalPath, '.listcache'))) {
                    DATE_CHANGE = fs.statSync(path.resolve(__dirname, PATHS.finalPath, '.listcache')).mtime;
                    copyOnlyChangedFiles(path.resolve(__dirname, PATHS.basePath));
                    /// Удаление файлов из client_packages, которых уже нет в client_files
                    deleteUnusedFiles(path.resolve(__dirname, PATHS.finalPath));
                } else {
                    throw new Error(".listcache не найден. Перезапустите сервер.");
                }
            }

            let endTime = new Date();
            console.log('END COPY CLIENT-SIDE | SUCCESS | CHANGED : ' + changedFiles.length + ' FILES');
            changedFiles.forEach(file => {
                console.log(file);
            });
            console.log('TIME: ', endTime - startTime + ' ms');
        } catch (e) {
            console.log('ERROR COPY CLIENT-SIDE: ' + e);
        }
    },
    dateChange: DATE_CHANGE
};