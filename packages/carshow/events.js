var carshow = require('./index.js');
module.exports = {
    "init": () => {
        carshow.init();
    },
    "playerEnterColshape": (player, shape) => {
        if (shape.isCarShow) {
            player.call('chat.message.push', [`!{#ffffff}${player.name} зашел в колшейп с carshowid ${shape.carShowId}`]);
            mp.events.call('carshow.list.show', player, shape.carShowId);
        }
    },
    "carshow.list.show": (player, carShowId) => {
        var list = carshow.getCarShowList(carShowId);
        player.call('carshow.list.show', [list]);
    }
}