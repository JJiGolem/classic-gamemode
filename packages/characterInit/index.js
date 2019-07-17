"use strict";
const freemodeCharacters = [mp.joaat("mp_m_freemode_01"), mp.joaat("mp_f_freemode_01")];
const creatorPlayerPos = new mp.Vector3(402.8664, -996.4108, -99.00027);
const creatorPlayerHeading = -185.0;

/// Функции модуля выбора и создания персоонажа
module.exports = {
    async init(player) {
        player.characters = await db.Models.Character.findAll({
            where: {
                accountId: player.account.id
            },
            include: [db.Models.Appearance],
            include: [db.Models.Feature]
        });
        console.log(player.characters);
        let charInfos = new Array();
        for(let i = 0; i < player.characters.length; i++) {
            charInfos.push({customizations: player.characters[i], charClothes: null/*player.characters[i].inventory.usedObjects.getPlayerClothes()*/});
        }
        return charInfos;
    },
    /// Функции создания персоонажа
    create(player) {
        player.character = {
            accountId: player.account.id,
            name: "",

            gender: 0,
            father: 0,
            mother: 21,
            similarity: 1,
            skin: 0,
            hair: 0,
            hairColor: 0,
            hairHighlightColor: 0,
            eyebrowColor: 0,
            beardColor: 0,
            eyeColor: 0,
            blushColor: 0,
            lipstickColor: 0,
            chestHairColor: 0,
            Feature: [],
            Appearance: [],
        }
        for (let i = 0; i < 20; i++) player.character.Feature.push(0.0);
        for (let i = 0; i < 10; i++) player.character.Appearance.push({value: 255, opacity: 1.0});

        player.model = freemodeCharacters[0];
        this.applyCharacter(player);
        this.sendToCreator(player);
    },
    async save(player, fullname, charData) {
        let characters = await db.Models.Character.findAll({
            where: {
                name: fullname
            }
        });
        if (characters.length != 0) return player.call('characterInit.create.check.ans', [0]); 
        player.character = JSON.parse(charData);
        this.applyCharacter(player);
        player.character = await db.Models.Character.create(player.character);
        player.call('characterInit.create.check.ans', [1]);
        mp.events.call('characterInit.done', player);
    },
    sendToCreator(player) {
        player.position = creatorPlayerPos;
        player.heading = creatorPlayerHeading;
        player.usingCreator = true;
        player.call("characterInit.create", [true, JSON.stringify(player.character)]);
    },
    applyCharacter(player) {
        player.setCustomization(
            player.character.gender == 0,
    
            player.character.mother,
            player.character.father,
            0,
    
            0,
            player.character.skin,
            0,
    
            player.character.similarity,
            1.0,
            0.0,
    
            player.character.eyeColor,
            player.character.hairColor,
            player.character.hairHighlightColor,
    
            player.character.Feature
        );
    
        player.setClothes(2, player.character.hair, 0, 2);
        for (let i = 0; i < 10; i++) {
            player.setHeadOverlay(i, [player.character.Appearance[i].value,
                player.character.Appearance[i].opacity,
                player.info.customization.colorForOverlayIdx(i), 0]);
        }
    }
};