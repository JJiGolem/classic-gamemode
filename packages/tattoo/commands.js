let tattoo = require('./index.js');

module.exports = {
    "/parsetats": {
        description: "Установить тату",
        access: 6,
        args: "[collection]:s [overlay]:s",
        handler: (player, args, out) => {
            let col = mp.joaat(args[0]);
            let ovr = mp.joaat(args[1]);
            player.setDecoration(col, ovr);
        }
    },
    "/addtat": {
        description: "Добавить тату",
        access: 6,
        args: "[collection]:s [overlay]:s [zoneId]:n [name]:s",
        handler: async (player, args, out) => {
            await tattoo.addCharacterTattoo(player, args[0], args[1], args[2], args[3]);
            out.info('Тату установлена', player);
        }
    },
    "/addtatbyid": {
        description: "Добавить тату по id",
        access: 6,
        args: "[id]:n",
        handler: async (player, args, out) => {
            let tat = await db.Models.Tattoo.findOne({
                where: {
                    id: args[0]
                }
            });
            if (!tat) return out.error('Тату не найдена', player);
            await tattoo.addCharacterTattoo(player, tat.collection, tat.hashNameMale, tat.zoneId, tat.name);
            out.info('Тату установлена', player);
        }
    },
    "/removetat": {
        description: "Удалить тату",
        access: 6,
        args: "[id]:n",
        handler: async (player, args, out) => {
            await tattoo.removeCharacterTattoo(player, args[0]);
            out.info('Тату удалена', player);
        }
    },
    "/divtatprices": {
        description: "Разделить цены тату",
        access: 6,
        args: "[число]:n",
        handler: async (player, args, out) => {
            let list = await db.Models.Tattoo.findAll();
            list.forEach((tat) => {
                tat.price = tat.price / args[0];
                tat.save();
            });
        }
    },
}