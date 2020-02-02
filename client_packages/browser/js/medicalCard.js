var medicalCard = new Vue({
    el: "#medicalCard",
    data: {
        show: false,
        identifier: 228133744323,
        name: "Darian Rockfall", 
        occupation: "LSPD",
        gender: "M",
        time: "18.11.2019",
        sign: "D.Rockfall",
    },
    watch: {
        show(val) {
            if (!val) {
                this.show = false;
                mp.trigger('documents.close');
            }
        }
    },
    filters: {
        split(value) {
            console.log(value);
            value += "";
            return value.replace(/(\d)(?=(\d{4})+(\D|$))/g, '$1 ');
        }
    }
});
