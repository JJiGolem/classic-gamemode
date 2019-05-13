module.exports = {
    "hospitalStorage.takeClothes": (player, index) => {
        if (!player.colshape || !player.colshape.hospitalStorage) return player.utils.error(`Вы не у склада FIB!`);
        var hospitalStorageMarker = player.colshape.hospitalStorage;
        if (!mp.factions.isHospitalFaction(player.faction)) return player.utils.error(`Вы не являетесь секретным агентом!`);

        var faction = mp.factions.getBySqlId(player.faction);
        if (!faction) return player.utils.error(`Организация с ID: ${player.faction} не найдена!`);
        var hospital = faction.name;

        if (faction.products < mp.economy["police_mainclothes_products"].value) return player.utils.error(`Недостаточно боеприпасов!`);
        var hats = player.inventory.getArrayByItemId(6);
        var tops = player.inventory.getArrayByItemId(7);
        var legs = player.inventory.getArrayByItemId(8);
        var feets = player.inventory.getArrayByItemId(9);
        var ears = player.inventory.getArrayByItemId(10);
        var ties = player.inventory.getArrayByItemId(2);
        var masks = player.inventory.getArrayByItemId(14);
        var glasses = player.inventory.getArrayByItemId(1);

        for (var key in hats)
            if (mp.factions.isHospitalFaction(hats[key].params.faction)) return player.utils.error(`У Вас уже есть головной убор ${hospital}!`);
        for (var key in tops)
            if (mp.factions.isHospitalFaction(tops[key].params.faction)) return player.utils.error(`У Вас уже есть рубашка ${hospital}!`);
        for (var key in legs)
            if (mp.factions.isHospitalFaction(legs[key].params.faction)) return player.utils.error(`У Вас уже есть брюки ${hospital}!`);
        for (var key in feets)
            if (mp.factions.isHospitalFaction(feets[key].params.faction)) return player.utils.error(`У Вас уже есть ботинки ${hospital}!`);
        for (var key in ears)
            if (mp.factions.isHospitalFaction(ears[key].params.faction)) return player.utils.error(`У Вас уже есть наушники ${hospital}!`);
        for (var key in ties)
            if (mp.factions.isHospitalFaction(ties[key].params.faction)) return player.utils.error(`У Вас уже есть аксессуар ${hospital}!`);
        for (var key in masks)
            if (mp.factions.isHospitalFaction(masks[key].params.faction)) return player.utils.error(`У Вас уже есть шлем ${hospital}!`);
        for (var key in glasses)
            if (mp.factions.isHospitalFaction(glasses[key].params.faction)) return player.utils.error(`У Вас уже есть очки ${hospital}!`);

        mp.fullDeleteItemsByParams(6, ["faction", "owner"], [player.faction, player.sqlId]);
        mp.fullDeleteItemsByParams(7, ["faction", "owner"], [player.faction, player.sqlId]);
        mp.fullDeleteItemsByParams(8, ["faction", "owner"], [player.faction, player.sqlId]);
        mp.fullDeleteItemsByParams(9, ["faction", "owner"], [player.faction, player.sqlId]);
        mp.fullDeleteItemsByParams(10, ["faction", "owner"], [player.faction, player.sqlId]);
        mp.fullDeleteItemsByParams(2, ["faction", "owner"], [player.faction, player.sqlId]);
        mp.fullDeleteItemsByParams(14, ["faction", "owner"], [player.faction, player.sqlId]);
        mp.fullDeleteItemsByParams(1, ["faction", "owner"], [player.faction, player.sqlId]);

        var hatParams, topParams, legsParams, feetsParams, earsParams, tiesParams, masksParams, glassesParams;
        if (player.sex == 1) {
            hatParams = {
                sex: 1,
                variation: [-1, -1][index],
                texture: [0, 0][index]
            };
            topParams = {
                sex: 1,
                torso: [90, 85][index],
                variation: [249, 250][index],
                texture: [0, 0][index],
                undershirt: [-1, -1][index],
            };
            legsParams = {
                sex: 1,
                variation: [96, 96][index],
                texture: [0, 0][index]
            };
            feetsParams = {
                sex: 1,
                variation: [8, 7][index],
                texture: [0, 0][index]
            };
            earsParams = {
                sex: 1,
                variation: [-1, -1][index],
                texture: [0, 0][index]
            };
            tiesParams = {
                sex: 1,
                variation: [126, 0][index],
                texture: [0, 0][index]
            };
            masksParams = {
                sex: 1,
                variation: [-1, -1][index],
                texture: [0, 0][index]
            };
            glassesParams = {
                sex: 1,
                variation: [-1, -1][index],
                texture: [0, 0][index]
            };
        } else {
            hatParams = {
                sex: 0,
                variation: [-1, -1][index],
                texture: [0, 0][index]
            };
            topParams = {
                sex: 0,
                torso: [98, 98][index],
                variation: [250, 283][index],
                texture: [1, 0][index]
            };
            legsParams = {
                sex: 0,
                variation: [99, 99][index],
                texture: [0, 0][index]
            };
            feetsParams = {
                sex: 0,
                variation: [19, 19][index],
                texture: [0, 0][index]
            };
            earsParams = {
                sex: 0,
                variation: [-1, -1][index],
                texture: [0, 0][index]
            };
            tiesParams = {
                sex: 0,
                variation: [-1, 96][index],
                texture: [0, 0][index]
            };
            masksParams = {
                sex: 0,
                variation: [-1, -1][index],
                texture: [0, 0][index]
            };
            glassesParams = {
                sex: 0,
                variation: [-1, -1][index],
                texture: [0, 0][index]
            };
        }
        if (topParams.undershirt == -1) delete topParams.undershirt;

        hatParams.faction = player.faction;
        topParams.faction = player.faction;
        legsParams.faction = player.faction;
        feetsParams.faction = player.faction;
        earsParams.faction = player.faction;
        tiesParams.faction = player.faction;
        masksParams.faction = player.faction;
        glassesParams.faction = player.faction;

        topParams.rows = 4;
        topParams.cols = 5;
        legsParams.rows = 2;
        legsParams.cols = 4;
        topParams.name = hospital;
        legsParams.name = hospital;

        hatParams.owner = player.sqlId;
        topParams.owner = player.sqlId;
        legsParams.owner = player.sqlId;
        feetsParams.owner = player.sqlId;
        earsParams.owner = player.sqlId;
        tiesParams.owner = player.sqlId;
        masksParams.owner = player.sqlId;
        glassesParams.owner = player.sqlId;

        var response = (e) => {
            if (e) player.utils.error(e);
        };
        if (hatParams.variation != -1) player.inventory.add(6, hatParams, {});
        if (topParams.variation != -1) player.inventory.add(7, topParams, {});
        if (legsParams.variation != -1) player.inventory.add(8, legsParams, {});
        if (feetsParams.variation != -1) player.inventory.add(9, feetsParams, {});
        if (earsParams.variation != -1) player.inventory.add(10, earsParams, {});
        if (tiesParams.variation != -1) player.inventory.add(2, tiesParams, {});
        if (masksParams.variation != -1) player.inventory.add(14, masksParams, {});
        if (glassesParams.variation != -1) player.inventory.add(1, glassesParams, {});

        player.utils.success(`Вам выдана форма ${hospital}!`);


        faction.setProducts(faction.products - mp.economy["police_mainclothes_products"].value);
        mp.logs.addLog(`${player.name} взял со склада Форма Hospital`, 'faction', player.account.id, player.sqlId, {
            faction: player.faction,
            count: 1
        });
    },

    "hospitalStorage.takeItem": (player, index, count = 1) => {
        if (!player.colshape || !player.colshape.hospitalStorage) return player.utils.error(`Вы не у склада Hospital!`);
        var hospitalStorageMarker = player.colshape.hospitalStorage;
        if (!mp.factions.isHospitalFaction(player.faction)) return player.utils.error(`Вы не являетесь медиком!`);

        var faction = mp.factions.getBySqlId(player.faction);
        if (!faction) return player.utils.error(`Организация с ID: ${player.faction} не найдена!`);

        if (faction.products < mp.economy["hospital_mainclothes_products"].value * count) return player.utils.error(`Недостаточно принадлежностей!`);

        var itemIds = [24, 25, 63, 27];
        var healths = [100, 15, 0, 0];
        index = Math.clamp(index, 0, itemIds.length - 1);
        var itemId = itemIds[index];
        if (itemId == 63 || itemId == 27) {
            var haveItem = Object.keys(player.inventory.getArrayByItemId(itemId)).length > 0;
            if (haveItem) return player.utils.error(`У Вас уже есть ${mp.inventory.getItem(itemId).name}!`);
        }

        mp.fullDeleteItemsByParams(itemId, ["faction", "owner"], [player.faction, player.sqlId]);
        var params = {
            faction: player.faction,
            owner: player.sqlId
        };
        if (healths[index]) params.count = healths[index];
        for (var i = 0; i < count; i++) {
            player.inventory.add(itemId, params, {}, (e) => {
                if (e) return player.utils.error(e);
                player.utils.success(`Вам выдано ${mp.inventory.getItem(itemId).name}!`);
                faction.setProducts(faction.products - mp.economy["hospital_mainclothes_products"].value);
                mp.logs.addLog(`${player.name} взял со склада ${mp.inventory.getItem(itemId).name}`, 'faction', player.account.id, player.sqlId, {
                    faction: player.faction,
                    item: mp.inventory.getItem(itemId).name,
                    count: 1
                });
            });
        }
    },

    "hospital.health.createOffer": (player, recId) => {
        var rec = mp.players.at(recId);
        if (!rec) return player.utils.error(`Гражданин не найден!`);
        var dist = player.dist(rec.position);
        if (dist > Config.maxInteractionDist) return player.utils.error(`Гражданин далеко!`);
        if (!mp.factions.isHospitalFaction(player.faction)) return player.utils.error(`Вы не медик!`);
        if (rec.health >= 98) return player.utils.error(`${rec.name} полностью здоров!`);

        var items = player.inventory.getArrayByItemId([24, 25]);
        var count = Object.keys(items).length;
        if (!count) {
            player.call(`prompt.showByName`, ["health_help"]);
            return player.utils.error(`Нет принадлежностей!`);
        }
        var health = 0;
        for (var sqlId in items) health += items[sqlId].params.count;
        if (health < parseInt(100 - rec.health)) return player.utils.error(`Недостаточно медикаментов!`);

        var price = parseInt((100 - rec.health) * mp.economy["hospital_health_price"].value);
        rec.offer = {
            medicId: player.id,
            health: parseInt(100 - rec.health),
        };

        player.utils.info(`Вы предложили лечение`);
        rec.utils.info(`Получено предложение лечения`);
        rec.call("choiceMenu.show", ["accept_health", {
            name: player.name,
            price: price
        }]);
    },

    "hospital.health.agree": (player) => {
        if (!player.offer) return player.utils.error(`Предложение не найдено!`);

        var medic = mp.players.at(player.offer.medicId);
        if (!medic || !mp.factions.isHospitalFaction(medic.faction)) return player.utils.error(`Медик не найден!`);
        var dist = player.dist(medic.position);
        if (dist > Config.maxInteractionDist) return player.utils.error(`Медик слишком далеко!`);

        var items = medic.inventory.getArrayByItemId([24, 25]);
        var count = Object.keys(items).length;
        if (!count) {
            player.utils.error(`У медика нет принадлежностей!`);
            medic.call(`prompt.showByName`, ["health_help"]);
            return medic.utils.error(`Нет принадлежностей!`);
        }

        if (player.health + player.offer.health > 100) {
            player.utils.error(`Вы не настолько больны!`);
            return medic.utils.error(`${player.name} не настолько болен!`);
        }
        var price = player.offer.health * mp.economy["hospital_health_price"].value;
        if (player.money - price < 0) {
            player.utils.error(`Необходимо ${price}$!`);
            return medic.utils.error(`${player.name} не имеет ${price}$!`);
        }

        var health = 0;
        for (var key in items) health += items[key].params.count;
        if (health < player.offer.health) return player.utils.error(`Недостаточно медикаментов!`);

        for (var key in items) {
            var item = items[key];
            var add = Math.clamp(item.params.count, 0, Math.ceil(100 - player.health));
            player.offer.health -= add;
            item.params.count -= add;
            player.health += add;
            if (item.params.count <= 0) medic.inventory.delete(item.id);
            else medic.inventory.updateParams(item.id, item);
            if (player.health >= 100 || player.offer.health <= 0) break;
        }

        player.utils.setMoney(player.money - price);
        medic.utils.setMoney(medic.money + price);

        player.health += player.offer.health;
        delete player.offer;

        player.utils.success(`${medic.name} Вас вылечил!`);
        medic.utils.success(`${player.name} вылечен!`);
    },

    "hospital.health.cancel": (player) => {
        if (!player.offer) return player.utils.error(`Предложение не найдено!`);

        var medic = mp.players.at(player.offer.medicId);
        delete player.offer;
        player.utils.info(`Лечение отклонено`);
        if (!medic) return;
        delete medic.offer;

        medic.utils.info(`${player.name} отклонил лечение`);
    },

    "hospital.callTeamHelp": (player) => {
        //debug(`hospital.callTeamHelp: ${player.name}`);
        // TODO: Вызов медиков.
    },

    "hospital.callPoliceHelp": (player) => {
        //debug(`hospital.callPoliceHelp: ${player.name}`);
        // TODO: Вызов полиции.
    },

    "hospital.advert": (player, text) => {
        if (!mp.factions.isHospitalFaction(player.faction)) return player.utils.error(`Вы не сотрудник больницы!`);
        // TODO: Уведомление всем игрокам, у которых есть телефон.
        text = text.substr(0, 100);
        mp.players.forEach((rec) => {
            if (rec.sqlId) {
                rec.call("BN_ShowWithPicture", ["EMS", player.name, text, "CHAR_ARTHUR", 2]);
            }
        });
    },

    "hospital.addCall": (player, text) => {
        // TODO: Проверка на наличие мобилы.
        mp.players.forEach((rec) => {
            if (mp.factions.isHospitalFaction(rec.faction)) {
                rec.call(`tablet.medic.addCall`, [{
                    id: player.id,
                    name: player.name,
                    pos: player.position,
                    message: text
                }]);
            }
        });
        player.hospitalCallTime = new Date().getTime();
        player.utils.success(`Вызов отправлен!`);
    },

    "hospital.acceptCall": (player, playerId, x, y) => {
        if (!mp.factions.isHospitalFaction(player.faction)) return player.utils.error(`Вы не сотрудник больницы!`);
        var rec = mp.players.at(playerId);
        if (!rec) return player.utils.error(`Гражданин не найден!`);
        if (!rec.hospitalCallTime) return player.utils.error(`Вызов принят/отклонен другим медиком!`);

        mp.players.forEach((rec) => {
            if (mp.factions.isHospitalFaction(rec.faction)) {
                rec.call(`tablet.medic.removeCall`, [playerId]);
                player.call("setNewWaypoint", [x, y]);
            }
        });

        delete rec.hospitalCallTime;
        player.utils.success(`Вызов принят!`);
        rec.utils.success(`${player.name} принял Ваш вызов!`);
    },

    "hospital.respawn": (player) => {
        if (player.health > 15) return player.utils.error(`Вы здоровы!`);
				player.health = 0;
				player.setVariable("knockDown", false);
    },
}
