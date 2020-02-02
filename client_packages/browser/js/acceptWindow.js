
var acceptWindow = new Vue({
    el: "#accept-window",
    data: {
        show: false,
        name: '',
        header: '',
        text: '',
        leftWord: 'Принять',
        rightWord: 'Отменить',
        value: '',
    },
    computed: {
    },
    methods: {
        accept() {
            if (this.name == 'carsell') {
                mp.trigger('vehicles.sell.seller.accept', 1);
            }
            if (this.name == 'taxi_rent') {
                mp.trigger('callRemote', 'taxi.rent.accept', 1);
                mp.trigger('taxi.rent.close');
            }
            if (this.name == 'bus_rent') {
                loader.show = true;
                mp.trigger('callRemote', 'busdriver.rent.accept', 1);
                mp.trigger('busdriver.rent.close');
            }
        },
        decline() {
            if (this.name == 'carsell') {
                mp.trigger('vehicles.sell.seller.accept', 0);
            }
            if (this.name == 'bus_rent') {
                loader.show = true;
                mp.trigger('callRemote', 'busdriver.rent.accept', 0);
                mp.trigger('busdriver.rent.close');
            }
            if (this.name == 'taxi_rent') {
                mp.trigger('callRemote', 'taxi.rent.accept', 0);
                mp.trigger('taxi.rent.close');
            }
        },
    }
});
