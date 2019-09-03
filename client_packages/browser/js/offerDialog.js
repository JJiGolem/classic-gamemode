var offerDialog = new Vue({
    el: "#offerDialog",
    data: {
        showTime: 10000,
        dialogs: {
            "documents": {
                text: "Carter Slade хочет показать вам паспорт",
                on(values) {
                    this.text = `${values.name} хочет показать Вам ${values.doc}`;
                },
                yes() {
                    mp.trigger("callRemote", "documents.offer.accept", 1);
                },
                no() {
                    mp.trigger("callRemote", "documents.offer.accept", 0);
                    mp.trigger("offerDialog.close");
                },
                ignore() {
                    mp.trigger("callRemote", "documents.offer.accept", 0);
                    mp.trigger("offerDialog.close");
                },
            },
            "carservice_diagnostics": {
                text: "Dun Hill предлагает диагностику вашего транспорта",
                price: 100,
                on(values) {
                    this.text = `${values.name} предлагает вам диагностику транспорта`;
                },
                yes() {
                    mp.trigger("callRemote", "carservice.diagnostics.accept", 1);
                    mp.trigger("offerDialog.close");
                },
                no() {
                    mp.trigger("callRemote", "carservice.diagnostics.accept", 0);
                    mp.trigger("offerDialog.close");
                },
                ignore() {
                    mp.trigger("callRemote", "carservice.diagnostics.accept", 0);
                    mp.trigger("offerDialog.close");
                },
            },
            "house_sell": {
                text: "Swifty Swift предлагает вам купить его дом",
                price: 100,
                on(values) {
                    this.price = values.price;
                    this.text = `${values.name} предлагает вам купить его дом`;
                },
                yes() {
                    mp.trigger("callRemote", "house.sell.ans", 1);
                },
                no() {
                    mp.trigger("callRemote", "house.sell.ans", 2);
                },
                ignore() {
                    mp.trigger("callRemote", "house.sell.ans", 2);
                },
            },
            "vehicles_sell": {
                text: `Carter Slade предлагает вам купить т/с "Glendale" (AYE741)`,
                price: 228,
                on(values) {
                    this.price = values.price;
                    this.text = `${values.name} предлагает вам купить т/с ${values.model} (${values.plate})`;
                },
                yes() {
                    mp.trigger("callRemote", "vehicles.sell.offer.accept", 1);
                    loader.show = true;
                    mp.trigger("offerDialog.close");
                },
                no() {
                    mp.trigger("callRemote", "vehicles.sell.offer.accept", 0);
                    mp.trigger("offerDialog.close");
                },
                ignore() {
                    mp.trigger("callRemote", "vehicles.sell.offer.accept", 0);
                    mp.trigger("offerDialog.close");
                },
            },
            "faction_invite": {
                text: `Carter Slade предлагает вам вступить в Groove Street`,
                on(values) {
                    this.text = `${values.name} предлагает вам вступить в ${values.faction}`;
                },
                yes() {
                    mp.trigger("callRemote", "factions.invite.accept");
                },
                no() {
                    mp.trigger("callRemote", "factions.invite.cancel");
                },
                ignore() {
                    mp.trigger("callRemote", "factions.invite.cancel");
                },
            },
            "hospital_healing": {
                text: `Carter Slade предлагает вам лечение`,
                price: 100,
                on(values) {
                    this.text = `${values.name} предлагает вам лечение`;
                    this.price = values.price;
                },
                yes() {
                    mp.trigger("callRemote", "hospital.healing.accept");
                },
                no() {
                    mp.trigger("callRemote", "hospital.healing.cancel");
                },
                ignore() {
                    mp.trigger("callRemote", "hospital.healing.cancel");
                },
            },
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
                self.dialog.ignore();
                self.hide();
            }, self.showTime);
        },
        hide() {
            clearTimeout(this.timeout);
            this.dialog = null;
        },
        pretty(val) {
            return prettyMoney(val);
        }
    },
    mounted() {
        let self = this;
        window.addEventListener('keyup', function (e) {
            if (!self.dialog) return;
            if (busy.includes(["chat", "terminal", "mapCase", "phone"])) return;
            if (e.keyCode == 89) { // Y
                self.dialog.yes();
                self.hide();
            }
            else if (e.keyCode == 78) { // N
                self.dialog.no();
                self.hide();
            }
        });
    },
    watch: {
        dialog(val) {
            if (val) setCursor(true);
            else setCursor(false);
        }
    },
});

// for tests
// offerDialog.show("documents", {name: "Carter Slade", doc: "Паспорт"});
