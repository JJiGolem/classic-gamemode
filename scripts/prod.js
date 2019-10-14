const path = require('path');
const fs = require('fs');
const rimraf = require('rimraf');
const wrench = require('wrench');
const obfuscator = require('javascript-obfuscator');

const PATHS = require('./paths');

module.exports = {
    build() {
        console.log('START BUILD CLIENT-SIDE');

        try {
            if (fs.existsSync(PATHS.finalPath)) {
                rimraf.sync(PATHS.finalPath);
            }
            
            wrench.copyDirSyncRecursive(path.resolve(__dirname, PATHS.basePath), path.resolve(__dirname, PATHS.finalPath), {
                forceDelete: true
            });
            
            fs.readdirSync(path.resolve(__dirname, PATHS.finalPath)).forEach(dir => {
                if (fs.lstatSync(path.resolve(__dirname, PATHS.finalPath, dir)).isDirectory() && dir != 'browser') {
                    fs.readdirSync(path.resolve(__dirname, PATHS.finalPath, dir)).forEach(file => {
                        let result = obfuscator.obfuscate(
                            fs.readFileSync(path.resolve(__dirname, PATHS.finalPath, dir, file), 'utf8').toString(),
                            {
                                compact: true,
                                controlFlowFlattening: true
                            }
                        );
                    
                        fs.writeFileSync(path.resolve(__dirname, PATHS.finalPath, dir, file), result.getObfuscatedCode());
                    })
                }
            });
            
            fs.readdirSync(path.resolve(__dirname, PATHS.finalPath, 'browser', 'js')).forEach(file => {
                let result = obfuscator.obfuscate(
                    fs.readFileSync(path.resolve(__dirname, PATHS.finalPath, 'browser', 'js', file), 'utf8').toString(),
                    {
                        compact: true,
                        controlFlowFlattening: true
                    }
                );
            
                fs.writeFileSync(path.resolve(__dirname, PATHS.finalPath, 'browser', 'js', file), result.getObfuscatedCode());
            })
            
            let indexResult = obfuscator.obfuscate(
                fs.readFileSync(path.resolve(__dirname, PATHS.finalPath, 'index.js'), 'utf8').toString(),
                {
                    compact: true,
                    controlFlowFlattening: true
                }
            );
            
            fs.writeFileSync(path.resolve(__dirname, PATHS.finalPath, 'index.js'), indexResult.getObfuscatedCode());
            
            console.log('END BUILD CLIENT-SIDE | SUCCESS');
        } catch (e) {
            console.log('ERROR BUILD CLIENT-SIDE: ' + e);
        }
    }
};