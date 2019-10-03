let clothingShop = require('./index.js');
let money = call('money');
let inventory = call('inventory');
let phone = call('phone');

module.exports = {
    "init": () => {
        clothingShop.init();
    },
    "playerEnterColshape": (player, shape) => {
        if (!player.character) return;
        if (shape.isClothingShop) {
            let id = shape.clothingShopId;
            player.call('chat.message.push', [`!{#ffffff}[debug]${player.name} зашел в колшейп CS ${shape.clothingShopId}`]);
            let data = clothingShop.getRawShopData(id);
            // let priceConfig = supermarket.getPriceConfig();
            player.call('clothingShop.enter', [data]);
            player.currentClothingShopId = shape.clothingShopId;
        }
    },
    "playerExitColshape": (player, shape) => {
        if (!player.character) return;
        if (shape.isClothingShop) {
            player.call('chat.message.push', [`!{#ffffff}[debug]${player.name} вышел с колшейпа CS ${shape.clothingShopId}`]);
            //player.call('supermarket.exit');
        }
    },
};