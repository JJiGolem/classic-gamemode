let factions = require('./index.js');
let notifs = require('../notifications');
let money = call('money');

module.exports = {
    "init": () => {
        factions.init();
    },
    "characterInit.done": (player) => {
        player.call(`factions.faction.set`, [player.character.factionId]);
        player.setVariable("factionId", player.character.factionId);
    },
    "factions.warehouse.takeBox": (player, type) => {
        factions.takeBox(player, type);
    },
    "factions.warehouse.putBox": (player) => {
        factions.putBox(player);
    },
    "factions.vehicle.products.put": (player, vehId) => {
        // console.log(`farms.vehicle.products.put: ${player.name}`);
        var header = `Погрузка ящика`;
        var veh = mp.vehicles.at(vehId);
        if (!veh || !veh.db) return notifs.error(player, `Авто #${vehId} не найдено`, header);
        if (player.dist(veh.position) > 10) return notifs.error(player, `Авто далеко`, header);
        var model = veh.db.modelName;
        if (veh.db.key != "faction") return notifs.error(player, `Авто ${model} не принадлежит организации`, header);
        var name = factions.getFaction(player.character.factionId).name;
        if (veh.db.owner != player.character.factionId) return notifs.error(player, `Авто не принадлежит ${name}`, header);

        if (player.hasAttachment("ammoBox")) {
            if (!factions.ammoVehModels.includes(model.toLowerCase())) return notifs.error(player, `Авто не предназначено для перевоза боеприпасов`, header);
            if (!veh.products) veh.products = {
                type: "ammo",
                count: 0
            };
            if (veh.products.type != "ammo") return notifs.error(player, `Авто содержит другой тип товара`, header);
            veh.products.count = Math.clamp(veh.products.count + factions.ammoBox, 0, factions.ammoVehMax);
            veh.setVariable("label", `${veh.products.count} из ${factions.ammoVehMax} ед.`);
            player.addAttachment("ammoBox", true);
            if (veh.products.count == factions.ammoVehMax) return notifs.warning(player, `Багажник заполнен`, header);
        } else if (player.hasAttachment("medicinesBox")) {
            if (!factions.medicinesVehModels.includes(model)) return notifs.error(player, `Авто не предназначено для перевоза медикаментов`, header);
            if (!veh.products) veh.products = {
                type: "medicines",
                count: 0
            };
            if (veh.products.type != "medicines") return notifs.error(player, `Авто содержит другой тип товара`, header);
            veh.products.count = Math.clamp(veh.products.count + factions.medicinesBox, 0, factions.medicinesVehMax);
            veh.setVariable("label", `${veh.products.count} из ${factions.medicinesVehMax} ед.`);
            player.addAttachment("medicinesBox", true);
            if (veh.products.count == factions.medicinesVehMax) return notifs.warning(player, `Багажник заполнен`, header);
        }
    },
    "factions.vehicle.products.take": (player, vehId) => {
        // console.log(`factions.vehicle.products.take: ${player.name}`);
        var header = `Взятие ящика`;
        var veh = mp.vehicles.at(vehId);
        if (!veh || !veh.db) return notifs.error(player, `Авто #${vehId} не найдено`, header);
        if (player.dist(veh.position) > 10) return notifs.error(player, `Авто далеко`, header);
        var model = veh.db.modelName;
        if (veh.db.key != "faction") return notifs.error(player, `Авто ${model} не принадлежит организации`, header);
        var name = factions.getFaction(player.character.factionId).name;
        if (veh.db.owner != player.character.factionId) return notifs.error(player, `Авто не принадлежит ${name}`, header);
        if (!veh.products || !veh.products.count) return notifs.error(player, `Багажник пустой`, header);
        var type = veh.products.type;
        if (type != "ammo" && type != "medicines") return notifs.error(player, `Неверный тип товара`, header);

        player.addAttachment(`${type}Box`);
        veh.products.count -= factions[`${type}Box`];
        if (veh.products.count <= 0) {
            veh.setVariable(`label`, null);
            veh.setVariable(`unload`, null);
            delete veh.products;
        } else veh.setVariable(`label`, `${veh.products.count} из ${factions[`${type}VehMax`]} ед.`);
    },
    "factions.vehicle.unload": (player, vehId) => {
        var veh = mp.vehicles.at(vehId);
        if (!veh || !veh.db) return;
        if (veh.db.key != "faction") return;
        if (veh.db.owner != player.character.factionId) return;
        if (!veh.products || (veh.products.type != "ammo" && veh.products.type != "medicines")) return;

        player.call(`offerDialog.show`, [`vehicle_unload`, {
            type: veh.products.type,
            vehId: vehId,
        }]);
    },
    "factions.vehicle.unload.start": (player, vehId) => {
        var header = `Разгрузка авто`;
        var veh = mp.vehicles.at(vehId);
        if (!veh || !veh.db) return notifs.error(player, `Авто #${vehId} не найдено`, header);
        if (player.dist(veh.position) > 10) return notifs.error(player, `Авто далеко`, header);
        var model = veh.db.modelName;
        if (veh.db.key != "faction") return notifs.error(player, `Авто ${model} не принадлежит организации`, header);
        var name = factions.getFaction(player.character.factionId).name;
        if (veh.db.owner != player.character.factionId) return notifs.error(player, `Авто не принадлежит ${name}`, header);
        if (!veh.products || !veh.products.count) return notifs.error(player, `Авто не содержит ящики`, header);
        var type = veh.products.type;
        if (type != "ammo" && type != "medicines") return notifs.error(player, `Неверный тип товара`, header);

        veh.setVariable("unload", true);
        notifs.success(player, `Разгрузка началась`, header);
    },
    "factions.invite.show": (player, recId) => {
        var rec = mp.players.at(recId);
        if (!rec || !rec.character) return notifs.error(player, `Игрок #${recId} не найден`, `Приглашение`);
        if (player.dist(rec.position) > 10) return notifs.error(player, `${rec.name} далеко`, `Приглашение`);
        if (rec.character.factionId) return notifs.error(player, `${rec.name} уже в организации`, `Приглашение`);
        if (!player.character.factionId) return notifs.error(player, `Вы не состоите в организации`, `Приглашение`);
        if (!factions.canInvite(player)) return notifs.error(player, `Недостаточно прав`, `Приглашение`);
        var faction = factions.getFaction(player.character.factionId);

        rec.offer = {
            type: "faction_invite",
            inviterId: player.id,
        };
        rec.call(`offerDialog.show`, ["faction_invite", {
            name: player.name,
            faction: faction.name
        }]);
    },
    "factions.invite.accept": (player) => {
        if (!player.offer || player.offer.type != "faction_invite") return notifs.error(player, `Приглашение не найдено`, `Организация`);

        var inviter = mp.players.at(player.offer.inviterId);
        delete player.offer;
        if (!inviter || !inviter.character) return notifs.error(player, `Пригласивший не найден`, `Приглашение`);
        if (player.dist(inviter.position) > 10) return notifs.error(player, `${inviter.name} далеко`, `Приглашение`);
        if (player.character.factionId) return notifs.error(player, `Вы уже в организации`, `Приглашение`);
        if (!inviter.character.factionId) return notifs.error(player, `${inviter.name} не состоит в организации`, `Приглашение`);
        if (!factions.canInvite(inviter)) return notifs.error(player, `У ${inviter.name} недостаточно прав`, `Приглашение`);

        var faction = factions.getFaction(inviter.character.factionId);
        factions.addMember(faction, player);

        notifs.success(inviter, `${player.name} вступил в организацию`, faction.name);
        notifs.success(player, `Добро пожаловать`, faction.name);
    },
    "factions.invite.cancel": (player) => {
        if (!player.offer) return;
        var inviter = mp.players.at(player.offer.inviterId);
        delete player.offer;
        if (!inviter || !inviter.character) return;
        notifs.info(player, `Предложение отклонено`, `Организация`);
        notifs.info(inviter, `${player.name} отклонил предложение`, `Организация`);
    },
    "factions.uval": (player, recId) => {
        var rec = mp.players.at(recId);
        if (!rec || !rec.character) return notifs.error(player, `Игрок #${recId} не найден`, `Увольнение`);
        if (!player.character.factionId) return notifs.error(player, `Вы не состоите в организации`, `Увольнение`);
        if (rec.character.factionId != player.character.factionId) return notifs.error(player, `${rec.name} не вашей организации`, `Увольнение`);
        if (player.character.factionRank <= rec.character.factionRank) return notifs.error(player, `${rec.name} должен иметь ниже ранг`, `Увольнение`);
        if (!factions.canUval(player)) return notifs.error(player, `Недостаточно прав`, `Увольнение`);

        factions.deleteMember(rec);
        notifs.success(player, `${rec.name} уволен`, `Организация`);
        notifs.info(rec, `${player.name} вас уволил`, `Организация`);
    },
    "factions.giverank.show": (player, recId) => {
        var rec = mp.players.at(recId);
        if (!rec || !rec.character) return notifs.error(player, `Игрок #${recId} не найден`, `Ранг организации`);
        if (player.dist(rec.position) > 10) return notifs.error(player, `${rec.name} далеко`, `Ранг организации`);
        if (!player.character.factionId) return notifs.error(player, `Вы не состоите в организации`, `Ранг организации`);
        if (rec.character.factionId != player.character.factionId) return notifs.error(player, `${rec.name} не вашей организации`, `Ранг организации`);
        if (rec.character.factionRank >= player.character.factionRank) return notifs.error(player, `Нельзя повысить до своего ранга или выше`, `Ранг организации`);
        if (!factions.canGiveRank(player)) return notifs.error(player, `Недостаточно прав`, `Ранг организации`);

        var faction = factions.getFaction(player.character.factionId);
        var rank = factions.getRankById(faction, rec.character.factionRank);

        var rankNames = factions.getRankNames(faction);
        player.call("factions.giverank.showMenu", [faction.name, rankNames, rank.rank, recId]);
    },
    "factions.giverank.set": (player, values) => {
        values = JSON.parse(values);
        var recId = values[0];
        var rank = values[1];

        var rec = mp.players.at(recId);
        if (!rec || !rec.character) return notifs.error(player, `Игрок #${recId} не найден`, `Ранг организации`);
        if (player.dist(rec.position) > 10) return notifs.error(player, `${rec.name} далеко`, `Ранг организации`);
        if (!player.character.factionId) return notifs.error(player, `Вы не состоите в организации`, `Ранг организации`);
        if (rec.character.factionId != player.character.factionId) return notifs.error(player, `${rec.name} не вашей организации`, `Ранг организации`);
        if (rec.character.factionRank >= player.character.factionRank) return notifs.error(player, `Недоступно для ${rec.name}`, `Ранг организации`);
        if (!factions.canGiveRank(player)) return notifs.error(player, `Недостаточно прав`, `Ранг организации`);

        rank = factions.getRank(player.character.factionId, rank);
        if (rank.id > rec.character.factionRank) {
            if (rank.id >= player.character.factionRank) return notifs.error(player, `Нельзя повысить до своего ранга или выше`, `Ранг организации`);
            notifs.info(rec, `${player.name} повысил вас до ${rank.name}`, `Повышение`);
            notifs.success(player, `${rec.name} повышен до ${rank.name}`, `Повышение`);
        } else {
            notifs.info(rec, `${player.name} понизил вас до ${rank.name}`, `Понижение`);
            notifs.success(player, `${rec.name} понижен до ${rank.name}`, `Понижение`);
        }
        factions.setRank(rec, rank);
    },
    "factions.cash.offer": (player, data) => {
        data = JSON.parse(data);
        data.sum = Math.clamp(data.sum, 0, 1000000);
        var header = `Чек на пополнение общака`;
        if (!player.insideFactionWarehouse) return notifs.error(player, `Вы далеко`, header);
        if (player.id == data.playerId) return notifs.error(player, `Нельзя предложить самому себе`, header);
        var rec = mp.players.at(data.playerId);
        if (!rec || !rec.character) return notifs.error(player, `Игрок #${data.playerId} не найден`, header);
        if (player.dist(rec.position) > 10) return notifs.error(player, `${rec.name} далеко`, header);
        var faction = factions.getFaction(player.character.factionId);

        rec.offer = {
            type: "faction_cash_check",
            playerId: player.id,
            factionId: faction.id,
            sum: data.sum
        };
        rec.call(`offerDialog.show`, [`faction_cash_check`, {
            name: faction.name,
            sum: data.sum,
        }]);
        notifs.success(player, `Предложение ${rec.name} отправлено`, header);
    },
    "factions.cash.offer.accept": (player) => {
        if (!player.offer || player.offer.type != "faction_cash_check") return notifs.error(player, `Предложение не найдено`);
        var header = `Чек на пополнение общака`;
        var offer = player.offer;
        delete player.offer;
        if (player.character.cash < offer.sum) return notifs.error(player, `Необходимо $${offer.sum}`, header);
        var faction = factions.getFaction(offer.factionId);

        money.removeCash(player, offer.sum, (res) => {
            if (!res) return notifs.error(player, `Ошибка списания наличных`, header);

            faction.cash += offer.sum;
            faction.save();
        }, `Чек на пополнение общака ${faction.name}`);

        notifs.success(player, `Вы пополнили общак ${faction.name}`, header);
        var rec = mp.players.at(offer.playerId);
        if (!rec || !rec.character || player.dist(rec.position) > 50) return;
        notifs.success(rec, `${player.name} пополнил общак на сумму $${offer.sum}`, header);
    },
    "factions.cash.offer.cancel": (player) => {
        if (!player.offer) return;
        var inviter = mp.players.at(player.offer.playerId);
        delete player.offer;
        if (!inviter || !inviter.character) return;
        notifs.info(player, `Предложение отклонено`, `Чек`);
        notifs.info(inviter, `${player.name} отклонил предложение`, `Чек`);
    },
    "factions.control.members.online.show": (player) => {
        var out = (text) => {
            player.call(`selectMenu.notification`, [text]);
        };
        if (!player.character.factionId) return out(`Вы не состоите в организации`);
        var members = factions.getMembers(player).map(x => {
            return {
                id: x.id,
                name: x.name,
                rank: factions.getRankById(x.character.factionId, x.character.factionRank).rank,
            }
        });

        player.call(`factions.control.players.show`, [{
            members: members,
            rankNames: factions.getRankNames(player.character.factionId),
        }]);
    },
    "factions.control.members.offline.show": async (player) => {
        var out = (text) => {
            player.call(`selectMenu.notification`, [text]);
        };
        if (!player.character.factionId) return out(`Вы не состоите в организации`);

        var members = await db.Models.Character.findAll({
            attributes: ['id', 'name', 'factionId', 'factionRank'],
            where: {
                factionId: player.character.factionId
            }
        });
        members = members.map(x => {
            return {
                sqlId: x.id,
                name: x.name,
                rank: factions.getRankById(x.factionId, x.factionRank).rank,
            };
        });

        player.call(`factions.control.players.show`, [{
            members: members,
            rankNames: factions.getRankNames(player.character.factionId),
        }]);
    },
    "factions.control.members.ranks.set": async (player, data) => {
        debug(`ranks.set:`)
        debug(data)
        if (typeof data == 'string') data = JSON.parse(data);

        var out = (text) => {
            player.call(`selectMenu.notification`, [text]);
        };
        if (!player.character.factionId) return out(`Вы не состоите в организации`);

        var rec = (data.recId != null) ? mp.players.at(data.recId) : mp.players.getBySqlId(data.sqlId);
        var character = null;
        if (!rec || !rec.character) { // игрок оффлайн
            character = await db.Models.Character.findByPk(data.sqlId);
            rec = data.sqlId;
        } else {
            character = rec.character;
        }
        if (character.factionId != player.character.factionId) return out(`${character.name} не вашей организации`);
        if (character.factionRank >= player.character.factionRank) return out(`Недоступно для ${rec.name}`);
        if (!factions.canGiveRank(player)) return out(`Недостаточно прав`);

        var rank = factions.getRank(player.character.factionId, data.rank);
        if (rank.id > character.factionRank) {
            if (rank.id >= player.character.factionRank) return out(`Нельзя повысить до своего ранга или выше`);
            notifs.info(rec, `${player.name} повысил вас до ${rank.name}`, `Повышение`);
            out(`${character.name} повышен до ${rank.name}`);
        } else {
            notifs.info(rec, `${player.name} понизил вас до ${rank.name}`, `Понижение`);
            out(`${character.name} понижен до ${rank.name}`);
        }
        factions.setRank(rec, rank);
    },
    "playerEnterVehicle": (player, vehicle, seat) => {
        if (seat != -1 || vehicle.key != 'faction') return;
        if (player.character.factionId != vehicle.owner) {
            notifs.error(player, `Вы не состоите в организации`, factions.getFaction(vehicle.owner).name);
            player.removeFromVehicle();
        }
    },
};
