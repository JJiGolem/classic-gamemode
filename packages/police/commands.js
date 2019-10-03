var factions = require('../factions');
var notifs = require('../notifications');
var police = require('./index');

module.exports = {
    "/pcuffs": {
        access: 6,
        description: "Надеть/снять наручники.",
        args: "[ид_игрока]:n",
        handler: (player, args, out) => {
            mp.events.call(`police.cuffs`, player, {
                recId: args[0]
            });
        }
    },
    "/pfollow": {
        access: 6,
        description: "Вести игрока за собой.",
        args: "[ид_игрока]:n",
        handler: (player, args, out) => {
            mp.events.call(`police.follow`, player, args[0]);
        }
    },
    "/pcellarrest": {
        access: 6,
        description: "Посадить игрока в КПЗ ЛСПД.",
        args: "[ид_игрока]:n [минуты]:n",
        handler: (player, args, out) => {
            var rec = mp.players.at(args[0]);
            if (!rec || !rec.character) return out.error(`Игрок #${args[0]} не найден`, player);
            var mins = Math.clamp(args[1], 1, 60 * 12); // 12 суток макс.

            notifs.info(rec, `${player.name} посадил вас на ${mins} минут`, `КПЗ`);
            out.info(`${player.name} посадил ${rec.name} в КПЗ на ${mins} минут`);
            police.startCellArrest(rec, null, mins * 60 * 1000);
        }
    },
    "/pjailarrest": {
        access: 6,
        description: "Посадить игрока в тюрьму за городом.",
        args: "[ид_игрока]:n [минуты]:n",
        handler: (player, args, out) => {
            var rec = mp.players.at(args[0]);
            if (!rec || !rec.character) return out.error(`Игрок #${args[0]} не найден`, player);
            var mins = Math.clamp(args[1], 1, 60 * 12); // 12 суток макс.

            notifs.info(rec, `${player.name} посадил вас на ${mins} минут`, `Тюрьма`);
            out.info(`${player.name} посадил ${rec.name} в тюрьму на ${mins} минут`);
            police.startJailArrest(player, null, mins * 60 * 1000);
        }
    },
    "/pwanted": {
        access: 6,
        description: "Изменить розыск игрока.",
        args: "[ид_игрока]:n [розыск]:n",
        handler: (player, args, out) => {
            var rec = mp.players.at(args[0]);
            if (!rec || !rec.character) return out.error(`Игрок #${args[0]} не найден`, player);
            if (rec.character.wanted == args[1]) return out.error(`${rec.name} уже имеет ${args[1]} ур. розыска`, player);
            police.setWanted(rec, args[1]);

            // notifs.success(player, `${rec.name} имеет ${rec.character.wanted} ур.`, `Розыск`);
            notifs.info(rec, `${player.name} выдал вам ${rec.character.wanted} ур.`, `Розыск`);

            mp.players.forEach(cop => {
                if (!cop.character) return;
                if (!factions.isPoliceFaction(cop.character.factionId) && !factions.isFibFaction(cop.character.factionId)) return;

                notifs.warning(cop, `${player.name} выдал ${rec.character.wanted} ур. ${rec.name}`, `Розыск`);
            });
        }
    },
    "/psearch": {
        access: 1,
        description: "Поиск преступника.",
        args: "[ид_игрока]:n",
        handler: (player, args, out) => {
            mp.events.call(`police.search`, player, args[0]);
        }
    },
    "/pvehput": {
        access: 6,
        description: "Запихнуть игрока в авто.",
        args: "[ид_игрока]:n [ид_авто]:n",
        handler: (player, args, out) => {
            mp.events.call(`police.vehicle.put`, player, args[0], args[1]);
        }
    },
    "/pvehrem": {
        access: 6,
        description: "Выпихнуть игрока из авто.",
        args: "[ид_игрока]:n",
        handler: (player, args, out) => {
            mp.events.call(`police.vehicle.remove`, player, args[0]);
        }
    },
    "/pgivelic": {
        access: 6,
        description: "Выдать игроку лицензию на оружие.",
        args: "[ид_игрока]:n",
        handler: (player, args, out) => {
            mp.events.call(`police.licenses.gun.give`, player, args[0]);
        }
    },
    "/ptakelic": {
        access: 6,
        description: "Забрать у игрока лицензию на оружие.",
        args: "[ид_игрока]:n",
        handler: (player, args, out) => {
            mp.events.call(`police.licenses.gun.take`, player, args[0]);
        }
    },
    "/paddcall": {
        access: 6,
        description: "Добавить вызов в планшет.",
        args: "[описание]",
        handler: (player, args, out) => {
            mp.events.call(`mapCase.pd.calls.add`, player, args.join(" "));
        }
    },
    "/premcall": {
        access: 6,
        description: "Удалить вызов из планшета.",
        args: "[ид]:n",
        handler: (player, args, out) => {
            mp.events.call(`mapCase.pd.calls.remove`, player, args[0]);
        }
    },
}
