let inventory = require('./index');
let notifs = require('../notifications');

module.exports = {
    "/inv_delete": {
        access: 6,
        description: "Удалить предмет из инвентаря игрока",
        args: "[ид_игрока] [ид_предмета]",
        handler: (player, args) => {
            var rec = mp.players.at(args[0]);
            if (!rec) return notifs.error(player, `Игрок #${args[0]} не найден`);
            inventory.deleteItem(rec, args[0]);
        }
    },
}
