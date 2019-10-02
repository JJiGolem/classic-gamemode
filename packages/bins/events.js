let bins = call('bins');
let inventory = call('inventory');
let notifs = call('notifications');

module.exports = {
    "init": () => {
        bins.init();
    },
    "bins.trash.take": (player) => {
        var colshape = player.insideBin;
        if (!colshape) return out(`Вы не возле мусорки`);
        if (colshape.lastFindTime) {
            var diff = Date.now() - colshape.lastFindTime;
            if (diff < bins.findInterval) return notifs.error(player, `Эту мусорку уже вычистили до вас`);
        }

        var trashInfo = bins.getRandomTrash();
        var name = inventory.getName(trashInfo.itemId);
        var out = (text) => {
            notifs.error(player, text, name)
        };

        var cant = inventory.cantAdd(player, trashInfo.itemId, {});
        if (cant) return out(cant);

        inventory.addItem(player, trashInfo.itemId, {}, (e) => {
            if (e) out(e);

            colshape.lastFindTime = Date.now();
        });

        notifs.success(player, `Вы нашли ${name}`, `Мусорка`);
    }
};
