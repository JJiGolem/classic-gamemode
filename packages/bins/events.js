let bins = call('bins');
let inventory = call('inventory');
let money = call('money');
let notifs = call('notifications');

module.exports = {
    "init": () => {
        bins.init();
        inited(__dirname);
    },
    "bins.trash.take": (player) => {
        var colshape = player.insideBin;
        if (!colshape) return out(`Вы не возле мусорки`);
        if (colshape.lastFindTime) {
            var diff = Date.now() - colshape.lastFindTime;
            if (diff < bins.findInterval) return notifs.error(player, `Эту мусорку уже вычистили до вас`);
        }
        colshape.lastFindTime = Date.now();

        var trashInfo = bins.getRandomTrash();
        if (!trashInfo) return notifs.error(player, `Ничего не нашли`);

        var name = inventory.getName(trashInfo.itemId);
        var out = (text) => {
            notifs.error(player, text, name)
        };

        var cant = inventory.cantAdd(player, trashInfo.itemId, {});
        if (cant) return out(cant);

        inventory.addItem(player, trashInfo.itemId, {}, (e) => {
            if (e) out(e);
        });

        notifs.success(player, `Вы нашли ${name}`, `Мусорка`);
    },
    "bins.trash.sell": (player) => {
        var header = `Сдача мусора`;
        if (!player.insideDumb) return notifs.error(player, `Вы не у свалки`, header);

        var trashIds = bins.trashesInfo.map(x => x.itemId);
        var items = inventory.getArrayByItemId(player, trashIds);
        if (!items.length) return notifs.error(player, `Вы не имеете мусор`, header);
        var pay = 0;
        items.forEach(item => {
            var price = bins.trashesInfo.find(x => x.itemId == item.itemId).price;
            pay += price;
            inventory.deleteItem(player, item);
        });
        money.addCash(player, pay, (res) => {
            if (!res) notifs.error(player, `Ошибка начисления наличных`, header);
        }, `Сдача мусора на свалке`);

        notifs.success(player, `Мусор сдан на переработку`, header);
    },
};
