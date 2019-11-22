const widget = require('./index');

module.exports = {
    "init": async () => {
        await widget.init();
        inited(__dirname);
    }
}