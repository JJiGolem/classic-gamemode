module.exports = {
    "fibStorage.takeClothes": (player, index) => {
        if (!player.colshape || !player.colshape.fibStorage) return player.utils.error(`Вы не у склада FIB!`);
        var fibStorageMarker = player.colshape.fibStorage;
        if (!mp.factions.isFibFaction(player.faction)) return player.utils.error(`Вы не являетесь секретным агентом!`);

        var faction = mp.factions.getBySqlId(player.faction);
        if (!faction) return player.utils.error(`Организация с ID: ${player.faction} не найдена!`);
        var fib = faction.name;

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
            if (mp.factions.isFibFaction(hats[key].params.faction)) return player.utils.error(`У Вас уже есть головной убор ${fib}!`);
        for (var key in tops)
            if (mp.factions.isFibFaction(tops[key].params.faction)) return player.utils.error(`У Вас уже есть рубашка ${fib}!`);
        for (var key in legs)
            if (mp.factions.isFibFaction(legs[key].params.faction)) return player.utils.error(`У Вас уже есть брюки ${fib}!`);
        for (var key in feets)
            if (mp.factions.isFibFaction(feets[key].params.faction)) return player.utils.error(`У Вас уже есть ботинки ${fib}!`);
        for (var key in ears)
            if (mp.factions.isFibFaction(ears[key].params.faction)) return player.utils.error(`У Вас уже есть наушники ${fib}!`);
        for (var key in ties)
            if (mp.factions.isFibFaction(ties[key].params.faction)) return player.utils.error(`У Вас уже есть аксессуар ${fib}!`);
        for (var key in masks)
            if (mp.factions.isFibFaction(masks[key].params.faction)) return player.utils.error(`У Вас уже есть шлем ${fib}!`);
        for (var key in glasses)
            if (mp.factions.isFibFaction(glasses[key].params.faction)) return player.utils.error(`У Вас уже есть очки ${fib}!`);

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
                variation: [-1, -1, 124, 117, -1][index],
                texture: [0, 0, 0, 0, 0][index]
            };
            topParams = {
                sex: 1,
                torso: [4, 12, 8, 8, 17][index],
                variation: [3, 10, 89, 50, 221][index],
                texture: [4, 0, 0, 0, 20][index],
                undershirt: [27, 36, -1, -1, -1][index],
            };
            legsParams = {
                sex: 1,
                variation: [25, 13, 31, 31, 31][index],
                texture: [0, 0, 0, 0, 0][index]
            };
            feetsParams = {
                sex: 1,
                variation: [10, 21, 24, 24, 24][index],
                texture: [0, 0, 0, 0, 0][index]
            };
            earsParams = {
                sex: 1,
                variation: [-1, -1, -1, -1, -1][index],
                texture: [0, 0, 0, 0, 0][index]
            };
            tiesParams = {
                sex: 1,
                variation: [125, 125, -1, -1, -1][index],
                texture: [0, 0, 0, 0, 0][index]
            };
            masksParams = {
                sex: 1,
                variation: [121, 121, 55, 52, 53][index],
                texture: [0, 0, 0, 5, 0][index]
            };
            glassesParams = {
                sex: 1,
                variation: [8, 8, -1, -1, -1][index],
                texture: [6, 6, 0, 0, 0][index]
            };
        } else {
            hatParams = {
                sex: 0,
                variation: [-1, -1, 19, 118, -1][index],
                texture: [0, 0, 0, 0, 0][index]
            };
            topParams = {
                sex: 0,
                torso: [9, 9, 18, 18, 18][index],
                variation: [9, 79, 43, 136, 231][index],
                texture: [0, 0, 0, 3, 20][index]
            };
            legsParams = {
                sex: 0,
                variation: [47, 50, 30, 30, 30][index],
                texture: [0, 1, 0, 0, 0][index]
            };
            feetsParams = {
                sex: 0,
                variation: [13, 13, 25, 25, 25][index],
                texture: [0, 0, 0, 0, 0][index]
            };
            earsParams = {
                sex: 0,
                variation: [-1, -1, -1, -1, -1][index],
                texture: [0, 0, 0, 0, 0][index]
            };
            tiesParams = {
                sex: 0,
                variation: [95, 95, 0, 0, 0][index],
                texture: [0, 0, 0, 0, 0][index]
            };
            masksParams = {
                sex: 0,
                variation: [121, 121, 57, 57, 57][index],
                texture: [0, 0, 0, 0, 0][index]
            };
            glassesParams = {
                sex: 0,
                variation: [11, 11, -1, -1, -1][index],
                texture: [0, 0, 0, 0, 0][index]
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
        topParams.cols = 4;
        legsParams.rows = 3;
        legsParams.cols = 5;
        topParams.name = fib;
        legsParams.name = fib;

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

        player.utils.success(`Вам выдана форма ${fib}!`);


        faction.setProducts(faction.products - mp.economy["police_mainclothes_products"].value);
        mp.logs.addLog(`${player.name} взял со склада Форма FIB`, 'faction', player.account.id, player.sqlId, {
            faction: player.faction,
            count: 1
        });
    },

    "fibStorage.takeArmour": (player) => {
        if (!player.colshape || !player.colshape.fibStorage) return player.utils.error(`Вы не у склада FIB!`);
        var fibStorageMarker = player.colshape.fibStorage;
        if (!mp.factions.isFibFaction(player.faction)) return player.utils.error(`Вы не являетесь секретным агентом!`);

        var faction = mp.factions.getBySqlId(player.faction);
        if (!faction) return player.utils.error(`Организация с ID: ${player.faction} не найдена!`);
        var fib = faction.name;

        if (faction.products < mp.economy["police_armour_products"].value) return player.utils.error(`Недостаточно боеприпасов!`);
        var items = player.inventory.getArrayByItemId(3);

        for (var sqlId in items)
            if (mp.factions.isFibFaction(items[sqlId].params.faction)) return player.utils.error(`У Вас уже есть бронежилет ${fib}!`);

        mp.fullDeleteItemsByParams(3, ["faction", "owner"], [player.faction, player.sqlId]);
        var params;
        if (player.sex == 1) {
            params = {
                variation: 16,
                texture: 2
            };
        } else {
            params = {
                variation: 18,
                texture: 2
            };
        }

        params.faction = player.faction;
        params.owner = player.sqlId;
        params.armour = 100;
        params.sex = player.sex;


        player.inventory.add(3, params, {}, (e) => {
            if (e) return player.utils.error(e);
            player.utils.success(`Вам выдан бронежилет ${fib}!`);
            faction.setProducts(faction.products - mp.economy["police_armour_products"].value);
            mp.logs.addLog(`${player.name} взял со склада Бронежилет FIB`, 'faction', player.account.id, player.sqlId, {
                faction: player.faction,
                count: 1
            });
        });

    },

    "fibStorage.takeGun": (player, index) => {
        if (!player.colshape || !player.colshape.fibStorage) return player.utils.error(`Вы не у склада FIB!`);
        var fibStorageMarker = player.colshape.fibStorage;
        if (!mp.factions.isFibFaction(player.faction)) return player.utils.error(`Вы не являетесь секретным агентом!`);

        var faction = mp.factions.getBySqlId(player.faction);
        if (!faction) return player.utils.error(`Организация с ID: ${player.faction} не найдена!`);

        if (faction.products < mp.economy["police_armour_products"].value) return player.utils.error(`Недостаточно боеприпасов!`);


        var itemIds = [17, 18, 19, 20, 21, 22, 23];
        var weaponIds = ["weapon_nightstick", "weapon_flashlight", "weapon_stungun", "weapon_combatpistol", "weapon_pumpshotgun", "weapon_carbinerifle", "weapon_sniperrifle"];
        index = Math.clamp(index, 0, itemIds.length - 1);
        var itemId = itemIds[index];

        var guns = player.inventory.getArrayByItemId(itemId);
        if (Object.keys(guns).length > 0) return player.utils.error(`У Вас уже есть ${mp.inventory.getItem(itemId).name}!`);

        mp.fullDeleteItemsByParams(itemId, ["faction", "owner"], [player.faction, player.sqlId]);
        var params = {
            weaponHash: mp.joaat(weaponIds[index]),
            ammo: 0,
            faction: player.faction,
            owner: player.sqlId
        };

        player.inventory.add(itemId, params, {}, (e) => {
            if (e) return player.utils.error(e);
            player.utils.success(`Вам выдано оружие ${mp.inventory.getItem(itemId).name}!`);
            faction.setProducts(faction.products - mp.economy["police_armour_products"].value);
            mp.logs.addLog(`${player.name} взял со склада оружие ${mp.inventory.getItem(itemId).name}`, 'faction', player.account.id, player.sqlId, {
                faction: player.faction,
                item: mp.inventory.getItem(itemId).name,
                count: 1
            });
        });
    },

    "fibStorage.takeAmmo": (player, index, ammo) => {
        //debug(`fibStorage.takeAmmo: ${index} ${ammo}`);
        if (!player.colshape || !player.colshape.fibStorage) return player.utils.error(`Вы не у склада FIB!`);
        var fibStorageMarker = player.colshape.fibStorage;
        if (!mp.factions.isFibFaction(player.faction)) return player.utils.error(`Вы не являетесь секретным агентом!`);

        var faction = mp.factions.getBySqlId(player.faction);
        if (!faction) return player.utils.error(`Организация с ID: ${player.faction} не найдена!`);

        var itemIds = [37, 38, 40, 39];
        index = Math.clamp(index, 0, itemIds.length - 1);
        var products = [0, 1, 3, 2];
        products = mp.economy[`ammo_${products[index]}_products_price`].value * ammo;
        if (faction.products < products) return player.utils.error(`Недостаточно боеприпасов!`);

        // mp.fullDeleteItemsByParams(itemIds[index], ["faction", "owner"], [player.faction, player.sqlId]);
        var params = {
            ammo: ammo,
            faction: player.faction,
            owner: player.sqlId
        };
        player.inventory.add(itemIds[index], params, {}, (e) => {
            if (e) return player.utils.error(e);
            player.utils.success(`Вам выданы ${mp.inventory.getItem(itemIds[index]).name}!`);
            faction.setProducts(faction.products - products);
            mp.logs.addLog(`${player.name} взял со склада ${mp.inventory.getItem(itemIds[index]).name}. Количество: ${ammo}`, 'faction', player.account.id, player.sqlId, {
                faction: player.faction,
                item: mp.inventory.getItem(itemIds[index]).name,
                count: ammo
            });
        });
    },

    "fibStorage.takeItem": (player, index) => {
        if (!player.colshape || !player.colshape.fibStorage) return player.utils.error(`Вы не у склада FIB!`);
        var fibStorageMarker = player.colshape.fibStorage;
        if (!mp.factions.isFibFaction(player.faction)) return player.utils.error(`Вы не являетесь секретным агентом!`);

        var faction = mp.factions.getBySqlId(player.faction);
        if (!faction) return player.utils.error(`Организация с ID: ${player.faction} не найдена!`);

        if (faction.products < mp.economy["police_armour_products"].value) return player.utils.error(`Недостаточно боеприпасов!`);

        var itemIds = [61, 27, 28];
        index = Math.clamp(index, 0, itemIds.length - 1);
        var itemId = itemIds[index];

        var items = player.inventory.getArrayByItemId(itemId);
        if (Object.keys(items).length > 0) return player.utils.error(`У Вас уже есть ${mp.inventory.getItem(itemId).name}!`);

        mp.fullDeleteItemsByParams(itemId, ["faction", "owner"], [player.faction, player.sqlId]);
        var params = {
            faction: player.faction,
            owner: player.sqlId
        };

        player.inventory.add(itemId, params, {}, (e) => {
            if (e) return player.utils.error(e);
            player.utils.success(`Вам выдано ${mp.inventory.getItem(itemId).name}!`);
            faction.setProducts(faction.products - mp.economy["police_armour_products"].value);
            mp.logs.addLog(`${player.name} взял со склада ${mp.inventory.getItem(itemId).name}`, 'faction', player.account.id, player.sqlId, {
                faction: player.faction,
                item: mp.inventory.getItem(itemId).name,
                count: 1
            });
        });
    },
    "fib.searchPlayer": (player, event, param) => {
        debug(`fib.searchPlayer: ${player.name} ${event} ${param}`);
        if (mp.factions.isFibFaction(player.faction)) {
            if (event == 'name') {
                DB.Characters.getSqlIdByName(param.toString(), (sqlId) => {
                    if (sqlId) {
                        var rec = mp.players.getBySqlId(sqlId);
                        if (rec.faction !== 0) {
                            var faction = mp.factions.getBySqlId(rec.faction);
                        } else {
                            var faction = "Безработный";
                        }
                        if (rec) {
                            DB.Handle.query("SELECT id,x,y,z FROM houses WHERE owner=?", [rec.sqlId], (e, result) => {
                                var houses = [];
                                for (var i = 0; i < result.length; i++) {
                                    var h = result[i];
                                    var pos = new mp.Vector3(h.x, h.y, h.z);
                                    houses.push({
                                        sqlId: h.id,
                                        adress: '',
                                        pos: pos
                                    });
                                }
                                var data = {
                                    playerId: rec.id,
                                    name: rec.name,
                                    crimes: rec.crimes,
                                    faction: faction.name,
                                    houses: houses
                                }
                                player.call(`tablet.fib.addSearchPlayer`, [data]);
                            });

                        } else {
                            return player.utils.error(`Гражданин не найден!`);
                        }
                    } else {
                        return player.utils.error(`Гражданин не найден!`);
                    }
                });
            } else {
                var rec = mp.players.at(param);
                if (rec) {
                    if (rec.faction !== 0) {
                        var faction = mp.factions.getBySqlId(rec.faction);
                    } else {
                        var faction = "Безработный";
                    }
                    DB.Handle.query("SELECT id,x,y,z FROM houses WHERE owner=?", [rec.sqlId], (e, result) => {
                        var houses = [];
                        for (var i = 0; i < result.length; i++) {
                            var h = result[i];
                            var pos = new mp.Vector3(h.x, h.y, h.z);
                            houses.push({
                                sqlId: h.id,
                                adress: '',
                                pos: pos
                            });
                        }
                        var data = {
                            playerId: rec.id,
                            name: rec.name,
                            crimes: rec.crimes,
                            faction: faction.name,
                            houses: houses
                        }
                        player.call(`tablet.fib.addSearchPlayer`, [data]);
                    });
                } else {
                    return player.utils.error(`Гражданин не найден!`);
                }
            }
        }
    },

    "fib.giveFine": (player, data) => {
        //debug(`giveWanted: ${data}`);
        data = JSON.parse(data);
        var recId = data.playerId,
            sum = data.summ,
            reason = data.reason;
        sum = Math.clamp(sum, 1, mp.economy["max_fine_sum"].value);
        var rec = mp.players.at(recId);
        if (!rec) return player.utils.error(`Гражданин не найден!`);
        //var dist = player.dist(rec.position);
        //if (dist > Config.maxInteractionDist) return player.utils.error(`Гражданин далеко!`);
        if (!mp.factions.isFibFaction(player.faction)) return player.utils.error(`Вы не сотрудник порядка!`);
        if (rec.id === player.id) return player.utils.error(`Вы не можете выдать сами себе штраф!`);

        rec.fines++;
        DB.Handle.query("INSERT INTO fines (cop,recipient,reason,price,date) VALUES (?,?,?,?,?)",
            [player.sqlId, rec.sqlId, reason, sum, new Date().getTime() / 1000], (e) => {
                if (e) terminal.error(e);
            });

        player.utils.success(`${rec.name} получил штраф на ${sum}$`);
        rec.utils.warning(`${player.name} выписал Вам штраф на ${sum}$`);
        mp.logs.addLog(`${player.name} выписал штраф игроку ${rec.name}. Причина: ${reason}, сумма: ${sum}`, 'faction', player.account.id, player.sqlId, {
            faction: player.faction,
            reason: reason,
            sum: sum
        });
        mp.logs.addLog(`${rec.name} был выписан штраф игроком ${player.name}. Причина: ${reason}, сумма: ${sum}`, 'faction', rec.account.id, rec.sqlId, {
            faction: rec.faction,
            reason: reason,
            sum: sum
        });

    },

    "fib.giveWanted": (player, data) => {
        //debug(`giveWanted: ${data}`);
        data = JSON.parse(data);
        var recId = data.playerId,
            wanted = data.stars;
        var rec = mp.players.at(recId);
        if (!rec) return player.utils.error(`Гражданин не найден!`);
        //var dist = player.dist(rec.position);
        //if (dist > Config.maxInteractionDist) return player.utils.error(`Гражданин далеко!`);
        if (!mp.factions.isFibFaction(player.faction)) return player.utils.error(`Вы не сотрудник порядка!`);
        if (wanted > Config.maxWantedLevel) return player.utils.error(`Выберите от 1 до ${Config.maxWantedLevel} уровня розыска!`);
        if (rec.wanted >= Config.maxWantedLevel) return player.utils.error(`${rec.name} имеет максимальный уровень розыска!`);
        if (rec.id === player.id) return player.utils.error(`Вы не можете выдать сами себе розыск!`);

        rec.utils.setWanted(rec.wanted + wanted);
        player.utils.success(`${rec.name} объявлен в розыск`);
        rec.utils.warning(`${player.name} объявил Вас в розыск`);
        mp.logs.addLog(`${player.name} объявил игрока ${rec.name} в розыск. Звезд: ${wanted}`, 'faction', player.account.id, player.sqlId, {
            faction: player.faction,
            wanted: wanted
        });
        mp.logs.addLog(`${rec.name} был объявлен игроком ${player.name} в розыск. Звезд: ${wanted}`, 'faction', rec.account.id, rec.sqlId, {
            faction: rec.faction,
            wanted: wanted
        });

        //todo broadcast for radio
    }
}
