let fs = require('fs');
let path = require('path');


let db = require('./db');
let ignoreModules = require('./ignoreModules');


db.connect(function() {
    fs.readdirSync(path.dirname(__dirname)).forEach(file => {
        file != 'base' && !ignoreModules.includes(file) && mp.events.add(require('../' + file + '/events'));
    });

    mp.events.call('init');
});