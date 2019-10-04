let bands = call('bands');
let factions = call('factions');
let inventory = require('./index.js');
let hospital = require('../hospital');
let houses = call('houses');
let mafia = call('mafia');
let notifs = require('../notifications');
let satiety = call('satiety');

module.exports = {
    "init": () => {
        inventory.init();
    },
    "characterInit.done": async (player) => {
        player.call("inventory.setMaxPlayerWeight", [inventory.maxPlayerWeight]);
        player.call("inventory.setMergeList", [inventory.mergeList]);
        player.call("inventory.registerWeaponAttachments", [inventory.bodyList[9], inventory.getWeaponModels()]);
        player.call("inventory.setSatiety", [player.character.satiety]);
        player.call("inventory.setThirst", [player.character.thirst]);
        inventory.initPlayerItemsInfo(player);
        mp.events.call("faction.holder.items.init", player);
        await inventory.initPlayerInventory(player);
        mp.events.call("inventory.done", player);
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
                if (i == -1) return notifs.error(player, `Предмет #${data.sqlId} в среде не найден. Сообщите разработчикам CRP. :)`, `Код 1`);
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
                if (!item) return notifs.error(player, `Предмет #${data.sqlId} в среде не найден. Сообщите разработчикам CRP. :)`, `Код 2`);
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
            mp.events.call("weapons.ammo.fill", player, item, target);
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

        inventory.putGround(player, item);
        notifs.success(player, `Предмет ${inventory.getName(item.itemId)} на земле`, header);
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
            if (!rec || !rec.character) return;
            var i = rec.inventory.ground.indexOf(obj);
            rec.inventory.ground.splice(i, 1);
        });

        mp.players.forEachInRange(player.position, 20, rec => {
            rec.call(`animations.play`, [player.id, {
                dict: "anim@mp_snowball",
                name: "pickup_snowball",
                speed: 1,
                flag: 1
            }, 1500]);
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
        if (bands.inWar(player.character.factionId)) return notifs.error(player, `Недоступно во время войны за территорию`, header);
        if (mafia.inWar(player.character.factionId)) return notifs.error(player, `Недоступно во время войны за бизнес`, header);

        player.health = Math.clamp(player.health + hospital.medHealth, 0, hospital.medMaxHealth);

        count--;
        if (!count) inventory.deleteItem(player, med);
        else inventory.updateParam(player, med, 'count', count);

        notifs.success(player, `Вы вылечились`, header);
    },
    // реанимировать адреналином
    "inventory.item.adrenalin.use": (player, data) => {
        if (typeof data == 'string') data = JSON.parse(data);
        var header = `Адреналин`;
        var rec = (data.recId != null) ? mp.players.at(data.recId) : mp.players.getNear(player);
        if (!rec || !rec.character) return notifs.error(player, `Гражданин не найден`, header);
        if (!rec.getVariable("knocked")) return notifs.error(player, `${rec.name} не нуждается в реанимации`, header);
        if (player.dist(rec.position) > 20) return notifs.error(player, `${rec.name} далеко`, header);
        var adrenalin = (data.itemSqlId) ? inventory.getItem(player, data.itemSqlId) : inventory.getItemByItemId(player, 26);
        if (!adrenalin) return notifs.error(player, `Необходим предмет`, header);
        var count = inventory.getParam(adrenalin, 'count').value;
        if (!count) return notifs.error(player, `Количество: 0 ед.`, header);

        rec.spawn(rec.position);
        rec.health = 10;
        rec.setVariable("knocked", false);
        mp.events.call(`mapCase.ems.calls.remove`, rec, rec.character.id);

        count--;
        if (!count) inventory.deleteItem(player, adrenalin);
        else inventory.updateParam(player, adrenalin, 'count', count);

        notifs.success(player, `${rec.name} реанимирован`, header);
        notifs.success(rec, `${player.name} вас реанимировал`, header);
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
        if (bands.inWar(player.character.factionId)) return notifs.error(player, `Недоступно во время войны за территорию`, header);
        if (mafia.inWar(player.character.factionId)) return notifs.error(player, `Недоступно во время войны за бизнес`, header);

        player.health = Math.clamp(player.health + hospital.patchHealth, 0, hospital.medMaxHealth);

        count--;
        if (!count) inventory.deleteItem(player, patch);
        else inventory.updateParam(player, patch, 'count', count);

        notifs.success(player, `Вы вылечились`, header);
    },
    // употребить наркотик
    "inventory.item.drugs.use": (player, sqlId) => {
        var header = `Наркотики`;
        var drugs = inventory.getItem(player, sqlId);
        if (!drugs) return notifs.error(player, `Предмет #${sqlId} не найден`, header);
        var count = inventory.getParam(drugs, 'count').value;
        if (!count) return notifs.error(player, `Количество: 0 г.`, header);
        if (bands.inWar(player.character.factionId)) return notifs.error(player, `Недоступно во время войны за территорию`, header);
        if (mafia.inWar(player.character.factionId)) return notifs.error(player, `Недоступно во время войны за бизнес`, header);
        var i = drugs.itemId - 29;
        if (player.lastUseDrugs) {
            var diff = Date.now() - player.lastUseDrugs;
            var wait = bands.drugsInterval[i];
            if (diff < wait) return notifs.error(player, `Повторное использование доступно через ${parseInt((wait - diff) / 1000)} сек.`, header);
        }

        player.health = Math.clamp(player.health + bands.drugsHealth[i], 0, 100);

        count--;
        if (!count) inventory.deleteItem(player, drugs);
        else inventory.updateParam(player, drugs, 'count', count);

        player.lastUseDrugs = Date.now();
        player.call(`effect`, [bands.drugsEffect[i], bands.drugsEffectTime[i]]);
        notifs.success(player, `Вы употребили наркотик`, header);

        player.character.narcotism += bands.drugsNarcotism[i];
        player.character.save();
        mp.events.call("player.narcotism.changed", player);
    },
    // употребить сигарету
    "inventory.item.smoke.use": (player, sqlId) => {
        var header = `Сигарета`;
        var smoke = inventory.getItem(player, sqlId);
        if (!smoke) return notifs.error(player, `Предмет #${sqlId} не найден`, header);
        var count = inventory.getParam(smoke, 'count').value;
        if (!count) return notifs.error(player, `Количество: 0 ед.`, header);
        if (bands.inWar(player.character.factionId)) return notifs.error(player, `Недоступно во время войны за территорию`, header);
        if (mafia.inWar(player.character.factionId)) return notifs.error(player, `Недоступно во время войны за бизнес`, header);

        player.health = Math.clamp(player.health + 2, 0, 100);

        count--;
        if (!count) inventory.deleteItem(player, smoke);
        else inventory.updateParam(player, smoke, 'count', count);

        player.call(`effect`, ['FocusOut', 15000]);
        notifs.success(player, `Вы употребили сигарету`, header);

        mp.players.forEachInRange(player.position, 20, rec => {
            rec.call(`animations.play`, [player.id, {
                dict: "amb@code_human_wander_smoking@male@idle_a",
                name: "idle_a",
                speed: 1,
                flag: 49
            }, 8000]);
        });

        player.character.nicotine++;
        player.character.save();
        mp.events.call("player.nicotine.changed", player);
    },
    // употребить еду
    "inventory.item.eat.use": (player, sqlId) => {
        var header = `Еда`;
        var eat = inventory.getItem(player, sqlId);
        if (!eat) return notifs.error(player, `Предмет #${sqlId} не найден`, header);

        var params = inventory.getParamsValues(eat);
        var character = player.character;

        satiety.set(player, character.satiety + (params.satiety || 10), character.thirst + (params.thirst || 10));
        notifs.success(player, `Вы съели ${inventory.getName(eat.itemId)}`, header);

        mp.players.forEachInRange(player.position, 20, rec => {
            rec.call(`animations.play`, [player.id, {
                dict: "amb@code_human_wander_eating_donut@male@idle_a",
                name: "idle_c",
                speed: 1,
                flag: 49
            }, 7000]);
        });

        inventory.deleteItem(player, eat);
    },
    // употребить напиток
    "inventory.item.drink.use": (player, sqlId) => {
        var header = `Напиток`;
        var drink = inventory.getItem(player, sqlId);
        if (!drink) return notifs.error(player, `Предмет #${sqlId} не найден`, header);

        var params = inventory.getParamsValues(drink);
        var character = player.character;

        satiety.set(player, character.satiety + (params.satiety || 10), character.thirst + (params.thirst || 10));
        notifs.success(player, `Вы выпили ${inventory.getName(drink.itemId)}`, header);

        mp.players.forEachInRange(player.position, 20, rec => {
            rec.call(`animations.play`, [player.id, {
                dict: "amb@code_human_wander_drinking_fat@female@idle_a",
                name: "idle_c",
                speed: 1,
                flag: 49
            }, 7000]);
        });

        inventory.deleteItem(player, drink);
    },
    // Запрос предметов инвентаря в багажнике авто
    "vehicle.boot.items.request": (player, vehId) => {
        var header = `Багажник`;
        var veh = mp.vehicles.at(vehId);
        if (!veh) return notifs.error(player, `Авто #${vehId} не найдено`, header);
        var dist = player.dist(veh.position);
        if (!veh.db) return notifs.error(player, `Авто #${vehId} не находится в БД`, header);
        if (dist > 50) return notifs.error(player, `Авто ${veh.db.modelName} слишком далеко`, header);
        if (!veh.getVariable("trunk")) return notifs.error(player, `Багажник закрыт`, header);
        if (!veh.inventory) return notifs.error(player, `Авто ${veh.db.modelName} не имеет багажник`, header);
        if (veh.bootPlayerId != null) {
            var rec = mp.players.at(veh.bootPlayerId);
            if (rec && rec.character && rec.dist(veh.position) < 50) return notifs.error(player, `С багажником взаимодействует другой игрок`, header);
        }

        veh.bootPlayerId = player.id;

        var place = {
            sqlId: -veh.db.id,
            header: veh.db.modelName,
            pockets: inventory.getEnvironmentClientPockets(veh.inventory.items, "Vehicle"),
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
    // Иниц. предметов инвентаря в шкафу организации
    "faction.holder.items.init": (player) => {
        if (!player.character.factionId) return;
        var holder = factions.getHolder(player.character.factionId);
        inventory.initFactionInventory(player, holder);
    },
    // Запрос предметов инвентаря в шкафу организации
    "faction.holder.items.request": (player, faction) => {
        var header = `Шкаф ${faction.name}`;
        var holder = factions.getHolder(faction.id);

        var items = holder.inventory.items[player.character.id];
        if (!items) return notifs.error(player, `У вас нет личного шкафа`, header);

        var place = {
            sqlId: -player.character.id,
            header: header,
            pockets: inventory.getEnvironmentClientPockets(items, "Faction"),
        };
        player.inventory.place.sqlId = place.sqlId;
        player.inventory.place.type = "Faction";
        player.inventory.place.items = items;
        player.call(`inventory.addEnvironmentPlace`, [place]);
    },
    // Запрос на очищение предметов в шкафу организации
    "faction.holder.items.clear": (player) => {
        player.inventory.place = {};
        player.call(`inventory.deleteEnvironmentPlace`, [-player.character.id]);
    },
    // Удаление предметов в шкафу организации
    "faction.holder.items.remove": (player) => {
        if (!player.character.factionId) return;
        var holder = factions.getHolder(player.character.factionId);
        delete holder.inventory.items[player.character.id];
    },
    // Уничтожение предметов в шкафу организациий
    "faction.holder.items.destroy": (player) => {
        // factions.destroyHolderItems(player);
    },
    // Запрос предметов инвентаря в шкафу дома
    "house.holder.items.request": (player, holder) => {
        var header = `Шкаф`;

        var items = holder.inventory.items;
        if (!items) return notifs.error(player, `Шкаф сломан`, header); // где-то баг, если выполнится вдруг

        if (holder.playerId != null) {
            var rec = mp.players.at(holder.playerId);
            if (rec && rec.character && rec.dist(holder.position) < 5) return notifs.error(player, `Со шкафом взаимодействует другой игрок`, header);
        }
        if (player.character.id != holder.houseInfo.characterId) return notifs.error(player, `Вы не являетесь владельцем дома`, header);

        holder.playerId = player.id;

        var place = {
            sqlId: -holder.houseInfo.id,
            header: header,
            pockets: inventory.getEnvironmentClientPockets(items, "House"),
        };
        player.inventory.place.sqlId = place.sqlId;
        player.inventory.place.type = "House";
        player.inventory.place.items = items;
        player.call(`inventory.addEnvironmentPlace`, [place]);
    },
    // Запрос на очищение предметов в шкафу дома
    "house.holder.items.clear": (player, holder) => {
        player.inventory.place = {};

        if (player.id == holder.playerId) {
            player.call(`inventory.deleteEnvironmentPlace`, [-holder.houseInfo.id]);
            delete holder.playerId;
        }
    },
    "player.faction.changed": (player) => {
        mp.events.call("faction.holder.items.destroy", player);
        mp.events.call("faction.holder.items.clear", player);
        mp.events.call("faction.holder.items.init", player);
    },
    "death.spawn": (player) => {
        if (!player.character) return;
        var weapons = inventory.getArrayWeapons(player);
        if (!weapons.length) return;
        weapons.forEach(weapon => {
            inventory.putGround(player, weapon);
        });
        notifs.warning(player, `Вы потеряли оружие`, `Инвентарь`);
    },
    "playerQuit": (player) => {
        if (!player.character) return;
        mp.events.call("faction.holder.items.remove", player);
        if (!player.inventory) return;

        if (player.inventory.place) {
            if (player.inventory.place.type == "Vehicle") {
                var veh = mp.vehicles.getBySqlId(-player.inventory.place.sqlId);
                if (!veh) return;
                delete veh.bootPlayerId;
            } else if (player.inventory.place.type == "House") {
                var holder = houses.getHouseById(-player.inventory.place.sqlId).holder;
                if (!holder) return;
                delete holder.playerId;
            }
        }
    },
};
