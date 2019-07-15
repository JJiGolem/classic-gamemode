var speedometer = new Vue({
    el: "#speedometer",
    data: {
        show: false,
        headlights: 0, //0-выкл,1-габариты,2-ближний,3-дальний (фары)
        lock: 0, //0-открыт,1-закрыт (двери)
        speed: 240,
        fuel: 50,
        maxFuel: 70,
        mileage: 23004,
        danger: 0, //0-выкл,1-вкл (аварийка)
    }
});

// for tests
// speedometer.show = true;
