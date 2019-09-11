let factions = require('./index.js');
let notifs = require('../notifications');
module.exports = {
    "init": () => {
        factions.init();
    },
    "characterInit.done": (player) => {
        player.call(`factions.faction.set`, [player.character.factionId]);
    },
    "factions.warehouse.takeBox": (player, type) => {
        factions.takeBox(player, type);
    },
    "factions.warehouse.putBox": (player) => {
        factions.putBox(player);
    },
    "factions.invite.show": (player, recId) => {
        var rec = mp.players.at(recId);
        if (!rec) return notifs.error(player, `Игрок #${recId} не найден`, `Приглашение`);
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
        if (!inviter) return notifs.error(player, `Пригласивший не найден`, `Приглашение`);
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
        if (!inviter) return;
        notifs.info(player, `Предложение отклонено`, `Организация`);
        notifs.info(inviter, `${player.name} отклонил предложение`, `Организация`);
    },
    "factions.uval": (player, recId) => {
        var rec = mp.players.at(recId);
        if (!rec) return notifs.error(player, `Игрок #${recId} не найден`, `Увольнение`);
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
        if (!rec) return notifs.error(player, `Игрок #${recId} не найден`, `Ранг организации`);
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
        if (!rec) return notifs.error(player, `Игрок #${recId} не найден`, `Ранг организации`);
        if (player.dist(rec.position) > 10) return notifs.error(player, `${rec.name} далеко`, `Ранг организации`);
        if (!player.character.factionId) return notifs.error(player, `Вы не состоите в организации`, `Ранг организации`);
        if (rec.character.factionId != player.character.factionId) return notifs.error(player, `${rec.name} не вашей организации`, `Ранг организации`);
        if (rec.character.factionRank >= player.character.factionRank) return notifs.error(player, `Нельзя повысить до своего ранга или выше`, `Ранг организации`);
        if (!factions.canGiveRank(player)) return notifs.error(player, `Недостаточно прав`, `Ранг организации`);

        rank = factions.getRank(player.character.factionId, rank);
        if (rank.id > rec.character.factionRank) {
            notifs.info(rec, `${player.name} повысил вас до ${rank.name}`, `Повышение`);
            notifs.success(player, `${rec.name} повышен до ${rank.name}`, `Повышение`);
        } else {
            notifs.info(rec, `${player.name} понизил вас до ${rank.name}`, `Понижение`);
            notifs.success(player, `${rec.name} понижен до ${rank.name}`, `Понижение`);
        }
        factions.setRank(rec.character, rank);
    },
    "playerEnterVehicle": (player, vehicle, seat) => {
        if (seat != -1 || vehicle.key != 'faction' || !player.character.factionId) return;
        if (player.character.factionId != vehicle.owner) {
            notifs.error(player, `Вы не состоите в организации`, factions.getFaction(vehicle.owner).name);
            player.removeFromVehicle();
        }
    },
};
