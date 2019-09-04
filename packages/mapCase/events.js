"use strict";
var chat = require('../chat');
var factions = require('../factions');
var mapCase = require('./index');
var notifs = require('../notifications');
var police = require('../police');
var utils = require('../utils');
var out = {
    error(player, text) {
        player.call(`mapCase.message.red.show`, [text]);
    },
    success(player, text) {
        player.call(`mapCase.message.green.show`, [text]);
    }
};
module.exports = {
    "init": async () => {},
    "characterInit.done": (player) => {
        if (player.character.wanted) mapCase.addPoliceWanted(player);
    },
    "mapCase.pd.init": (player) => {
        player.call(`mapCase.pd.calls.add`, [mapCase.policeCalls]);

        var wanted = police.getWanted();
        wanted = mapCase.convertWanted(wanted);
        player.call(`mapCase.pd.wanted.add`, [wanted]);

        var ranks = factions.getRankNames(player.character.factionId);
        player.call(`mapCase.pd.ranks.set`, [ranks]);

        var members = factions.getMembers(player);
        members = mapCase.convertMembers(members);
        player.call(`mapCase.pd.members.add`, [members]);
        mapCase.addPoliceMember(player);
    },
    "mapCase.pd.searchByPhone": async (player, number) => {
        // console.log(`searchByPhone: ${number}`)
        if (!factions.isPoliceFaction(player.character.factionId)) return out.error(player, `Вы не являетесь сотрудником`);
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
        if (!factions.isPoliceFaction(player.character.factionId)) return out.error(player, `Вы не являетесь сотрудником`);
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
        if (!factions.isPoliceFaction(player.character.factionId)) return out.error(player, `Вы не являетесь сотрудником`);
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
    "mapCase.pd.searchById": async (player, recId) => {
        if (!factions.isPoliceFaction(player.character.factionId)) return out.error(player, `Вы не являетесь сотрудником`);
        var header = `Установление личности`;
        var rec = mp.players.at(recId);
        if (!rec) return out.error(player, `Игрок <span>#${recId}</span> не найден`);

        var vehicles = await db.Models.Vehicle.findAll({
            where: {
                key: "owner",
                owner: recId
            }
        });
        var result = mapCase.convertCharactersToProfileData(rec.character, vehicles);
        player.call(`mapCase.pd.profileData.set`, [result]);
    },
    "mapCase.pd.getProfile": async (player, id) => {
        // console.log(`getProfile: ${id}`)
        if (!factions.isPoliceFaction(player.character.factionId)) return out.error(player, `Вы не являетесь сотрудником`);
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
        if (!factions.isPoliceFaction(player.character.factionId)) return out.error(player, `Вы не являетесь сотрудником`);
        data = JSON.parse(data);

        var fine = await db.Models.Fine.create({
            copId: player.character.id,
            recId: data.recId,
            cause: data.cause,
            price: data.price
        });
        var rec = mp.players.getBySqlId(data.recId);
        if (rec) rec.character.Fines.push(fine);

        notifs.info(rec, `${player.name} выписал вам штраф на сумму $${fine.price} (${fine.cause})`, `Штраф`);
        var text = `Штраф на сумму <span>${fine.price}$</span><br/>выдан <span>${data.recName}</span><br/> по причине <span>${data.cause}</span>`;
        out.success(player, text);
    },
    "mapCase.pd.wanted.give": (player, data) => {
        if (!factions.isPoliceFaction(player.character.factionId)) return out.error(player, `Вы не являетесь сотрудником`);
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
        notifs.info(rec, `${player.name} выдал вам ${rec.character.wanted} ур. розыска (${data.cause})`, `Розыск`);
        var text = `Уровень розыска <span>${data.wanted}&#9733;</span><br/>выдан <span>${data.recName}</span><br/> по причине <span>${data.cause}</span>`;
        out.success(player, text);
    },
    "mapCase.pd.calls.add": (player, description) => {
        mapCase.addPoliceCall(player, description);
    },
    "mapCase.pd.calls.remove": (player, id) => {
        mapCase.removePoliceCall(id);
    },
    "mapCase.pd.calls.accept": (player, id) => {
        // console.log(`calls.accept: ${player.name} ${id}`)
        if (!factions.isPoliceFaction(player.character.factionId)) return out.error(player, `Вы не являетесь сотрудником`);
        var header = `Вызов полиции`;
        var rec = mp.players.getBySqlId(id);
        if (!rec) return out.error(player, `Игрок #${id} оффлайн`);
        var accepted = mapCase.acceptPoliceCall(id);
        if (!accepted) return out.error(player, `Вызов #${id} принят другим полицейским`);
        notifs.success(rec, `${player.name} принял ваш вызов, оставайтесь на месте`, header);
        var text = `Вы приняли вызов от <br/><span>${rec.name}</span>`;
        out.success(player, text);
        player.call(`waypoint.set`, [rec.position.x, rec.position.y]);
    },
    "mapCase.pd.rank.raise": (player, recId) => {
        if (!factions.isPoliceFaction(player.character.factionId)) return out.error(player, `Вы не являетесь сотрудником`);
        if (!factions.canGiveRank(player)) return out.error(player, `Недостаточно прав`);
        var header = `Повышение`;
        var rec = mp.players.getBySqlId(recId);
        if (!rec) return out.error(player, `Игрок #${recId} оффлайн`);
        var max = factions.getMaxRank(rec.character.factionId);
        if (rec.character.factionRank >= max.id) return out.error(player, `${rec.name} имеет макс. ранг`);

        mapCase.setPdRank(rec, rec.character.factionRank + 1);
        var rankName = factions.getRankById(rec.character.factionId, rec.character.factionRank).name;

        notifs.success(rec, `${player.name} повысил вас до ${rankName}`, header);
        var text = `<span>${rec.name}</span><br /> был повышен до ранга ${rankName}`;
        out.success(player, text);
    },
    "mapCase.pd.rank.lower": (player, recId) => {
        if (!factions.isPoliceFaction(player.character.factionId)) return out.error(player, `Вы не являетесь сотрудником`);
        if (!factions.canGiveRank(player)) return out.error(player, `Недостаточно прав`);
        var header = `Понижение`;
        var rec = mp.players.getBySqlId(recId);
        if (!rec) return out.error(player, `Игрок #${recId} оффлайн`, header);
        var max = factions.getMinRank(rec.character.factionId);
        if (rec.character.factionRank <= max.id) return out.error(player, `${rec.name} имеет мин. ранг`);

        mapCase.setPdRank(rec, rec.character.factionRank - 1);
        var rankName = factions.getRankById(rec.character.factionId, rec.character.factionRank).name;

        notifs.success(rec, `${player.name} понизил вас до ${rankName}`, header);
        var text = `<span>${rec.name}</span><br /> был понижен до ранга ${rankName}`;
        out.success(player, text);
    },
    "mapCase.pd.members.uval": (player, recId) => {
        if (!factions.isPoliceFaction(player.character.factionId)) return out.error(player, `Вы не являетесь сотрудником`);
        if (!factions.canUval(player)) return out.error(player, `Недостаточно прав`);
        var header = `Увольнение`;
        var rec = mp.players.getBySqlId(recId);
        if (!rec) return out.error(player, `Игрок #${recId} оффлайн`);

        factions.deleteMember(rec);
        notifs.info(rec, `${player.name} уволил вас`, header);
        var text = `<span>${rec.name}</span><br /> был уволен`;
        out.success(player, text);
    },
    "mapCase.pd.emergency.call": (player) => {
        if (!factions.isPoliceFaction(player.character.factionId)) return out.error(player, `Вы не являетесь сотрудником`);
        mp.players.forEach((rec) => {
            if (!rec.character) return;
            if (!factions.isPoliceFaction(rec.character.factionId)) return;
            if (rec.character.factionId != player.character.factionId) return;

            chat.push(rec, `${player.name} запросил подкрепление`);
            rec.call(`mapCase.pd.emergencyBlips.add`, [rec.name, rec.position]);
        });
        out.success(player, `Сработал экстренный вызов`);
    },
    "playerQuit": (player) => {
        if (!player.character) return;
        mapCase.removePoliceCall(player.character.id);
        if (player.character.wanted) mapCase.removePoliceWanted(player.character.id);
        if (!factions.isPoliceFaction(player.character.factionId)) return;
        mapCase.removePoliceMember(player);
    },
}
