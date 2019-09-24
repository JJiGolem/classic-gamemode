let notifs = call('notifications');

module.exports = {
    "/promocode": {
        access: 5,
        description: "Изменить реферальный промокод игрока.",
        args: "[ид_игрока]:n [промокод]",
        handler: async (player, args, out) => {
            var rec = mp.players.at(args[0]);
            if (!rec) return out.error(`Игрок #${args[0]} не найден`, player);

            var code = args[1].toUpperCase();
            var promocode = await db.Models.Promocode.findOne({
                attributes: ["id"],
                where: {
                    promocode: code
                }
            });
            if (promocode) return out.error(`Промокод ${args[1]} занят`, player);

            rec.character.Promocode.promocode = code;
            rec.character.Promocode.save();

            out.info(`${player.name} изменил промокод ${rec.name} на ${code}`)
            notifs.success(rec, `${player.name} изменил ваш промокод на ${code}`);
            mp.events.call("player.promocode.changed", rec);
        }
    },
}
