const path = require('path');
const fs = require('fs');
const wrench = require('wrench');
const rimraf = require('rimraf');
const PATHS = require('./paths');

function copyAllFiles() {
    fs.mkdirSync(path.resolve(__dirname, PATHS.finalPath));
    wrench.copyDirSyncRecursive(path.resolve(__dirname, PATHS.basePath), path.resolve(__dirname, PATHS.finalPath), { forceDelete: true });
}

function deleteUnusedBrowserFiles() {
    fs.readdirSync(path.resolve(__dirname, PATHS.finalPath, 'browser')).forEach(dir => {
        if (fs.lstatSync(path.resolve(__dirname, PATHS.finalPath, 'browser', dir)).isDirectory()) {
            let directory = fs.readdirSync(path.resolve(__dirname, PATHS.finalPath, 'browser', dir));

            directory.forEach(file => {
                if (!fs.existsSync(path.resolve(__dirname, PATHS.basePath, 'browser', dir, file))) {
                    rimraf.sync(path.resolve(__dirname, PATHS.finalPath, 'browser', dir, file));
                }
            });

            directory = fs.readdirSync(path.resolve(__dirname, PATHS.finalPath, 'browser', dir));

            if (directory.length === 0) {
                rimraf.sync(path.resolve(__dirname, PATHS.finalPath, 'browser', dir));
            }
        } else {
            if (!fs.existsSync(path.resolve(__dirname, PATHS.basePath, 'browser', dir))) {
                rimraf.sync(path.resolve(__dirname, PATHS.finalPath, 'browser', dir));
            }
        }
    });
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
                deleteUnusedBrowserFiles();
            }
        } else {
            if (!fs.existsSync(path.resolve(__dirname, PATHS.basePath, dir))) {
                rimraf.sync(path.resolve(__dirname, PATHS.finalPath, dir));
            }
        }
    });
}

function copyBrowser() {
    fs.readdirSync(path.resolve(__dirname, PATHS.basePath, 'browser')).forEach(dir => {
        if (fs.lstatSync(path.resolve(__dirname, PATHS.basePath, 'browser', dir)).isDirectory()) {
            if (dir == 'js' || dir == 'css') {
                copyJsOrCss(dir);
            } else if (dir == 'build') {
                copyReact();
            } else if (dir == 'fonts') {
                copyFonts();
            } else if (dir == 'img') {
                copyImg();
            }
        } else {
            if (fs.statSync(path.resolve(__dirname, PATHS.basePath, 'browser', dir)).mtime > this.dateChange) {
                console.log(`browser/${dir}`, fs.statSync(path.resolve(__dirname, PATHS.basePath, 'browser', dir)).mtime)
                let content = fs.readFileSync(path.resolve(__dirname, PATHS.basePath, 'browser', dir), 'utf8');

                fs.writeFileSync(path.resolve(__dirname, PATHS.finalPath, 'browser', dir), content);
            }
        }
    });
}

function copyJsOrCss(dir) {
    fs.readdirSync(path.resolve(__dirname, PATHS.basePath, 'browser', dir)).forEach(file => {
        if (fs.statSync(path.resolve(__dirname, PATHS.basePath, 'browser', dir, file)).mtime > this.dateChange) {
            let content = fs.readFileSync(path.resolve(__dirname, PATHS.basePath, 'browser', dir, file), 'utf8');
            fs.writeFileSync(path.resolve(__dirname, PATHS.finalPath, 'browser', dir, file), content);
        }
    });
}

function copyReact() {

}

function copyFonts() {
    fs.readdirSync(path.resolve(__dirname, PATHS.basePath, 'browser', 'fonts')).forEach(dir => {
        fs.readdirSync(path.resolve(__dirname, PATHS.basePath, 'browser', 'fonts', dir)).forEach(file => {
            if (fs.statSync(path.resolve(__dirname, PATHS.basePath, 'browser', 'fonts', dir, file)).mtime > this.dateChange) {
                wrench.copyDirSyncRecursive(path.resolve(__dirname, PATHS.basePath, 'browser', 'fonts', dir), 
                    path.resolve(__dirname, PATHS.finalPath, 'browser', 'fonts', dir),
                    { forceDelete: true }
                );
            }
        });
    });
}

function copyImg() {
    fs.readdirSync(path.resolve(__dirname, PATHS.basePath, 'browser', 'img')).forEach(dir => {
        fs.readdirSync(path.resolve(__dirname, PATHS.basePath, 'browser', 'fonts', dir)).forEach(file => {
            if (fs.statSync(path.resolve(__dirname, PATHS.basePath, 'browser', 'fonts', dir, file)).mtime > this.dateChange) {
                wrench.copyDirSyncRecursive(path.resolve(__dirname, PATHS.basePath, 'browser', 'fonts', dir), 
                    path.resolve(__dirname, PATHS.finalPath, 'browser', 'fonts', dir),
                    { forceDelete: true }
                );
            }
        });
    });
}

function copyOnlyChangedFiles() {
    this.dateChange = fs.statSync(path.resolve(__dirname, PATHS.finalPath, '.listcache')).mtime;

    fs.readdirSync(path.resolve(__dirname, PATHS.basePath)).forEach(dir => {
        if (dir != 'browser') {
            if (fs.lstatSync(path.resolve(__dirname, PATHS.basePath, dir)).isDirectory()) {
                fs.readdirSync(path.resolve(__dirname, PATHS.basePath, dir)).forEach(file => {
                    if (fs.statSync(path.resolve(__dirname, PATHS.basePath, dir, file)).mtime > this.dateChange) {
                        console.log(`${dir}/${file}`, fs.statSync(path.resolve(__dirname, PATHS.basePath, dir, file)).mtime)
                        let content = fs.readFileSync(path.resolve(__dirname, PATHS.basePath, dir, file), 'utf8');

                        if (!fs.existsSync(path.resolve(__dirname, PATHS.finalPath, dir))) {
                            fs.mkdirSync(path.resolve(__dirname, PATHS.finalPath, dir));
                        }

                        fs.writeFileSync(path.resolve(__dirname, PATHS.finalPath, dir, file), content);
                    }
                })
            } else {
                if (fs.statSync(path.resolve(__dirname, PATHS.basePath, dir)).mtime > this.dateChange) {
                    let content = fs.readFileSync(path.resolve(__dirname, PATHS.basePath, dir), 'utf8');

                    fs.writeFileSync(path.resolve(__dirname, PATHS.finalPath, dir), content);
                }
            }
        } else {
            copyBrowser();
        }
    });
    
    /// Удаление файлов из client_packages, которых уже нет в client_files
    deleteUnusedFiles();
}

module.exports = {
    compile() {
        console.log('START COPY CLIENT-SIDE');

        try {
            if (!fs.existsSync(path.resolve(__dirname, PATHS.finalPath))) {
                copyAllFiles();
            } else {
                copyOnlyChangedFiles();
            }

            console.log('END COPY CLIENT-SIDE | SUCCESS');
        } catch (e) {
            console.log('ERROR COPY CLIENT-SIDE: ' + e);
        }
    },
    dateChange: null
};