let supermarket = require('./index.js');
let money = call('money');
module.exports = {
    "init": () => {
        supermarket.init();
    },
    "playerEnterColshape": (player, shape) => {
        if (!player.character) return;
        if (shape.isSupermarket) {
                let id = shape.supermarketId;
                player.call('chat.message.push', [`!{#ffffff}[debug]${player.name} зашел в колшейп Supermarket ${shape.supermarketId}`]);
                let data = supermarket.getRawShopData(id);
                player.call('supermarket.enter', [data]);
                player.currentsupermarketId = shape.supermarketId;
        }
    },
    "playerExitColshape": (player, shape) => {
        if (!player.character) return;
        if (shape.isSupermarket) {
                player.call('chat.message.push', [`!{#ffffff}[debug]${player.name} вышел с колшейпа Supermarket ${shape.supermarketId}`]);
                player.call('supermarket.exit');
        }
    },
    "supermarket.phone.buy": (player) => {
        if (player.phone) return player.call('supermarket.phone.buy.ans', [0]);
        let supermarketId = player.currentsupermarketId;
        if (supermarketId == null) return;
        
        let price = supermarket.phoneProducts * supermarket.productPrice * supermarket.getPriceMultiplier(supermarketId);
        if (player.character.cash < price) return player.call('supermarket.phone.buy.ans', [2]);
        let productsAvailable = supermarket.getProductsAmount(supermarketId);
        if (supermarket.phoneProducts > productsAvailable) return player.call('supermarket.phone.buy.ans', [3]);

        money.removeCash(player, price, function(result) {
            if (result) {
                supermarket.removeProducts(supermarketId, supermarket.phoneProducts);
                supermarket.updateCashbox(supermarketId, price);
                mp.events.call('phone.buy', player);
                player.call('supermarket.phone.buy.ans', [1]);
            } else {
                player.call('supermarket.phone.buy.ans', [4]);
            }
        });
    },
    "supermarket.number.change": (player, number) => {
        if (number.length != 6 || /\D/g.test(number) || number.charAt(0) == '0') return player.call('supermarket.number.change.ans', [0]);

        let supermarketId = player.currentsupermarketId;
        if (supermarketId == null) return;
        
        let price = supermarket.numberChangeProducts * supermarket.productPrice * supermarket.getPriceMultiplier(supermarketId);
        if (player.character.cash < price) return player.call('supermarket.number.change.ans', [2]);
        let productsAvailable = supermarket.getProductsAmount(supermarketId);
        if (supermarket.numberChangeProducts > productsAvailable) return player.call('supermarket.number.change.ans', [3]);

        money.removeCash(player, price, function(result) {
            if (result) {
                supermarket.removeProducts(supermarketId, supermarket.phoneProducts);
                supermarket.updateCashbox(supermarketId, price);
                // смена номера todo
                player.call('supermarket.number.change.ans', [1, number]);
            } else {
                player.call('supermarket.number.change.ans', [4]);
            }
        });

        
    },
}