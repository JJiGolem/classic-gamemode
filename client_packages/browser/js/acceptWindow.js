
var acceptWindow = new Vue({
    el: "#accept-window",
    data: {
        show: false,
        name: '',
        header: '',
        leftWord: 'Принять', //Слово на зелёном фоне.
        rightWord: 'Отменить', //Слово на красном фоне.
        value: '',//Значеие из поя ввода.
    },
    computed: {
    },
    methods: {
        accept() {
            if (this.name == 'carsell') {
                mp.trigger('vehicles.sell.seller.accept', 1);
            }
        },
        decline() {
            if (this.name == 'carsell') {
                mp.trigger('vehicles.sell.seller.accept', 0);
            }
        },
    }
});

//for tests
//acceptWindow.show = true;
// inputWindow.name = 'carsell';
//acceptWindow.header = `Вы действительно хотите продать т/с "Glendale" игроку Swifty Swift за $35000?`;
