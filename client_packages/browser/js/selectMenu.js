var selectMenu = new Vue({
    el: "#selectMenu",
    data: {
        show: false,
        // Текущее меню
        menu: null,
        // Макс. количество пунктов на экране
        maxItems: 5,
        // Макс. количество цветов в селекторе
        maxColorValues: 11,
        menus: {
            "parkingMenu": {
                name: "parking",
                header: "Парковка", // заголовок меню, видимый на экране
                items: [{
                    text: "Забрать автомобиль",
                },
                {
                    text: "Закрыть меню",
                }
                ],
                i: 0, // индекс выбранного пункта
                j: 0, // индекс первого видимого пункта
                handler(eventName) { // обработчик взаимодействия с меню
                    var item = this.items[this.i];
                    var e = {
                        menuName: this.name, // название меню
                        itemName: item.text, // текст пункта меню
                        itemIndex: this.i, // индекс пункта меню
                        itemValue: (item.i != null && item.values) ? item.values[item.i] : null, // значение пункта меню
                        valueIndex: item.i, // индекс значения пункта меню
                    };
                    mp.trigger(`chat.message.push`, `!{#ffffff} Событие: ${eventName}`);
                    mp.trigger(`chat.message.push`, `!{#ffffff} ${JSON.stringify(e)}`);
                    if (eventName == 'onItemSelected') {
                        if (e.itemName == 'Забрать автомобиль') {
                            mp.trigger(`parkings.vehicle.get`);
                        }
                        if (e.itemName == 'Закрыть меню') {
                            mp.trigger(`parkings.menu.close`);
                        }
                    }
                }
            },
            "carShowMenu": {
                name: "carshow",
                header: "Автосалон", 
                items: [{
                    text: "Модель", 
                    values: [],
                    i: 0, 
                },
                {
                    text: "Основной цвет",
                    values: [],
                    i: 0,
                },
                {
                    text: "Дополнительный цвет",
                    values: [],
                    i: 0,
                },
                {
                    text: "Купить"
                }
            ],
                i: 0, // индекс выбранного пункта
                j: 0, // индекс первого видимого пункта
                handler(eventName) { // обработчик взаимодействия с меню
                    var item = this.items[this.i];
                    var e = {
                        menuName: this.name, // название меню
                        itemName: item.text, // текст пункта меню
                        itemIndex: this.i, // индекс пункта меню
                        itemValue: (item.i != null && item.values) ? item.values[item.i] : null, // значение пункта меню
                        valueIndex: item.i, // индекс значения пункта меню
                    };
                    mp.trigger(`chat.message.push`, `!{#ffffff} Событие: ${eventName}`);
                    mp.trigger(`chat.message.push`, `!{#ffffff} ${JSON.stringify(e)}`);
                    if (eventName == 'onItemValueChanged') {
                        if (e.itemName == 'Модель') {
                            mp.trigger(`carshow.vehicle.show`, e.valueIndex);
                        }
                        if (e.itemName == 'Основной цвет') {
                            mp.trigger(`carshow.vehicle.color`, e.valueIndex, -1);
                        }
                        if (e.itemName == 'Дополнительный цвет') {
                            mp.trigger(`carshow.vehicle.color`, -1, e.valueIndex);
                        }
                    }
                    if (eventName == 'onItemSelected') {
                        if (e.itemName == 'Купить') {
                            mp.trigger(`carshow.car.buy`);
                        }
                    }
                    if (eventName == 'onEscapePressed') {
                            mp.trigger(`carshow.list.close`);    
                    }
                }
            },
            "carMarketMenu": {
                name: "carmarket",
                header: "Авторынок", 
                items: [{
                    text: "Продать транспорт", 
                    i: 0, 
                },
                {
                    text: "Отмена",
                    i: 0,
                }
            ],
                i: 0, 
                j: 0, 
                handler(eventName) {
                    var item = this.items[this.i];
                    var e = {
                        menuName: this.name, 
                        itemName: item.text,
                        itemIndex: this.i, 
                        itemValue: (item.i != null && item.values) ? item.values[item.i] : null,
                        valueIndex: item.i,
                    };
                    mp.trigger(`chat.message.push`, `!{#ffffff} Событие: ${eventName}`);
                    mp.trigger(`chat.message.push`, `!{#ffffff} ${JSON.stringify(e)}`);
                    if (eventName == 'onItemSelected') {
                        if (e.itemName == 'Продать транспорт') {
                            mp.trigger(`carmarket.car.sell`);
                        }
                        if (e.itemName == 'Отмена') {
                            mp.trigger(`carmarket.menu.close`);    
                    }
                    }
                }
            },
        }
    },
    methods: {
        onKeyUp(e) {
            if (e.keyCode == 38) { // UP
                if (this.menu.i == 0) return;
                this.menu.i = Math.clamp(this.menu.i - 1, 0, this.menu.items.length - 1);
                if (this.menu.i < this.menu.j) this.menu.j--;
                this.onItemFocusChanged();
            } else if (e.keyCode == 40) { // DOWN
                if (this.menu.i == this.menu.items.length - 1) return;
                this.menu.i = Math.clamp(this.menu.i + 1, 0, this.menu.items.length - 1);
                if (this.menu.i - this.menu.j == this.maxItems) this.menu.j++;
                this.onItemFocusChanged();
            } else if (e.keyCode == 37) { // LEFT
                var item = this.menu.items[this.menu.i];
                if (!item.values || item.i == 0) return;
                item.i = Math.clamp(item.i - 1, 0, item.values.length - 1);
                this.onItemValueChanged();
            } else if (e.keyCode == 39) { // RIGHT
                var item = this.menu.items[this.menu.i];
                if (!item.values || item.i == item.values.length - 1) return;
                item.i = Math.clamp(item.i + 1, 0, item.values.length - 1);
                this.onItemValueChanged();
            } else if (e.keyCode == 13) { // ENTER
                this.onItemSelected();
            } else if (e.keyCode == 8) { // BACKSPACE
                this.onBackspacePressed();
            } else if (e.keyCode == 27) { // ESCAPE
                this.onEscapePressed();
            }
        },
        isItemShow(index) {
            return index >= this.menu.j && index <= this.menu.j + this.maxItems - 1;
        },
        isValueShow(index) {
            var i = this.menu.items[this.menu.i].i;
            return index <= 2;
        },
        valuesType(index) {
            // 0 - обычное значение, 1 - цвет, 2 - ползунок, -1 - нет значений
            var values = this.menu.items[index].values;
            if (!values) return -1;
            if (values[0][0] == '#') return 1;
            for (var i = 0; i < values.length; i++) {
                var value = values[i];
                if (typeof value != 'number') return 0;
            }
            return 2;
        },
        // ************** События взаимодействия с меню **************
        // Выбран пункт меню
        onItemSelected(e) {
            this.menu.handler("onItemSelected");
        },
        // Изменено значение пункта меню
        onItemValueChanged() {
            this.menu.handler("onItemValueChanged");
        },
        // Изменен фокус пункта меню
        onItemFocusChanged() {
            this.menu.handler("onItemFocusChanged");
        },
        // Нажата клавиша 'Назад'
        onBackspacePressed() {
            this.menu.handler("onBackspacePressed");
        },
        onEscapePressed() {
            this.menu.handler("onEscapePressed");
        },
        open() {
            this.menu.i = 0; // TEMP, нужно разобраться, почему i/j остаются прежними при закрытии/открытии меню
            this.menu.j = 0;
            this.show = true;
        },
        close() {
            this.menu = null;
        }
    },
    computed: {
        items() {
            if (!this.menu) return null;
            var items = this.menu.items.slice(0);
            return items;
        },
        values() {
            if (!this.menu) return null;
            var i = this.menu.items[this.menu.i].i;
            var values = this.menu.items[this.menu.i].values;
            if (!values) return null;
            var result = [values[i - 1] || "", values[i], values[i + 1] || ""];
            return result;
        },
        colorValues() {
            return this.menu.items[this.menu.i].values.slice(0, this.maxColorValues);
        },
        leftNumberType() {
            var offset = 3.5; // половина от ширины шарика ползунка
            if (this.menu.items[this.menu.i].i == 0) return 0 - offset + '%';
            var values = this.menu.items[this.menu.i].values;
            var maxValue = values[values.length - 1];
            var curValue = values[this.menu.items[this.menu.i].i];
            return curValue / maxValue * 100 - offset + '%';
        }
    },
    mounted() {
        let self = this;
        window.addEventListener('keyup', function (e) {
            if (!self.menu) return;
            self.onKeyUp(e);
        });
    }
});

