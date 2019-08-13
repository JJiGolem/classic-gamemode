
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
        },
        decline() {
            if (this.name == 'money_giving') {
                mp.trigger('interaction.money.decline');
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
