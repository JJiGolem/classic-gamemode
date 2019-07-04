var hud = new Vue({
    el: "#hud",
    data: {
        players: 0,
        maxPlayers: 1000,
        cash: 100000,
        bank: 100000,
        time: new Date().toTimeString().replace(/(\d{2}:\d{2}).*/, '$1'),
        region: "Округ Блейн",
        street: "Атли-стрит",
        temperature: 17,
        city: "San Andreas",
        weather: "clear-day",
        voice: false,
        show: false,
        leftWeather: 300,
    },
    methods: {
        updateTime() {
            this.time = new Date().toTimeString().replace(/(\d{2}:\d{2}).*/, '$1');
        },
        pretty(val) {
            val += '';
            return val.replace(/(\d)(?=(\d{3})+(\D|$))/g, '$1 ');
        }
    },
    mounted() {
        setInterval(this.updateTime, 1000);
    }
});