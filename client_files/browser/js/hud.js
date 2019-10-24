var hud = new Vue({
    el: "#hud",
    data: {
        players: 0,
        maxPlayers: 1000,
        build: 0,
        branch: "",
        wanted: 0,
        cash: 0,
        bank: 0,
        time: convertToMoscowDate(new Date()).toTimeString().replace(/(\d{2}:\d{2}).*/, '$1'),
        region: "Округ Блейн",
        street: "Атли-стрит",
        temperature: 17,
        city: "San Andreas",
        weather: "clear-day",
        voice: false,
        show: false,
        showOnline: true,
        leftWeather: 300,
        keysShow: true,
        date: "",
        star: "M12.9998 0L16.2442 8.4776L25.2082 8.98278L18.2494 14.7274L20.545 23.5172L12.9998 18.59L5.45456 23.5172L7.75015 14.7274L0.791358 8.98278L9.75533 8.4776L12.9998 0Z",
        satiety: 0,
        thirst: 0,
        playerId: -1,
        cold: false,
        heat: false,
        arrestTime: 10, // секунды
        arrestDescription: "До освобождения 999999 мин.", // TODO: Описание
        keys: [{
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
                name: "Войс-чат",
            },
            {
                key: "L",
                name: "Действия",
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
        coldTimer: -1,
        heatTimer: -1,
    },
    computed: {
        arrestProgressStyle() {
            return {
                strokeDasharray: `${this.arrestProgress * 1.57}% 157%`, //78.5% 157%;
            }
        },
        arrestProgress() {

        }
    },
    watch: {
        cold(val) {
            if (!val) return;
            clearTimeout(this.coldTimer);
            this.coldTimer = setTimeout(() => {
                this.cold = false;
            }, 10000);
        },
        heat(val) {
            if (!val) return;
            clearTimeout(this.heatTimer);
            this.heatTimer = setTimeout(() => {
                this.heat = false;
            }, 10000);
        }
    },
    methods: {
        updateTime() {
            this.time = convertToMoscowDate(new Date()).toTimeString().replace(/(\d{2}:\d{2}).*/, '$1');
            if (this.time == "00:00")
                this.setDate();
        },
        setDate() {
            let date = new Date();
            let day = date.getDate();
            let month = date.getMonth() + 1;
            let year = date.getUTCFullYear();

            if (day < 10) day = "0" + day;
            if (month < 10) month = "0" + month;
            this.date = `${day}.${month}.${year}`;
        },
        pretty(val) {
            return prettyMoney(val);
        },

    },
    mounted() {
        setInterval(this.updateTime, 1000);
        this.setDate();
    },
});

// for tets
// hud.show = true;
