var carshow = require('./index.js');
module.exports = {
    "init": () => {
        //carshow.init();
    },
    "vehicles.loaded": async () => {
        await carshow.init();
    },
    "playerEnterColshape": (player, shape) => {
        if (shape.isCarShow) {
            if (player.vehicle) return;
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
    "carshow.list.close": (player, carShowId) => {
        player.dimension = 0;
        let info = carshow.getCarShowInfoById(carShowId);
        player.position = new mp.Vector3(info.returnX, info.returnY, info.returnZ);
        player.heading = info.returnH;
    },
    "carshow.car.buy": (player, carId, primaryColor, secondaryColor) => {
        carshow.buyCarFromCarList(player, carId, primaryColor, secondaryColor);
    }
}