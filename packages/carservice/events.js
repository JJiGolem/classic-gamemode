var carservice = require('./index.js');
module.exports = {
    "init": () => {
        carservice.init();
    },
    "carservice.shape.enter": (player) => {
        player.call("carservice.jobmenu.show");
    }
}