var prompt = new Vue({
    el: "#prompt",
    data: {
        showTime: 10000,
        showTimer: null,
        prompts: {
            "select_menu": {
                text: "Используйте <span>&uarr;</span> <span>&darr;</span> <span>&crarr;</span> для выбора пункта в меню.",
                showTime: 60000
            },
            "vehicle_engine": {
                text: "Нажмите <span>2</span> для того, чтобы завести двигатель автомобиля"
            },
            "vehicle_open_boot": {
                text: "Нажмите <span>E</span> для того, чтобы открыть багажник"
            },
            "vehicle_open_hood": {
                text: "Нажмите <span>E</span> для того, чтобы открыть капот"
            },
            "vehicle_close_boot": {
                text: "Нажмите <span>E</span> для того, чтобы закрыть багажник"
            },
            "vehicle_close_hood": {
                text: "Нажмите <span>E</span> для того, чтобы закрыть капот"
            },
            "vehicle_items_boot": {
                text: "Нажмите <span>I</span> для того, чтобы взаимодействовать с содержимым багажника"
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
            "documents_close": {
                text: "Нажмите <span>Esc</span> для того, чтобы закрыть документ"
            },
            "fuelstation_control": {
                text: "Чтобы заправить транспортное средство, вы должны находиться за рулем"
            },
            "take_ammobox": {
                text: "Нажмите <span>E</span> для того, чтобы взять ящик с боеприпасами",
            },
            "take_medicinesbox": {
                text: "Нажмите <span>E</span> для того, чтобы взять ящик с медикаментами",
            },
            "put_ammobox": {
                text: "Нажмите <span>E</span> для того, чтобы положить ящик с боеприпасами",
            },
            "put_medicinesbox": {
                text: "Нажмите <span>E</span> для того, чтобы положить ящик с медикаментами",
            },
            "garage_control": {
                text: "Нажмите <span>E</span> для того, чтобы выехать из гаража"
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

            var self = this;
            clearTimeout(this.showTimer);
            this.showTimer = setTimeout(function() {
                self.hide();
            }, self.showTime);
        },
        show(text) {
            this.text = text;
            hud.showOnline = false;

            var self = this;
            clearTimeout(this.showTimer);
            this.showTimer = setTimeout(function() {
                self.hide();
            }, self.showTime);
        },
        hide() {
            this.text = null;
            hud.showOnline = true;
        }
    },
});
