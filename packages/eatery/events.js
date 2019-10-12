let eatery = require('./index.js');
let money = call('money');
let inventory = call('inventory');

module.exports = {
    "init": () => {
        eatery.init();
    },
    "playerEnterColshape": (player, shape) => {
        if (!player.character) return;
        if (shape.isEatery) {
            let id = shape.eateryId;
            player.call('chat.message.push', [`!{#ffffff}[debug]${player.name} зашел в колшейп Eatery ${shape.eateryId}`]);
            let data = eatery.getRawShopData(id);
            let priceConfig = eatery.getPriceConfig();
            player.call('eatery.enter', [data, priceConfig]);
            player.currentEateryId = shape.eateryId;
        }
    },
    "playerExitColshape": (player, shape) => {
        if (!player.character) return;
        if (shape.isEatery) {
            player.call('chat.message.push', [`!{#ffffff}[debug]${player.name} вышел с колшейпа Eatery ${shape.eateryId}`]);
            player.call('eatery.exit');
        }
    },
}