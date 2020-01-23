

    var dataForLock = {
        0: { class: "green", d: "M15.0833 7.5H13.8333V5.83332C13.8333 2.6168 11.2166 0 8 0C4.78344 0 2.16668 2.6168 2.16668 5.83332V6.25C2.16668 6.48031 2.35305 6.66668 2.58336 6.66668H4.25C4.48031 6.66668 4.66668 6.48031 4.66668 6.25V5.83332C4.66668 3.99535 6.16203 2.5 8 2.5C9.83797 2.5 11.3333 3.99535 11.3333 5.83332V7.5H0.91668C0.686367 7.5 0.5 7.68637 0.5 7.91668V18.3334C0.5 19.2525 1.24746 20 2.16668 20H13.8334C14.7525 20 15.5 19.2525 15.5 18.3333V7.91668C15.5 7.68637 15.3136 7.5 15.0833 7.5ZM9.24758 16.204C9.26059 16.3216 9.22277 16.4396 9.14383 16.5279C9.06488 16.6162 8.95176 16.6667 8.83336 16.6667H7.16668C7.04828 16.6667 6.93516 16.6162 6.85621 16.5279C6.77727 16.4396 6.73941 16.3216 6.75246 16.204L7.01531 13.8404C6.58848 13.5299 6.33336 13.0387 6.33336 12.5C6.33336 11.5808 7.08082 10.8333 8.00004 10.8333C8.91926 10.8333 9.66672 11.5808 9.66672 12.5C9.66672 13.0387 9.4116 13.5299 8.98477 13.8404L9.24758 16.204Z" },
        1: { class: "red",   d: "M15.0833 7.5H13.8333V5.83332C13.8333 2.6168 11.2166 0 8 0C4.78344 0 2.16668 2.6168 2.16668 5.83332V7.5H0.91668C0.686367 7.5 0.5 7.68637 0.5 7.91668V18.3334C0.5 19.2525 1.24746 20 2.16668 20H13.8334C14.7525 20 15.5 19.2525 15.5 18.3333V7.91668C15.5 7.68637 15.3136 7.5 15.0833 7.5ZM9.24758 16.204C9.26059 16.3216 9.22277 16.4396 9.14383 16.5279C9.06488 16.6162 8.95176 16.6667 8.83336 16.6667H7.16668C7.04828 16.6667 6.93516 16.6162 6.85621 16.5279C6.77727 16.4396 6.73941 16.3216 6.75246 16.204L7.01531 13.8404C6.58848 13.5299 6.33336 13.0387 6.33336 12.5C6.33336 11.5808 7.08082 10.8333 8.00004 10.8333C8.91926 10.8333 9.66672 11.5808 9.66672 12.5C9.66672 13.0387 9.4116 13.5299 8.98477 13.8404L9.24758 16.204ZM11.3333 7.5H4.66668V5.83332C4.66668 3.99535 6.16203 2.5 8 2.5C9.83797 2.5 11.3333 3.99535 11.3333 5.83332V7.5Z" },
    }

    var speedometer = new Vue({
        el: "#speedometer",
        data: {
            show: false,
            isActive: true, //подсветка
            headlights: 0, //0-выкл,1-габариты,2-ближний,3-дальний (фары)
            lock: 1, //0-открыт,1-закрыт (двери)
            speed: 0,
            fuel: 0,
            maxFuel: 70,
            mileage: 0,
            danger: 0, //0-выкл,1-вкл (движок)
            maxSpeed: 480,
            arrow: 0, //0-выкл,1-левый,2-правый (поворотики)
            emergency: 0,
            isElectricCar: false, // Установить true для электрокаров.

            leftArrow: false,
            rightArrow: false,

            svgLockPaths: dataForLock,

            arrowInterval: null,
        },
        methods: {
            flickerLight: function () { // 0, 1, 2, 3
                if (this.arrowInterval)
                    clearInterval(this.arrowInterval);

                if (!(this.arrow + this.emergency)) {
                    this.leftArrow = false;
                    this.rightArrow = false;
                    return;
                }
                this.leftArrow = (this.emergency == 1 || this.arrow == 1) ? !this.leftArrow : false;
                this.rightArrow = (this.emergency == 1 || this.arrow == 2) ? !this.rightArrow : false;

                this.arrowInterval = setInterval(() => {
                    this.leftArrow = (this.emergency == 1 || this.arrow == 1) ? !this.leftArrow : false;
                    this.rightArrow = (this.emergency == 1 || this.arrow == 2) ? !this.rightArrow : false;
                }, 500);
            },
        },
        computed: {
            perFuel: function () {
                let fuel = this.fuel;

                return 100 - (fuel * 100 / this.maxFuel);
            },
            isShow() {
                return this.show && hud.show;
            },
        },
        watch: {
            arrow: function () {
                this.flickerLight();
            },
            emergency: function () {
                this.flickerLight();
            }
        },
        filters: {
          split: function (value) {
              value = value + '';
              return value.replace(/(\d)(?=(\d{3})+(\D|$))/g, '$1 ');
          }
        }


    });

    // for tests
    // speedometer.show = true;
