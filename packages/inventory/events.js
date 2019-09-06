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
        console.log(`item.add: ${player.name}`)
        console.log(data)
        var item = inventory.getItem(player, data.sqlId);
        if (data.placeSqlId > 0 || data.placeSqlId == null) { // переместил в свой карман или на себя
            if (item) { // предмет уже есть у игрока
                if (item.parentId == null && data.placeSqlId) { // снял вещь
                    inventory.clearView(player, item.itemId);
                    var params = inventory.getParamsValues(item);
                    if (params.weaponHash) inventory.giveWeapon(player, params.weaponHash, params.ammo);
                } else if (item.parentId && data.placeSqlId == null) { // надел вещь
                    inventory.updateView(player, item);
                }
                item.pocketIndex = data.pocketI;
                item.index = data.index;
                item.parentId = data.placeSqlId;
                item.save();
            } else { // игрок взял предмет из окруж. среды
                var i = player.inventory.place.items.findIndex(x => x.id == data.sqlId);
                var item = player.inventory.place.items[i];
                inventory.addPlayerItem(player, item, data.placeSqlId, data.pocketI, data.index);
                item.destroy();
                player.inventory.place.items.splice(i, 1);
            }
        } else { // переместил в окруж. среду
            if (item) { // переместил из своего инвентаря в окруж. среду
                inventory.addEnvironmentItem(player, item, data.pocketI, data.index);
                inventory.deleteItem(player, item);
            } else { // предмет уже находится в окруж. среде
                item = player.inventory.place.items.find(x => x.id == data.sqlId);
                item.pocketIndex = data.pocketI;
                item.index = data.index;
                item.save();
            }
        }
    },
    // срабатывает, когда игрок переместил предмет на предмет (в любом месте)
    "item.merge": (player, data) => {
        data = JSON.parse(data);
        console.log(`item.merge: ${player.name}`)
        console.log(data)
        var header = `Слияние предметов`;
        var item = inventory.getItem(player, data.sqlId);
        var target = inventory.getItem(player, data.targetSqlId);
        if (!item) return notifs.error(player, `Предмет #${data.sqlId} не найден`, header);
        if (!target) return notifs.error(player, `Целевой предмет #${data.targetSqlId} не найден`, header);
        if (!inventory.canMerge(item.itemId, target.itemId)) return notifs.error(player, `Предметы недоступны для слияния`, header);

        var params = inventory.getParamsValues(target);
        if (params.weaponHash) { // зарядка оружия
            mp.events.call("weapons.ammo.fill", player, target, item);
        }
    },
    // срабатывает, когда игрок выкидывает предмет
    "item.ground.put": (player, sqlId) => {
        // console.log(`item.ground.put: ${sqlId}`)
        var header = `Выброс предмета`;
        var item = inventory.getItem(player, sqlId);
        if (!item) return notifs.error(player, `Предмет #${sqlId} не найден`, header);

        if (player.vehicle) return notifs.error(player, `Недоступно в авто`, header);
        if (player.cuffs) return notifs.error(`Недоступно в наручниках`, header);

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
        if (player.cuffs) return notifs.error(player, `Недоступно в наручниках`, header);
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
            var params = inventory.getParamsValues(item);
            if (params.weaponHash) {
                var weapon = inventory.getItemByItemId(player, item.itemId);
                if (weapon) return notifs.error(player, `Оружие ${inventory.getName(item.itemId)} уже имеется`, header);
            }

            item.playerId = player.character.id;
            // из-за paranoid: true
            item.restore();
            player.inventory.items.push(item);
            inventory.giveWeapon(player, params.weaponHash, params.ammo);
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
        if (!veh.getVariable("trunk")) return notifs.error(player, `Багажник закрыт`, header);
        if (!veh.inventory) return notifs.error(player, `Авто ${veh.db.modelName} не имеет багажник`, header);
        if (veh.bootPlayerId != null) return notifs.error(player, `С багажником взаимодействует другой игрок`, header);

        veh.bootPlayerId = player.id;

        var place = {
            sqlId: -veh.db.id,
            header: veh.db.modelName,
            pockets: inventory.getVehicleClientPockets(veh.inventory.items),
        };
        player.inventory.place.sqlId = place.sqlId;
        player.inventory.place.type = "Vehicle";
        player.inventory.place.items = veh.inventory.items;
        player.call(`inventory.addEnvironmentPlace`, [place]);
    },
    // Запрос на очищение предметов в багажнике
    "vehicle.boot.items.clear": (player, vehId) => {
        var veh = mp.vehicles.at(vehId);
        player.inventory.place = {};

        if (veh && player.id == veh.bootPlayerId) {
            player.call(`inventory.deleteEnvironmentPlace`, [-veh.db.id]);
            delete veh.bootPlayerId;
        }
    },
    "playerQuit": (player) => {
        if (!player.character) return;
        if (!player.inventory.place || player.inventory.place.type != "Vehicle") return;
        var veh = mp.vehicles.getBySqlId(-player.inventory.place.sqlId);
        if (!veh) return;
        delete veh.bootPlayerId;
    },
};
