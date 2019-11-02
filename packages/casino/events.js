let casino = require('./index.js');
let money = call('money');

module.exports = {
    "init": () => {
        casino.init();
        inited(__dirname);
    },
}