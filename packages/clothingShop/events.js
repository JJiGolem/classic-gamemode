let clothingShop = require('./index.js');
let money = call('money');
let inventory = call('inventory');
let clothes = call('clothes');
module.exports = {
    "init": () => {
        clothingShop.init();
    },
    "playerEnterColshape": (player, shape) => {
        if (!player.character) return;
        if (shape.isClothingShop) {
            player.call('chat.message.push', [`!{#ffffff}[debug]${player.name} зашел в колшейп CS ${shape.clothingShopId}`]);
            player.currentClothingShopId = shape.clothingShopId;
            if (player.hasValidClothesData) {
                mp.events.call('clothingShop.enter', player);
            } else {
                player.call('clothingShop.player.freeze');
                let gender = player.character.gender ? '0' : '1';
                console.log(gender);
                let list = clothes.getClientList()[gender];
                for (let key in list) {
                    player.call('clothingShop.list.get', [key, list[key]]);
                }
                player.hasValidClothesData = true;
            }
        }
    },
    "playerExitColshape": (player, shape) => {
        if (!player.character) return;
        if (shape.isClothingShop) {
            player.call('chat.message.push', [`!{#ffffff}[debug]${player.name} вышел с колшейпа CS ${shape.clothingShopId}`]);
        }
    },
    "clothingShop.enter": (player) => {
        let id = player.currentClothingShopId;
        let data = clothingShop.getRawShopData(id);
        player.call('clothingShop.enter', [data]);
    },
};