let inventory = require('./index');

module.exports = {
    "/invdelete": {
        access: 6,
        description: "Удалить предмет из инвентаря игрока",
        args: "[ид_игрока]:n [ид_предмета]:n",
        handler: (player, args, out) => {
            var rec = mp.players.at(args[0]);
            if (!rec) return out.error(player, `Игрок #${args[0]} не найден`);
            inventory.deleteItem(rec, args[1]);
        }
    },
    "/invadditems": {
        access: 6,
        description: "Добавить тестовые предметы в инвентарь игрока",
        args: "[ид_игрока]:n",
        handler: (player, args, out) => {
            var rec = mp.players.at(args[0]);
            if (!rec) return out.error(`Игрок #${args[0]} не найден`, player);
            var slot = inventory.findFreeSlot(rec, 1);
            inventory.addItem(rec, 1, slot, {
                variation: 1,
                texture: 0,
                sex: 1
            });
            var slot = inventory.findFreeSlot(rec, 6);
            inventory.addItem(rec, 6, slot, {
                variation: 1,
                texture: 0,
                sex: 1
            });
            var slot = inventory.findFreeSlot(rec, 14);
            inventory.addItem(rec, 14, slot, {
                variation: 1,
                texture: 0,
                sex: 1
            });
            var slot = inventory.findFreeSlot(rec, 2);
            inventory.addItem(rec, 2, slot, {
                variation: 1,
                texture: 0,
                sex: 1
            });
            var slot = inventory.findFreeSlot(rec, 3);
            inventory.addItem(rec, 3, slot, {
                variation: 1,
                texture: 0,
                sex: 1,
                pockets: '[3,3,3,3,5,4,5,5,10,6,6,6]',
                health: 100,
            });
            var slot = inventory.findFreeSlot(rec, 7);
            inventory.addItem(rec, 7, slot, {
                variation: 1,
                texture: 0,
                sex: 1,
                pockets: '[4,5,5,5,5,5]'
            });
            // return;
            var slot = inventory.findFreeSlot(rec, 11);
            inventory.addItem(rec, 11, slot, {
                variation: 1,
                texture: 0,
                sex: 1
            });
            var slot = inventory.findFreeSlot(rec, 10);
            inventory.addItem(rec, 10, slot, {
                variation: 1,
                texture: 0,
                sex: 1
            });
            var slot = inventory.findFreeSlot(rec, 12);
            inventory.addItem(rec, 12, slot, {
                variation: 1,
                texture: 0,
                sex: 1
            });
            var slot = inventory.findFreeSlot(rec, 13);
            inventory.addItem(rec, 13, slot, {
                variation: 1,
                texture: 0,
                sex: 1,
                pockets: '[2,2,6,5,2,3,6,6,12,10]'
            });
            var slot = inventory.findFreeSlot(rec, 8);
            inventory.addItem(rec, 8, slot, {
                variation: 1,
                texture: 0,
                sex: 1,
                pockets: '[6,6,6,6,8,10]'
            });
            var slot = inventory.findFreeSlot(rec, 9);
            inventory.addItem(rec, 9, slot, {
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
        args: "[ид_игрока]:n",
        handler: (player, args, out) => {
            var rec = mp.players.at(args[0]);
            if (!rec) return out.error(`Игрок #${args[0]} не найден`, player);
            inventory.clearItems(rec);
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
        args: "[ид_предмета]:n [название]",
        handler: (player, args, out) => {
            console.log(args[0] - 1)
            var item = inventory.inventoryItems[args[0] - 1];
            if (!item) return out.error(`Предмет #${args[0]} не найден`, player);

            args.splice(0, 1);
            var name = args.join(" ").trim();
            out.info(`${player.name} изменил название предмета #${item.id} (${item.name} => ${name})`);
            item.name = name;
            item.save();
            inventory.updateItemInfo(item);
        }
    },
    "/invsetitemdesc": {
        description: "Изменить описание предмета инвентаря. (см. /invlist)",
        access: 6,
        args: "[ид_предмета]:n [описание]",
        handler: (player, args, out) => {
            var item = inventory.inventoryItems[args[0] - 1];
            if (!item) return out.error(`Предмет #${args[0]} не найден`, player);

            args.splice(0, 1);
            var desc = args.join(" ").trim();
            out.info(`${player.name} изменил описание предмета #${item.id} (${item.description} => ${desc})`);

            item.description = desc;
            item.save();
            inventory.updateItemInfo(item);
        }
    },
    "/invsetitemweight": {
        description: "Изменить вес предмета инвентаря. (см. /invlist)",
        access: 6,
        args: "[ид_предмета]:n [вес]:n",
        handler: (player, args, out) => {
            var item = inventory.inventoryItems[args[0] - 1];
            if (!item) return out.error(`Предмет #${args[0]} не найден`, player);

            out.info(`${player.name} изменил вес предмета #${item.id} (${item.weight} => ${args[1]})`);
            item.weight = args[1];
            item.save();
            inventory.updateItemInfo(item);
        }
    },
    "/invsetitemsize": {
        description: "Изменить размер предмета инвентаря. (см. /invlist)",
        access: 6,
        args: "[ид_предмета]:n [высота]:n [ширина]:n",
        handler: (player, args, out) => {
            var item = inventory.inventoryItems[args[0] - 1];
            if (!item) return out.error(`Предмет #${args[0]} не найден`, player);

            out.info(`${player.name} изменил размер предмета #${args[0]} (${item.height}x${item.width} => ${args[1]}x${args[2]})`);
            item.height = args[1];
            item.width = args[2];
            item.save();
            inventory.updateItemInfo(item);
        }
    },
    "/invsetitemmodel": {
        description: "Изменить модель предмета инвентаря. Эта модель используется, когда игрок выкидывает предмет. (см. /invlist)",
        access: 6,
        args: "[ид_предмета]:n [модель]",
        handler: (player, args, out) => {
            var item = inventory.inventoryItems[args[0] - 1];
            if (!item) return out.error(`Предмет #${args[0]} не найден`, player);

            var model = args[1].trim();
            out.info(`${player.name} изменил модель предмета #${args[0]} (${item.model} => ${model})`);
            item.model = model;
            item.save();
            inventory.updateItemInfo(item);
        }
    },
    "/invsetitemdeltaz": {
        description: "Изменить deltaZ предмета инвентаря. Смещение модели по высоте, когда игрок выкидывает предмет. (см. /invlist)",
        access: 6,
        args: "[ид_предмета]:n [deltaZ]:n",
        handler: (player, args, out) => {
            var item = inventory.inventoryItems[args[0] - 1];
            if (!item) return out.error(`Предмет #${args[0]} не найден`, player);

            out.info(`${player.name} изменил deltaZ предмета #${args[0]} (${item.deltaZ} => ${args[1]})`);
            item.deltaZ = args[1];
            item.save();
            inventory.updateItemInfo(item);
        }
    },
    "/invsetitemrot": {
        description: "Изменить rotation предмета инвентаря. Поворот модели, когда игрок выкидывает предмет. (см. /invlist)",
        access: 6,
        args: "[ид_предмета]:n [x]:n [y]:n",
        handler: (player, args, out) => {
            var item = inventory.inventoryItems[args[0] - 1];
            if (!item) return out.error(`Предмет #${args[0]} не найден`, player);

            out.info(`${player.name} изменил rotation предмета #${args[0]} (${item.rX}x${item.rY} => ${args[1]}x${args[2]})`);
            item.rX = args[1];
            item.rY = args[2];
            item.save();
            inventory.updateItemInfo(item);
        }
    },
    "/pitems": {
        access: 6,
        description: "Логировать предметы игрока в консоль",
        args: "",
        handler: (player) => {
            console.log(player.inventory.items)
        }
    },
}
