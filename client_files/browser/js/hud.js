var hud = new Vue({
    el: "#hud",
    data: {
        players: 0,
        maxPlayers: 1000,
        build: 0,
        wanted: 0,
        cash: 0,
        bank: 0,
        time: new Date().toTimeString().replace(/(\d{2}:\d{2}).*/, '$1'),
        region: "Округ Блейн",
        street: "Атли-стрит",
        temperature: 17,
        city: "San Andreas",
        weather: "clear-day",
        voice: false,
        show: false,
        showOnline: true,
        leftWeather: 300,
        keys: [
            {
                key: "I",
                name: "Инвентарь",
            },
            {
                key: "T",
                name: "Чат",
            },
            {
                key: "P",
                name: "Планшет",
            },
            {
                key: "<i class='fas fa-arrow-up'></i>",
                name: "Телефон",
            },
            {
                key: "N",
                name: "Войс",
            },
            {
                key: "M",
                name: "Меню",
            },
            {
                key: "F3",
                name: "Обновления",
            },
        ],
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
    },
});

// for tets
// hud.show = true;
