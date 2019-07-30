var inventory = new Vue({
    el: '#inventory',
    data: {
        // Макс. вес предметов, переносимый игроком
        maxPlayerWeight: 15,
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
                height: 3,
                width: 3,
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
                menu: {
                    'Включить': {
                        handler(item) {
                            console.log(`Включить ${item}`)
                        }
                    }
                }
            },
            24: {
                name: 'Аптечка',
                description: 'Описание аптечки.',
                height: 6,
                width: 8,
                weight: 0.1,
                menu: {
                    'Лечить': {
                        handler(item) {
                            console.log(`лечить ${item}`)
                        }
                    }
                }
            },
            37: {
                name: 'Патрон',
                description: 'Описание патрона.',
                height: 4,
                width: 4,
                weight: 0.02,
                menu: {
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

                }
            },
        },
        // Предметы в окружении (земля, шкаф, багажник, холодильник, ...)
        environment: [],
        // Предметы на игроке (экипировка)
        equipment: {},
        // Предметы на горячих клавишах
        hotkeys: {},
        // Предметы в руках
        hands: {
            left: null,
            right: null
        },
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
                columns: {},
            },
            x: 0,
            y: 0
        },
    },
    computed: {
        // Тяжесть игрока (в %)
        playerWeight: function() {
            var weight = this.getItemWeight(Object.values(this.equipment));
            return weight / this.maxPlayerWeight * 100;
        }
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
                height: this.itemsInfo[itemId].height * 2.2 + "vh",
                width: this.itemsInfo[itemId].width * 2.2 + "vh",
                pointerEvents: (this.itemDrag.item) ? 'none' : '',
            };
            return style;
        },
        itemMouseHandler(item, e) {
            var handlers = {
                'mouseenter': (e) => {
                    this.itemDesc.item = item;
                    var itemDiv = e.target;
                    this.itemDesc.x = e.pageX + itemDiv.offsetWidth / 5;
                    this.itemDesc.y = e.pageY + itemDiv.offsetHeight / 5;
                },
                'mouseleave': (e) => {
                    this.itemDesc.item = null;
                },
                'mousemove': (e) => {
                    var itemDiv = e.target;
                    this.itemDesc.x = e.pageX + itemDiv.offsetWidth / 5;
                    this.itemDesc.y = e.pageY + itemDiv.offsetHeight / 5;
                },
                'contextmenu': (e) => {
                    this.itemMenu.item = item;
                    this.itemMenu.x = e.pageX;
                    this.itemMenu.y = e.pageY;
                },
                'mousedown': (e) => {
                    if (e.which == 1) { // Left Mouse Button
                        this.itemDrag.item = item;
                        this.itemDrag.div = e.target;
                        this.itemDrag.x = e.pageX - e.target.offsetWidth / 2;
                        this.itemDrag.y = e.pageY - e.target.offsetHeight / 2;
                    }
                },
            };
            handlers[e.type](e);
        },
        columnMouseHandler(place, pocket, index, e) {
            if (!this.itemDrag.item) return;
            var columns = this.itemDrag.accessColumns;
            var pocketI = place.pockets.indexOf(pocket);
            var w = this.itemsInfo[this.itemDrag.item.itemId].width;
            var h = this.itemsInfo[this.itemDrag.item.itemId].height;
            if (w > pocket.cols || h > pocket.rows) return;
            var coord = this.indexToXY(pocket.rows, pocket.cols, index);
            coord.x = Math.clamp(coord.x - parseInt(w / 2), 0, pocket.cols - w);
            coord.y = Math.clamp(coord.y - parseInt(h / 2), 0, pocket.rows - h);
            var handlers = {
                'mouseenter': (e) => {
                    columns.placeSqlId = place.sqlId;
                    columns.pocketI = pocketI;
                    for (var x = 0; x < w; x++) {
                        for (var y = 0; y < h; y++) {
                            var i = this.xyToIndex(pocket.rows, pocket.cols, {
                                x: coord.x + x,
                                y: coord.y + y
                            });
                            columns.columns[i] = true;
                            if (this.isColumnBusy(pocket, i, this.itemDrag.item)) columns.deny = true;
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
        columnClass(index, pocket, place) {
            var classes = {
                access: this.isColumnAccess(index, pocket, place),
            };
            if (classes.access && this.itemDrag.accessColumns.deny)
                classes.deny = true;

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
        setBusyColumn(pocket, index, item) {
            for (var i in pocket.busyColumns) {
                if (pocket.busyColumns[i] == item.sqlId) delete pocket.busyColumns[i];
            }
            console.log(pocket)
            pocket.busyColumns[index] = item.sqlId;
        },
        isColumnBusy(pocket, index, ignoreItem) {
            return pocket.busyColumns[index] && pocket.busyColumns[index] != ignoreItem.sqlId;
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
            alert("[Inventory] " + message);
        },

        // ******************  [ Inventory Config ] ******************
        setItemsInfo(itemsInfo) {
            for (var itemId in itemsInfo) {
                Vue.set(this.itemsInfo, itemId, itemsInfo[itemId]);
            }
        },
        // ******************  [ Player Inventory ] ******************
        getItem(sqlId) {
            var item = this.getItemBySqlId(sqlId, this.equipment);
            return item;
        },
        addItem(item, pocket, index, parent) {
            if (typeof item == 'number') item = this.getItem(item);
            if (typeof parent == 'number') parent = this.getItem(parent);

            this.deleteItem(item.sqlId);
            this.deleteEnvironmentItem(item.sqlId);

            if (item.pockets) {
                item.showPockets = true;
                item.pockets.forEach(pocket => pocket.busyColumns = {});
            }
            if (parent) {
                this.setBusyColumn(parent.pockets[pocket], index, item);
                parent.pockets[pocket].items[index] = item;
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
        setItemParam(item, keys, values) {
            if (typeof item == 'number') item = this.getItem(item);
            if (!item) return this.notify(`setItemParam: Предмет ${item} не найден`);
            if (!Array.isArray(keys)) keys = [keys];
            if (!Array.isArray(values)) values = [values];
            for (var i in keys) {
                Vue.set(item.params, keys[i], values[i]);
            }
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

        // ******************  [ Hotkeys ] ******************
        bindHotkey(item, key) {
            if (typeof item == 'number') item = this.getItem(item);
            if (!item) return this.notify(`bindHotkey: Предмет ${item} не опреден`);
            Vue.set(this.hotkeys, key, item);
        },
        unbindHotkey(key) {
            Vue.delete(this.hotkeys, key);
        },

        // ******************  [ Hands ] ******************
        fillHand(item, hand) {
            if (typeof item == 'number') item = this.getItem(item);
            if (!item) return this.notify(`fillHand: Предмет ${item} не опреден`);

            this.hands[hand] = item;
        },
        clearHand(hand) {
            this.hands[hand] = null;
        },

        // ******************  [ Environment ] ******************
        addEnvironmentPlace(place) {
            place.showPockets = true;
            place.pockets.forEach(pocket => pocket.busyColumns = {});
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
        setEnvironmentItemParam(item, keys, values) {
            if (typeof item == 'number') item = this.getEnvironmentItem(item);
            if (!item) return this.notify(`setEnvironmentItemParam: Предмет ${item} не найден`);
            if (!Array.isArray(keys)) keys = [keys];
            if (!Array.isArray(values)) values = [values];
            for (var i in keys) {
                Vue.set(item.params, keys[i], values[i]);
            }
        },
    },
    watch: {
        enable(val) {
            if (!val) this.show = false;
        },
        show(val) {
            setCursor(val);
            mp.trigger("blur", val, 300);
        }
    },
    mounted() {
        let self = this;
        window.addEventListener('keyup', function(e) {
            if (e.keyCode == 73 && self.enable) self.show = !self.show;
        });
        window.addEventListener('click', function(e) {
            self.itemMenu.item = null;
        });
        window.addEventListener('mousemove', function(e) {
            if (self.itemDrag.item) {
                var itemDiv = self.itemDrag.div;
                self.itemDrag.x = e.pageX - itemDiv.offsetWidth / 2;
                self.itemDrag.y = e.pageY - itemDiv.offsetHeight / 2;
            }
        });
        window.addEventListener('mouseup', function(e) {
            var columns = self.itemDrag.accessColumns;
            var index = Object.keys(columns.columns)[0];
            if (!columns.deny && columns.placeSqlId != null &&
                columns.pocketI != null &&
                index != null) {
                if (columns.placeSqlId > 0) self.addItem(self.itemDrag.item, columns.pocketI, index, columns.placeSqlId)
                else self.addEnvironmentItem(self.itemDrag.item, columns.pocketI, index, columns.placeSqlId)
            }

            self.itemDrag.item = null;
            self.itemDrag.div = null;
            columns.placeSqlId = null;
            columns.pocketI = null;
            columns.columns = {};
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
            cols: 9,
            rows: 8,
            items: {},
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
                                    rows: 5,
                                    cols: 5,
                                    items: {
                                        0: {
                                            sqlId: 427,
                                            itemId: 13,
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
                itemId: 37,
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
        }
    }]
});
inventory.show = true;
inventory.enable = true;*/
