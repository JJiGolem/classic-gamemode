let inventory = require('./index.js');
module.exports = {
    "init": () => {
        inventory.init();
    },
    "characterInit.done": (player) => {
        inventory.initPlayerItemsInfo(player);
        inventory.initPlayerInventory(player);
    }
};
