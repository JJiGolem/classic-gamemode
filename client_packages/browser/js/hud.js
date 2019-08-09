var hud = new Vue({
    el: "#hud",
    data: {
        players: 0,
        maxPlayers: 1000,
        cash: 0,
        bank: 0,
        time: new Date().setHours(17).toTimeString().replace(/(\d{2}:\d{2}).*/, '$1'),
        region: "Округ Блейн",
        street: "Атли-стрит",
        temperature: 17,
        city: "San Andreas",
        weather: "clear-day",
        voice: false,
        show: false,
        showOnline: true,
        leftWeather: 300,
    },
    methods: {
        updateTime() {
            this.time = new Date().toTimeString().replace(/(\d{2}:\d{2}).*/, '$1');
        },
        pretty(val) {
            return prettyMoney(val);
        }
    },
    mounted() {
        setInterval(this.updateTime, 1000);
    }
});
