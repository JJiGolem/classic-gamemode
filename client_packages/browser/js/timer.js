var timer = new Vue({
    el: "#timer",
    data: {
        // текущий таймер
        timer: null,
        // список таймеров
        timers: {
            "death": {
                icon: "death.svg",
                text: "До смерти осталось"
            }
        },
        // общее время жизни таймера
        allTime: 0,
        // оставшееся время жизни таймера
        time: 0,
        // таймер отсчета времени
        updateTimer: null,
    },
    computed: {
        // ширина прогрессбара (от 0 до 100)
        width() {
            return this.time / this.allTime * 100;
        },
    },
    methods: {
        show(name, time) {
            if (!this.timers[name]) return;

            this.time = time;
            this.allTime = time;
            this.timer = this.timers[name];
            clearInterval(this.updateTimer);
            this.updateTimer = setInterval(() => {
                this.time -= 1000;
                if (this.time < 0) {
                    clearInterval(this.updateTimer);
                    this.timer = null;
                }
            }, 1000);
        }
    }
});

// for tests
// timer.show("death", 180000);
