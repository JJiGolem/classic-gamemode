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
    "item.ground.put": (player, sqlId) => {
        // console.log(`item.ground.put: ${sqlId}`)
        var header = `Выброс предмета`;
        var item = inventory.getItem(player, sqlId);
        if (!item) return notifs.error(player, `Предмет #${sqlId} не найден`, header);

        if (player.vehicle) return notifs.error(player, `Недоступно в авто`, header);
        if (player.hasCuffs) return notifs.error(`Недоступно в наручниках`, header);

        var children = inventory.getArrayItems(player, item);
        inventory.deleteItem(player, item);

        var info = inventory.getInventoryItem(item.itemId);
        var pos = player.position;
        pos.z += info.deltaZ - 1;

        var newObj = mp.objects.new(mp.joaat(info.model), pos, {
            rotation: new mp.Vector3(info.rX, info.rY, player.heading),
            dimension: player.dimension
        });
        newObj.playerId = player.id;
        newObj.item = item;
        newObj.children = children;
        newObj.setVariable("groundItem", true);
        player.inventory.ground.push(newObj);

        notifs.success(player, `Предмет ${info.name} на земле`, header);

        var objId = newObj.id;
        newObj.destroyTimer = setTimeout(() => {
            try {
                var obj = mp.objects.at(objId);
                if (!obj || !obj.item || obj.item.id != sqlId) return;
                obj.destroy();
                var rec = mp.players.at(obj.playerId);
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
    // срабатывает, когда игрок поднимает предмет
    "item.ground.take": (player, objId) => {
        // console.log(`item.ground.take: ${objId}`)
        var header = `Поднятие предмета`;
        var obj = mp.objects.at(objId);
        if (!obj) return notifs.error(player, `Объект #${objId} не найден`, header);

        if (!obj.getVariable("groundItem") || !obj.item) return notifs.error(player, `Объект #${objId} не является предметом`, header);
        if (obj.denyTake) return notifs.error(player, `Предмет занят другим игроком`, header);
        if (player.hasCuffs) return notifs.error(player, `Недоступно в наручниках`, header);
        var dist = player.dist(obj.position);
        if (dist > inventory.groundMaxDist) return notifs.error(player, `Вы слишком далеко от предмета`, header);
        var slot = inventory.findFreeSlot(player, obj.item.itemId);
        if (!slot) {
            //ищем предметы с вместимостью
            mp.objects.forEachInRange(player.position, inventory.groundMaxDist, (sObj) => {
                if (!sObj.getVariable("groundItem") || !sObj.item) return;

                var sItem = sObj.item;
                var params = inventory.getParamsValues(sItem);
                if (!params.pockets) return;

                slot = inventory.findFreeSlot(player, sItem.itemId);
                if (slot) obj = sObj;
            });
        }
        obj.children.forEach((item) => {
            item.playerId = player.character.id;
            item.save();
            player.inventory.items.push(item);
        });
        obj.denyTake = true;
        inventory.addOldItem(player, obj.item, (e) => {
            delete obj.denyTake;
            if (e) return notifs.error(player, e, header);

            // TODO: проиграть анимацию
            // mp.events.call("anim", player, "random@domestic", "pickup_low", 0, 1000);
            notifs.success(player, `Предмет ${inventory.getName(obj.item.itemId)} в инвентаре`, header);
            clearTimeout(obj.destroyTimer);
            obj.destroy();
            var rec = mp.players.at(obj.playerId);
            if (!rec) return;
            var i = rec.inventory.ground.indexOf(obj);
            rec.inventory.ground.splice(i, 1);
        });
    },
    // вылечиться аптечкой
    "inventory.item.med.use": (player, sqlId) => {
        var header = `Аптечка`;
        var med = inventory.getItem(player, sqlId);
        if (!med) return notifs.error(player, `Предмет #${sqlId} не найден`, header);
        var count = inventory.getParam(med, 'count').value;
        if (!count) return notifs.error(player, `Количество: 0 ед.`, header);
        if (player.health >= hospital.medMaxHealth) {
            notifs.error(player, `Нельзя вылечиться больше`, header);
            notifs.warning(player, `Медики лечат эффективнее`, header);
            return;
        }

        player.health = Math.clamp(player.health + hospital.medHealth, 0, hospital.medMaxHealth);

        count--;
        if (!count) inventory.deleteItem(player, med);
        else inventory.updateParam(player, med, 'count', count);

        notifs.success(player, `Вы вылечились`, header);
    },
    // вылечиться пластырем
    "inventory.item.patch.use": (player, sqlId) => {
        var header = `Пластырь`;
        var patch = inventory.getItem(player, sqlId);
        if (!patch) return notifs.error(player, `Предмет #${sqlId} не найден`, header);
        var count = inventory.getParam(patch, 'count').value;
        if (!count) return notifs.error(player, `Количество: 0 ед.`, header);
        if (player.health >= hospital.medMaxHealth) {
            notifs.error(player, `Нельзя вылечиться больше`, header);
            notifs.warning(player, `Медики лечат эффективнее`, header);
            return;
        }

        player.health = Math.clamp(player.health + hospital.patchHealth, 0, hospital.medMaxHealth);

        count--;
        if (!count) inventory.deleteItem(player, patch);
        else inventory.updateParam(player, patch, 'count', count);

        notifs.success(player, `Вы вылечились`, header);
    },
    // Запрос предметов инвентаря в багажнике авто
    "vehicle.boot.items.request": (player, vehId) => {
        var header = `Багажник`;
        var veh = mp.vehicles.at(vehId);
        if (!veh) return notifs.error(player, `Авто #${vehId} не найдено`, header);
        var dist = player.dist(veh.position);
        if (!veh.db) return notifs.error(player, `Авто #${vehId} не находится в БД`, header);
        if (dist > 10) return notifs.error(player, `Авто ${veh.db.modelName} слишком далеко`, header);
        // if (!veh.getVariable("trunk")) return player.utils.error(`Багажник закрыт!`);
        // if (!veh.inventory) return notifs.error(player, `Авто ${veh.db.modelName} не имеет багажник`, header);
        if (veh.bootPlayerId != null) return notifs.error(player, `С багажником взаимодействует другой игрок`, header);

        veh.bootPlayerId = player.id;
        player.bootVehicleId = veh.id;
        // player.call(`inventory.addVehicleItems`, [veh.inventory.items, {
        //     name: veh.name,
        //     sqlId: veh.sqlId
        // }, 5, 10]);

        var place = {
            sqlId: -veh.db.id,
            header: veh.db.modelName,
            pockets: [{
                    cols: 10,
                    rows: 10,
                    items: {}
                },
                {
                    cols: 10,
                    rows: 10,
                    items: {}
                }
            ],
        };
        player.call(`inventory.addEnvironmentPlace`, [place]);
    },
    // Запрос на очищение предметов в багажнике
    "vehicle.boot.items.clear": (player, vehId) => {
        var veh = mp.vehicles.at(vehId);
        delete player.bootVehicleId;

        if (veh && player.id == veh.bootPlayerId) {
            player.call(`inventory.deleteEnvironmentPlace`, [-veh.db.id]);
            delete veh.bootPlayerId;
        }
    },
};
