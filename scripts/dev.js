const path = require('path');
const fs = require('fs');
const wrench = require('wrench');
const PATHS = require('./paths');

module.exports = {
    compile() {
        console.log('START COPY CLIENT-SIDE');

        try {
            if (!fs.existsSync(path.resolve(__dirname, PATHS.finalPath))) {
                fs.mkdirSync(path.resolve(__dirname, PATHS.finalPath));
            }

            wrench.copyDirSyncRecursive(path.resolve(__dirname, PATHS.basePath), path.resolve(__dirname, PATHS.finalPath), { forceDelete: true });

            console.log('END COPY CLIENT-SIDE | SUCCESS');
        } catch (e) {
            console.log('ERROR COPY CLIENT-SIDE: ' + e);
        }
    }
};