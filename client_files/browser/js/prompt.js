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
            "vehicle_autopilot": {
                text: "Нажите <span>W</span> или уберите точку на карте для того, чтобы деактивировать автопилот"
            },
            "faction_items_holder": {
                text: "Нажмите <span>I</span> для того, чтобы взаимодействовать с содержимым шкафа организации"
            },
            "house_items_holder": {
                text: "Нажмите <span>I</span> для того, чтобы взаимодействовать с содержимым шкафа дома"
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
            "biz_info_ask": {
                text: "Нажмите <span>B</span> для просмотра информации о бизнесе"
            },
            "farm_tax": {
                text: "Налог. баланс фермы пополнен на сутки. Не забудьте дополнить, иначе ферма будет продана в штат."
            },
            "farm_job": {
                text: "Собирайте урожай на поле в фермерский пикап"
            },
            "farm_farmer": {
                text: "Загрузите фермерский пикап на созрелом поле. Сдайте урожай на склад фермы и получите премию."
            },
            "farm_tractor": {
                text: "Загрузите фермерский трактор зерном на складе. Посейте поле и получите премию."
            },
            "farm_pilot": {
                text: "Загрузите самолет удобрением на складе. Орошите поля и получите премию."
            },
            "carrier_job": {
                text: "Загрузите товар в грузовик и доставьте на ферму или бизнес. Следите за ценами, чтобы заработать больше."
            },
            "army_capture_attack_win": {
                text: "Ваша команда победила в захвате",
            },
            "army_capture_attack_lose": {
                text: "Ваша команда проиграла в захвате",
            },
            "army_capture_defender_win": {
                text: "Ваша команда победила в обороне",
            },
            "army_capture_defender_lose": {
                text: "Ваша команда проиграла в обороне",
            },
            "capture_attack_win": {
                text: "Влияние вашей группировки увеличилось",
            },
            "capture_attack_lose": {
                text: "Вашей группировке не удалось увеличить влияние",
            },
            "capture_defender_win": {
                text: "Ваша группировка отстояла свою территорию",
            },
            "capture_defender_lose": {
                text: "Влияние вашей группировки уменьшилось",
            },
            "bizWar_attack_win": {
                text: "Влияние вашей мафии увеличилось, новый бизнес под крышей",
            },
            "bizWar_attack_lose": {
                text: "Вашей мафии не удалось увеличить влияние",
            },
            "bizWar_defender_win": {
                text: "Ваша мафия отстояла свой бизнес",
            },
            "bizWar_defender_lose": {
                text: "Влияние вашей мафии уменьшилось, потеряна крыша над бизнесом",
            },
            "fishing": {
                text: "Нажмите <span>ЛКМ</span>, чтобы начать рыбачить",
            },
            "bin": {
                text: "Нажмите <span>E</span>, чтобы покопаться в мусорке",
            },
            "woodman_take_ax": {
                text: "Достаньте топор, чтобы вырубить дерево",
            },
            "woodman_start_ax": {
                text: "Нажмите <span>ЛКМ</span>, чтобы начать рубить дерево",
            },
            "woodman_log_take_ax": {
                text: "Достаньте топор, чтобы разрубить бревно",
            },
            "woodman_log_start_ax": {
                text: "Нажмите <span>ЛКМ</span>, чтобы начать рубить бревно",
            },
            "mason_take_pick": {
                text: "Достаньте кирку, чтобы добыть камень",
            },
            "mason_start_pick": {
                text: "Нажмите <span>ЛКМ</span>, чтобы начать добывать камень",
            },
            "animations_stop": {
                text: "Нажмите <span>SPACE</span>, чтобы остановить анимацию",
            },
            "clubs_buy": {
                text: "Нажмите <span>E</span>, чтобы просмотреть ассортимент",
            },
            "winter_job": {
                text: "Очищайте дорогу от снега",
            },
            "craft_exit": {
                text: "Нажмите <span>Esc</span> для того, чтобы выйти",
            },
            "bugTracker_exit": {
                text: "Нажмите <span>Esc</span> для того, чтобы выйти",
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
