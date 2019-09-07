var tuning = require('./index.js');
module.exports = {
    "init": () => {
        tuning.init();
    },
    "playerEnterColshape": (player, shape) => {
        if (shape.isCustoms) {
            if (!player.vehicle) return;
            console.log(`${player.name} entered LSC ${shape.customsId}`)
            let customs = tuning.getCustomsDataById(shape.customsId);
            player.vehicle.dimension = player.id + 1;
            player.vehicle.position = new mp.Vector3(customs.tuneX, customs.tuneY, customs.tuneZ);
            player.call('vehicles.heading.set', [customs.tuneH])
            let primary = player.vehicle.color1;
            let secondary = player.vehicle.color2;
            player.call('tuning.start', [customs.id, primary, secondary]);
            player.call('vehicles.engine.toggle', [false]);
            player.vehicle.setVariable("engine", false);
            player.vehicle.isBeingTuned = true;
        }
    },
    "tuning.end": (player, id) => {
        console.log(id);
        if (!player.vehicle) return player.dimension = 0;
        let customs = tuning.getCustomsDataById(id);
        player.vehicle.dimension = 0;
        player.vehicle.position = new mp.Vector3(customs.returnX, customs.returnY, customs.returnZ);
        player.call('vehicles.heading.set', [customs.returnH]);
    },
    "tuning.colors.set": async (player, primary, secondary) => {
        let vehicle = player.vehicle;
        if (!vehicle) return;
        console.log(`${primary} ${secondary}`);
        vehicle.setColor(primary, secondary);
        vehicle.color1 = primary;
        vehicle.color2 = secondary;
        await vehicle.db.update({
            color1: primary,
            color2: secondary
        });
        player.call('tuning.colors.set.ans', [0]);
    },
    "tuning.buy": (player, type, index) => {
        let config = tuning.getModsConfig();
        typeName = config[type];
        let vehicle = player.vehicle;
        console.log(`${type} ${index}`);
        tuning.saveMod(vehicle, typeName, index);
        vehicle.setMod(type, index);
        player.call('tuning.buy.ans', [0, typeName, index]);
    }
}