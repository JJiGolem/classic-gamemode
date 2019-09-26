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

// for tests
// watermark.id = "98715";
