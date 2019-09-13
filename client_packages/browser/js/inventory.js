var inventory = new Vue({
    el: '#inventory',
    data: {
        // Макс. вес предметов, переносимый игроком
        maxPlayerWeight: 30,
        // Общая информация о предметах
        itemsInfo: {
            1: {
                name: 'Очки',
                description: 'Описание очков.',
                height: 2,
                width: 3,
                weight: 0.1
            },
            3: {
                name: 'Бронежилет',
                description: 'Описание броника.',
                height: 6,
                width: 8,
                weight: 10
            },
            7: {
                name: 'Рубашка',
                description: 'Описание рубашки.',
                height: 5,
                width: 4,
                weight: 0.1
            },
            8: {
                name: 'Штаны',
                description: 'Описание штанов.',
                height: 6,
                width: 8,
                weight: 0.1
            },
            9: {
                name: 'Ботинки',
                description: 'Описание ботинков.',
                height: 3,
                width: 3,
                weight: 0.1
            },
            13: {
                name: 'Сумка',
                description: 'Описание сумки.',
                height: 6,
                width: 8,
                weight: 2
            },
            18: {
                name: 'Фонарь SureFire G2 Nitrolon',
                description: 'Компактный, легкий и мощный фонарик, который можно использовать как подствольный целеуказатель.',
                height: 6,
                width: 8,
                weight: 2,
            },
            21: {
                name: 'Дробаш',
                description: 'Может стрелять.',
                height: 6,
                width: 8,
                weight: 2,
            },
            24: {
                name: 'Аптечка',
                description: 'Описание аптечки.',
                height: 6,
                width: 8,
                weight: 0.1,
            },
            37: {
                name: 'Патрон',
                description: 'Описание патрона.',
                height: 4,
                width: 4,
                weight: 0.02,
            },
            39: {
                name: 'Патрон',
                description: 'Описание патрона.',
                height: 4,
                width: 4,
                weight: 0.02,
            },
        },
        // Меню предмета по ПКМ
        itemsMenu: {
            // itemId: struct menu
            /*18: { // test
                'Включить': {
                    handler(item) {
                        console.log(`Включить ${item}`)
                    }
                }
            },*/
            24: { // малая аптечка
                'Вылечиться': {
                    handler(item) {
                        mp.trigger(`callRemote`, `inventory.item.med.use`, item.sqlId);
                    }
                }
            },
            25: { // пластырь
                'Вылечиться': {
                    handler(item) {
                        mp.trigger(`callRemote`, `inventory.item.patch.use`, item.sqlId);
                    }
                }
            },
            27: { // большая аптечка
                'Вылечиться': {
                    handler(item) {
                        mp.trigger(`callRemote`, `inventory.item.med.use`, item.sqlId);
                    }
                }
            },
            28: { // наручники
                'Скрутить': {
                    handler(item) {
                        var data = {
                            cuffsSqlId: item.sqlId
                        };
                        mp.trigger(`callRemote`, `police.cuffs`, JSON.stringify(data));
                    }
                }
            },
            /*37: { // test
                'Разрядить': {
                    handler(item) {
                        console.log(`разрядить: ${item}`)
                    }
                },
                'Сломать': {
                    handler(item) {
                        console.log(`сломать ${item}`);
                    }
                },
                'Разобрать': {
                    items: {
                        'Полностью': {
                            handler(item) {
                                console.log(`Полностью ${item}`)
                            }
                        },
                        'Для переноски': {
                            handler(item) {
                                console.log(`для переноски ${item}`)
                            }
                        },
                    }
                },
                'Присоединить': {
                    handler(item) {
                        console.log(`Присоединить ${item}`);
                    }
                },
                'Отсоединить': {
                    handler(item) {
                        console.log(`Отсоединить ${item}`);
                    }
                },
            },*/
            // 4 типа патронов
            37: {
                'Зарядить': {
                    handler(item) {
                        mp.trigger(`callRemote`, `weapons.ammo.fill`, item.sqlId);
                    }
                }
            },
            38: {
                'Зарядить': {
                    handler(item) {
                        mp.trigger(`callRemote`, `weapons.ammo.fill`, item.sqlId);
                    }
                }
            },
            39: {
                'Зарядить': {
                    handler(item) {
                        mp.trigger(`callRemote`, `weapons.ammo.fill`, item.sqlId);
                    }
                }
            },
            40: {
                'Зарядить': {
                    handler(item) {
                        mp.trigger(`callRemote`, `weapons.ammo.fill`, item.sqlId);
                    }
                }
            },
        },
        // Вайт-лист предметов, которые можно надеть
        bodyList: {
            // columnIndex: [itemId, ...]
            0: [1],
            1: [6],
            2: [14],
            3: [2],
            4: [3],
            5: [7],
            6: [11],
            7: [10],
            8: [12],
            9: [21, 22, 23, 48, 49, 50, 51, 52, 53, 86, 87, 88, 89, 90, 91, 92, 93, 94, 95, 96, 97, 98, 99, 100], // автоматы
            10: [13],
            11: [8],
            12: [9],
        },
        // Вайт-лист предметов, которые можно использовать в горячих клавишах
        hotkeysList: {
            // itemId: {...}
            24: { // малая аптечка
                handler(item) {
                    mp.trigger(`callRemote`, `inventory.item.med.use`, item.sqlId);
                }
            },
            25: { // пластырь
                handler(item) {
                    mp.trigger(`callRemote`, `inventory.item.patch.use`, item.sqlId);
                }
            },
            27: { // большая аптечка
                handler(item) {
                    mp.trigger(`callRemote`, `inventory.item.med.use`, item.sqlId);
                }
            },
            28: { // наручники
                handler(item) {
                    var data = {
                        cuffsSqlId: item.sqlId
                    };
                    mp.trigger(`callRemote`, `police.cuffs`, JSON.stringify(data));
                }
            },
            // патроны
            37: {
                handler(item) {
                    mp.trigger(`callRemote`, `weapons.ammo.fill`, item.sqlId);
                }
            },
            38: {
                handler(item) {
                    mp.trigger(`callRemote`, `weapons.ammo.fill`, item.sqlId);
                }
            },
            39: {
                handler(item) {
                    mp.trigger(`callRemote`, `weapons.ammo.fill`, item.sqlId);
                }
            },
            40: {
                handler(item) {
                    mp.trigger(`callRemote`, `weapons.ammo.fill`, item.sqlId);
                }
            },
        },
        // Блек-лист предметов, которые не могут храниться в других предметах
        blackList: {
            // parentItemId: [cildItemId, ...]
            3: [13],
            7: [13],
            8: [13],
        },
        // Вайт-лист предметов, которые могут перетаскиваться друг на друга
        mergeList: {
            // parentItemId: [cildItemId, ...]
            // 9mm
            37: [20],
            // 12mm
            38: [48],
            // 7.62mm
            39: [21, 107],
            // 5.56mm
            40: [22, 99],
        },
        // Огнестрельные оружия
        weaponsList: [20, 21, 22, 48, 99, 107],
        // Предметы в окружении (земля, шкаф, багажник, холодильник, ...)
        environment: [],
        // Предметы на игроке (экипировка)
        equipment: {},
        // Предметы на горячих клавишах
        hotkeys: {},
        // Предметы в руках
        hands: null,
        // Сытость игрока
        satiety: 0,
        // Жажда игрока
        thirst: 0,
        // Режим отладки
        debug: true,
        // Показ инвентаря на экране
        show: false,
        // Возможность использования инвентаря
        enable: false,
        // Показ описания предмета на экране
        itemDesc: {
            item: null,
            x: 0,
            y: 0
        },
        // Показ меню предмета на экране
        itemMenu: {
            item: null,
            x: 0,
            y: 0
        },
        // Показа переносимого предмета на экране
        itemDrag: {
            item: null,
            div: null,
            accessColumns: {
                placeSqlId: null,
                pocketI: null,
                deny: false,
                targetSqlId: null,
                columns: {},
                bodyFocus: null,
                hotkeyFocus: null,
            },
            x: 0,
            y: 0
        },
    },
    computed: {
        // Тяжесть игрока (в %)
        playerWeight() {
            var weight = this.getItemWeight(Object.values(this.equipment));
            return weight / this.maxPlayerWeight * 100;
        },
        equipmentBusyColumns() {
            var cols = {};
            for (var i in this.equipment) {
                var equip = this.equipment[i];
                if (!equip.pockets) continue;
                cols[equip.sqlId] = {};
                for (var j in equip.pockets) {
                    var pocket = equip.pockets[j];
                    if (!Object.keys(pocket.items).length) continue;
                    cols[equip.sqlId][j] = {};
                    for (var index in pocket.items) {
                        var item = pocket.items[index];
                        var w = this.itemsInfo[item.itemId].width;
                        var h = this.itemsInfo[item.itemId].height;
                        var coord = this.indexToXY(pocket.rows, pocket.cols, index);
                        for (var x = 0; x < w; x++) {
                            for (var y = 0; y < h; y++) {
                                var i = this.xyToIndex(pocket.rows, pocket.cols, {
                                    x: coord.x + x,
                                    y: coord.y + y
                                });
                                cols[equip.sqlId][j][i] = item.sqlId;
                            }
                        }
                    }
                }
            }

            return cols;
        },
        environmentBusyColumns() {
            var cols = {};
            for (var i in this.environment) {
                var env = this.environment[i];
                cols[env.sqlId] = {};
                for (var j in env.pockets) {
                    var pocket = env.pockets[j];
                    cols[env.sqlId][j] = {};
                    for (var index in pocket.items) {
                        var item = pocket.items[index];
                        var w = this.itemsInfo[item.itemId].width;
                        var h = this.itemsInfo[item.itemId].height;
                        var coord = this.indexToXY(pocket.rows, pocket.cols, index);
                        for (var x = 0; x < w; x++) {
                            for (var y = 0; y < h; y++) {
                                var i = this.xyToIndex(pocket.rows, pocket.cols, {
                                    x: coord.x + x,
                                    y: coord.y + y
                                });
                                cols[env.sqlId][j][i] = item.sqlId;
                            }
                        }
                    }
                }
            }

            return cols;
        },
    },
    methods: {
        // ******************  [ Private ] ******************
        urlItemImg(itemId) {
            return `img/inventory/items/${itemId}.png`;
        },
        itemStyle(itemId) {
            var url = this.urlItemImg(itemId);
            var style = {
                backgroundImage: `url(${url})`,
                height: this.itemsInfo[itemId].height * 2 + "vh",
                width: this.itemsInfo[itemId].width * 2 + "vh",
                pointerEvents: (this.itemDrag.item) ? 'none' : '',
            };
            return style;
        },
        valueColor(value) {
            if (value > 50) return "#bf0";
            if (value > 15) return "#fb0";
            return "#b44";
        },
        onBodyItemEnter(index) {
            if (!this.itemDrag.item) return;
            var item = this.equipment[index];
            if (item) return;
            if (!this.bodyList[index].includes(this.itemDrag.item.itemId)) return;
            var columns = this.itemDrag.accessColumns;
            columns.bodyFocus = index;
        },
        onBodyItemLeave(index) {
            var columns = this.itemDrag.accessColumns;
            columns.bodyFocus = null;
        },
        onHotkeyItemEnter(key) {
            // console.log("onHotkeyItemEnter")
            if (!this.itemDrag.item) return;
            var item = this.hotkeys[key];
            if (item && this.getItem(item.sqlId)) return;
            if (!this.hotkeysList[this.itemDrag.item.itemId]) return;
            var columns = this.itemDrag.accessColumns;
            columns.hotkeyFocus = key;
        },
        onHotkeyItemLeave(key) {
            // console.log("onHotkeyItemLeave")
            var columns = this.itemDrag.accessColumns;
            columns.hotkeyFocus = null;
        },
        itemMouseHandler(item, e) {
            var rect = document.getElementById('inventory').getBoundingClientRect();
            var handlers = {
                'mouseenter': (e) => {
                    this.itemDesc.item = item;
                    this.itemDesc.x = (e.screenX - rect.x) + 15;
                    this.itemDesc.y = (e.screenY - rect.y) + 15;
                },
                'mouseleave': (e) => {
                    this.itemDesc.item = null;
                },
                'mousemove': (e) => {
                    this.itemDesc.item = item;
                    this.itemDesc.x = (e.screenX - rect.x) + 15;
                    this.itemDesc.y = (e.screenY - rect.y) + 15;
                },
                'contextmenu': (e) => {
                    this.itemMenu.item = item;
                    this.itemMenu.x = e.clientX - rect.x;
                    this.itemMenu.y = e.clientY - rect.y;
                },
                'mousedown': (e) => {
                    if (e.which == 1) { // Left Mouse Button
                        this.itemDrag.item = item;
                        this.itemDrag.div = e.target;
                        this.itemDrag.x = e.screenX - rect.x - e.target.offsetWidth / 2;
                        this.itemDrag.y = e.screenY - rect.y - e.target.offsetHeight / 2;
                    }
                },
            };
            handlers[e.type](e);
        },
        columnMouseHandler(place, pocket, index, e) {
            if (!this.itemDrag.item) return;
            var item = this.itemDrag.item;
            var columns = this.itemDrag.accessColumns;
            var pocketI = place.pockets.indexOf(pocket);
            var w = this.itemsInfo[item.itemId].width;
            var h = this.itemsInfo[item.itemId].height;
            if (w > pocket.cols || h > pocket.rows) return;
            var coord = this.indexToXY(pocket.rows, pocket.cols, index);
            coord.x = Math.clamp(coord.x - parseInt(w / 2), 0, pocket.cols - w);
            coord.y = Math.clamp(coord.y - parseInt(h / 2), 0, pocket.rows - h);
            var handlers = {
                'mouseenter': (e) => {
                    // console.log('mouseenter')
                    columns.placeSqlId = place.sqlId;
                    columns.pocketI = pocketI;
                    columns.deny = place.sqlId == item.sqlId ||
                        place.itemId == item.itemId ||
                        place.sqlId < 0 && this.getItemsCount(item) > 0 ||
                        (this.blackList[place.itemId] && this.blackList[place.itemId].includes(item.itemId));
                    for (var x = 0; x < w; x++) {
                        for (var y = 0; y < h; y++) {
                            var i = this.xyToIndex(pocket.rows, pocket.cols, {
                                x: coord.x + x,
                                y: coord.y + y
                            });
                            columns.columns[i] = true;
                            if (!columns.deny) {
                                columns.deny = this.isColumnBusy(place, pocketI, i, item);
                                if (columns.deny) {
                                    if (this.mergeList[item.itemId]) {
                                        var target = this.getItemInColumn(place, pocketI, i);
                                        var canMerge = this.mergeList[item.itemId].includes(target.itemId) &&
                                            place.sqlId > 0 && this.getItem(item.sqlId);
                                        columns.targetSqlId = (canMerge) ? target.sqlId : null;
                                    }
                                } else columns.targetSqlId = null;
                            }
                        }
                    }
                },
                'mouseleave': (e) => {
                    columns.placeSqlId = null;
                    columns.pocketI = null;
                    columns.index = null;
                    columns.deny = false;
                    columns.columns = {};
                },
            }
            handlers[e.type](e);
        },
        isColumnBusy(place, pocketI, index, item) {
            var cols = (place.sqlId > 0) ? this.equipmentBusyColumns : this.environmentBusyColumns;
            if (!cols[place.sqlId][pocketI]) return false;
            if (!cols[place.sqlId][pocketI][index]) return false;
            return cols[place.sqlId][pocketI][index] != item.sqlId;
        },
        getItemInColumn(place, pocketI, index) {
            var cols = (place.sqlId > 0) ? this.equipmentBusyColumns : this.environmentBusyColumns;
            if (!cols[place.sqlId][pocketI]) return null;
            if (!cols[place.sqlId][pocketI][index]) return null;
            var sqlId = cols[place.sqlId][pocketI][index];
            return (place.sqlId > 0) ? this.getItem(sqlId) : this.getEnvironmentItem(sqlId);
        },
        columnClass(index, pocket, place) {
            var classes = {
                access: this.isColumnAccess(index, pocket, place),
            };
            if (classes.access) {
                classes.deny = this.itemDrag.accessColumns.deny;
                classes.merge = this.itemDrag.accessColumns.targetSqlId;
            }

            return classes;
        },
        getItemsCount(item) {
            if (!item.pockets) return 0;
            var count = 0;
            item.pockets.forEach((pocket) => {
                for (var index in pocket.items) {
                    count++;
                }
            });
            return count;
        },
        getChildren(item) {
            var result = [];
            if (!item.pockets) return result;
            item.pockets.forEach((pocket) => {
                for (var index in pocket.items) {
                    var child = pocket.items[index];
                    result.push(child);
                }
            });
            return result;
        },
        isColumnAccess(index, pocket, place) {
            if (!this.itemDrag.item) return false;
            var columns = this.itemDrag.accessColumns;
            if (columns.placeSqlId != place.sqlId) return false;
            var pocketI = place.pockets.indexOf(pocket);
            if (pocketI == -1) return false;
            if (columns.pocketI != pocketI) return false;
            if (!columns.columns[index]) return false;

            return true;
        },
        getPlaceWeight(place) {
            var weight = 0;
            for (var i in place.pockets) {
                var pocket = place.pockets[i];
                weight += this.getItemWeight(Object.values(pocket.items));
            }
            return weight;
        },
        getItemWeight(items, weight = 0) {
            if (!Array.isArray(items)) items = [items];
            for (var index in items) {
                var item = items[index];
                var info = this.itemsInfo[item.itemId];
                // if (!info) return weight;
                weight += info.weight;
                if (item.params.count) weight += item.params.count * info.weight;
                if (item.pockets) {
                    for (var key in item.pockets) {
                        var pocket = item.pockets[key];
                        weight += this.getItemWeight(Object.values(pocket.items), 0);
                    }
                }
            }

            return weight;
        },
        indexToXY(rows, cols, index) {
            if (!rows || !cols) return null;
            var x = index % cols;
            var y = (index - x) / cols;
            if (x >= cols || y >= rows) return null;
            return {
                x: x,
                y: y
            };
        },
        xyToIndex(rows, cols, coord) {
            if (!rows || !cols) return -1;
            return coord.y * cols + coord.x;
        },
        getItemBySqlId(sqlId, items) {
            if (!sqlId || sqlId == -1) return null;
            for (var index in items) {
                var item = items[index];
                if (item.sqlId == sqlId) return item;
                if (item.pockets) {
                    for (var key in item.pockets) {
                        var pocket = item.pockets[key];
                        var it = this.getItemBySqlId(sqlId, pocket.items);
                        if (it) return it;
                    }
                }
            }
            return null;
        },
        notify(message) {
            console.log("[Inventory] " + message);
        },
        callRemote(eventName, values) {
            // console.log(`callRemote: ${eventName}`);
            // console.log(values)

            mp.trigger("callRemote", eventName, JSON.stringify(values));
        },

        // ******************  [ Inventory Config ] ******************
        setItemsInfo(itemsInfo) {
            if (typeof itemsInfo == 'string') itemsInfo = JSON.parse(itemsInfo);
            for (var itemId in itemsInfo) {
                itemId = parseInt(itemId);
                this.setItemInfo(itemId, itemsInfo[itemId]);

                if (!this.itemsMenu[itemId]) this.itemsMenu[itemId] = {};
                var menu = this.itemsMenu[itemId];
                if (this.weaponsList.includes(itemId)) {
                    menu['Зарядить'] = {
                        handler(item) {
                            mp.trigger(`callRemote`, `weapons.weapon.ammo.fill`, item.sqlId);
                        }
                    };
                    menu['Разрядить'] = {
                        handler(item) {
                            var hash = item.params.weaponHash;
                            mp.trigger(`weapons.ammo.remove`, item.sqlId, hash.toString());
                        }
                    };
                }
                menu['Выкинуть'] = {
                    handler(item) {
                        // console.log(`выкинуть ${item}`)
                        if (inventory.weaponsList.includes(item.itemId)) mp.trigger(`weapons.ammo.sync`);
                        else {
                            var children = inventory.getChildren(item);
                            var weapon = children.find(x => inventory.weaponsList.includes(x.itemId));
                            if (weapon) mp.trigger(`weapons.ammo.sync`);
                        }
                        mp.trigger(`callRemote`, `item.ground.put`, item.sqlId);
                    }
                };
            }
        },
        setItemInfo(itemId, info) {
            if (typeof info == 'string') info = JSON.parse(info);
            Vue.set(this.itemsInfo, itemId, info);
        },
        // ******************  [ Player Inventory ] ******************
        getItem(sqlId) {
            var item = this.getItemBySqlId(sqlId, this.equipment);
            return item;
        },
        addItem(item, pocket, index, parent) {
            if (typeof item == 'number') item = this.getItem(item);
            if (typeof parent == 'number') parent = this.getItem(parent);
            if (typeof item == 'string') item = JSON.parse(item);
            if (typeof parent == 'string') parent = JSON.parse(parent);

            this.deleteItem(item.sqlId);
            this.deleteEnvironmentItem(item.sqlId);
            if (item.pockets) {
                item.showPockets = true;
            }
            if (parent) {
                Vue.set(parent.pockets[pocket].items, index, item);
            } else Vue.set(this.equipment, index, item);
        },
        initItems(items) {
            if (typeof items == 'string') items = JSON.parse(items);
            for (var index in items) {
                var item = items[index];
                this.addItem(item, null, index);
            }
        },
        deleteItem(sqlId, items = this.equipment) {
            for (var index in items) {
                var item = items[index];
                if (item.sqlId == sqlId) Vue.delete(items, index);
                if (item.pockets) {
                    for (var key in item.pockets) {
                        var pocket = item.pockets[key];
                        this.deleteItem(sqlId, pocket.items);
                    }
                }
            }
        },
        setItemSqlId(item, sqlId) {
            if (typeof item == 'number') item = this.getItem(item);
            if (!item) return this.notify(`setItemSqlId: Предмет ${item} не найден`);
            sqlId = parseInt(sqlId);
            Vue.set(item, 'sqlId', sqlId);
        },
        setItemParam(item, key, value) {
            if (typeof item == 'number') item = this.getItem(item);
            if (!item) return this.notify(`setItemParam: Предмет ${item} не найден`);
            if (!isNaN(value)) value = parseFloat(value);
            Vue.set(item.params, key, value);
        },
        getItemInfoHash(itemId) {
            var info = this.itemsInfo[itemId];
            var hash = info.name.length +
                info.description.length +
                info.height +
                info.width +
                info.weight * 1000;
            return hash;
        },
        getItemsInfoHashes(chunk = 2) {
            var hashes = [];
            for (var itemId in this.itemsInfo) {
                hashes.push(this.getItemInfoHash(itemId));
            }
            for (var i = 0; i < hashes.length; i++) {
                for (var j = 1; j < chunk; j++) {
                    if (!hashes[i + j]) break;
                    hashes[i] += hashes[i + j];
                }
                hashes.splice(i + 1, chunk - 1);
            }
            return hashes;
        },
        setArmour(value) {
            var item = this.equipment[4];
            if (!item) return;
            item.params.health = value;
        },

        // ******************  [ Hotkeys ] ******************
        bindHotkey(itemSqlId, key) {
            var item = this.getItem(itemSqlId);
            if (!item) return this.notify(`Предмет должен находиться в инвентаре`);
            this.clearHotkeys(item);
            Vue.set(this.hotkeys, key, item);
        },
        unbindHotkey(key) {
            Vue.delete(this.hotkeys, key);
        },
        onUseHotkey(key) {
            if (!key) key = 10; // для клавиши '0'
            var item = this.hotkeys[key];
            if (!item || !this.getItem(item.sqlId)) return;
            this.hotkeysList[item.itemId].handler(item);
        },
        clearHotkeys(item) {
            if (typeof item == 'number') item = this.getItem(item);
            for (var key in this.hotkeys) {
                var it = this.hotkeys[key];
                if (it.sqlId == item.sqlId) this.unbindHotkey(key);
            }
        },

        // ******************  [ Hands ] ******************
        fillHands(item) {
            if (typeof item == 'number') item = this.getItem(item);
            if (!item) return this.notify(`fillHands: Предмет ${item} не опреден`);

            this.hands = item;
        },
        clearHands() {
            this.hands = null;
        },

        // ******************  [ Environment ] ******************
        addEnvironmentPlace(place) {
            if (typeof place == 'string') place = JSON.parse(place);
            place.showPockets = true;
            this.environment.unshift(place);
        },
        deleteEnvironmentPlace(sqlId) {
            for (var i in this.environment) {
                var place = this.environment[i];
                if (place.sqlId == sqlId) Vue.delete(this.environment, i);
            }
        },
        getEnvironmentPlace(sqlId) {
            for (var i in this.environment) {
                var place = this.environment[i];
                if (place.sqlId == sqlId) return place;
            }
            return null;
        },
        getEnvironmentItem(sqlId) {
            var item;
            for (var i in this.environment) {
                var place = this.environment[i];
                for (var j in place.pockets) {
                    var pocket = place.pockets[j];
                    item = this.getItemBySqlId(sqlId, pocket.items);
                    if (item) break;
                }
                if (item) break;
            }
            return item;
        },
        addEnvironmentItem(item, pocket, index, placeSqlId) {
            this.deleteEnvironmentItem(item.sqlId);
            this.deleteItem(item.sqlId);

            var place = this.getEnvironmentPlace(placeSqlId);
            if (!place) return this.notify(`addEnvironmentItem: место с sqlId ${placeSqlId} не найдено`);
            Vue.set(place.pockets[pocket].items, index, item);
        },
        deleteEnvironmentItem(sqlId) {
            var places = this.environment;
            for (var i in places) {
                var place = places[i];
                for (var j in place.pockets) {
                    var items = place.pockets[j].items;
                    for (var index in items) {
                        var item = items[index];
                        if (item.sqlId == sqlId) Vue.delete(items, index);
                        if (item.pockets) {
                            for (var key in item.pockets) {
                                var pocket = item.pockets[key];
                                this.deleteItem(sqlId, pocket.items);
                            }
                        }
                    }
                }
            }
        },
        setEnvironmentItemSqlId(item, sqlId) {
            if (typeof item == 'number') item = this.getEnvironmentItem(item);
            if (!item) return this.notify(`setEnvironmentItemParam: Предмет ${item} не найден`);
            sqlId = parseInt(sqlId);
            Vue.set(item, 'sqlId', sqlId);
        },
        setEnvironmentItemParam(item, key, value) {
            if (typeof item == 'number') item = this.getEnvironmentItem(item);
            if (!item) return this.notify(`setEnvironmentItemParam: Предмет ${item} не найден`);
            if (!isNaN(value)) value = parseFloat(value);
            Vue.set(item.params, key, value);
        },
    },
    watch: {
        enable(val) {
            if (!val) this.show = false;
        },
        show(val) {
            setCursor(val);
            mp.trigger("blur", val, 300);
            hud.show = !val;
            if (val) busy.add("inventory", true);
            else busy.remove("inventory", true);
        },
    },
    mounted() {
        let self = this;
        window.addEventListener('keyup', function(e) {
            if (busy.includes(["chat", "terminal", "interaction", "mapCase", "phone"])) return;
            if (e.keyCode == 73 && self.enable) self.show = !self.show;
            if (e.keyCode > 47 && e.keyCode < 58) {
                var num = e.keyCode - 48;
                self.onUseHotkey(num);
            }
        });
        window.addEventListener('click', function(e) {
            self.itemMenu.item = null;
        });
        window.addEventListener('mousemove', function(e) {
            if (self.itemDrag.item) {
                var rect = document.getElementById('inventory').getBoundingClientRect();
                var itemDiv = self.itemDrag.div;

                self.itemDrag.x = e.screenX - rect.x - itemDiv.offsetWidth / 2;
                self.itemDrag.y = e.screenY - rect.y - itemDiv.offsetHeight / 2;
            }
        });
        window.addEventListener('mouseup', function(e) {
            // console.log(JSON.stringify(self.itemDrag))
            var columns = self.itemDrag.accessColumns;
            if (columns.bodyFocus != null) {
                self.addItem(self.itemDrag.item, null, columns.bodyFocus);
                self.callRemote("item.add", {
                    sqlId: self.itemDrag.item.sqlId,
                    pocketI: null,
                    index: columns.bodyFocus,
                    placeSqlId: null
                });
            } else if (columns.hotkeyFocus) {
                self.bindHotkey(self.itemDrag.item.sqlId, columns.hotkeyFocus);
            } else if (columns.targetSqlId) {
                self.deleteItem(self.itemDrag.item.sqlId);
                self.callRemote("item.merge", {
                    sqlId: self.itemDrag.item.sqlId,
                    targetSqlId: columns.targetSqlId,
                    pocketI: columns.pocketI,
                    placeSqlId: columns.placeSqlId
                });
            } else {
                var index = Object.keys(columns.columns)[0];
                if (!columns.deny && columns.placeSqlId != null &&
                    columns.pocketI != null &&
                    index != null) {
                    if (columns.placeSqlId > 0) self.addItem(self.itemDrag.item, columns.pocketI, index, columns.placeSqlId)
                    else self.addEnvironmentItem(self.itemDrag.item, columns.pocketI, index, columns.placeSqlId)
                    self.callRemote("item.add", {
                        sqlId: self.itemDrag.item.sqlId,
                        pocketI: columns.pocketI,
                        index: index,
                        placeSqlId: columns.placeSqlId
                    });
                }
            }

            self.itemDrag.item = null;
            self.itemDrag.div = null;
            columns.placeSqlId = null;
            columns.pocketI = null;
            columns.columns = {};
            columns.bodyFocus = null;
        });
    }
});

