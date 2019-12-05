var hud = new Vue({
    el: "#hud",
    data: {
        players: 0,
        maxPlayers: 1500,
        build: 0,
        branch: "",
        wanted: 0,
        cash: 100000,
        bank: 100000,
        time: convertToMoscowDate(new Date()).toTimeString().replace(/(\d{2}:\d{2}).*/, '$1'),
        region: "Палето-Бэй",
        street: "Санни Стрит",
        temperature: 17,
        city: "San Andreas",
        weather: "clear-day",
        mute: false, // Блокировка голосового чата
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
        arrestTime: 0, // секунды
        arrestTimeMax: 0,
        arrestTimer: null,
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
        localPos: {
            x: 0,
            y: 0,
        },
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
            return 100 - this.arrestTime / this.arrestTimeMax * 100;
        },
        arrestDescription() {
            var str = (this.arrestTime > 60)? `${parseInt(this.arrestTime / 60)} мин.` : `${this.arrestTime} сек`;
            return `До освобождения ${str}`;
        },
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
        },
        arrestTimeMax(val) {
            this.arrestTime = val;
            clearInterval(this.arrestTimer);
            this.arrestTimer = setInterval(() => {
                this.arrestTime--;
                if (this.arrestTime <= 0) {
                    clearInterval(this.arrestTimer);
                }
            }, 1000);
        },
    },
    methods: {
        updateTime() {
            this.time = convertToMoscowDate(new Date()).toTimeString().replace(/(\d{2}:\d{2}).*/, '$1');
            if (this.time == "00:00")
                this.setDate();
        },
        setDate() {
            let date = convertToMoscowDate(new Date());
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
        isKeyShow(name) {
            if (name == 'Планшет') return playerMenu.factionId && playerMenu.factionId < 8;
            return true;
        },
    },
    mounted() {
        setInterval(this.updateTime, 1000);
        this.setDate();
    },
});

// for tets
// hud.show = true;
