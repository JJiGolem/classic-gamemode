let infopeds = require('./index.js');

module.exports = {
    "init": async () => {
        await infopeds.init();
        inited(__dirname);
    },
    "playerEnterColshape": (player, shape) => {
        if (!shape.isInfoPointShape) return;
        if (!player.character) return;
        if (player.vehicle) return;

        player.call('infopeds.info.show', [true]);
    },
    // Временно отключено, потому что новичков будут выталкивать
    // "playerExitColshape": (player, shape) => {
    //     if (!shape.isInfoPointShape) return;
    //     player.call('infopeds.info.show', [false]);
    // },
}