"use strict";
var factions = require('../factions');
var mapCase = require('./index');
var notifs = require('../notifications');
var police = require('../police');

module.exports = {
    "init": async () => {},
    "characterInit.done": (player) => {
        if (!factions.isPoliceFaction(player.character.factionId)) return;
        player.call(`mapCase.pd.calls.add`, [mapCase.policeCalls]);
    },
    "mapCase.pd.searchByPhone": async (player, number) => {
        // console.log(`searchByPhone: ${number}`)
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
        // console.log(`searchByName: ${name}`)
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
        // console.log(`searchByCar: ${plate}`)
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
        player.call(`mapCase.pd.resultData.set`, [result]);
    },
    "mapCase.pd.getProfile": async (player, id) => {
        // console.log(`getProfile: ${id}`)
        var character = await db.Models.Character.findByPk(id, {
            attributes: ['id', 'name', 'gender', 'wanted', 'wantedCause'],
            include: [db.Models.Phone, db.Models.House, db.Models.Faction, db.Models.FactionRank],
        });
        var vehicles = await db.Models.Vehicle.findAll({
            where: {
                key: "owner",
                owner: id
            }
        });
        var result = mapCase.convertCharactersToProfileData(character, vehicles);
        player.call(`mapCase.pd.profileData.set`, [result]);

    },
    "mapCase.pd.fines.give": async (player, data) => {
        data = JSON.parse(data);

        var fine = await db.Models.Fine.create({
            copId: player.character.id,
            recId: data.recId,
            cause: data.cause,
            price: data.price
        });
        var rec = mp.players.getBySqlId(data.recId);
        if (rec) rec.character.Fines.push(fine);

        var text = `Штраф на сумму <span>${fine.price}$</span><br/>выдан <span>${data.recName}</span><br/> по причине <span>${data.cause}</span>`;
        player.call(`mapCase.message.green.show`, [text]);
    },
    "mapCase.pd.wanted.give": (player, data) => {
        data = JSON.parse(data);

        var rec = mp.players.getBySqlId(data.recId);
        if (rec) {
            police.setWanted(rec, data.wanted, data.cause);
            notifs.info(rec, `${player.name} выдал вам ${rec.character.wanted} ур. по причине: ${data.cause}`, `Розыск`);
        } else db.Models.Character.update({
            wanted: data.wanted,
            wantedCause: data.cause
        }, {
            where: {
                id: data.recId
            }
        });
        var text = `Уровень розыска <span>${data.wanted}&#9733;</span><br/>выдан <span>${data.recName}</span><br/> по причине <span>${data.cause}</span>`;
        player.call(`mapCase.message.green.show`, [text]);
    },
    "mapCase.pd.calls.add": (player, description) => {
        mapCase.addPoliceCall(player, description);
    },
    "mapCase.pd.calls.remove": (player, id) => {
        mapCase.removePoliceCall(id);
    },
    "mapCase.pd.calls.accept": (player, id) => {
        // console.log(`calls.accept: ${player.name} ${id}`)
        var header = `Вызов полиции`;
        var rec = mp.players.getBySqlId(id);
        if (!rec) return notifs.error(player, `Игрок #${id} оффлайн`, header);
        var accepted = mapCase.acceptPoliceCall(id);
        if (!accepted) return notifs.error(player, `Вызов #${id} принят другим полицейским`, header);
        notifs.success(rec, `${player.name} принял ваш вызов, оставайтесь на месте`, header);
        var text = `Вы приняли вызов от <br/><span>${rec.name}</span>`;
        player.call(`mapCase.message.green.show`, [text]);
        player.call(`waypoint.set`, [rec.position.x, rec.position.y]);
    },
    "playerQuit": (player) => {
        if (!player.character) return;
        mapCase.removePoliceCall(player.character.id);
    },
}
