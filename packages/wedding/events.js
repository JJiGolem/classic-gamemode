let notifs = call('notifications');
let wedding = call('wedding');

module.exports = {
    "init": () => {
        wedding.init();
    },
    "characterInit.done": (player) => {
        wedding.initSpouse(player);
    },
    "wedding.remove": (player) => {
        var header = `Свадьба`;
        var out = (text) => {
            notifs.error(player, text, header);
        };
        if (!player.insideWedding) return out(`Вы не у церкви`);
        if (!player.spouse) return out(`Вы не состоите в браке`);

        var rec = mp.players.getByName(player.spouse.character.name);
        if (rec) notifs.warning(rec, `${player.name} развелся с вами`);

        notifs.success(player, `Вы развелись с ${player.spouse.character.name}`);
        wedding.remove(player);
    },
    "wedding.add.offer": (player, recId) => {
        var header = `Свадьба`;
        var out = (text) => {
            notifs.error(player, text, header);
        };
        if (!player.insideWedding) return out(`Вы не у церкви`);
        if (player.spouse) return out(`Вы уже состоите в браке`);

        var rec = mp.players.at(recId);
        if (!rec) return out(`Игрок #${recId} не найден`);
        if (player.dist(rec.position) > 5) return out(`${rec.name} далеко`);
        if (rec.spouse) return out(`${rec.name} уже состоит в браке`);
        if (player.character.gender == 1) return out(`Предложение должен сделать мужчина`);

        player.call(`offerDialog.show`, [`wedding_male`, {
            name: rec.name,
            recId: rec.id
        }]);
    },
    "wedding.add": (player, recId) => {
        var header = `Свадьба`;
        var out = (text) => {
            notifs.error(player, text, header);
        };
        if (!player.insideWedding) return out(`Вы не у церкви`);
        if (player.spouse) return out(`Вы уже состоите в браке`);

        var rec = mp.players.at(recId);
        if (!rec) return out(`Игрок #${recId} не найден`);
        if (player.dist(rec.position) > 5) return out(`${rec.name} далеко`);
        if (rec.spouse) return out(`${rec.name} уже состоит в браке`);
        if (player.character.gender == 1) return out(`Предложение должен сделать мужчина`);

        rec.offer = {
            type: "wedding",
            playerId: player.id
        };
        rec.call(`offerDialog.show`, [`wedding_female`, {
            name: player.name
        }]);
    },
    "wedding.add.accept": (player) => {
        var header = `Свадьба`;
        var out = (text) => {
            notifs.error(player, text, header);
        };
        if (!player.insideWedding) return out(`Вы не у церкви`);
        if (player.spouse) return out(`Вы уже состоите в браке`);
        if (!player.offer || player.offer.type != "wedding") return out(`Предложение не найдено`);
        var rec = mp.players.at(player.offer.playerId);
        if (!rec) return out(`Игрок #${recId} не найден`);
        if (player.dist(rec.position) > 5) return out(`${rec.name} далеко`);
        if (rec.spouse) return out(`${rec.name} уже состоит в браке`);

        wedding.add(rec, player);
        notifs.success(player, `${rec.name} теперь ваш муж`, header);
        notifs.success(rec, `${player.name} теперь ваша жена`, header);
    },
    "wedding.add.cancel": (player, recId) => {
        if (!player.offer || player.offer.type != "wedding") return;
        var rec = mp.players.at(player.offer.playerId);
        if (rec) notifs.warning(rec, `${player.name} отклонила предложение руки и сердца`);
        delete player.offer;
    },
};
