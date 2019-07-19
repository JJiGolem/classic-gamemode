var characterSelector = new Vue({
    el: "#characterSelector",
    methods: {
        left() {
            if (loader.show) return;
            mp.trigger("characterInit.chooseLeft");
        },
        enter() {
            if (loader.show) return;
            loader.show = true;
            mp.trigger("characterInit.choose");
        },
        right() {
            if (loader.show) return;
            mp.trigger("characterInit.chooseRight");
        }
    },
    computed: {
        show() {
            return characterInfo.show && characterInfo.characters.length;
        }
    }
});
