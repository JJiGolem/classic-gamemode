"use strict";
const freemodeCharacters = [mp.joaat("mp_m_freemode_01"), mp.joaat("mp_f_freemode_01")];
const creatorPlayerPos = new mp.Vector3(402.8664, -996.4108, -99.00027);
const creatorPlayerHeading = -185.0;

let inventory = call('inventory');
let notifs = call('notifications');
let utils = call("utils");
let promocodes = call("promocodes");

let clothesConfig = {
    0: {
        pants: [
            [0, 0],
            [14, 0]
        ],
        /// 11 / 3 / 8
        tops: [
            [0, 2, 0, 0, 9, 0],
            [5, 1, 4, 0, 3, 0],
            [16, 2, 15, 0, 3, 0]
        ],
        shoes: [
            [3, 0],
            [1, 7]
        ]
    },
    1: {
        pants: [
            [1, 5],
            [1, 6],
            [5, 0],
            [15, 3]
        ],
        /// 11 / 3 / 8
        tops: [
            [17, 0, 5, 0, 15, 0],
            [1, 0, 0, 0, 15, 0],
            [5, 2, 5, 0, 15, 0],
            [34, 0, 0, 0, 15, 0]
        ],
        shoes: [
            [1, 2],
            [9, 2]
        ]
    }
};

const TOP_ID = 7;
const PANTS_ID = 8;
const SHOES_ID = 9;

