let ammunation = require('./index.js');

module.exports = {
    "init": () => {
        ammunation.init();
    },
    "playerEnterColshape": (player, shape) => {
        if (!player.character) return;
        if (shape.isAmmunation) {
            let id = shape.ammunationId;
            player.call('chat.message.push', [`!{#ffffff}[debug]${player.name} зашел в колшейп Ammo ${shape.ammunationId}`]);
            let data = ammunation.getRawShopData(id);
            //let priceConfig = supermarket.getPriceConfig();
            player.call('ammunation.enter', [data]);
            player.currentAmmunationId = shape.ammunationId;
        }
    },
    "playerExitColshape": (player, shape) => {
        if (!player.character) return;
        if (shape.isAmmunation) {
            player.call('chat.message.push', [`!{#ffffff}[debug]${player.name} вышел с колшейпа Ammo ${shape.ammunationId}`]);
            player.call('ammunation.exit');
        }
    },
}