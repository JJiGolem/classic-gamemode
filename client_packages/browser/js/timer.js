var timer = new Vue({
    el: "#timer",
    data: {
        timer: null,
        timers: {
            "death": {
                icon: "death.svg",
                text: "До смерти осталось"
            }
        },
        allTime: 0,
        time: 0,
        updateTimer: null,
    },
    computed: {
        width() {
            return this.time / this.allTime * 100;
        },
    },
    watch: {
        timer(val) {
            if (val) {
                busy.add("timer", false, true);
            } else {
                busy.remove("timer", true);
            }
        },
    },
    methods: {
        start(name, time) {
            if (!this.timers[name]) return;

            this.time = time;
            this.allTime = time;
            this.timer = this.timers[name];
            clearInterval(this.updateTimer);
            this.updateTimer = setInterval(() => {
                this.time -= 1000;
                if (this.time < 0) {
                    this.stop();
                }
            }, 1000);
        },
        stop() {
            clearInterval(this.updateTimer);
            this.timer = null;
        },
    }
});
