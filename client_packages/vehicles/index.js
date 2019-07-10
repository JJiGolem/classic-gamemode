mp.events.add('playerEnterVehicle', (vehicle, seat) => { ///Убираем автозаведение автомобиля персонажем
    if (mp.players.local.getSeatIsTryingToEnter() !== -1 || vehicle.getIsEngineRunning()) {
        return;
    }
    vehicle.setEngineOn(false, true, true);
});

mp.keys.bind(0x32, true, function () {
    mp.events.callRemote('vehicles.engine.toggle'); // TODO: проверки
});
// TEMP
var indicators = {
    show: true,
    fuel: 0,
    mileage: 0
}
mp.events.add('vehicles.indicators.show', (state) => {
    indicators.show = state;
});

mp.events.add('vehicles.indicators.update', (litres) => {
    indicators.fuel = litres;
});

mp.events.add('render', () => {
    if (indicators.show && mp.players.local.vehicle) {

        mp.game.graphics.drawText(`SPEED: ${Math.floor(mp.players.local.vehicle.getSpeed() * 2.236936)}km/h FUEL: ${indicators.fuel} MILEAGE: ${parseInt(indicators.mileage)}`, [0.8, 0.9],
            {
                font: 4,
                color: [255, 255, 255, 255],
                scale: [0.5, 0.5],
                outline: true
            });
    }
});

var mileageTimer, mileageUpdateTimer, lastPos, currentDist = 0;

mp.events.add('vehicles.mileage.start', (value) => {
    if (mp.players.local.vehicle) {
        mp.players.local.vehicle.mileage = value;
        indicators.mileage = value;
    }
    startMileageCounter();
});

function startMileageCounter() {

    var player = mp.players.local;
    lastPos = player.position;
    stopMileageCounter();
    mileageTimer = setInterval(() => {
        var vehicle = player.vehicle;
        if (!vehicle) return stopMileageCounter();

        var dist = (vehicle.position.x - lastPos.x) * (vehicle.position.x - lastPos.x) + (vehicle.position.y - lastPos.y) * (vehicle.position.y - lastPos.y) +
            (vehicle.position.z - lastPos.z) * (vehicle.position.z - lastPos.z);
        dist = Math.sqrt(dist);
        if (dist > 200) dist = 50;
        dist /= 1000;

        currentDist += dist;
        lastPos = vehicle.position;

        var mileage = vehicle.mileage + currentDist; // Добавить обновление в спидометре
        indicators.mileage = mileage;
    }, 1000);
    mileageUpdateTimer = setInterval(() => {
        var vehicle = player.vehicle;
        if (!vehicle) return stopMileageCounter();
        if (currentDist < 0.1) return;
        mp.events.callRemote(`vehicles.mileage.add`, currentDist);
        vehicle.mileage += currentDist;
        currentDist = 0;
    }, 60000);
};

function stopMileageCounter() {

    clearInterval(mileageTimer);
    clearInterval(mileageUpdateTimer);
    mileageTimer = 0;
    mileageUpdateTimer = 0;

    if (currentDist < 0.1) return;
    mp.events.callRemote(`vehicles.mileage.add`, currentDist);
    currentDist = 0;
};