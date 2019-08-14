let inventory = require('./index');

module.exports = {
    "/invdelete": {
        access: 6,
        description: "Удалить предмет из инвентаря игрока",
        args: "[ид_игрока] [ид_предмета]",
        handler: (player, args, out) => {
            var rec = mp.players.at(args[0]);
            if (!rec) return out.error(player, `Игрок #${args[0]} не найден`);
            inventory.deleteItem(rec, args[1], out);
        }
    },
    "/invadditems": {
        access: 6,
        description: "Добавить тестовые предметы в инвентарь игрока",
        args: "[ид_игрока]",
        handler: (player, args, out) => {
            var rec = mp.players.at(args[0]);
            if (!rec) return out.error(`Игрок #${args[0]} не найден`, player);
            inventory.addItem(rec, 1, null, 0, null, {
                variation: 1,
                texture: 0,
                sex: 1
            });
            inventory.addItem(rec, 6, null, 1, null, {
                variation: 1,
                texture: 0,
                sex: 1
            });
            inventory.addItem(rec, 14, null, 2, null, {
                variation: 1,
                texture: 0,
                sex: 1
            });
            inventory.addItem(rec, 2, null, 3, null, {
                variation: 1,
                texture: 0,
                sex: 1
            });
            inventory.addItem(rec, 3, null, 4, null, {
                variation: 1,
                texture: 0,
                sex: 1,
                pockets: '[3,3,3,3,5,4,5,5,10,6,6,6]',
                health: 100,
            });
            inventory.addItem(rec, 7, null, 5, null, {
                variation: 1,
                texture: 0,
                sex: 1,
                pockets: '[4,5,5,5,5,5]'
            });
            inventory.addItem(rec, 11, null, 6, null, {
                variation: 1,
                texture: 0,
                sex: 1
            });
            inventory.addItem(rec, 10, null, 7, null, {
                variation: 1,
                texture: 0,
                sex: 1
            });
            inventory.addItem(rec, 12, null, 8, null, {
                variation: 1,
                texture: 0,
                sex: 1
            });
            inventory.addItem(rec, 13, null, 10, null, {
                variation: 1,
                texture: 0,
                sex: 1,
                pockets: '[2,2,6,5,2,3,6,6,12,10]'
            });
            inventory.addItem(rec, 8, null, 11, null, {
                variation: 1,
                texture: 0,
                sex: 1,
                pockets: '[6,6,6,6,8,10]'
            });
            inventory.addItem(rec, 9, null, 12, null, {
                variation: 1,
                texture: 0,
                sex: 1
            });

            out.info(`Тестовые предметы добавлены`, player);
        }
    },
    "/invclearitems": {
        access: 6,
        description: "Очистить инвентарь игрока",
        args: "[ид_игрока]",
        handler: (player, args, out) => {
            var rec = mp.players.at(args[0]);
            if (!rec) return out.error(`Игрок #${args[0]} не найден`, player);
            rec.inventory.items.forEach((item) => {
                if (!item.parentId) inventory.deleteItem(rec, item);
            });
            out.info(`Инвентарь ${rec.name} очищен`, player);
        }
    },
    "/invlist": {
        description: "Посмотреть общую информация о предметах инвентаря.",
        access: 6,
        args: "",
        handler: (player, args, out) => {
            var text = "ID) Имя (Описание) [вес] [высота X ширина] | модель | DeltaZ | rX | rY<br/>";
            for (var i = 0; i < inventory.inventoryItems.length; i++) {
                var item = inventory.inventoryItems[i];
                text += `${item.id}) ${item.name} (${item.description}) [${item.weight} кг] [${item.height}x${item.width}] | ${item.model} | ${item.deltaZ} | ${item.rX} | ${item.rY}<br/>`;
            }
            out.log(text, player);
        }
    },
    "/invsetitemname": {
        description: "Изменить название предмета инвентаря. (см. /invlist)",
        access: 6,
        args: "[ид_предмета] [название]",
        handler: (player, args, out) => {
            console.log(args[0] - 1)
            var item = inventory.inventoryItems[args[0] - 1];
            if (!item) return out.error(`Предмет #${args[0]} не найден`, player);

            args.splice(0, 1);
            var name = args.join(" ").trim();
            out.info(`${player.name} изменил название предмета #${item.id} (${item.name} => ${name})`);
            item.name = name;
            item.save();
        }
    },
    "/invsetitemdesc": {
        description: "Изменить описание предмета инвентаря. (см. /invlist)",
        access: 6,
        args: "[ид_предмета] [описание]",
        handler: (player, args, out) => {
            var item = inventory.inventoryItems[args[0] - 1];
            if (!item) return out.error(`Предмет #${args[0]} не найден`, player);

            args.splice(0, 1);
            var desc = args.join(" ").trim();
            out.info(`${player.name} изменил описание предмета #${item.id} (${item.description} => ${desc})`);

            item.description = desc;
            item.save();
        }
    },
    "/invsetitemweight": {
        description: "Изменить вес предмета инвентаря. (см. /invlist)",
        access: 6,
        args: "[ид_предмета] [вес]",
        handler: (player, args, out) => {
            var item = inventory.inventoryItems[args[0] - 1];
            if (!item) return out.error(`Предмет #${args[0]} не найден`, player);

            out.info(`${player.name} изменил вес предмета #${item.id} (${item.weight} => ${args[1]})`);
            item.weight = args[1];
            item.save();
        }
    },
    "/invsetitemsize": {
        description: "Изменить размер предмета инвентаря. (см. /invitems)",
        access: 6,
        args: "[ид_предмета] [высота] [ширина]",
        handler: (player, args, out) => {
            var item = inventory.inventoryItems[args[0] - 1];
            if (!item) return out.error(`Предмет #${args[0]} не найден`, player);

            out.info(`${player.name} изменил размер предмета #${args[0]} (${item.height}x${item.width} => ${args[1]}x${args[2]})`);
            item.height = args[1];
            item.width = args[2];
            item.save();
        }
    },
}
