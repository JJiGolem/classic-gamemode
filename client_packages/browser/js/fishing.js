let cursor = document.getElementById('fishing-cursor');
let interval;

var fishing = new Vue({
    el: '#fishing',
    data: {
        show: false,
        position: 0,
        zone: 10,
        speed: 10,
        isStarted: false,
        isFetch: false,
        direction: 'right',
        weight: 0
    },
    watch: {
        position: function (newPosition, oldPosition) {
            if (oldPosition === 96) {
              this.direction = 'left';
            }

            if (oldPosition === 1) {
              this.direction = 'right';
            }
        },
    },
    methods: {
        moveCursor() {
            if (this.direction === 'right') {
                this.position++;
            }

            if (this.direction === 'left') {
                this.position--;
            }
        },
        startFishing() {
            this.isStarted = true;
            mp.trigger('fishing.game.start');
        },
        fishFetch(speed, zone, weight) {
            this.isFetch = true;
            this.speed = speed;
            this.zone = zone;
            this.weight = weight;
            interval = setInterval(this.moveCursor, this.speed);
        },
        stopFishing() {
            clearInterval(interval);
            this.isStarted = false;
            this.isFetch = false;
            this.position = 0;
            this.direction = 'right';

            let result;

        },
        endFishing() {
            mp.trigger('fishing.end');
        }
    },
    mounted() {
    }
});