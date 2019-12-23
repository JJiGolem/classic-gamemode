var craft = new Vue({
    el: "#craft",
    data: {
        // Показ интерфейса
        show: false,
        // Показ инфо об изготовителе
        helpShow: false,
        // Показ параметров предмета
        paramsShow: false,
        // Текуший изготовитель (станок, верстак и т.п.)
        crafter: null,
        // Таймер очереди
        queueTimer: null,
    },
    computed: {
        currentType() {
            return this.crafter.types[this.crafter.typeI];
        },
        currentItem() {
            return this.currentType.items[this.currentType.itemI];
        },
        currentItemParams() {
            var item = this.currentItem;
            return inventory.getPrettyParams(item.itemId, item.params);
        },
        canCraft() {
            if (!this.currentItem) return false;

            for (var i = 0; i < this.currentItem.materials.length; i++) {
                var material = this.currentItem.materials[i];
                if (this.isDeficit(material)) return false;
            }

            return true;
        },
    },
    watch: {
        show(val) {
            mp.trigger("blur", val, 300);
            hud.keysShow = !val;
            if (val) {
                busy.add("craft", true, true);
                prompt.showByName("craft_exit");
            } else {
                busy.remove("craft", true);
                prompt.hide();
            }
        },
    },
    filters: {
        time(val) {
            var minutes = parseInt(val / 60);
            var seconds = val % 60;

            if (minutes < 10) minutes = "0" + minutes;
            if (seconds < 10) seconds = "0" + seconds;

            return `${minutes}:${seconds}`;
        },
        itemName(val) {
            var len = 25;
            if (val.length > len) val = val.substr(0, len) + "...";
            return val;
        },
    },
    methods: {
        initCrafter(crafter) {
            if (typeof crafter == 'string') crafter = JSON.parse(crafter);
            Vue.set(crafter, 'typeI', 0);
            crafter.types.forEach(type => {
                Vue.set(type, 'itemI', -1);
            });

            var processList = crafter.queue.columns.filter(x => x.time);
            if (processList.length) this.startQueueTick(processList);

            this.crafter = crafter;
        },
        clearCrafter() {
            clearInterval(this.queueTimer);
            this.crafter = null;
            this.show = false;
        },
        getMaterialName(item, material) {
            var name = `${material.count}${inventory.itemsInfo[material.itemId].name}`;
            var isLast = item.materials.indexOf(material) == item.materials.length - 1;
            if (!isLast) name += '/';
            return name;
        },
        getMaterialCount(itemId) {
            var items = inventory.getItemsByItemId(itemId);
            var count = items.length;
            items.forEach(item => {
                if (item.params.count) count += item.params.count - 1;
            });
            return count;
        },
        isDeficit(material) {
            return this.getMaterialCount(material.itemId) < material.count;
        },
        startQueueTick(processList) {
            clearInterval(this.queueTimer);
            this.queueTimer = setInterval(() => {
                for (var i = 0; i < processList.length; i++) {
                    var col = processList[i];
                    if (col.time <= 0) {
                        col.state = 'completed';
                        processList.splice(i, 1);
                        i--;
                        continue;
                    }
                    col.time--;
                }
                if (!processList.length) clearInterval(this.queueTimer);
            }, 1000);
        },
        progressStyle(col) {
            return {
                width: 100 - col.time / col.maxTime * 100 + '%'
            };
        },
        stateName(col) {
            if (col.playerName != playerMenu.name) return col.playerName;
            if (col.state == 'process') return 'Изготовление';
            if (col.state == 'completed') return 'Завершено';
            if (col.state == 'unsuccessfully') return 'Неудачно';
        },
        onClickItem(itemI) {
            if (this.currentType.itemI == itemI) this.currentType.itemI = -1;
            else this.currentType.itemI = itemI;
        },
        onClickDetails() {
            this.paramsShow = !this.paramsShow;
        },
        onClickCraft() {
            if (!this.canCraft) return;
            this.callRemote(`craft.item.craft`, {
                typeI: this.crafter.typeI,
                itemI: this.currentType.itemI
            });
            this.currentType.itemI = -1;
        },
        onClickColumn(index) {
            var col = this.crafter.queue.columns[index];
            if (!col.itemId || col.state == 'process' || col.playerName != playerMenu.name) return;
            this.callRemote(`craft.queue.take`, index);
        },
        callRemote(eventName, data) {
            if (typeof data == 'object') data = JSON.stringify(data);
            // console.log(`callRemote: ${eventName}`);
            // console.log(data)

            mp.trigger("callRemote", eventName, data);
        },
        addItemToQueue(index, item) {
            if (typeof item == 'string') item = JSON.parse(item);
            Vue.set(this.crafter.queue.columns, index, item);

            var processList = this.crafter.queue.columns.filter(x => x.time);
            if (processList.length) this.startQueueTick(processList);
        },
    },
    mounted() {
        window.addEventListener('keyup', (e) => {
            if (e.keyCode == 27 && this.show) this.show = !this.show;
        });
    },
});

// for tests
/*
craft.show = true;
craft.initCrafter({
    name: "Станок",
    description: "Используется для изготовления предметов.",
    types: [{
            name: "Тип1",
            items: [{
                    itemId: 1,
                    params: {
                        health: 100,
                    },
                    materials: [{
                        itemId: 16,
                        count: 20
                    }],
                    time: 60,
                },
                {
                    itemId: 3,
                    params: {
                        health: 100
                    },
                    materials: [{
                            itemId: 16,
                            count: 15
                        },
                        {
                            itemId: 7,
                            count: 2
                        },
                        {
                            itemId: 16,
                            count: 15
                        },
                        {
                            itemId: 7,
                            count: 2
                        },
                    ],
                    time: 60,
                }
            ],
        },
        {
            name: "Тип2",
            items: [{
                    itemId: 18,
                    params: {
                        health: 100
                    },
                    materials: [{
                        itemId: 16,
                        count: 20
                    }],
                    time: 60,
                },
                {
                    itemId: 21,
                    params: {
                        health: 100
                    },
                    materials: [{
                            itemId: 16,
                            count: 2
                        },
                        {
                            itemId: 7,
                            count: 4
                        }
                    ],
                    time: 90,
                }
            ],
        }
    ],
    queue: {
        columns: [{
                itemId: 1,
                state: 'process',
                time: 10,
                maxTime: 180,
                playerName: "Carter Slade",
            },
            {
                itemId: 3,
                state: 'completed',
                playerName: "Cyrus Raider",
            },
            {
                itemId: 7,
                state: 'unsuccessfully',
                playerName: "Carter Slade",
            },
            {}
        ]
    },
});
*/
