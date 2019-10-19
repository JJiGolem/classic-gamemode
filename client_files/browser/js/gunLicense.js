var gunLicense = new Vue({
    el: "#gunLicense",
    data: {
        show: false,
        header: "State of San Andreas License To Carry Handgun",
        name: "Carter Slade",
        number: 1121,
        sex: 1,
        date: "18.08.2020",
    },
    computed: {
        prettySex() {
            return (this.sex) ? "Ж" : "М";
        },
    },
    methods: {
        close() {
            this.show = false;
            mp.trigger('documents.close');
        },
    },
});

// for tests
// gunLicense.show = true;
