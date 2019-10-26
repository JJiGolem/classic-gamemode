let world = call('world');

module.exports = {
    "/worldadd": {
        access: 3,
        description: "Добавить объект мира. Позиция берется от игрока.<br/>Хеш - по-умолчанию ставить 0.<br/>Типы: 1 - дерево",
        args: "[тип]:n [радиус]:n [хеш]:n [название]",
        handler: (player, args, out) => {
            args[0] = Math.clamp(args[0], 0, 1);
            args[2] = args[2].toString();
            var name = args.slice(3).join(" ");

            player.call(`world.objects.add`, [args[0], args[1], args[2], name]);
        }
    },
    "/worldshow": {
        access: 1,
        description: "Показать объекты мира в радиусе.",
        args: "[тип]:n [радиус]:n",
        handler: (player, args, out) => {
            var list = [];
            for (var objId in world.colshapes) {
                var el = world.colshapes[objId];
                if (player.dist(el.db.pos) < args[1]) list.push(el.db.dataValues);
            }
            out.log(`Объекты показаны на карте в радиусе ${args[1]} м. (${list.length} шт.)`, player);

            player.call(`world.objects.show`, [list]);
        }
    },
}
