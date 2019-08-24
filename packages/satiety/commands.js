var notifs = require('../notifications');
module.exports = {

    "/satiety": {
        access: 4,
        description: "Пополнить сытость игроку.",
        args: `[ид_игрока]:n`,
        handler: (player, args, out) => {
            var rec = mp.players.at(args[0]);
            if (!rec) return out.error(`Игрок #${args[0]} не найден`, player);

            var character = rec.character;
            character.satiety = 100;
            character.save();
            player.call("inventory.setSatiety", [character.satiety]);
            out.info(`${player.name} пополнил сытость ${rec.name}`);
            notifs.success(rec, `${player.name} пополнил вам сытость`, `Сытость`);
        }
    },
    "/thirst": {
        access: 4,
        description: "Пополнить жажду игроку.",
        args: `[ид_игрока]:n`,
        handler: (player, args, out) => {
            var rec = mp.players.at(args[0]);
            if (!rec) return out.error(`Игрок #${args[0]} не найден`, player);

            var character = rec.character;
            character.thirst = 100;
            character.save();
            player.call("inventory.setThirst", [character.thirst]);
            out.info(`${player.name} пополнил жажду ${rec.name}`);
            notifs.success(rec, `${player.name} пополнил вам жажду`, `Жажда`);
        }
    },
}
