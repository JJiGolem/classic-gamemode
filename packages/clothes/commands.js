let clothes = call('clothes');

module.exports = {
    "/cllist": {
        access: 1,
        description: "Список одежды на сервере.<br/>Типы:<br/>bracelets, ears, glasses, hats, masks, pants, shoes, ties, tops, watches",
        args: "[тип_одежды]",
        handler: (player, args, out) => {
            if (!clothes.getTypes().includes(args[0])) return out.error(`Неверный тип одежды`, player);

            var list = clothes.list[1][args[0]].concat(clothes.list[0][args[0]]);

            var text = Object.keys(list[0].dataValues).join(" | ") + "<hr/>";

            list.forEach(el => {
                text += Object.values(el.dataValues).join(" | ") + "<br/>";
            });

            out.log(text, player);
        }
    },
    "/clname": {
        access: 1,
        description: "Изменить название одежды.<br/>Типы:<br/>bracelets, ears, glasses, hats, masks, pants, shoes, ties, tops, watches",
        args: "[тип_одежды] [ид_одежды]:n [название]",
        handler: (player, args, out) => {
            if (!clothes.getTypes().includes(args[0])) return out.error(`Неверный тип одежды`, player);

            var el = clothes.getClothes(args[0], args[1]);
            if (!el) return out.error(`Одежда типа ${args[0]} #${args[1]} не найдена`, player);

            var type = args[0];
            args.splice(0, 2);
            var name = args.join(" ");

            el.name = name;
            el.save();
            out.info(`${player.name} изменил название одежды типа ${type} #${el.id} (${el.name})`);
        }
    },
    "/clvar": {
        access: 1,
        description: "Изменить variation одежды.<br/>Типы:<br/>bracelets, ears, glasses, hats, masks, pants, shoes, ties, tops, watches",
        args: "[тип_одежды] [ид_одежды]:n [variation]:n",
        handler: (player, args, out) => {
            if (!clothes.getTypes().includes(args[0])) return out.error(`Неверный тип одежды`, player);

            var el = clothes.getClothes(args[0], args[1]);
            if (!el) return out.error(`Одежда типа ${args[0]} #${args[1]} не найдена`, player);

            el.variation = args[2];
            el.save();

            out.info(`${player.name} изменил variation одежды типа ${args[0]} #${el.id} (${el.variation})`);
        }
    },
    "/clprice": {
        access: 1,
        description: "Изменить цену одежды.<br/>Типы:<br/>bracelets, ears, glasses, hats, masks, pants, shoes, ties, tops, watches",
        args: "[тип_одежды] [ид_одежды]:n [цена]:n",
        handler: (player, args, out) => {
            if (!clothes.getTypes().includes(args[0])) return out.error(`Неверный тип одежды`, player);

            var el = clothes.getClothes(args[0], args[1]);
            if (!el) return out.error(`Одежда типа ${args[0]} #${args[1]} не найдена`, player);

            el.price = args[2];
            el.save();

            out.info(`${player.name} изменил цену на одежду типа ${args[0]} #${args[1]} ($${el.price})`);
        }
    },
    "/clclass": {
        access: 1,
        description: "Изменить класс одежды.<br/>Типы:<br/>bracelets, ears, glasses, hats, masks, pants, shoes, ties, tops, watches",
        args: "[тип_одежды] [ид_одежды]:n [класс]:n",
        handler: (player, args, out) => {
            if (!clothes.getTypes().includes(args[0])) return out.error(`Неверный тип одежды`, player);

            var el = clothes.getClothes(args[0], args[1]);
            if (!el) return out.error(`Одежда типа ${args[0]} #${args[1]} не найдена`, player);

            el.class = args[2];
            el.save();

            out.info(`${player.name} изменил класс одежды типа ${args[0]} #${args[1]} (${el.class})`);
        }
    },
}
