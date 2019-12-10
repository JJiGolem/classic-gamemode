var carshow = require('./index.js');
module.exports = {
    "init": () => {
        //carshow.init();
        inited(__dirname);
    },
    "vehicles.loaded": async () => {
        await carshow.init();
    },
    "playerEnterColshape": (player, shape) => {
        if (shape.isCarShow) {
            if (!player.character) return;
            if (player.vehicle) return;
            let isCuffed = player.getVariable('cuffs') || false;
            if (isCuffed) return;
            mp.events.call('carshow.list.show', player, shape.carShowId);
        }
    },
    "carshow.list.show": (player, carShowId) => {
        var list = carshow.getCarShowList(carShowId);
        player.dimension = player.id + 1;
        let info = carshow.getCarShowInfoById(carShowId);
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