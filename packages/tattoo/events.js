let tattoo = require('./index.js');
let inventory = call('inventory');
let money = call('money');

module.exports = {
    "init": () => {
        tattoo.init();
        inited(__dirname);
    },
    "characterInit.done": async (player) => {
        await tattoo.loadCharacterTattoos(player);
        tattoo.setCharacterTattoos(player);
        tattoo.sendTattoosDataToClient(player, player.character.tattoos);
    },
    "playerEnterColshape": (player, shape) => {
        if (!player.character) return;
        if (shape.isTattooParlor) {
            player.currentTattooParlorId = shape.tattooParlorId;
            player.dimension = player.id + 1;
            if (player.hasValidTattooData) {
                mp.events.call('tattoo.enter', player);
            } else {
                player.call('tattoo.player.freeze');
                
                let tattooList = tattoo.getRawTattooList();
                let packsCount = tattooList.length % 100 == 0 ? 
                parseInt(tattooList.length / 100) : parseInt(tattooList.length / 100) + 1;
                while (tattooList.length > 0) {
                    let pack = tattooList.slice(0, 100);
                    console.log(pack.length);
                    tattooList.splice(0, 100);
                    player.call('tattoo.pack.get', [pack, packsCount]);
                }
                player.hasValidTattooData = true;
            }
        }
    },
    "tattoo.enter": (player) => {
        let id = player.currentTattooParlorId;
        let data = tattoo.getRawShopData(id);
        data.deleteTattooPrice = tattoo.deleteTattooProducts * tattoo.productPrice;
        let gender = player.character.gender;
        player.call('tattoo.enter', [data, gender]);
    },
    "tattoo.exit": (player) => {
        player.dimension = 0;
        inventory.updateAllView(player);
    },
    "tattoo.buy": (player, tattooId) => {
        let list = tattoo.getRawTattooList();
        let tat = list.find(x => x.id == tattooId);
        console.log(tat);
        if (!tat) return player.call('tattoo.buy.ans', [1]);;

        let parlorId = player.currentTattooParlorId;
        if (parlorId == null) return
        
        let products = tattoo.calculateProductsNeeded(tat.price);
        let price = parseInt(tat.price * tattoo.getPriceMultiplier(parlorId));
        if (player.character.cash < price) return player.call('tattoo.buy.ans', [2]);
        let productsAvailable = tattoo.getProductsAmount(parlorId);
        if (products > productsAvailable) return player.call('tattoo.buy.ans', [4]);

        money.removeCash(player, price, async function (result) {
            if (result) {
                let hash = player.character.gender ? 'hashNameFemale' : 'hashNameMale';
                await tattoo.addCharacterTattoo(player, tat.collection, tat[hash], tat.zoneId, tat.name);
                player.call('tattoo.buy.ans', [0]);
                tattoo.removeProducts(parlorId, products);
                tattoo.updateCashbox(parlorId, price);
            } else {
                player.call('tattoo.buy.ans', [3]);
            }
        }, `Покупка татуировки #${tattooId}`);

    },
    "tattoo.delete": (player, tattooId) => {
        let tat = player.character.tattoos.find(x => x.id == tattooId);
        console.log(tattooId)
        if (!tat) return player.call('tattoo.delete.ans', [1]);
        
        let parlorId = player.currentTattooParlorId;
        if (parlorId == null) return
        
        let products = tattoo.deleteTattooProducts;
        let price = parseInt(products * tattoo.productPrice * tattoo.getPriceMultiplier(parlorId));
        if (player.character.cash < price) return player.call('tattoo.delete.ans', [2]);
        let productsAvailable = tattoo.getProductsAmount(parlorId);
        if (products > productsAvailable) return player.call('tattoo.delete.ans', [4]);
        
        money.removeCash(player, price, async function (result) {
            if (result) {
                tattoo.removeCharacterTattoo(player, tattooId)
                player.call('tattoo.delete.ans', [0, tattooId]);
                tattoo.removeProducts(parlorId, products);
                tattoo.updateCashbox(parlorId, price);
            } else {
                player.call('tattoo.buy.ans', [3]);
            }
        }, `Сведение татуировки #${tattooId}`);
    }
}