const path = require('path');
const fs = require('fs');
const wrench = require('wrench');
const rimraf = require('rimraf');
const PATHS = require('./paths');

let changedFiles = [];
let files = [];

let DATE_CHANGE = null;

function copyAllFiles() {
    fs.mkdirSync(path.resolve(__dirname, PATHS.finalPath));
    wrench.copyDirSyncRecursive(path.resolve(__dirname, PATHS.basePath), path.resolve(__dirname, PATHS.finalPath), { forceDelete: true });
}

function deleteUnusedFiles() {
    fs.readdirSync(path.resolve(__dirname, PATHS.finalPath)).forEach(dir => {
        if (fs.lstatSync(path.resolve(__dirname, PATHS.finalPath, dir)).isDirectory()) {
            if (dir != 'browser') {
                let directory = fs.readdirSync(path.resolve(__dirname, PATHS.finalPath, dir));

                directory.forEach(file => {
                    if (!fs.existsSync(path.resolve(__dirname, PATHS.basePath, dir, file))) {
                        rimraf.sync(path.resolve(__dirname, PATHS.finalPath, dir, file));
                    }
                });

                directory = fs.readdirSync(path.resolve(__dirname, PATHS.finalPath, dir));

                if (directory.length === 0) {
                    rimraf.sync(path.resolve(__dirname, PATHS.finalPath, dir));
                }
            } else {
                
            }
        } else {
            if (!fs.existsSync(path.resolve(__dirname, PATHS.basePath, dir))) {
                rimraf.sync(path.resolve(__dirname, PATHS.finalPath, dir));
            }
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
        let finalPahDir = updatedPath.replace('client_files', 'client_packages');
        if (!fs.existsSync(finalPahDir)) {
            fs.mkdirSync(finalPahDir)
        }
        if (fs.lstatSync(updatedPath).isDirectory()) {
            copyOnlyChangedFiles(updatedPath);
        } else {
            files.push(updatedPath);
            if (fs.statSync(updatedPath).mtime > DATE_CHANGE) {
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
                DATE_CHANGE = fs.statSync(path.resolve(__dirname, PATHS.finalPath, '.listcache')).mtime;
                copyOnlyChangedFiles(path.resolve(__dirname, PATHS.basePath));
                
                /// Удаление файлов из client_packages, которых уже нет в client_files
                deleteUnusedFiles();
            }

            let endTime = new Date();
            console.log('END COPY CLIENT-SIDE | SUCCESS | CHANGED : ' + changedFiles.length + ' FILES');
            console.log('TIME: ', endTime - startTime + ' ms');
        } catch (e) {
            console.log('ERROR COPY CLIENT-SIDE: ' + e);
        }
    },
    dateChange: DATE_CHANGE
};