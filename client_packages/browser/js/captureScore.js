var captureScore = new Vue({
    el: "#captureScore",
    data: {
        show: false,
        colors: {
            8: "#00b500",
            9: "#8c30ff",
            10: "#fff629",
            11: "#4a97d1",
        },
        names: {
            8: "The Families",
            9: "The Ballas",
            10: "Los Santos Vagos",
            11: "Marabunta Grande",
        },
        leftBandId: 8,
        rightBandId: 9,
        leftScore: 94,
        rightScore: 42,
        time: 90,
        timer: null,
    },
    computed: {
        leftImgSrc() {
            return `img/captureScore/${this.leftBandId}.svg`;
        },
        rightImgSrc() {
            return `img/captureScore/${this.rightBandId}.svg`;
        },
        progressWidth() {
            var max = this.leftScore + this.rightScore;
            if (max == 0) return 50;
            return this.leftScore / max * 100;
        },
        prettyTime() {
            var minutes = parseInt(this.time / 60);
            var seconds = parseInt(this.time % 60);
            if (minutes < 10) minutes = "0" + minutes;
            if (seconds < 10) seconds = "0" + seconds;
            return `${minutes}:${seconds}`;
        }
    },
    watch: {
        show(val) {
            if (!val) clearInterval(this.timer);
        }
    },
    methods: {
        start(bandA, bandB, time) {
            this.leftBandId = bandA;
            this.rightBandId = bandB;
            this.leftScore = 0;
            this.rightScore = 0;
            this.time = time;
            this.show = true;
            this.startTimer();
        },
        startTimer() {
            clearInterval(this.timer);
            this.timer = setInterval(() => {
                this.time--;
                if (this.time < 0) this.show = false;
            }, 1000);
        },
        setScore(bandId, score) {
            if (this.leftBandId == bandId) this.leftScore = score;
            else if (this.rightBandId == bandId) this.rightScore = score;
        }
    }
});

// for tests
// captureScore.show = true;
