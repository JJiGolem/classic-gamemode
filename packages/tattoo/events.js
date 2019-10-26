let tattoo = require('./index.js');

module.exports = {
    "init": () => {
        tattoo.init();
        inited(__dirname);
    },
    "characterInit.done": async (player) => {
        await tattoo.loadCharacterTattoos(player);
        tattoo.setCharacterTattoos(player)
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
                console.log(packsCount)
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
        let gender = player.character.gender ? 0 : 1;
        player.call('tattoo.enter', [data, gender]);
    },
    "tattoo.exit": (player) => {
        player.dimension = 0;
        inventory.updateAllView(player);
    },
}