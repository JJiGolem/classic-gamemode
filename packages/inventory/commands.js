let inventory = require('./index');

module.exports = {
    "/inv_delete": {
        access: 6,
        description: "Удалить предмет ",
        args: "[ид_предмета]:n",
        handler: (player, args) => {
            inventory.deleteItem(player, args[0]);
        }
    },
}
