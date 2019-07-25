var dataForSpeedScale = [
    /*0 */    { isFill: false, d: "M116.688,681.406V677.1h62.259c1.228,0,2.223.643,2.223,1.437v1.436c0,0.794-.995,1.437-2.223,1.437H116.688Z" },
    /*1 */    { isFill: false, d: "M 120.412 630.591 l 0.561 -4.273 l 19.2 2.535 c 0.379 0.05 0.6 0.728 0.5 1.515 l -0.187 1.424 c -0.1 0.787 -0.494 1.384 -0.873 1.334 Z" },
    /*2 */    { isFill: false, d: "M129.193,581.863l1.113-4.164,38.755,10.412a1.438,1.438,0,0,1,1.013,1.76l-0.371,1.387a1.432,1.432,0,0,1-1.755,1.016Z" },
    /*3 */    { isFill: false, d: "M 145.721 533.721 l 1.645 -3.982 l 17.895 7.432 c 0.353 0.147 0.394 0.86 0.091 1.593 l -0.548 1.327 c -0.3 0.733 -0.835 1.209 -1.188 1.062 Z" },
    /*4 */    { isFill: false, d: "M 166.968 488.956 l 2.149 -3.733 l 34.747 20.114 a 1.439 1.439 0 0 1 0.524 1.963 l -0.716 1.244 a 1.431 1.431 0 0 1 -1.958 0.526 Z" },
    /*5 */    { isFill: false, d: "M 195.174 446.72 l 2.617 -3.42 l 15.367 11.822 c 0.3 0.234 0.158 0.933 -0.323 1.563 l -0.873 1.139 c -0.482 0.63 -1.118 0.951 -1.421 0.718 Z" },
    /*6 */    { isFill: false, d: "M 227.438 409.018 l 3.039 -3.048 l 28.371 28.445 a 1.439 1.439 0 0 1 0 2.032 l -1.013 1.016 a 1.431 1.431 0 0 1 -2.027 0 Z" },
    /*7 */    { isFill: false, d: "M 265.4 375.516 l 3.41 -2.624 L 280.6 388.3 c 0.232 0.3 -0.088 0.942 -0.716 1.425 l -1.137 0.875 c -0.628 0.483 -1.325 0.628 -1.558 0.324 Z" },
    /*8 */    { isFill: false, d: "M 306.483 347.5 l 3.722 -2.155 l 20.062 34.839 a 1.439 1.439 0 0 1 -0.525 1.962 l -1.241 0.719 a 1.431 1.431 0 0 1 -1.957 -0.526 Z" },
    /*9 */    { isFill: false, d: "M 351.615 324.962 l 3.971 -1.649 L 363 341.255 c 0.146 0.354 -0.328 0.887 -1.059 1.19 l -1.324 0.55 c -0.731 0.3 -1.443 0.263 -1.589 -0.091 Z" },
    /*10*/    { isFill: false, d: "M 398.715 308.582 l 4.153 -1.116 l 10.384 38.857 a 1.437 1.437 0 0 1 -1.013 1.76 l -1.384 0.372 a 1.433 1.433 0 0 1 -1.755 -1.016 Z" },
    /*11*/    { isFill: false, d: "M 447.941 298.5 l 4.262 -0.562 l 2.528 19.254 c 0.05 0.38 -0.546 0.772 -1.33 0.875 l -1.421 0.188 c -0.784 0.1 -1.461 -0.121 -1.511 -0.5 Z" },
    /*12*/    { isFill: false, d: "M 497.85 293.491 h 4.3 v 77.683 c 0 1.532 -0.641 2.774 -1.433 2.774 h -1.433 c -0.791 0 -1.433 -1.242 -1.433 -2.774 V 293.491 Z" },
    /*13*/    { isFill: false, d: "M 547.808 297.929 l 4.262 0.562 l -2.529 19.255 c -0.049 0.379 -0.726 0.6 -1.511 0.5 l -1.42 -0.188 c -0.785 -0.1 -1.381 -0.5 -1.331 -0.875 Z" },
    /*14*/    { isFill: false, d: "M 597.132 307.466 l 4.152 1.116 L 590.9 347.439 a 1.434 1.434 0 0 1 -1.755 1.016 l -1.384 -0.372 a 1.436 1.436 0 0 1 -1.013 -1.76 Z" },
    /*15*/    { isFill: false, d: "M 644.427 323.3 l 3.971 1.649 L 640.986 342.9 c -0.146 0.354 -0.857 0.4 -1.588 0.091 l -1.324 -0.55 c -0.732 -0.3 -1.206 -0.836 -1.059 -1.19 Z" },
    /*16*/    { isFill: false, d: "M 689.794 345.34 l 3.723 2.155 l -20.061 34.839 a 1.431 1.431 0 0 1 -1.957 0.526 l -1.241 -0.719 a 1.437 1.437 0 0 1 -0.525 -1.962 Z" },
    /*17*/    { isFill: false, d: "M 731.2 372.887 l 3.41 2.624 l -11.791 15.407 c -0.233 0.3 -0.93 0.159 -1.558 -0.324 l -1.137 -0.875 c -0.628 -0.483 -0.948 -1.121 -0.716 -1.425 Z" },
    /*18*/    { isFill: false, d: "M 769.522 405.97 l 3.04 3.048 l -28.371 28.445 a 1.43 1.43 0 0 1 -2.026 0 l -1.013 -1.016 a 1.439 1.439 0 0 1 0 -2.032 Z" },
    /*19*/    { isFill: false, d: "M 802.225 443.3 l 2.617 3.42 l -15.367 11.822 c -0.3 0.234 -0.94 -0.088 -1.421 -0.717 l -0.873 -1.14 c -0.481 -0.63 -0.626 -1.329 -0.323 -1.562 Z" },
    /*20*/    { isFill: false, d: "M 830.883 485.223 l 2.149 3.733 L 798.285 509.07 a 1.431 1.431 0 0 1 -1.957 -0.526 l -0.717 -1.244 a 1.44 1.44 0 0 1 0.525 -1.963 Z" },
    /*21*/    { isFill: false, d: "M 852.649 529.742 l 1.645 3.983 L 836.4 541.157 c -0.353 0.146 -0.884 -0.329 -1.187 -1.062 l -0.549 -1.328 c -0.3 -0.733 -0.262 -1.446 0.091 -1.593 Z" },
    /*22*/    { isFill: false, d: "M 869.694 577.7 l 1.113 4.164 l -38.755 10.411 a 1.431 1.431 0 0 1 -1.755 -1.016 l -0.371 -1.387 a 1.438 1.438 0 0 1 1.013 -1.76 Z" },
    /*23*/    { isFill: false, d: "M 879.041 626.325 L 879.6 630.6 l -19.2 2.535 c -0.379 0.05 -0.77 -0.548 -0.873 -1.334 l -0.187 -1.425 c -0.1 -0.786 0.12 -1.465 0.5 -1.515 Z" },
    /*24*/    { isFill: false, d: "M 883.312 677.1 v 4.31 H 821.053 c -1.228 0 -2.224 -0.643 -2.224 -1.437 v -1.436 c 0 -0.794 1 -1.437 2.224 -1.437 h 62.259 Z" },
    ];
    
    var dataForLightBeam = [
        { transform: "rotate(15deg) translate(15px, -90px)", d: "M 369.147 121.872 h 87.14 c 8.284 0 15 -6.716 15 -15 s -6.716 -15 -15 -15 h -87.14 c -8.284 0 -15 6.716 -15 15 S 360.863 121.872 369.147 121.872 Z" },
        { transform: "rotate(15deg) translate(25px, -100px)", d: "M 374.891 199.635 c 0 8.284 6.716 15 15 15 h 87.14 c 8.284 0 15 -6.716 15 -15 s -6.716 -15 -15 -15 h -87.14 C 381.607 184.635 374.891 191.351 374.891 199.635 Z" },
        { transform: "rotate(15deg) translate(45px, -110px)", d: "M 477.031 277.397 h -87.14 c -8.284 0 -15 6.716 -15 15 s 6.716 15 15 15 h 87.14 c 8.284 0 15 -6.716 15 -15 S 485.316 277.397 477.031 277.397 Z" },
        { transform: "rotate(15deg) translate(70px, -120px)", d: "M 456.287 370.159 h -87.14 c -8.284 0 -15 6.716 -15 15 s 6.716 15 15 15 h 87.14 c 8.284 0 15 -6.716 15 -15 S 464.571 370.159 456.287 370.159 Z" },
    ];
    
    var dataForLock = {
        0: { class: "green", d: "M408.05,195.2h-49.8v-82c0-62.3-50.9-113.2-113.2-113.2s-113.2,50.8-113.2,113.1c0,11.4,9.3,20.8,20.8,20.8s20.8-9.3,20.8-20.8c0-39.5,32.2-71.6,71.6-71.6c39.5,0,71.6,32.2,71.6,71.6v82H82.05c-11.4,0-20.8,9.3-20.8,20.8v253.4c0,11.4,9.3,20.8,20.8,20.8h326c11.4,0,20.8-9.3,20.8-20.8V215.9C428.85,204.5,419.45,195.2,408.05,195.2z M388.35,448.5h-285.6V236.7h285.5v211.8H388.35z" },
        1: { class: "red",   d: "M 408.05 195.2 h -49.8 v -82 c 0 -62.3 -50.9 -113.2 -113.2 -113.2 s -113.2 50.8 -113.2 113.1 v 82 h -49.8 c -11.4 0 -20.8 9.3 -20.8 20.8 v 253.4 c 0 11.4 9.3 20.8 20.8 20.8 h 326 c 11.4 0 20.8 -9.3 20.8 -20.8 V 215.9 C 428.85 204.5 419.45 195.2 408.05 195.2 Z M 174.45 114.2 c 0 -39.5 32.2 -71.6 71.6 -71.6 c 39.5 0 71.6 32.2 71.6 71.6 v 81 h -143.2 V 114.2 Z M 388.35 448.5 h -285.6 V 236.7 h 285.5 v 211.8 H 388.35 Z" },
    }
    
    var dataForFuel = `M352.427,90.24l0.32-0.32L273.28,10.667L250.667,33.28l45.013,45.013c-20.053,7.68-34.347,26.987-34.347,49.707
        c0,29.44,23.893,53.333,53.333,53.333c7.573,0,14.827-1.6,21.333-4.48v153.813C336,342.4,326.4,352,314.667,352
        c-11.733,0-21.333-9.6-21.333-21.333v-96c0-23.573-19.093-42.667-42.667-42.667h-21.333V42.667C229.333,19.093,210.24,0,186.667,0
        h-128C35.093,0,16,19.093,16,42.667V384h213.333V224h32v106.667c0,29.44,23.893,53.333,53.333,53.333
        c29.44,0,53.333-23.893,53.333-53.333V128C368,113.28,362.027,99.947,352.427,90.24z M186.667,149.333h-128V42.667h128V149.333z
        M314.667,149.333c-11.733,0-21.333-9.6-21.333-21.333s9.6-21.333,21.333-21.333c11.733,0,21.333,9.6,21.333,21.333
        S326.4,149.333,314.667,149.333z`;
    
    var dataForDanger = `M507.494,426.066L282.864,53.537c-5.677-9.415-15.87-15.172-26.865-15.172c-10.995,0-21.188,5.756-26.865,15.172
        L4.506,426.066c-5.842,9.689-6.015,21.774-0.451,31.625c5.564,9.852,16.001,15.944,27.315,15.944h449.259
        c11.314,0,21.751-6.093,27.315-15.944C513.508,447.839,513.336,435.755,507.494,426.066z M256.167,167.227
        c12.901,0,23.817,7.278,23.817,20.178c0,39.363-4.631,95.929-4.631,135.292c0,10.255-11.247,14.554-19.186,14.554
        c-10.584,0-19.516-4.3-19.516-14.554c0-39.363-4.63-95.929-4.63-135.292C232.021,174.505,242.605,167.227,256.167,167.227z
         M256.498,411.018c-14.554,0-25.471-11.908-25.471-25.47c0-13.893,10.916-25.47,25.471-25.47c13.562,0,25.14,11.577,25.14,25.47
        C281.638,399.11,270.06,411.018,256.498,411.018z`
    
    var speedometer = new Vue({
        el: "#speedometer",
        data: {
            show: false,
            isActive: true, //подсветка
            headlights: 3, //0-выкл,1-габариты,2-ближний,3-дальний (фары)
            lock: 0, //0-открыт,1-закрыт (двери)
            speed: 240,
            fuel: 50,
            maxFuel: 70,
            mileage: 1223.004,
            danger: 0, //0-выкл,1-вкл (аварийка)
            maxSpeed: 480,
            arrow: 0, //0-выкл,1-левый,2-правый (поворотики)
            hp: 80, //%
    
            leftArrow: false,
            rightArrow: false,
    
            svgScalePaths: dataForSpeedScale,
            svgLightPaths: dataForLightBeam,
            svgLockPaths: dataForLock,
            svgFuelPath: dataForFuel,
            svgDangerPath: dataForDanger,
    
            arrowInterval: null,
        },
        methods: {
            flickerLight: function () { // 0, 1, 2, 3
                if (this.arrowInterval)
                    clearInterval(this.arrowInterval);
    
                if (!(this.arrow + this.danger)) {
                    this.leftArrow = false;
                    this.rightArrow = false;
                    return;
                }
    
                this.arrowInterval = setInterval(() => {
                    this.leftArrow = (this.danger == 1 || this.arrow == 1) ? !this.leftArrow : false;
                    this.rightArrow = (this.danger == 1 || this.arrow == 2) ? !this.rightArrow : false;
                }, 500);
            },
        },
        computed: {
            compSpeed: function () {
                let speed = this.speed;
    
                let amountLines = this.svgScalePaths.length;
                let step = this.maxSpeed / (amountLines - 1);
                let count = Math.floor(speed / step);
    
                for (let i = 0; i < amountLines; i++) {
                    let val = i <= count;
    
                    if (speed == 0) val = false;
    
                    this.svgScalePaths[i].isFill = val;
                }
    
                return speed;
            },
            perFuel: function () {
                let fuel = this.fuel;
    
                return 100 - (fuel * 100 / this.maxFuel);
            },
        },
        watch: {
            arrow: function () {
                this.flickerLight();
            },
            danger: function () {
                this.flickerLight();
            }
        }
    
    
    });
    
    // for tests
    speedometer.show = true;
    