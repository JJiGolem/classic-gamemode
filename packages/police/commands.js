var notifs = require('../notifications');
var police = require('./index');

module.exports = {
    "/pcuffs": {
        access: 6,
        description: "Надеть/снять наручники.",
        args: "[ид_игрока]:n",
        handler: (player, args, out) => {
            mp.events.call(`police.cuffs`, player, args[0]);
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
            if (!rec) return out.error(`Игрок #${args[0]} не найден`, player);
            var mins = Math.clamp(args[1], 1, 60 * 12); // 12 суток макс.

            notifs.info(rec, `${player.name} посадил вас на ${mins} минут`, `КПЗ`);
            out.info(`${player.name} посадил ${rec.name} в КПЗ на ${mins} минут`);
            police.startCellArrest(player, null, mins * 60 * 1000);
        }
    },
    "/pjailarrest": {
        access: 6,
        description: "Посадить игрока в тюрьму за городом.",
        args: "[ид_игрока]:n [минуты]:n",
        handler: (player, args, out) => {
            var rec = mp.players.at(args[0]);
            if (!rec) return out.error(`Игрок #${args[0]} не найден`, player);
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
            if (!rec) return out.error(`Игрок #${args[0]} не найден`, player);

            rec.character.wanted = args[1];
            rec.character.save();

            notifs.success(player, `${rec.name} имеет ${rec.character.wanted} ур.`, `Розыск`);
            notifs.info(rec, `${player.name} выдал вам ${rec.character.wanted} ур.`, `Розыск`);
        }
    },
    "/pvehput": {
        access: 6,
        description: "Запихнуть игрока в авто.",
        args: "[ид_игрока]:n",
        handler: (player, args, out) => {
            mp.events.call(`police.vehicle.put`, player, args[0]);
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
}
