var offerDialog = new Vue({
    el: "#offerDialog",
    data: {
        showTime: 10000,
        dialogs: {
            "accept_sell_biz": {
                text: "Carter Slade предлагает Вам купить бизнес 'Закусочная'",
                price: 10000,
                on(values) {
                    this.text = `${values.owner} предлагает Вам купить бизнес '${values.type}'`;
                },
                yes() {
                    mp.trigger("events.callRemote", "biz.sell.accept");
                },
                no() {
                    mp.trigger("events.callRemote", "biz.sell.cancel");
                },
            },
            "accept_trade": {
                text: "Carter Slade хочет с Вами торговаться.",
                on(values) {
                    this.text = `${values.name} хочет с Вами торговаться.`;
                },
                yes() {
                    mp.trigger("events.callRemote", "trade.offer.agree");
                },
                no() {
                    mp.trigger("events.callRemote", "trade.offer.cancel");
                },
            },
            "accept_invite": {
                text: "Carter Slade предлагает Вам вступить в Правительство.",
                on(values) {
                    this.text = `${values.name} предлагает Вам вступить в ${values.faction}.`;
                },
                yes() {
                    mp.trigger("events.callRemote", "factions.offer.agree");
                },
                no() {
                    mp.trigger("events.callRemote", "factions.offer.cancel");
                },
            },
            "accept_health": {
                text: "Carter Slade предлагает Вам лечение за 9999$.",
                on(values) {
                    this.text = `${values.name} предлагает Вам лечение за ${values.price}$.`;
                },
                yes() {
                    mp.trigger("events.callRemote", "hospital.health.agree");
                },
                no() {
                    mp.trigger("events.callRemote", "hospital.health.cancel");
                },
            },
            "acccept_trash_team": {
                text: "Tomat Petruchkin предлагает Вам вступить в Бригаду.",
                on(values) {
                    this.text = `${values.name} предлагает Вам вступить в Бригаду.`;
                },
                yes() {
                    mp.trigger("events.callRemote", "trash.team.agree");
                },
                no() {
                    mp.trigger("events.callRemote", "trash.team.cancel");
                },
            },
            "acccept_gopostal_team": {
                text: "Tomat Petruchkin предлагает Вам вступить в Группу.",
                on(values) {
                    this.text = `${values.name} предлагает Вам вступить в Группу.`;
                },
                yes() {
                    mp.trigger("events.callRemote", "gopostal.team.agree");
                },
                no() {
                    mp.trigger("events.callRemote", "gopostal.team.cancel");
                },
            },
            "accept_job_builder": {
                text: "Вы хотите начать работу <Работа>?",
                on(values) {
                    this.text = `Вы хотите ${values.name}`;
                },
                yes() {
                    mp.trigger("events.callRemote", "job.builder.agree");
                },
                no() {
                    mp.trigger("client.job.cursor.cancel");
                },
            },
            "accept_job_taxi": {
                text: "Вы хотите начать работу <Работа>?",
                on(values) {
                    this.text = `Вы хотите ${values.name}`;
                },
                yes() {
                    mp.trigger("events.callRemote", "job.taxi.agree");
                },
                no() {
                    mp.trigger("client.job.cursor.cancel");
                },
            },
            "accept_job_waterfront": {
                text: "Вы хотите начать работу <Работа>?",
                on(values) {
                    this.text = `Вы хотите ${values.name}`;
                },
                yes() {
                    mp.trigger("events.callRemote", "job.waterfront.agree");
                },
                no() {
                    mp.trigger("client.job.cursor.cancel");
                },
            },
            "accept_job_trucker": {
                text: "Вы хотите начать работу <Работа>?",
                on(values) {
                    this.text = `Вы хотите ${values.name}`;
                },
                yes() {
                    mp.trigger("events.callRemote", "job.trucker.agree");
                },
                no() {
                    mp.trigger("client.job.cursor.cancel");
                },
            },
            "accept_job_pizza": {
                text: "Вы хотите начать работу <Работа>?",
                on(values) {
                    this.text = `Вы хотите ${values.name}`;
                },
                yes() {
                    mp.trigger("events.callRemote", "job.pizza.agree");
                },
                no() {
                    mp.trigger("client.job.cursor.cancel");
                },
            },
            "accept_job_postal": {
                text: "Вы хотите начать работу <Работа>?",
                on(values) {
                    this.text = `Вы хотите ${values.name}`;
                },
                yes() {
                    mp.trigger("events.callRemote", "job.gopostal.agree");
                },
                no() {
                    mp.trigger("client.job.cursor.cancel");
                },
            },
            "accept_job_trash": {
                text: "Вы хотите начать работу <Работа>?",
                on(values) {
                    this.text = `Вы хотите ${values.name}`;
                },
                yes() {
                    mp.trigger("events.callRemote", "job.trash.agree");
                },
                no() {
                    mp.trigger("client.job.cursor.cancel");
                },
            },
            "invite_inhouse_confirm": {
                text: "Carter Slade приглашает Вас в свой дом.",
                on(values) {
                    houseMenu.__vue__.exitMenu();
                    this.text = `${values.name} приглашает Вас в свой дом.`;
                },
                yes() {
                    houseMenu.__vue__.exitMenu();
                    mp.trigger("events.callRemote", "house.invite.agree");
                },
                no() {
                    mp.trigger("events.callRemote", "house.invite.cancel");
                }
            },
            "sellhousegov_confirm": {
                text: "Вы действительно хотите продать свой дом государству за $100.",
                on(values) {
                    houseMenu.__vue__.exitMenu();
                    this.text = `Вы действительно хотите продать свой дом государству за $${values.price}.`;
                },
                yes() {
                    houseMenu.__vue__.exitMenu();
                    mp.trigger("events.callRemote", "house.sellgov.agree");
                },
                no() {

                }
            },
            "sellhouseplayer_confirm": {
                text: "Вы действительно хотите продать свой дом Carter за $100?",
                on(values) {
                    houseMenu.__vue__.exitMenu();
                    this.text = `Вы действительно хотите продать свой дом ${values.name} за $${values.price}?`;
                },
                yes() {
                    houseMenu.__vue__.exitMenu();
                    mp.trigger("events.callRemote", "house.sellplayer.agree");
                },
                no() {
                    mp.trigger("events.callRemote", "house.sellplayer.cancel");
                }
            },
            "buyhouseplayer_confirm": {
                text: "Carter предлагает Вам купить его Дом 1 за $1000.",
                on(values) {
                    houseMenu.__vue__.exitMenu();
                    this.text = `${values.name} предлагает Вам купить его Дом ${values.houseid} за $${values.price}.`;
                },
                yes() {
                    houseMenu.__vue__.exitMenu();
                    mp.trigger("events.callRemote", "house.buyhouseplayer.agree");
                },
                no() {
                    mp.trigger("events.callRemote", "house.buyhouseplayer.cancel");
                }
            },
            "accept_familiar": {
                text: "Гражданин хочет с Вами познакомиться.",
                yes() {
                    mp.trigger("events.callRemote", "familiar.offer.agree");
                },
                no() {
                    mp.trigger("events.callRemote", "familiar.offer.cancel");
                },
            },
            "accept_delete_character": {
                text: "Удалить персонажа Alex Cortez?",
                on(values) {
                    this.text = `Удалить персонажа ${values.name}?`;
                    this.name = values.name;
                },
                yes() {
                    var name = this.name;
                    mp.trigger("events.callRemote", "deleteCharacter", name);
                },
                no() {},
            },
            "accept_respawn": {
                text: "Желаете возродиться?",
                on(values) {

                },
                yes() {
                    mp.trigger("events.callRemote", "hospital.respawn");
                },
                no() {}
            },
            "sellcar_confirm": {
                text: "Вы действительно хотите продать Infernus Carter Slade за $100?",
                on(values) {
                    this.text = `Вы действительно хотите продать ${values.model} за ${values.price * 0.30}$-${values.price * 0.40}$?`;
                },
                yes() {
                    mp.trigger("events.callRemote", "car.sell.agree");
                },
                no() {
                    mp.trigger("events.callRemote", "car.sell.cancel");
                }
            },
            "sellcarplayer_confirm": {
                text: "Вы действительно хотите продать Infernus Carter Slade за $100?",
                on(values) {
                    this.text = `Вы действительно хотите продать ${values.model} ${values.name} за $${values.price}?`;
                },
                yes() {
                    mp.trigger("events.callRemote", "car.sellplayer.agree");
                },
                no() {
                    mp.trigger("events.callRemote", "car.sellplayer.cancel");
                }
            },
            "buycarplayer_confirm": {
                text: "Carter предлагает Вам купить Infernus за $1000.",
                on(values) {
                    this.text = `${values.name} предлагает Вам купить ${values.model} за $${values.price}.`;
                },
                yes() {
                    mp.trigger("events.callRemote", "car.buycarplayer.agree");
                },
                no() {
                    mp.trigger("events.callRemote", "car.buycarplayer.cancel");
                }
            },
            "accept_fix_car": {
                text: "Вы уверены, что хотите доставить транспорт за 50$?",
                on(values) {
                    this.text = `Вы уверены, что хотите доставить транспорт за 50$?`;
                    this.sqlId = values.sqlId;
                },
                yes() {
                    mp.trigger("events.callRemote", "car.fix.accept", sqlId);
                },
                no() {

                },
            }
        },
        dialog: null,
        timeout: null,
    },
    methods: {
        show(name, values) {
            if (typeof values == 'string') values = JSON.parse(values);
            this.dialogs[name].on(values);
            this.dialog = this.dialogs[name];
            var self = this;
            clearTimeout(self.timeout);
            self.timeout = setTimeout(() => {
                self.hide();
            }, self.showTime);
        },
        hide() {
            clearTimeout(this.timeout);
            this.dialog = null;
        },
        pretty(val) {
            val += '';
            return val.replace(/(\d)(?=(\d{3})+(\D|$))/g, '$1 ');
        }
    },
    mounted() {
        let self = this;
        window.addEventListener('keyup', function(e) {
            if (!self.dialog) return;
            if (e.code == "KeyY") {
                self.dialog.yes();
                self.hide();
            }
            else if (e.code == "KeyN") {
                self.dialog.no();
                self.hide();
            }
        });
    }
});

// for tests
// offerDialog.show("accept_sell_biz", {owner: "Carter Slade", type: "Закусочная"});
