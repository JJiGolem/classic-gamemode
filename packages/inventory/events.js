var inventory = require('./index.js');
module.exports = {
    "init": () => {
        inventory.loadInventoryItemsFromDB();
    },
    "characterInit.done": (player) => {
        inventory.initPlayerInventory(player);
    }
};
