var driverLicense = new Vue({
    el: "#driverLicense",
    data: {
        show: false,
        header: "Водительское удостоверение",
        number: 332143023,
        name: "Alexander Woodman",
        sex: 1,
        catNames: ["b", "p", "m", "a", "air", "boat"],
        categories: [0, 1, 0, 1, 0, 1],
    },
    computed: {
        fullname() {
            return this.fName + " " + this.sName;
        },
        prettySex() {
            return (this.sex) ? "Ж" : "М";
        },
        prettyNumber() {
            return getPaddingNumber(this.number, 10);
        },
    },
    methods: {
        imgSrc(catIndex) {
            var cat = this.categories[catIndex];
            var name = this.catNames[catIndex];
            var src = `img/driverLicense/${name}`;
            if (cat) src += "-on";
            src += ".svg";
            return src;
        },
        close() {
            this.show = false;
            mp.trigger('documents.close');
        }
    }
});

// for tests
// driverLicense.show = true;
