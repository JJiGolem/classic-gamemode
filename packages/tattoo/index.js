const fs = require('fs');

let parseData = {};

module.exports = {
    init() {
        console.log('tattoos init');
    },
    parseTattoos() {
        fs.readdirSync("packages/tattoo/data/").forEach(file => {
            let collection = file.slice(0, file.length - 5);
            console.log(collection);
            let data = require(`./data/${file}`);
            data.forEach((current) => {
                db.Models.Tattoo.create({
                    collection: collection,
                    name: current.Name,
                    hashNameMale: current.HashNameMale,
                    hashNameFemale: current.HashNameFemale,
                    zoneId: current.ZoneID,
                    price: current.Price
                });
            });
        });
    },
    async loadCharacterTattoos(player) {
        if (!player.character) return;
        let tattoos = await db.Models.CharacterTattoo.findAll();
        player.character.tattoos = tattoos;
        console.log(`[TATTOO] Для персонажа ${player.character.name} загружено ${tattoos.length} татуировок`);
    },
    setCharacterTattoos(player) {
        let tattoos = player.character.tattoos;
        console.log(tattoos);
        tattoos.forEach((current) => {
            player.setDecoration(mp.joaat(current.collection), mp.joaat(current.hashName));
        });
    },
    async addCharacterTattoo(player, collection, hashName, zoneId) {
        if (!player.character) return;
        let tattoo = await db.Models.CharacterTattoo.create({
            characterId: player.character.id,
            collection: collection,
            hashName: hashName,
            zoneId: zoneId
        });
        player.character.tattoos.push(tattoo);
        player.setDecoration(mp.joaat(collection), mp.joaat(hashName));
    },
    async removeCharacterTattoo(player, tattooId) {
        if (!player.character) return;
        let tattoos = player.character.tattoos;
        let index = tattoos.findIndex(x => x.id == tattooId);
        let tat = tattoos[index];
        if (!tat) return;
        await tat.destroy();
        tattoos.splice(index, 1);
        player.clearDecorations();
        this.setCharacterTattoos(player);
    }
}