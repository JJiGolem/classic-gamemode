let bins = call('bins');

module.exports = {
    "/binshow": {
        access: 1,
        description: "Показать мусорки на карте в радиусе 50м.",
        args: "",
        handler: (player, args) => {
            var list = [];
            bins.list.forEach(el => {
                var pos = new mp.Vector3(el.x, el.y, el.z);
                if (player.dist(pos) < 50) list.push(el);
            });
            player.call(`bins.blips.show`, [list]);
        }
    },
    "/binhide": {
        access: 1,
        description: "Скрыть мусорки на карте",
        args: "",
        handler: (player, args) => {
            player.call(`bins.blips.hide`);
        }
    },
}
