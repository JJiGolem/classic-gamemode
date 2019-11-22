let intervalFishingB;

var fishing = new Vue({
    el: '#fishing',
    data: {
        show: false,
        position: 0,
        zone: null,
        isStarted: false,
        isFetch: false,
        direction: 'right',
        weight: null,
        isEnd: false
    },
    watch: {
        position: function (newPosition, oldPosition) {
            if (oldPosition === 93) {
              this.direction = 'left';
            }

            if (oldPosition === 1) {
                if (this.direction === 'left') {
                    return this.isEnd = true;
                }

              this.direction = 'right';
            }
        },
        isEnd: function(newState, oldState) {
            if (newState) {
                clearInterval(intervalFishingB);
                mp.trigger('fishing.game.end', false);
            }
        }
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
        fishFetch(speed, zone, weight) {
            this.isFetch = true;
            this.zone = zone;
            this.weight = weight;
            intervalFishingB = setInterval(this.moveCursor, speed);
        },
        endFishing() {
            clearInterval(intervalFishingB);

            let result = (Math.abs((this.position + 3) - 50) < parseInt(this.zone / 2))

            mp.trigger('fishing.game.end', result);
        },
        clearData() {
            this.position = 0;
            this.weight = null;
            this.zone = null;
            this.direction = 'right',
            this.isStarted = false;
            this.isFetch = false;
            this.isEnd = false;
        }
    },
});