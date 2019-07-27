var carshow = require('./index.js');
module.exports = {
    "init": () => {
        carshow.init();
    },
    "playerEnterColshape": (player, shape) => {
        if (shape.isCarShow) {
            player.call('chat.message.push', [`!{#ffffff}${player.name} зашел в колшейп с carshowid ${shape.carShowId}`]);
            player.call('chat.message.push', [`!{#ffffff}${carshow.getCarShowPropertyBySqlId("name", shape.carShowId)}`]);
            mp.events.call('carshow.list.show', player, shape.carShowId);
        }
    },
    "carshow.list.show": (player, carShowId) => {
        var list = carshow.getCarShowList(carShowId);
        player.dimension = player.id + 1;
        let info = carshow.getCarShowInfoById(carShowId);
        console.log(info.name);
        console.log(info.sqlId);
        player.call('carshow.list.show', [list, info]);
    },
    "carshow.car.buy": (player, carId, primaryColor, secondaryColor) => {
        carshow.buyCarFromCarList(player, carId, primaryColor, secondaryColor);
    }
}