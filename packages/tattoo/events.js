let tattoo = require('./index.js');
let inventory = call('inventory');

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
        let gender = player.character.gender;
        player.call('tattoo.enter', [data, gender]);
    },
    "tattoo.exit": (player) => {
        player.dimension = 0;
        inventory.updateAllView(player);
    },
    "tattoo.buy": async (player, tattooId) => {
        let list = tattoo.getRawTattooList();
        let tat = list.find(x => x.id == tattooId);
        console.log(tat);
        if (!tat) return;
        let hash = player.character.gender ? 'hashNameFemale' : 'hashNameMale';
        await tattoo.addCharacterTattoo(player, tat.collection, tat[hash], tat.zoneId, tat.name);
        player.call('tattoo.buy.ans', [0]);
    },
    "tattoo.delete": (player, tattooId) => {
        let tat = player.character.tattoos.find(x => x.id == tattooId);
        console.log(tattooId)
        if (!tat) return console.log(`${tattooId} not found`);
        console.log('remove')
        tattoo.removeCharacterTattoo(player, tattooId)
        player.call('tattoo.delete.ans', [0, tattooId]);
    }
}