const widget = require('./index');

module.exports = {
    "init": () => {
        widget.init();
        inited(__dirname);
    }
}