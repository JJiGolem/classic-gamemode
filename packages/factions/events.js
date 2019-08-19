let factions = require('./index.js');
let notifs = require('../notifications');
module.exports = {
    "init": () => {
        factions.init();
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
        if (!inviter) return notifs.error(player, `Пригласивший не найден`, `Приглашение`);
        if (player.dist(inviter.position) > 10) return notifs.error(player, `${inviter.name} далеко`, `Приглашение`);
        if (player.character.factionId) return notifs.error(player, `Вы уже в организации`, `Приглашение`);
        if (!inviter.character.factionId) return notifs.error(player, `${inviter.name} не состоит в организации`, `Приглашение`);
        if (!factions.canInvite(inviter)) return notifs.error(player, `У ${inviter.name} недостаточно прав`, `Приглашение`);

        var faction = factions.getFaction(inviter.character.factionId);
        factions.addMember(faction, player.character);

        notifs.success(inviter, `${player.name} вступил в организацию`, faction.name);
        notifs.success(player, `Добро пожаловать`, faction.name);
        delete player.offer;
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

        factions.deleteMember(rec.character);
        notifs.success(player, `${rec.name} уволен`, `Организация`);
        notifs.info(rec, `${player.name} вас уволил`, `Организация`);
    },
    "factions.giverank.show": (player, recId) => {

    },
    "playerEnterVehicle": (player, vehicle, seat) => {
        if (seat != -1 || vehicle.key != 'faction' || !player.character.factionId) return;
        if (player.character.factionId != vehicle.owner) {
            notifs.error(player, `Вы не состоите в организации`, factions.getFaction(vehicle.owner).name);
            player.removeFromVehicle();
        }
    },
};
