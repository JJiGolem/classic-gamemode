let bins = call('bins');

module.exports = {
    "/binshow": {
        access: 1,
        description: "Показать мусорки на карте в радиусе 50м.",
        args: "",
        handler: (player, args, out) => {
            var list = [];
            bins.colshapes.forEach(el => {
                var pos = new mp.Vector3(el.bin.x, el.bin.y, el.bin.z);
                if (player.dist(pos) < 50) list.push(pos);
            });
            if (!list.length) return out.error(`Мусорок поблизости нет`, player);
            out.log(`Мусорки показаны на карте (${list.length} шт.)`, player);

            player.call(`bins.blips.show`, [list]);
        }
    },
    "/binhide": {
        access: 1,
        description: "Скрыть мусорки на карте",
        args: "",
        handler: (player, args, out) => {
            out.log(`Мусорки скрыты на карте`);
            player.call(`bins.blips.hide`);
        }
    },
    "/binadd": {
        access: 6,
        description: "Добавить мусорку",
        args: "",
        handler: (player, args, out) => {
            bins.add(player.position);
            out.info(`${player.name} добавил мусорку`);
        }
    },
    "/bindel": {
        access: 6,
        description: "Удалить мусорку",
        args: "",
        handler: (player, args, out) => {
            var colshape = bins.getNear(player);
            if (!colshape) return out.error(`Мусорки поблизости не найдено`, player);

            out.info(`${player.name} удалил мусорку #${colshape.bin.id}`);
            bins.remove(colshape.bin.id);
        }
    },
}
