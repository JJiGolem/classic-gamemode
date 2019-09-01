var tuning = require('./index.js');
module.exports = {
    "init": () => {
        tuning.init();
    },
    "playerEnterColshape": (player, shape) => {
        if (shape.isCustoms) {
            if (!player.vehicle) return;
            console.log(`${player.name} entered LSC ${shape.customsId}`)
            let data = tuning.getCustomsDataById(shape.customsId);
            player.vehicle.dimension = player.id + 1;
            player.vehicle.position = new mp.Vector3(data.tuneX, data.tuneY, data.tuneZ);
            player.call('vehicles.heading.set', [data.tuneH])
            player.call('tuning.menu.show');
            player.call('vehicles.engine.toggle', [false]);
            player.vehicle.setVariable("engine", false);
            player.vehicle.isBeingTuned = true;
        }
    }
}