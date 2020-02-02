var watermark = new Vue({
    el: "#watermark",
    data: {
        id: "",
    },
    computed: {
        isShow() {
            return hud.build && this.id.length;
        },
    },
});
