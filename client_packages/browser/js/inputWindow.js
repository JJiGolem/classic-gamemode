
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
        value: '',//Значеие из поя ввода.
    },
    computed: {
    },
    methods: {
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
        },
    }
});

//for tests
// inputWindow.show = true;
// inputWindow.name = 'money_giving';
// inputWindow.header = "Передача денег Cyrus Raider";
// inputWindow.hint = "Введите сумму";
// inputWindow.inputHint = "Сумма...";
