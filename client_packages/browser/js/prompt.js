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
                text: "Нажмите <span>2</span> для того, чтобы завести двигатель автомобиля"
            },
            "carshow_control": {
                text: "Нажмите <span>Esc</span> для того, чтобы выйти из автосалона"
            },
            "carmarket_noveh": {
                text: "Чтобы продать транспортное средство, вы должны находиться в нем"
            },
            "carmarket_control": {
                text: "Нажмите <span>E</span> для того, чтобы продать транспортное средство"
            },
        },
        text: null
    },
    methods: {
        showByName(name) {
            var prompt = this.prompts[name];
            if (!prompt) return;
            this.text = prompt.text;
            hud.showOnline = false;
        },
        show(text) {
            this.text = text;
            hud.showOnline = false;
        },
        hide() {
            this.text = null;
            hud.showOnline = true;
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
