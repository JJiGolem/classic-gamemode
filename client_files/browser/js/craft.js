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
    filters: {
        time(val) {
            var minutes = parseInt(val / 60);
            var seconds = val % 60;

            if (minutes < 10) minutes = "0" + minutes;
            if (seconds < 10) seconds = "0" + seconds;

            return `${minutes}:${seconds}`;
        },
    },
    methods: {
        initCrafter(crafter) {
            Vue.set(crafter, 'typeI', 0);
            Vue.set(crafter.types[0], 'itemI', 0);

            var processList = crafter.queue.columns.filter(x => x.time);
            if (processList.length) this.startQueueTick(processList);

            this.crafter = crafter;
        },
        clearCrafter() {
            clearInterval(this.queueTimer);
            this.crafter = null;
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
                if (item.count) count += item.count - 1;
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
        stateName(state) {
            if (state == 'process') return 'Изготовление';
            if (state == 'completed') return 'Завершено';
            if (state == 'unsuccessfully') return 'Неудачно';
        },
        onClickItem(itemI) {
            if (this.currentType.itemI == itemI) this.currentType.itemI = -1;
            else this.currentType.itemI = itemI;
        },
        onClickDetails() {
            this.paramsShow = !this.paramsShow;
        },
        onClickCraft() {
            this.callRemote(`craft.item.craft`, this.currentItem.itemId);
            this.currentType.itemI = -1;
        },
        callRemote(eventName, values) {
            console.log(`callRemote: ${eventName}`);
            console.log(values)

            // mp.trigger("callRemote", eventName, JSON.stringify(values));
        },
    },
});

// for tests
/*craft.show = true;
craft.initCrafter({
    name: "Станок",
    types: [{
        name: "Тип1",
        items: [{
                itemId: 1,
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
                    }
                ],
                time: 60,
            }
        ],
    }],
    queue: {
        columns: [{
                itemId: 1,
                state: 'process',
                time: 10,
                maxTime: 180,
            },
            {
                itemId: 3,
                state: 'completed',
            },
            {
                itemId: 7,
                state: 'unsuccessfully'
            },
            {}
        ]
    },
});
*/