// for tests
/*inventory.initItems({
    0: {
        sqlId: 100,
        itemId: 1,
        params: {}
    },
    5: {
        sqlId: 200,
        itemId: 7,
        params: {},
        pockets: [{
                cols: 9,
                rows: 20,
                items: {}
            },
            {
                cols: 5,
                rows: 5,
                items: {
                    2: {
                        sqlId: 300,
                        itemId: 1,
                        params: {}
                    }
                }
            }
        ]
    }
});

inventory.addEnvironmentPlace({
    sqlId: -200,
    header: "Холодильник",
    pockets: [{
            cols: 5,
            rows: 7,
            items: {},
        },
        {
            cols: 5,
            rows: 7,
            items: {},
        },
        {
            cols: 7,
            rows: 7,
            items: {},
        }
    ],
});
inventory.addEnvironmentPlace({
    sqlId: -100,
    header: "Шкаф",
    pockets: [{
            cols: 10,
            rows: 8,
            items: {
                0: {
                    sqlId: 595,
                    itemId: 7,
                    pockets: [{
                        cols: 5,
                        rows: 5,
                        items: {},
                    }],
                    params: {}
                }
            },
        },
        {
            cols: 9,
            rows: 8,
            items: {
                0: {
                    sqlId: 590,
                    itemId: 13,
                    pockets: [{
                        cols: 5,
                        rows: 6,
                        items: {
                            0: {
                                sqlId: 600,
                                itemId: 7,
                                pockets: [{
                                    rows: 10,
                                    cols: 10,
                                    items: {
                                        0: {
                                            sqlId: 427,
                                            itemId: 13,
                                            pockets: [{
                                                    cols: 5,
                                                    rows: 3,
                                                    items: {}
                                                },
                                                {
                                                    cols: 5,
                                                    rows: 3,
                                                    items: {}
                                                },
                                                {
                                                    cols: 5,
                                                    rows: 3,
                                                    items: {}
                                                },
                                            ],
                                            params: {}
                                        }
                                    }
                                }],
                                params: {}
                            }
                        }
                    }],
                    params: {},
                }
            },
        },
        {
            cols: 4,
            rows: 2,
            items: {},
        },
        {
            cols: 5,
            rows: 2,
            items: {},
        }
    ],
});
inventory.addEnvironmentPlace({
    sqlId: 0,
    header: "На земле",
    pockets: [{
        cols: 19,
        rows: 30,
        items: {
            0: {
                sqlId: 1,
                itemId: 37,
                // index: 0,
                params: {
                    count: 110
                }
            },
            5: {
                sqlId: 2,
                itemId: 39,
                // index: 5,
                params: {
                    count: 10
                }
            },
            10: {
                sqlId: 3,
                itemId: 24,
                // index: 10,
                params: {
                    count: 4,
                    health: 70,
                }
            },
            140: {
                sqlId: 4,
                itemId: 18,
                // index: 10,
                params: {
                    health: 70,
                }
            },
            148: {
                sqlId: 5,
                itemId: 1,
                // index: 10,
                params: {}
            },
            290: {
                sqlId: 6,
                itemId: 21,
                params: {}
            }
        }
    }]
});
inventory.show = true;
inventory.enable = true;*/
