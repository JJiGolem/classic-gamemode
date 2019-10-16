const path = require('path');
const fs = require('fs');
const wrench = require('wrench');
const rimraf = require('rimraf');
const PATHS = require('./paths');

module.exports = {
    compile() {
        console.log('START COPY CLIENT-SIDE');

        try {
            if (!fs.existsSync(path.resolve(__dirname, PATHS.finalPath))) {
                fs.mkdirSync(path.resolve(__dirname, PATHS.finalPath));
                wrench.copyDirSyncRecursive(path.resolve(__dirname, PATHS.basePath), path.resolve(__dirname, PATHS.finalPath), { forceDelete: true });
            } else {
                this.dateChange = fs.statSync(path.resolve(__dirname, PATHS.finalPath, '.listcache')).mtime

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
                        fs.readdirSync(path.resolve(__dirname, PATHS.basePath, 'browser')).forEach(dir => {
                            if (!new Array('build', 'fonts', 'img').includes(dir)) {
                                if (fs.lstatSync(path.resolve(__dirname, PATHS.basePath, 'browser', dir)).isDirectory()) {
                                    fs.readdirSync(path.resolve(__dirname, PATHS.basePath, 'browser', dir)).forEach(file => {
                                        if (fs.statSync(path.resolve(__dirname, PATHS.basePath, 'browser', dir, file)).mtime > this.dateChange) {
                                            console.log(`browser/${dir}/${file}`, fs.statSync(path.resolve(__dirname, PATHS.basePath, 'browser', dir, file)).mtime)
                                            let content = fs.readFileSync(path.resolve(__dirname, PATHS.basePath, 'browser', dir, file), 'utf8');
            
                                            fs.writeFileSync(path.resolve(__dirname, PATHS.finalPath, 'browser', dir, file), content);
                                        }
                                    })
                                } else {
                                    if (fs.statSync(path.resolve(__dirname, PATHS.basePath, 'browser', dir)).mtime > this.dateChange) {
                                        console.log(`browser/${dir}`, fs.statSync(path.resolve(__dirname, PATHS.basePath, 'browser', dir)).mtime)
                                        let content = fs.readFileSync(path.resolve(__dirname, PATHS.basePath, 'browser', dir), 'utf8');
        
                                        fs.writeFileSync(path.resolve(__dirname, PATHS.finalPath, 'browser', dir), content);
                                    }
                                }
                            }
                        });
                    }
                });
                
                /// Удаление файлов и client_packages, которых уже нет в client_files

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
                    } else {
                        if (!fs.existsSync(path.resolve(__dirname, PATHS.basePath, dir))) {
                            rimraf.sync(path.resolve(__dirname, PATHS.finalPath, dir));
                        }
                    }
                })
            }

            console.log('END COPY CLIENT-SIDE | SUCCESS');
        } catch (e) {
            console.log('ERROR COPY CLIENT-SIDE: ' + e);
        }
    },
    dateChange: null
};