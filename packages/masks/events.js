let masks = require('./index.js');
let inventory = call('inventory');
let money = call('money');

const MASK_ID = 14;

module.exports = {
    "init": () => {
        masks.init();
    },
    "masks.shop.enter": (player) => {
        let list = masks.getRawMaskList();
        let data = masks.getShopData();
        player.dimension = player.id + 1;
        player.call("masks.shop.enter", [data, list]);
    },
    "masks.shop.exit": (player) => {
        player.dimension = 0;
        inventory.updateAllView(player);
    },
    "masks.buy": (player, maskId, textureId) => {
        let list = masks.getMaskList();
        let mask = list.find(x => x.id == maskId);
        if (!mask) return player.call('masks.buy.ans', [1]);
        if (!mask.isAvailable) return player.call('masks.buy.ans', [3]);

        let price = mask.price;
        if (player.character.cash < price) return player.call('masks.buy.ans', [4]);

        let params = {
            sex: !player.character.gender,
            variation: mask.drawable,
            texture: textureId
        }
        inventory.addItem(player, MASK_ID, params, (e) => {
            if (e) return player.call('masks.buy.ans', [2, e]);
            money.removeCash(player, price, function (result) {
                if (result) {
                    player.call('masks.buy.ans', [0]);
                } else {
                    player.call('masks.buy.ans', [5]);
                    console.log(`[MASKS] Маска добавлена в инвентарь ${player.name}, но деньги не сняты`);
                }
            });
        });
    }
}