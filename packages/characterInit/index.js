"use strict";
const freemodeCharacters = [mp.joaat("mp_m_freemode_01"), mp.joaat("mp_f_freemode_01")];
const creatorPlayerPos = new mp.Vector3(402.8664, -996.4108, -99.00027);
const creatorPlayerHeading = -185.0;

let characterInfo = [
    db.Models.Feature, 
    db.Models.Appearance
];

/// Функции модуля выбора и создания персоонажа
module.exports = {
    /// Позволяет добавлять модели, которые вы хотите загрузить из БД к персоонажу
    /// currentModuleInfo - массив
    addLoadedInfo(currentModuleInfo) {
        characterInfo = characterInfo.concat(currentModuleInfo);
    },
    async init(player) {
        player.characters = await db.Models.Character.findAll({
            where: {
                accountId: player.account.id
            },
            include: characterInfo
        });
        let charInfos = new Array();
        for(let i = 0; i < player.characters.length; i++) {
            charInfos.push({charInfo: player.characters[i], charClothes: null});
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
            Features: [],
            Appearances: [],
        }
        for (let i = 0; i < 20; i++) player.character.Features.push({value: 0.0});
        for (let i = 0; i < 10; i++) player.character.Appearances.push({value: 255, opacity: 1.0});

        mp.events.call('characterInit.create.init', player);

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
        player.character.name = fullname;
        let pos = this.getSpawn();
        player.character.x = pos[0];
        player.character.y = pos[1];
        player.character.z = pos[2];
        this.applyCharacter(player);
        player.character = await db.Models.Character.create(player.character, {
            include: characterInfo
        });
        
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
        let features = new Array();
        player.character.Features.forEach((element) => {
            features.push(element.value);
        });
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
    
            features
        );
    
        player.setClothes(2, player.character.hair, 0, 2);
        for (let i = 0; i < 10; i++) {
            player.setHeadOverlay(i, [player.character.Appearances[i].value,
                player.character.Appearances[i].opacity,
                this.colorForOverlayIdx(player, i), 0]);
        }
    },
    colorForOverlayIdx(player, index) {
        let color;

        switch (index) {
            case 1:
                color = player.character.beardColor;
                break;
            case 2:
                color = player.character.eyebrowColor;
                break;
            case 5:
                color = player.character.blushColor;
                break;
            case 8:
                color = player.character.lipstickColor;
                break;
            case 10:
                color = player.character.chestHairColor;
                break;
            default:
                color = 0;
        }
        return color;
    },
    getSpawn() {
        switch(call('utils').randomInteger(0, 2)) {
            case 0:
                return [-252.91534423828125, -338.6800231933594, 29.70627212524414];
            case 1:
                return [-252.91534423828125, -338.6800231933594, 29.70627212524414];
            case 2:
                return [-252.91534423828125, -338.6800231933594, 29.70627212524414];
            default:
                return [-252.91534423828125, -338.6800231933594, 29.70627212524414];
        }
    }
};