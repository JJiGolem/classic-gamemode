var inputWindow = new Vue({
    el: "#input-window",
    data: {
        show: false,
        name: '',
        header: '',
        hint: '', //Текст над полем ввода.
        inputHint: '', //Текст-подсказка в поле ввода.
        leftWord: 'Принять', //Слово на зелёном фоне.
        rightWord: 'Отменить', //Слово на красном фоне.
        value: '', //Значеие из поя ввода.
        windows: {
            "mafia_power_sell": {
                name: `mafia_power_sell`,
                header: `Продажа крыши бизнеса`,
                hint: `Введите сумму`,
                inputHint: `Сумма`,
                leftWord: `Продать`,
                rightWord: `Отменить`
            },
        },
    },
    computed: {},
    methods: {
        showByName(name) {
            var win = this.windows[name];
            if (!win) return;
            for (var key in win) {
                this[key] = win[key];
            }
            this.show = true;
        },
        accept() {
            if (this.name == 'money_giving') {
                mp.trigger('interaction.money.accept', this.value);
            }
            if (this.name == 'carsell_id') {
                mp.trigger('vehicles.sell.id', this.value);
            }
            if (this.name == 'carsell_price') {
                mp.trigger('vehicles.sell.price', this.value);
            }
            if (this.name == 'fuelstations_litres') {
                mp.trigger('fuelstations.fill.litres.send', this.value);
            }
            if (this.name == 'mafia_power_sell') {
                if (isNaN(this.value)) return notifications.push(`error`, `Требуется число`);
                if (this.value <= 0) return notifications.push(`error`, `Требуется положительное число`);
                var data = {
                    recId: this.playerId,
                    sum: parseInt(this.value),
                };
                this.show = false;
                mp.trigger(`callRemote`, `mafia.power.sell`, JSON.stringify(data));
            }
        },
        decline() {
            if (this.name == 'money_giving') {
                mp.trigger('interaction.money.decline');
            }
            if (this.name == 'carsell_id') {
                mp.trigger('vehicles.sell.close');
            }
            if (this.name == 'carsell_price') {
                mp.trigger('vehicles.sell.close');
            }
            if (this.name == 'fuelstations_litres') {
                mp.trigger('fuelstations.fill.litres.close');
            }
            if (this.name == 'mafia_power_sell') {
                this.show = false;
            }
        },
    },
    watch: {
        show(val) {
            setCursor(val);
        }
    },
});

//for tests
// inputWindow.show = true;
// inputWindow.name = 'money_giving';
// inputWindow.header = "Передача денег Cyrus Raider";
// inputWindow.hint = "Введите сумму";
// inputWindow.inputHint = "Сумма...";
