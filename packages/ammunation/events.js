let ammunation = require('./index.js');
let inventory = call('inventory');
let money = call('money');

module.exports = {
    "init": async () => {
        await ammunation.init();
        inited(__dirname);
    },
    "playerEnterColshape": (player, shape) => {
        if (!player.character) return;
        if (shape.isAmmunation) {
            let id = shape.ammunationId;
            let data = ammunation.getRawShopData(id);
            let weaponsConfig = ammunation.getWeaponsConfig();
            player.call('ammunation.enter', [data, weaponsConfig, ammunation.ammoProducts, ammunation.armourProducts]);
            player.currentAmmunationId = shape.ammunationId;
        }
    },
    "playerExitColshape": (player, shape) => {
        if (!player.character) return;
        if (shape.isAmmunation) {
            player.call('ammunation.exit');
        }
    },
    "ammunation.weapon.buy": (player, weaponId) => {
        let ammunationId = player.currentAmmunationId;
        if (ammunationId == null) return;

        if (!player.character) return;
        if (!player.character.gunLicenseDate) return player.call('ammunation.weapon.buy.ans', [4]);
        let weaponData = ammunation.weaponsConfig[weaponId];

        let price = weaponData.products * ammunation.productPrice * ammunation.getPriceMultiplier(ammunationId);
        if (player.character.cash < price) return player.call('ammunation.weapon.buy.ans', [0]);
        let productsAvailable = ammunation.getProductsAmount(ammunationId);
        if (weaponData.products > productsAvailable) return player.call('ammunation.weapon.buy.ans', [1]);

        let params = {
            weaponHash: mp.joaat(weaponData.gameId),
            ammo: 0,
            owner: player.character.id
        };

        inventory.addItem(player, weaponData.itemId, params, (e) => {
            if (e) return player.call('ammunation.weapon.buy.ans', [2, e]);

            money.removeCash(player, price, function (result) {
                if (result) {
                    ammunation.removeProducts(ammunationId, weaponData.products);
                    ammunation.updateCashbox(ammunationId, price);
                    player.call('ammunation.weapon.buy.ans', [3, weaponData.name]);
                } else {
                    player.call('ammunation.weapon.buy.ans', [4]);
                }
            }, `Покупка оружия ${weaponData.name}`);
        });
    },
    "ammunation.ammo.buy": (player, values) => {
        let ammunationId = player.currentAmmunationId;
        if (ammunationId == null) return;

        if (!player.character) return;
        if (!player.character.gunLicenseDate) return player.call('ammunation.weapon.buy.ans', [4]);
        
        values = JSON.parse(values);
        let ammoIndex = values[0];
        let ammoCount = values[1];

        let price = ammunation.ammoProducts * ammoCount * ammunation.productPrice * ammunation.getPriceMultiplier(ammunationId);
        if (player.character.cash < price) return player.call('ammunation.ammo.buy.ans', [0]);
        let productsAvailable = ammunation.getProductsAmount(ammunationId);
        if (ammunation.ammoProducts * ammoCount > productsAvailable) return player.call('ammunation.ammo.buy.ans', [1]);

        let itemIds = [37, 38, 40, 39];
        let params = {
            count: ammoCount,
            owner: player.character.id
        };

        inventory.addItem(player, itemIds[ammoIndex], params, (e) => {
            if (e) return player.call('ammunation.ammo.buy.ans', [2, e]);

            money.removeCash(player, price, function (result) {
                if (result) {
                    ammunation.removeProducts(ammunationId, ammunation.ammoProducts * ammoCount);
                    ammunation.updateCashbox(ammunationId, price);
                    player.call('ammunation.ammo.buy.ans', [3]);
                } else {
                    player.call('ammunation.ammo.buy.ans', [4]);
                }
            }, `Покупка боеприпасов с itemId #${itemIds[ammoIndex]} (${ammoCount} шт.)`);
        });
    },
    "ammunation.armour.buy": (player, armourId) => {
        let ammunationId = player.currentAmmunationId;
        if (ammunationId == null) return;

        if (!player.character) return;
        
        let price = ammunation.armourProducts * ammunation.productPrice * ammunation.getPriceMultiplier(ammunationId);
        if (player.character.cash < price) return player.call('ammunation.armour.buy.ans', [0]);
        let productsAvailable = ammunation.getProductsAmount(ammunationId);
        if (ammunation.armourProducts > productsAvailable) return player.call('ammunation.armour.buy.ans', [1]);

        let params = {
            variation: 12,
            texture: armourId,
            health: 100,
            pockets: '[3,3,3,3,3,3,3,3,10,5,3,5,10,3,3,3]',
            sex: !player.character.gender
        };

        inventory.addItem(player, 3, params, (e) => {
            if (e) return player.call('ammunation.armour.buy.ans', [2, e]);

            money.removeCash(player, price, function (result) {
                if (result) {
                    ammunation.removeProducts(ammunationId, ammunation.armourProducts);
                    ammunation.updateCashbox(ammunationId, price);
                    player.call('ammunation.armour.buy.ans', [3]);
                } else {
                    player.call('ammunation.armour.buy.ans', [4]);
                }
            }, `Покупка бронежилета`);
        });
    },
}