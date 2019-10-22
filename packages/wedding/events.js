let money = call('money');
let notifs = call('notifications');
let wedding = call('wedding');

module.exports = {
    "init": () => {
        wedding.init();
        inited(__dirname);
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
        if (!rec || !rec.character) return out(`Игрок #${recId} не найден`);
        if (player.dist(rec.position) > 5) return out(`${rec.name} далеко`);
        if (rec.spouse) return out(`${rec.name} уже состоит в браке`);
        if (player.character.gender == 1) return out(`Предложение должен сделать мужчина`);
        if (rec.character.gender == 0) return out(`${rec.name} не женщина`);
        if (player.character.cash < wedding.weddingPrice) return out(`Необходимо $${wedding.weddingPrice}`);

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
        if (!rec || !rec.character) return out(`Игрок #${recId} не найден`);
        if (player.dist(rec.position) > 5) return out(`${rec.name} далеко`);
        if (rec.spouse) return out(`${rec.name} уже состоит в браке`);
        if (player.character.gender == 1) return out(`Предложение должен сделать мужчина`);
        if (rec.character.gender == 0) return out(`${rec.name} не женщина`);
        if (player.character.cash < wedding.weddingPrice) return out(`Необходимо $${wedding.weddingPrice}`);

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
        var offer = player.offer;
        delete player.offer;
        if (!player.insideWedding) return out(`Вы не у церкви`);
        if (player.spouse) return out(`Вы уже состоите в браке`);
        if (!offer || offer.type != "wedding") return out(`Предложение не найдено`);
        var rec = mp.players.at(offer.playerId);
        if (!rec || !rec.character) return out(`Игрок #${recId} не найден`);
        if (player.dist(rec.position) > 5) return out(`${rec.name} далеко`);
        if (rec.spouse) return out(`${rec.name} уже состоит в браке`);
        if (rec.character.cash < wedding.weddingPrice) return notifs.error(rec, `Необходимо $${wedding.weddingPrice}`, header);

        money.removeCash(rec, wedding.weddingPrice, (res) => {
            if (!res) return notifs.error(rec, `Ошибка списания наличных`, header);

            wedding.add(rec, player);
        }, `Заключение брака с ${player.name}`);

        notifs.success(player, `${rec.name} теперь ваш муж`, header);
        notifs.success(rec, `${player.name} теперь ваша жена`, header);
    },
    "wedding.add.cancel": (player, recId) => {
        if (!player.offer || player.offer.type != "wedding") return;
        var rec = mp.players.at(player.offer.playerId);
        if (rec && rec.character) notifs.warning(rec, `${player.name} отклонила предложение руки и сердца`);
        delete player.offer;
    },
};
