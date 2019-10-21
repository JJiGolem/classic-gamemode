"use strict";

module.exports = {
    // Место заключения брака
    weddingPos: new mp.Vector3(-1680.2960205078125, -291.5504455566406, 51.88338088989258 - 1),
    // Цена брака
    weddingPrice: 500,

    init() {
        this.createWeddingMarker();
    },
    async initSpouse(player) {
        var spouse = await db.Models.Spouse.findOne({
            where: {
                [Op.or]: {
                    characterA: player.character.id,
                    characterB: player.character.id
                }
            },
            include: [{
                    as: "characterOne",
                    model: db.Models.Character,
                    attributes: ['name', 'gender']
                },
                {
                    as: "characterTwo",
                    model: db.Models.Character,
                    attributes: ['name', 'gender']
                }
            ],
        });
        if (spouse) {
            player.spouse = {
                db: spouse
            };
            if (spouse.characterA == player.character.id) player.spouse.character = spouse.characterTwo;
            else player.spouse.character = spouse.characterOne;
        }
        mp.events.call("spouseInit.done", player);
    },
    async getSpouseName(player) {
        if (typeof player == 'number') {
            var spouse = await db.Models.Spouse.findOne({
                where: {
                    [Op.or]: {
                        characterA: player,
                        characterB: player
                    }
                },
                include: [{
                        as: "characterOne",
                        model: db.Models.Character,
                        attributes: ['name', 'gender']
                    },
                    {
                        as: "characterTwo",
                        model: db.Models.Character,
                        attributes: ['name', 'gender']
                    }
                ],
            });

            if (!spouse) return null;
            if (spouse.characterA == player) return spouse.characterTwo.name;
            else return spouse.characterOne.name;
        } else {
            if (!player.spouse) return null;
            return player.spouse.character.name;
        }
    },
    createWeddingMarker() {
        var pos = this.weddingPos;

        var marker = mp.markers.new(1, pos, 0.5, {
            color: [255, 67, 162, 100]
        });
        marker.blip = mp.blips.new(489, pos, {
            color: 49,
            name: "Церковь",
            shortRange: 10,
            scale: 1
        });
        var colshape = mp.colshapes.newSphere(pos.x, pos.y, pos.z, 1.5);
        colshape.onEnter = (player) => {
            if (player.vehicle) return;
            player.call(`selectMenu.show`, [`wedding`]);
            player.insideWedding = true;
        };
        colshape.onExit = (player) => {
            player.call(`selectMenu.hide`);
            delete player.insideWedding;
        };
    },
    add(male, female) {
        var spouse = db.Models.Spouse.build({
            characterA: male.character.id,
            characterB: female.character.id
        });

        male.spouse = {
            db: spouse,
            character: {
                name: female.name,
                gender: female.character.gender
            }
        };
        female.spouse = {
            db: spouse,
            character: {
                name: male.name,
                gender: male.character.gender
            }
        };

        spouse.save();
        mp.events.call("player.spouse.changed", male);
        mp.events.call("player.spouse.changed", female);
    },
    remove(player) {
        if (!player.spouse) return;
        var rec = mp.players.getByName(player.spouse.character.name);

        player.spouse.db.destroy();
        delete player.spouse;

        mp.events.call("player.spouse.changed", player);
        if (rec) {
            delete rec.spouse;
            mp.events.call("player.spouse.changed", rec);
        }
    }
};
