var characterSelector = new Vue({
    el: "#characterSelector",
    methods: {
        left() {
            mp.trigger("characterChoose.left");
        },
        enter() {
            if (loader.show) return;
            loader.show = true;
            mp.trigger("characterChoose.enter");
        },
        right() {
            mp.trigger("characterChoose.right");
        }
    },
    computed: {
        show() {
            return characterInfo.show && characterInfo.characters.length;
        }
    }
});
