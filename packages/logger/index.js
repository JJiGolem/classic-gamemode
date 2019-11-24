"use strict";

module.exports = {

    log(text, moduleName = null, player = null) {
        var data = {
            text: text
        };
        if (moduleName) data.module = moduleName;
        if (player) {
            if (typeof player == 'number') data.characterId = player;
            else {
                data.characterId = player.character.id;
                data.playerId = player.id;
            }
        }

        db.Models.Log.create(data);
    },
    debug(text, moduleName = null, player = null) {
        var data = {
            text: text
        };
        if (moduleName) data.module = moduleName;
        if (player) {
            if (typeof player == 'number') data.characterId = player;
            else {
                data.characterId = player.character.id;
                data.playerId = player.id;
            }
        }

        db.Models.DebugLog.create(data);
    },
    async loadLogs(characterId, dateA, dateB) {
        var logs = await db.Models.Log.findAll({
            where: {
                characterId: characterId,
                date: {
                    [Op.gte]: dateA,
                    [Op.lt]: dateB
                }
            }
        });
        return logs;
    },
    async loadLogIds(playerId, date) {
        var logs = await db.Models.Log.findAll({
            where: {
                playerId: playerId,
                date: {
                    [Op.gte]: date,
                    [Op.lt]: new Date(date.getTime() + 24 * 60 * 60 * 1000)
                },
                text: {
                    [Op.or]: [{
                            [Op.like]: '%Авторизовал персонажа%'
                        },
                        {
                            [Op.like]: '%Деавторизовал персонажа%'
                        }
                    ],
                }
            },
            include: {
                model: db.Models.Character,
                attributes: ['name'],
            }
        });
        
        return logs;
    },
};
