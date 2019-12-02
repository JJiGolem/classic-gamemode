let eatery = require('./index.js');
let money = call('money');
let inventory = call('inventory');

module.exports = {
    "init": async () => {
        await eatery.init();
        inited(__dirname);
    },
    "playerEnterColshape": (player, shape) => {
        if (!player.character) return;
        if (shape.isEatery) {
            let id = shape.eateryId;
            let data = eatery.getRawShopData(id);
            let priceConfig = eatery.getPriceConfig();
            player.call('eatery.enter', [data, priceConfig]);
            player.currentEateryId = shape.eateryId;
        }
    },
    "playerExitColshape": (player, shape) => {
        if (!player.character) return;
        if (shape.isEatery) {
            player.call('eatery.exit');
        }
    },
    "eatery.products.buy": (player, productId) => {
        let eateryId = player.currentEateryId;
        if (eateryId == null) return;

        let productName;
        switch (productId) {
            case 0:
                productName = 'hamburger';
                break;
            case 1:
                productName = 'pizza';
                break;
            case 2:
                productName = 'hotdog';
                break;
            case 3:
                productName = 'chips';
                break;
            case 4:
                productName = 'cola';
                break;
        }
        let price = parseInt(eatery.productsConfig[productName] * eatery.productPrice * eatery.getPriceMultiplier(eateryId));
        if (player.character.cash < price) return player.call('eatery.products.buy.ans', [2]);
        let productsAvailable = eatery.getProductsAmount(eateryId);
        if (eatery.defaultProductsAmount > productsAvailable) return player.call('eatery.products.buy.ans', [3]);

        let itemId = eatery.itemIds[productName];
        let params = {};

        if (productName == 'hamburger') {
            params.satiety = 60;
            params.thirst = -10;
        } else if (productName == 'pizza') {
            params.satiety = 50;
            params.thirst = -5;
        } else if (productName == 'hotdog') {
            params.satiety = 55;
            params.thirst = -10;
        } else if (productName == 'chips') {
            params.satiety = 30;
            params.thirst = -5;
        } else if (productName == 'cola') {
            params.thirst = 50;
        }

        inventory.addItem(player, itemId, params, (e) => {
            if (e) return player.call('eatery.products.buy.ans', [4, e]);
            money.removeCash(player, price, function (result) {
                if (result) {
                        eatery.removeProducts(eateryId, eatery.defaultProductsAmount);
                        eatery.updateCashbox(eateryId, price);
                        player.call('eatery.products.buy.ans', [1]);
                } else {
                    player.call('eatery.products.buy.ans', [0]);
                }
            }, `Покупка в закусочной ${productName}`);
        });
    },
}