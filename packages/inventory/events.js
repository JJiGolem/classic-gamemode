let inventory = require('./index.js');
module.exports = {
    "init": () => {
        inventory.init();
    },
    "characterInit.done": (player) => {
        player.call("inventory.setSatiety", [player.character.satiety])
        player.call("inventory.setThirst", [player.character.thirst]);
        inventory.initPlayerItemsInfo(player);
        inventory.initPlayerInventory(player);
    },
    // срабатывает, когда игрок переместил предмет (в любом месте)
    "item.add": (player, data) => {
        data = JSON.parse(data);
        console.log("item.add")
        console.log(data)

        if (data.placeSqlId > 0 || data.placeSqlId == null) { // переместил в свой карман или на себя
            var item = inventory.getItem(player, data.sqlId);
            if (item) { // предмет уже есть у игрока
                if (item.parentId == null && data.placeSqlId) { // снял вещь
                    inventory.clearView(player, item.itemId);
                } else if (item.parentId && data.placeSqlId == null) { // надел вещь
                    inventory.updateView(player, item);
                }
                item.pocketIndex = data.pocketI;
                item.index = data.index,
                item.parentId = data.placeSqlId;
                item.save();
            } else { // игрок взял предмет из окруж. среды


            }
        } else { // переместил в окруж. среду

        }
    },
};
