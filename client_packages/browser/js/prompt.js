var prompt = new Vue({
    el: "#prompt",
    data: {
        showTime: 10000,
        prompts: {
            "select_menu": {
                text: "Используйте <span>&uarr;</span> <span>&darr;</span> <span>&crarr;</span> для выбора пункта в меню.",
                showTime: 60000
            },
            "vehicle_engine": {
                text: "Нажмите <span>2</span>, чтобы завести двигатель автомобиля."
            },
            "vehicle_repair": {
                text: "Автомобиль поломался. Необходимо вызвать механика."
            },
            "offerDialog_help": {
                text: "Используйте клавиши <span>y</span> и <span>n</span>",
            },
            "documents_help": {
                text: "Нажмите <span>e</span> для закрытия",
            },
            "health_help": {
                text: "Приобрести медикаменты можно в больнице.",
            },
            "police_service_recovery_carkeys": {
                text: "Вызовите службу, чтобы пригнать авто к участку.",
            },
            "band_zones_attack_win": {
                text: "Влияние Вашей группировки увеличилось!",
            },
            "band_zones_attack_lose": {
                text: "Вашей группировке не удалось увеличить влияние!",
            },
            "band_zones_defender_win": {
                text: "Ваша группировка отстояла территорию!",
            },
            "band_zones_defender_lose": {
                text: "Влияние Вашей группировки уменьшилось!",
            },
        },
        text: null
    },
    methods: {
        showByName(name) {
            var prompt = this.prompts[name];
            if (!prompt) return;

            this.text = prompt.text;
        },
        show(text) {
            this.text = text;
        },
        hide() {
            this.text = null;
        }
    },
    watch: {
        text(val, oldVal) {
            if (oldVal || !val) return;

            var self = this;
            setTimeout(function() {
                self.hide();
            }, self.showTime);
        },
    }
});
