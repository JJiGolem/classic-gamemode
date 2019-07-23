var selectMenu = new Vue({
    el: "#selectMenu",
    data: {
        show: false,
        // Текущее меню
        menu: null,
        // Макс. количество пунктов на экране
        maxItems: 5,
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
            var item = this.menu.items[this.menu.i];
            var e = {
                menuName: this.menu.name,
                itemName: item.text,
                itemIndex: this.menu.i,
                itemValue: (item.i != null && item.values) ? item.values[item.i] : null,
                valueIndex: item.i
            };
            console.log(`selectMenu.onItemSelected`);
            console.log(e);
        },
        // Изменено значение пункта меню
        onItemValueChanged() {
            var item = this.menu.items[this.menu.i];
            var e = {
                menuName: this.menu.name,
                itemName: item.text,
                itemIndex: this.menu.i,
                itemValue: (item.i != null && item.values) ? item.values[item.i] : null,
                valueIndex: item.i
            };
            console.log(`selectMenu.onItemValueChanged`);
            console.log(e);
        },
        // Изменен фокус пункта меню
        onItemFocusChanged() {
            var item = this.menu.items[this.menu.i];
            var e = {
                menuName: this.menu.name,
                itemName: item.text,
                itemIndex: this.menu.i,
                itemValue: (item.i != null && item.values) ? item.values[item.i] : null,
                valueIndex: item.i
            };
            console.log(`selectMenu.onItemFocusChanged`);
            console.log(e);
        },
        // Нажата клавиша 'Назад'
        onBackspacePressed() {
            var item = this.menu.items[this.menu.i];
            var e = {
                menuName: this.menu.name,
                itemName: item.text,
                itemIndex: this.menu.i,
                itemValue: (item.i != null && item.values) ? item.values[item.i] : null,
                valueIndex: item.i
            };
            console.log(`selectMenu.onBackspacePressed`);
            console.log(e);
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
        window.addEventListener('keyup', function(e) {
            if (!self.menu) return;
            self.onKeyUp(e);
        });
    }
});

// for tests
/*var testMenu = {
    name: "test", // название меню, необходимо для отловки событий
    header: "Меню выбора",
    items: [{
            text: "Выборочный тип 1",
            values: ['Выбор 1', 'Выбор 2', 'Выбор 3', 'Выбор 4', 'Выбор 5', 'Выбор 6'],
            i: 0,
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
            text: "Обычный тип 9"
        },
    ],
    i: 1, // индекс выбранного пункта
    j: 0, // индекс первого видимого пункта
};
selectMenu.menu = testMenu;
selectMenu.show = true;*/
