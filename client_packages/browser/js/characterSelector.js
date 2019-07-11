var characterSelector = new Vue({
    el: "#characterSelector",
    methods: {
        left() {
            mp.trigger("characterChoose.left");
        },
        enter() {
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
