let notifs = call('notifications');

module.exports = {
    "init": () => {

    },
    "characterInit.done": (player) => {

    },
    "familiar.add": (player, recId) => {
        console.log(`familiar.add: ${player.name} ${recId}`)
        var header = `Знакомство`;
        var rec = mp.players.at(recId);
        if (!rec) return notifs.error(player, `Игрок #${recId} не найден`, header);
        if (player.dist(rec.position) > 10) return notifs.error(player, `${rec.name} далеко`, header);

        rec.call(`offerDialog.show`, ["familiar", {
            name: player.name,
            playerId: player.id
        }]);
    },
    "familiar.accept": (player, recId) => {
        var header = `Знакомство`;
        var rec = mp.players.at(recId);
        if (!rec) return notifs.error(player, `Игрок #${recId} не найден`, header);
        if (player.dist(rec.position) > 10) return notifs.error(player, `${rec.name} далеко`, header);

        player.call(`familiar.add`, [rec.name]);
        rec.call(`familiar.add`, [player.name]);

        notifs.success(player, `${rec.name} ваш новый знакомый`, header);
        notifs.success(rec, `${player.name} ваш новый знакомый`, header);
    },
};
