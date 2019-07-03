let fs = require('fs');
let path = require('path');


let db = require('./db');

db.connect(function() {
    fs.readdirSync(path.dirname(__dirname)).forEach(file => {
        file != 'base' && mp.events.add(require('../' + file + '/events'));
    });

    mp.events.call('init');
});