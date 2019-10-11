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
        let multiplier = masks.getPriceMultiplier();
        list = list.map((current) => {
            current.price *= multiplier;
            return current;
        });
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

        let products = masks.calculateProductsNeeded(mask.price);
        let price = mask.price * masks.getPriceMultiplier();
        if (player.character.cash < price) return player.call('masks.buy.ans', [4]);
        let productsAvailable = masks.getProductsAmount();
        if (products > productsAvailable) return player.call('masks.buy.ans', [6]);
        let params = {
            sex: !player.character.gender,
            variation: mask.drawable,
            texture: textureId
        }
        inventory.addItem(player, MASK_ID, params, (e) => {
            if (e) return player.call('masks.buy.ans', [2, e]);
            money.removeCash(player, price, function (result) {
                if (result) {
                    masks.removeProducts(products);
                    masks.updateCashbox(price);
                    player.call('masks.buy.ans', [0]);
                } else {
                    player.call('masks.buy.ans', [5]);
                    console.log(`[MASKS] Маска добавлена в инвентарь ${player.name}, но деньги не сняты`);
                }
            }, `Покупка маски (ID #${maskId} | Texture #${textureId})`);
        });
    }
}