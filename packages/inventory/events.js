let inventory = require('./index.js');
module.exports = {
    "init": () => {
        inventory.init();
    },
    "characterInit.done": (player) => {
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
                item.pocketIndex = data.pocketI;
                item.index = data.index,
                item.parentId = data.placeSqlId;
                console.log(item)
                item.save();
                if (item.parentId == null) { // надел вещь
                    inventory.updateView(player, item);
                }
            } else { // игрок взял предмет из окруж. среды


            }
        } else { // переместил в окруж. среду

        }
    },
};
