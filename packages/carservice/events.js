var carservice = require('./index.js');
module.exports = {
    "init": () => {
        carservice.init();
    },
    "carservice.jobshape.enter": (player) => {
        player.call("carservice.jobmenu.show");
        //mp.events.call("jobs.set", player, 1);
    },
    "playerEnterColshape": (player, shape) => {
        if (shape.isCarService) {
            player.call('chat.message.push', [`!{#ffffff}${player.name} зашел в колшейп carService`]);
            player.call('carservice.shape.enter');
        }
    },
    "playerExitColshape": (player, shape) => {
        if (shape.isCarService) {
            player.call('chat.message.push', [`!{#ffffff}${player.name} вышел с колшейпа carService`]);
            player.call('carservice.shape.leave');
        }
    },
}