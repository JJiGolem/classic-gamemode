mp.events.add('playerEnterVehicle', (vehicle, seat) => { ///Убираем автозаведение автомобиля персонажем
    if (mp.players.local.getSeatIsTryingToEnter() !== -1 || vehicle.getIsEngineRunning()) {
        return;
    }
    vehicle.setEngineOn(false, true, true);
});


mp.events.add("playerLeaveVehicle", () => {
    mp.callCEFV('speedometer.arrow = 0');
    mp.callCEFV('speedometer.emergency = false');
});

mp.events.addDataHandler("engine", (entity) => {
    var player = mp.players.local;
    var engine = entity.getVariable('engine');
    entity.setUndriveable(!engine);
    entity.setEngineOn(engine, true, true);

});

setInterval(() => { /// Синхронизация двигателя
    var player = mp.players.local;
    if (player.vehicle && mp.vehicles.exists(player.vehicle)) {
        var engine = player.vehicle.getVariable('engine');

        player.vehicle.setUndriveable(!engine);
        player.vehicle.setEngineOn(engine, true, true);
    }
}, 100);

speedometerUpdateTimer = setInterval(() => { /// Обновление спидометра

    if ((!mp.players.local.vehicle) || (mp.players.local.vehicle.getPedInSeat(-1) != mp.players.local.handle)) return;

    let engine = mp.players.local.vehicle.getIsEngineRunning();
    let lastEngine;
    if (engine != lastEngine) {
        if (!engine) {
            mp.callCEFV(`speedometer.isActive = false`);
            lastEngine = false;
        } else {
            mp.callCEFV(`speedometer.isActive = true`);
            lastEngine = true;
        }
    }

    let speed = Math.floor(mp.players.local.vehicle.getSpeed() * 3.6);
    mp.callCEFV(`speedometer.speed = ${speed}`);

    var lights = mp.players.local.vehicle.getLightsState(1, 1); /// Фары
    var lastLightState;
    var lightState = 0;
    var low = lights.lightsOn;
    var high = lights.highbeamsOn;
    if (low == 0 && high == 0) lightState = 0;
    if (low == 0 && high == 1) lightState = 1;
    if (low == 1 && high == 0) lightState = 2;
    if (low == 1 && high == 1) lightState = 3;
    if (lastLightState != lightState) {
        mp.callCEFV(`speedometer.headlights = ${lightState}`);
        lastLightState = lightState;
    }

}, 100);

mp.keys.bind(0x32, true, function () {

    if (mp.players.local.vehicle.getPedInSeat(-1) === mp.players.local.handle) {
        mp.events.callRemote('vehicles.engine.toggle'); // TODO: проверки
    }
});

mp.events.add('vehicles.engine.toggle', (state) => {
    mp.callCEFV(`speedometer.isActive = ${state}`);
})

mp.events.add('vehicles.speedometer.show', (state) => {
    if (state) {
        let vehicle = mp.players.local.vehicle;
        if (!vehicle) return;
        let engine = vehicle.getIsEngineRunning()
        mp.callCEFV(`speedometer.isActive = ${engine}`);
        mp.callCEFV('speedometer.show = true');
    } else {
        mp.callCEFV('speedometer.show = false');
    }
});

mp.events.add('vehicles.speedometer.sync', () => {

    let vehicle = mp.players.local.vehicle;

    var left = vehicle.getVariable(`leftTurnSignal`);
    var right = vehicle.getVariable(`rightTurnSignal`);

    if (left && right) {
        mp.callCEFV('speedometer.emergency = true');
    }
    if (left && !right) {
        mp.callCEFV('speedometer.arrow = 1');
    }
    if (!left && right) {
        mp.callCEFV('speedometer.arrow = 2');
    }
});

mp.events.add('vehicles.speedometer.fuel.update', (litres) => {
    mp.callCEFV(`speedometer.fuel = ${litres}`);
});

mp.events.add('vehicles.speedometer.mileage.update', (mileage) => {
    mileage = parseInt(mileage);
    mp.callCEFV(`speedometer.mileage = ${mileage}`);
});

