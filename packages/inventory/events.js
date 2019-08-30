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
    // срабатывает, когда игрок выкидывает предмет
    "item.throw": (player, sqlId) => {
        var header = `Выброс предмета`;
        var item = inventory.getItem(player, sqlId);
        if (!item) return notifs.error(player, `Предмет #${sqlId} не найден`, header);

        if (player.vehicle) return notifs.error(player, `Недоступно в авто`, header);
        if (player.hasCuffs) return notifs.error(`Недоступно в наручниках`, header);

        inventory.deleteItem(player, item);

        var info = inventory.getInventoryItem(item.itemId);
        var pos = player.position;
        pos.z += info.deltaZ - 1;

        var newObj = mp.objects.new(mp.joaat(info.model), pos, {
            rotation: new mp.Vector3(info.rX, info.rY, player.heading),
            dimension: player.dimension
        });
        newObj.item = item;
        newObj.setVariable("groundItem", true);
        player.inventory.ground.push(newObj);

        notifs.success(player, `Предмет ${info.name} на земле`, header);

        var objId = newObj.id;
        var playerId = player.id;
        newObj.destroyTimer = setTimeout(() => {
            try {
                var obj = mp.objects.at(objId);
                if (!obj || !obj.item || obj.item.id != sqlId) return;
                obj.destroy();
                var rec = mp.players.at(playerId);
                if (!rec) return;
                var i = rec.inventory.ground.indexOf(obj);
                rec.inventory.ground.splice(i, 1);
            } catch (e) {
                console.log(e);
            }
        }, inventory.groundItemTime);

        var ground = player.inventory.ground;
        if (ground.length > inventory.groundMaxItems) {
            var obj = ground.shift();
            clearTimeout(obj.destroyTimer);
            obj.destroy();
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
