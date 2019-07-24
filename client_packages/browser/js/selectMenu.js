var selectMenu = new Vue({
    el: "#selectMenu",
    data: {
        show: false,
        // Текущее меню
        menu: null,
        // Макс. количество пунктов на экране
        maxItems: 5,
        menus: {
            "parkingMenu": {
                name: "parking", // название меню, необходимо для отловки событий
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
                }
            }
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
            }
        },
        isItemShow(index) {
            return index >= this.menu.j && index <= this.menu.j + this.maxItems - 1;
        },
        isValueShow(index) {
            var i = this.menu.items[this.menu.i].i;
            return index <= 2;
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
            values: ['Выбор 1', 'Выбор 2', 'Выбор 3', 'Выбор 4', 'Выбор 5', 'Выбор 6'], // доступные значения пункта меню
            i: 0, // индекс выбранного значения пункта меню
        },
        {
            text: "Выбор цвета 2",
            values: ['#0bf', '#fb0', '#bf0'],
            i: 0,
        },
        {
            text: "Обычный тип 3"
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