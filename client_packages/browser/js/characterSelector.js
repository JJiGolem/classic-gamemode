var characterSelector = new Vue({
    el: "#characterSelector",
    methods: {
        left() {
            mp.trigger("choiceCharacter.left");
        },
        enter() {
            mp.trigger("choiceCharacter.enter");
        },
        right() {
            mp.trigger("choiceCharacter.right");
        }
    },
    computed: {
        show() {
            return characterInfo.show && characterInfo.characters.length;
        }
    }
});
