let masks = require('./index.js');
module.exports = {
    "init": () => {
        masks.init();
    },
    "masks.shop.enter": (player) => {
        let list = masks.getRawMaskList();
        let data = masks.getShopData();
        player.dimension = player.id + 1;
        player.call("masks.shop.enter", [data, list]);
    },
    "masks.shop.exit": (player) => {
        player.dimension = 0;
    }
}