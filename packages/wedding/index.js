"use strict";

module.exports = {
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
};