/// Функции модуля выбора и создания персоонажа
module.exports = {
    async init(player) {
        if (player.character != null) delete player.character;
        if (player.characters == null) {
            var start = Date.now();
            player.characters = await db.Models.Character.findAll({
                where: {
                    accountId: player.account.id
                },
                include: [{
                        model: db.Models.Feature,
                    },
                    {
                        model: db.Models.Appearance,
                    },
                    db.Models.Fine,
                    {
                        model: db.Models.Promocode,
                        include: db.Models.PromocodeReward,
                    },
                    {
                        as: "settings",
                        model: db.Models.CharacterSettings,
                    },
                    // Этот инклюд тормозит выборку до 5 сек...
                    // {
                    //     model: db.Models.CharacterInventory,
                    //     where: {
                    //         parentId: null,
                    //     },
                    //     include: {
                    //         as: "params",
                    //         model: db.Models.CharacterInventoryParam,
                    //     },
                    // },
                ]
            });
            var diff = Date.now() - start;
            notifs.info(player, `Время выборки персонажей: ${diff} ms.`);
            player.characters.forEach(character => {
                character.Appearances.sort((x, y) => {
                    if (x.order > y.order) return 1;
                    if (x.order < y.order) return -1;
                    if (x.order == y.order) return 0;
                });
                character.Features.sort((x, y) => {
                    if (x.order > y.order) return 1;
                    if (x.order < y.order) return -1;
                    if (x.order == y.order) return 0;
                });
            });
        }
        let charInfos = new Array();
        for (let i = 0; i < player.characters.length; i++) {
            charInfos.push({
                charInfo: player.characters[i],
                charClothes: null,
                // charClothes: inventory.getView(player.characters[i].CharacterInventories),
            });
        }
        return charInfos;
    },
    /// Функции создания персоонажа
    create(player) {
        player.characterInfo = {
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
            Promocode: {},
            settings: {},
        }
        for (let i = 0; i < 20; i++) player.characterInfo.Features.push({
            value: 0.0,
            order: i
        });
        for (let i = 0; i < 11; i++) player.characterInfo.Appearances.push({
            value: 255,
            opacity: 1.0,
            order: i
        });

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
        player.characterInfo = JSON.parse(charData);
        player.characterInfo.name = fullname;
        let pos = this.getSpawn();
        player.characterInfo.x = pos[0];
        player.characterInfo.y = pos[1];
        player.characterInfo.z = pos[2];
        player.characterInfo.Promocode.promocode = await promocodes.getPromocode();

        player.character = await db.Models.Character.create(player.characterInfo, {
            include: [{
                    model: db.Models.Feature,
                },
                {
                    model: db.Models.Appearance,
                },
                {
                    model: db.Models.Promocode,
                },
                {
                    as: "settings",
                    model: db.Models.CharacterSettings,
                },
            ]
        });
        this.applyCharacter(player);
        player.characterInit.created = true;
        player.call('characterInit.create.check.ans', [1]);
        mp.events.call('characterInit.done', player);
    },
    sendToCreator(player) {
        player.position = creatorPlayerPos;
        player.heading = creatorPlayerHeading;
        player.usingCreator = true;
        player.call("characterInit.create", [true, JSON.stringify(player.characterInfo)]);
    },
    applyCharacter(player) {
        if (player.character != null) {
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
            for (let i = 0; i < 11; i++) {
                player.setHeadOverlay(i, [player.character.Appearances[i].value,
                    player.character.Appearances[i].opacity,
                    this.colorForOverlayIdx(player, i), 0
                ]);
            }
        }
        else {
            let features = new Array();
            player.characterInfo.Features.forEach((element) => {
                features.push(element.value);
            });
            player.setCustomization(
                player.characterInfo.gender == 0,

                player.characterInfo.mother,
                player.characterInfo.father,
                0,

                0,
                player.characterInfo.skin,
                0,

                player.characterInfo.similarity,
                1.0,
                0.0,

                player.characterInfo.eyeColor,
                player.characterInfo.hairColor,
                player.characterInfo.hairHighlightColor,

                features
            );

            player.setClothes(2, player.characterInfo.hair, 0, 2);
            for (let i = 0; i < 11; i++) {
                player.setHeadOverlay(i, [player.characterInfo.Appearances[i].value,
                    player.characterInfo.Appearances[i].opacity,
                    this.colorForOverlayIdx(player, i), 0
                ]);
            }
        }
    },
    colorForOverlayIdx(player, index) {
        let color;
        if (player.character != null) {
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
        }
        else {
            switch (index) {
                case 1:
                    color = player.characterInfo.beardColor;
                    break;
                case 2:
                    color = player.characterInfo.eyebrowColor;
                    break;
                case 5:
                    color = player.characterInfo.blushColor;
                    break;
                case 8:
                    color = player.characterInfo.lipstickColor;
                    break;
                case 10:
                    color = player.characterInfo.chestHairColor;
                    break;
                default:
                    color = 0;
            }
        }
        return color;
    },
    getSpawn() {
        switch (call('utils').randomInteger(0, 2)) {
            case 0:
                return [-252.91534423828125, -338.6800231933594, 29.70627212524414];
            case 1:
                return [258.9052429199219, -1112.8656005859375, 29.43829917907715];
            case 2:
                return [-197.68017578125, -804.0416870117188, 30.45401954650879];
            default:
                return [-252.91534423828125, -338.6800231933594, 29.70627212524414];
        }
    },
    setStartClothes(player) {
        let sex = player.character.gender ? 0 : 1;

        let pantsArray = clothesConfig[sex].pants;
        let pants = pantsArray[utils.randomInteger(0, pantsArray.length - 1)];
        let pantsParams = {
            sex: sex,
            variation: pants[0],
            texture: pants[1],
            pockets: '[5, 5, 5, 5, 4, 4, 4, 4]',
            name: (pants[0] == 15 && sex == 1) || (pants[0] == 14 && sex == 0) ? 'Шорты' : 'Брюки'
        }
        inventory.addItem(player, PANTS_ID, pantsParams, (e) => {
            //if (e) return notifs.error(player, e);
            if (e) return console.log(e);
        });

        let shoesArray = clothesConfig[sex].shoes;
        let shoes = shoesArray[utils.randomInteger(0, shoesArray.length - 1)];
        let shoesParams = {
            sex: sex,
            variation: shoes[0],
            texture: shoes[1],
            name: 'Кроссовки'
        }
        inventory.addItem(player, SHOES_ID, shoesParams, (e) => {
            //if (e) return notifs.error(player, e);
            if (e) return console.log(e);
        });

        let topsArray = clothesConfig[sex].tops;
        let top = topsArray[utils.randomInteger(0, topsArray.length - 1)];
        let topParams = {
            sex: sex,
            variation: top[0],
            texture: top[1],
            torso: top[2],
            tTexture: top[3],
            undershirt: top[4],
            uTexture: top[5],
            //pockets: '[3, 3]',
            name: 'Футболка'
        }
        inventory.addItem(player, TOP_ID, topParams, (e) => {
            //if (e) return notifs.error(player, e);
            if (e) return console.log(e);
        });
    },
    spawn(player) {
        var settings = player.character.settings;
        if (!player.character.factionId || player.house.id == -1) settings.spawn = 0;
        switch (settings.spawn) {
            case 0: // улица
                player.spawn(new mp.Vector3(player.character.x, player.character.y, player.character.z));
                player.heading = player.character.h;
                player.dimension = 0;
                break;
            case 1: // дом
                break;
            case 2: //организация
                break;
        }
    },
};
