var characterPass = new Vue({
    el: "#characterPass",
    data: {
        show: false,
        header: "Паспорт гражданина",
        fName: "Alexander",
        sName: "Woodman",
        regDate: "06 Апр 2012",
        sex: 1,
        number: 3940123342,
    },
    computed: {
        fullname() {
            return this.fName + " " + this.sName;
        },
        prettySex() {
            return (this.sex)? "М" : "Ж";
        },
        prettyNumber() {
            return getPaddingNumber(this.number, 10);
        },
    }
});
