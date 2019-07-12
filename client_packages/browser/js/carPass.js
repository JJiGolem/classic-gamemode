var carPass = new Vue({
    el: "#carPass",
    data: {
        show: false,
        header: "Паспорт Т/С",
        id: 3940123342,
        mark: "Lampadati",
        name: "Felon GT",
        regDate: "06 Дек 2012",
        price: 60000,
        owners: 1,
        number: "GRYZ12"
    },
    computed: {
        fullname() {
            return this.fName + " " + this.sName;
        },
        prettySex() {
            return (this.sex) ? "М" : "Ж";
        },
        prettyId() {
            return getPaddingNumber(this.id, 10);
        },
        prettyPrice() {
            return prettyMoney(this.price);
        },
    }
});

// for tests
// carPass.show = true;