// for tests
// Для своего меню необходимо создать след. структуру (комментарии внутри):
/*var testMenu = {
    name: "test", // название меню, необходимо для отловки событий
    header: "Меню выбора", // заголовок меню, видимый на экране
    items: [{
            text: "Выборочный тип 1", // текст пункта меню, видимый на экране
            // если ОДНО ИЗ значений начинается с '#', то снизу появится селектор цветов
            // если ВСЕ значения - числа, то снизу появится селектор с ползунком
            // в любом другом случае, появится обычный селектор со значениями
            values: ['Выбор 1', 'Выбор 2', 'Выбор 3', 'Выбор 4', 'Выбор 5', 'Выбор 6'], // доступные значения пункта меню
            i: 0, // индекс выбранного значения пункта меню
        },
        {
            text: "Выбор цвета 2",
            values: ['#0bf', '#fb0', '#bf0', '#fb0', '#fb0', '#fb0', '#bf0', '#0fe', '#cd3', 'yellow', 'pink'],
            i: 0,
        },
        {
            text: "Ползунок 2.5",
            values: [0, 10, 20, 30, 40, 50],
            i: 0,
            min: "Минимум", // слово слева от ползунка
            max: "Максимум", // слово справа от ползунка
        },
        {
            text: "Обычный тип 3"
        },
        {
            text: "Ползунок 3.5",
            values: [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 100],
            i: 0,
            min: "Округлые", // слово слева от ползунка
            max: "Впалые", // слово справа от ползунка
        },
        {
            text: "Выборочный тип 4",
            values: ['Выбор 1', 'Выбор 2', 'Выбор 3'],
            i: 0,
        },
        {
            text: "Выбор цвета 5",
            values: ['#0bf', '#fb0', '#bf0'],
            i: 0,
        },
        {
            text: "Обычный тип 6"
        },
        {
            text: "Выборочный тип 7",
            values: ['Выбор 1', 'Выбор 2', 'Выбор 3'],
            i: 0,
        },
        {
            text: "Выбор цвета 8",
            values: ['#0bf', '#fb0', '#bf0'],
            i: 0,
        },
        {
            text: "Обычный тип 9",
        },
    ],
    i: 1, // индекс выбранного пункта
    j: 0, // индекс первого видимого пункта
    handler(eventName) { // обработчик взаимодействия с меню
        var item = this.items[this.i];
        var e = {
            menuName: this.name, // название меню
            itemName: item.text, // текст пункта меню
            itemIndex: this.i, // индекс пункта меню
            itemValue: (item.i != null && item.values) ? item.values[item.i] : null, // значение пункта меню
            valueIndex: item.i, // индекс значения пункта меню
        };
        console.log(`Событие: ${eventName}`);
        console.log(e);
    }
};
// Далее, присвоить эту структуру модулю selectMenu:
selectMenu.menu = testMenu;
// Показываем меню:
selectMenu.show = true;*/