mp.events.add('vehicles.speedometer.max.update', (fuel) => {
    mp.callCEFV(`speedometer.maxFuel = ${fuel}`);

    let maxSpeed = (mp.game.vehicle.getVehicleModelMaxSpeed(mp.players.local.vehicle.model) * 3.6).toFixed(0);
    mp.callCEFV(`speedometer.maxSpeed = ${maxSpeed}`);
});

var mileageTimer, mileageUpdateTimer, lastPos, currentDist = 0;

mp.events.add('vehicles.mileage.start', (value) => {
    if (mp.players.local.vehicle) {
        mp.players.local.vehicle.mileage = value;
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

        var mileage = vehicle.mileage + currentDist;
        mp.events.call('vehicles.speedometer.mileage.update', mileage);
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

    if (currentDist < 0.1) return;
    mp.events.callRemote(`vehicles.mileage.add`, currentDist);
    currentDist = 0;
};

mp.keys.bind(0x25, true, function () {
    if (mp.busy.includes()) return;
    var player = mp.players.local;
    var vehicle = player.vehicle;
    if (!vehicle) return;
    if (vehicle.getPedInSeat(-1) != player.handle) return;

    var left = vehicle.getVariable(`leftTurnSignal`);
    var right = vehicle.getVariable(`rightTurnSignal`);
    mp.callCEFV('speedometer.arrow = 0');
    if (!left || !right) {
        mp.events.callRemote("vehicles.signals.left", !left);
        if (!left) {
            mp.callCEFV('speedometer.arrow = 0');
            mp.callCEFV('speedometer.arrow = 1');
        } else {
            mp.callCEFV('speedometer.arrow = 0');
        }

    }
});

mp.keys.bind(0x27, true, function () {
    if (mp.busy.includes()) return;
    var player = mp.players.local;
    var vehicle = player.vehicle;
    if (!vehicle) return;
    if (vehicle.getPedInSeat(-1) != player.handle) return;

    var left = vehicle.getVariable(`leftTurnSignal`);
    var right = vehicle.getVariable(`rightTurnSignal`);
    mp.callCEFV('speedometer.arrow = 0');
    if (!left || !right) {
        mp.events.callRemote("vehicles.signals.right", !right);
        if (!right) {
            mp.callCEFV('speedometer.arrow = 0');
            mp.callCEFV('speedometer.arrow = 2');
        } else {
            mp.callCEFV('speedometer.arrow = 0');
        }
    }
});


mp.keys.bind(0x28, false, () => {
    if (mp.busy.includes()) return;
    var player = mp.players.local;
    var vehicle = player.vehicle;
    if (!vehicle) return;
    if (vehicle.getPedInSeat(-1) != player.handle) return;

    var left = vehicle.getVariable(`leftTurnSignal`);
    var right = vehicle.getVariable(`rightTurnSignal`);

    if (left && right) {
        mp.events.callRemote(`vehicles.signals.emergency`, false);
        mp.callCEFV('speedometer.arrow = 0');
        mp.callCEFV('speedometer.emergency = false');
    } else {
        mp.events.callRemote(`vehicles.signals.emergency`, true);
        mp.callCEFV('speedometer.arrow = 0');
        mp.callCEFV('speedometer.emergency = true');
    }
});


mp.events.addDataHandler("leftTurnSignal", (entity) => {
    var player = mp.players.local;
    var left = entity.getVariable('leftTurnSignal');
    entity.setIndicatorLights(1, left);
});

mp.events.addDataHandler("rightTurnSignal", (entity) => {
    var player = mp.players.local;
    var right = entity.getVariable('rightTurnSignal');
    entity.setIndicatorLights(0, right);
});

mp.events.add('entityStreamIn', (entity) => {
    if (entity.type == 'vehicle') {
        var left = entity.getVariable("leftTurnSignal");
        var right = entity.getVariable("rightTurnSignal");
        entity.setIndicatorLights(1, left);
        entity.setIndicatorLights(0, right);
    }
});