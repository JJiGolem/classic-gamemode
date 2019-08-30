let inventory = require('./index.js');
let hospital = require('../hospital');
let notifs = require('../notifications');

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
    // вылечиться аптечкой
    "inventory.item.med.use": (player, sqlId) => {
        var header = `Аптечка`;
        var med = inventory.getItem(player, sqlId);
        if (!med) return notifs.error(player, `Предмет #${sqlId} не найден`, header);
        var count = inventory.getParam(med, 'count').value;
        if (!count) return notifs.error(player, `Количество: 0 ед.`, header);
        if (player.health >= hospital.medMaxHealth) return notifs.error(player, `Нельзя вылечиться больше`, header);

        player.health = Math.clamp(player.health + hospital.medHealth, 0, hospital.medMaxHealth);

        count--;
        if (!count) inventory.deleteItem(player, med);
        else inventory.updateParam(player, med, 'count', count);

        notifs.success(player, `Вы вылечились`, header);
        notifs.warning(player, `Медики лечат эффективнее`, header);
    },
};
