
var governmentBadge = new Vue({
    el: "#governmentBadge",
    data: {
        show: false,
        type: "lspd",
        identifier: 50234,
        name: "Darian Rockfall",
        rank: "unnamed",
        gender: "Mужской",
        sign: "D.Rockfall",
        directorSign: "E.Wilkinson",
    },
    methods: {
        close() {
            this.show = false;
            mp.trigger('documents.close');
        }
    },
});
