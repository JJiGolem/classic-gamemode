"use strict";
var mapCase = require('./index');
module.exports = {
    "init": async () => {},
    "mapCase.pd.searchByPhone": async (player, number) => {
        console.log(`searchByPhone: ${number}`)
        var characters = await db.Models.Character.findAll({
            attributes: ['id', 'name'],
            limit: 20,
            include: [{
                    model: db.Models.Phone,
                    where: {
                        number: {
                            [Op.like]: `%${number}%`
                        }
                    },
                },
                db.Models.House
            ],
        });
        var result = mapCase.convertCharactersToResultData(characters);
        player.call(`mapCase.pd.resultData.set`, [result]);
    },
    "mapCase.pd.searchByName": async (player, name) => {
        console.log(`searchByName: ${name}`)
        var characters = await db.Models.Character.findAll({
            attributes: ['id', 'name'],
            where: {
                name: {
                    [Op.like]: `%${name}%`
                }
            },
            limit: 20,
            include: [db.Models.Phone, db.Models.House],
        });
        var result = mapCase.convertCharactersToResultData(characters);
        player.call(`mapCase.pd.resultData.set`, [result]);
    },
    "mapCase.pd.searchByCar": async (player, plate) => {
        console.log(`searchByCar: ${plate}`)
        var vehicles = await db.Models.Vehicle.findAll({
            attributes: ['owner'],
            where: {
                key: "owner",
                plate: {
                    [Op.like]: `%${plate}%`
                }
            },
            limit: 20
        });
        var owners = [];
        for (var i = 0; i < vehicles.length; i++) owners.push(vehicles[i].owner);
        var characters = await db.Models.Character.findAll({
            attributes: ['id', 'name'],
            where: {
                id: owners
            },
            limit: 20,
            include: [db.Models.Phone, db.Models.House],
        });
        var result = mapCase.convertCharactersToResultData(characters);
        console.log(result)
        player.call(`mapCase.pd.resultData.set`, [result]);
    },

}
