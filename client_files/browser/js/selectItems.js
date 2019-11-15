var selectItems = new Vue({
    el: "#selectItems",
    data: {
        show: false,
        items: [
            {
                img: 10,
                name: "Серьги",
            },
            {
                img: 11,
                name: "Часы",
            },
            {
                img: 21,
                name: "Дробаш",
                amount: 123,
            },
        ],
        focus: 3,
        tempFocus: -1,
        select: 0,

        centerX: 0,
        centerY: 0,
    },
    computed: {
        cItems() {
            return [{}, ...this.items];
        }
    },
    methods: {
        mousemove(e) {
            let vectX = e.pageX - this.centerX;
            let vectY = e.pageY - this.centerY;

            let delta = 0;
            if (vectY < 0 && vectX < 0) delta = 180;
            else if (vectY > 0 && vectX < 0) delta = 180;
            else if (vectY < 0 && vectX > 0) delta = 360;
            else if (vectY > 0 && vectX > 0) delta = 360;

            let angle = Math.atan(vectY / vectX) * 180 / Math.PI + delta - 70;
            let id = parseInt(angle/36);
            this.select = (id == 10) ? 0 : id;

        }
    },
    watch: {
        focus(val) {
            this.tempFocus = val;
        },
        show(val) {
            this.select = -1;
            this.tempFocus = this.focus;
        },
        select(val) {
            this.tempFocus = val;
        }
    },
    mounted() {
        var self = this;
        this.centerX = window.innerWidth  / 2;
        this.centerY = window.innerHeight  / 2;

        window.addEventListener('keydown', function(e) {
            if (e.keyCode != 81 || this.show) return;

            self.show = true;

            window.addEventListener('mousemove', self.mousemove);
        });

        window.addEventListener('keyup', function(e) {
            if (e.keyCode != 81) return;
            // TODO: Обработка выбора self.select id ячейки (жёлтой)
            console.log(self.select);
            window.removeEventListener('mousemove', self.mousemove);

            self.show = false;
        });
    }
});

//for tests

//selectItems.show = true;
