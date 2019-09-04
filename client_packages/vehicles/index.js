let breakdowns = require('./vehicles/breakdowns.js');
let sell = require('./vehicles/sell.js');
let garage = require('./vehicles/garage.js');

let currentSirenState = false;

mp.speedometerEnabled = true;

mp.events.add("playerLeaveVehicle", () => {
    mp.callCEFV('speedometer.arrow = 0');
    mp.callCEFV('speedometer.emergency = false');
    setTimeout(() => {
        try {
            currentSirenState = false;
        } catch (err) {
            mp.chat.debug('currentSirenState = false error')
        }

    }, 2000);

});

mp.events.addDataHandler("engine", (entity) => {
    var player = mp.players.local;
    var engine = entity.getVariable('engine');
    entity.setUndriveable(!engine);
    entity.setEngineOn(engine, true, true);

});

setInterval(() => { /// Синхронизация двигателя
    try {
        var player = mp.players.local;
        if (player.vehicle && mp.vehicles.exists(player.vehicle)) {
            var engine = player.vehicle.getVariable('engine') || false;

            player.vehicle.setUndriveable(!engine);
            player.vehicle.setEngineOn(engine, true, true);
        }
    } catch (err) {
        mp.chat.debug('engine sync error');
    }

}, 100);

let lastLightState;
let lightState = 0;
let lastLockStatus;

speedometerUpdateTimer = setInterval(() => { /// Обновление спидометра

    try {
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

        let lights = mp.players.local.vehicle.getLightsState(1, 1); /// Фары

        let low = lights.lightsOn;
        let high = lights.highbeamsOn;
        if (low == 0 && high == 0) lightState = 0;
        if (low == 0 && high == 1) lightState = 1;
        if (low == 1 && high == 0) lightState = 2;
        if (low == 1 && high == 1) lightState = 3;
        if (lastLightState != lightState) {
            mp.callCEFV(`speedometer.headlights = ${lightState}`);
            lastLightState = lightState;
        }
        let lockStatus = mp.players.local.vehicle.getDoorLockStatus();
        if (lockStatus != lastLockStatus) {
            lastLockStatus = lockStatus;
            if (lockStatus == 1) {
                mp.callCEFV(`speedometer.lock = 0`);
            } else {
                mp.callCEFV(`speedometer.lock = 1`);
            }
        }
    } catch (err) {
        mp.chat.debug('speedometerUpdateTimer error');
    }


}, 100);

mp.keys.bind(0x32, true, function() {
    if (mp.busy.includes('chat')) return;
    if (mp.players.local.vehicle.getPedInSeat(-1) === mp.players.local.handle) {
        mp.events.callRemote('vehicles.engine.toggle');
    }
});

mp.events.add('vehicles.engine.toggle', (state) => {
    mp.callCEFV(`speedometer.isActive = ${state}`);
})

mp.events.add('vehicles.speedometer.show', (state) => {
    if (mp.speedometerEnabled) {
        if (state) {
            let vehicle = mp.players.local.vehicle;
            if (!vehicle) return;
            let engine = vehicle.getIsEngineRunning()
            mp.callCEFV(`speedometer.isActive = ${engine}`);
            mp.callCEFV('speedometer.show = true');
        } else {
            mp.callCEFV('speedometer.show = false');
        }
    }

});

mp.events.add('vehicles.speedometer.sync', () => {

    let vehicle = mp.players.local.vehicle;
    if (!vehicle) return;
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
    let vehicle = mp.players.local.vehicle;
    if (!vehicle) return;
    let maxSpeed = (mp.game.vehicle.getVehicleModelMaxSpeed(vehicle.model) * 3.6).toFixed(0);
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
        try {
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
        } catch (err) {
            mp.chat.debug('mileageTimer error');
        }

    }, 1000);
    mileageUpdateTimer = setInterval(() => {
        try {
            var vehicle = player.vehicle;
            if (!vehicle) return stopMileageCounter();
            if (currentDist < 0.1) return;
            mp.events.callRemote(`vehicles.mileage.add`, currentDist);
            vehicle.mileage += currentDist;
            currentDist = 0;
        } catch (err) {
            mp.chat.debug('mileageUpdateTimer error');
        }
    }, 60000);
};

function stopMileageCounter() {

    clearInterval(mileageTimer);
    clearInterval(mileageUpdateTimer);

    if (currentDist < 0.1) return;
    mp.events.callRemote(`vehicles.mileage.add`, currentDist);
    currentDist = 0;
};

mp.keys.bind(0x25, true, function() {
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

mp.keys.bind(0x27, true, function() {
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


mp.keys.bind(0x28, true, () => {
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

mp.events.addDataHandler("hood", (entity) => {
    var hood = entity.getVariable('hood');
    if (hood) {
        entity.setDoorOpen(4, false, false);
    } else {
        entity.setDoorShut(4, false);
    }
});


mp.events.addDataHandler("trunk", (entity) => {
    var trunk = entity.getVariable('trunk');
    if (trunk) {
        entity.setDoorOpen(5, false, false);
    } else {
        entity.setDoorShut(5, false);
    }
});

mp.events.addDataHandler("sirenSound", (entity) => {
    var sirenSound = entity.getVariable("sirenSound");
    entity.setSirenSound(sirenSound);
});

mp.events.addDataHandler("sirenLights", (entity) => {
    var sirenLights = entity.getVariable("sirenLights");
    entity.setSiren(sirenLights);
});

mp.events.add('entityStreamIn', (entity) => {
    if (entity.type == 'vehicle') {
        let left = entity.getVariable("leftTurnSignal") || false;
        let right = entity.getVariable("rightTurnSignal") || false;
        entity.setIndicatorLights(1, left);
        entity.setIndicatorLights(0, right);

        let hood = entity.getVariable("hood") || false;
        let trunk = entity.getVariable("trunk") || false;

        let sirenLights = entity.getVariable("sirenLights") || false;
        let sirenSound = entity.getVariable("sirenSound") || false;

        if (hood) {
            entity.setDoorOpen(4, false, false);
        } else {
            entity.setDoorShut(4, false);
        }

        if (trunk) {
            entity.setDoorOpen(5, false, false);
        } else {
            entity.setDoorShut(5, false);
        }

        entity.setSiren(sirenLights);
        entity.setSirenSound(sirenSound);
    }
});

mp.events.add('vehicles.lock', () => {
    let veh = mp.getCurrentInteractionEntity();
    if (!veh) return;
    if (veh.type != 'vehicle') return;
    mp.events.callRemote('vehicles.lock', veh.remoteId);
})

mp.events.add('vehicles.hood', () => {
    let veh = mp.getCurrentInteractionEntity();
    if (!veh) return;
    if (veh.type != 'vehicle') return;

    if (veh.getVariable("hood")) {
        mp.events.callRemote('vehicles.hood', veh.remoteId, false);
    } else {
        mp.events.callRemote('vehicles.hood', veh.remoteId, true);
    }
});

mp.events.add('vehicles.trunk', () => {
    let veh = mp.getCurrentInteractionEntity();
    if (!veh) return;
    if (veh.type != 'vehicle') return;

    if (veh.getVariable("trunk")) {
        mp.events.callRemote('vehicles.trunk', veh.remoteId, false);
    } else {
        mp.events.callRemote('vehicles.trunk', veh.remoteId, true);
    }
});

mp.events.add('vehicles.explode', () => {
    let veh = mp.getCurrentInteractionEntity();
    if (!veh) return;
    if (veh.type != 'vehicle') return;
    mp.events.callRemote('vehicles.explode', veh.remoteId);
});

mp.events.add('vehicles.siren.sound', () => {
    let veh = mp.getCurrentInteractionEntity();
    if (!veh) return;
    if (veh.type != 'vehicle') return;
    mp.events.callRemote('vehicles.siren.sound', veh.remoteId);
});

let sirenLightsUpdater = setInterval(() => {
    try {
        if (!mp.players.local.vehicle) return;
        if (currentSirenState == mp.players.local.vehicle.isSirenOn()) return;
        mp.events.callRemote('vehicles.siren.lights');
        currentSirenState = mp.players.local.vehicle.isSirenOn();
    } catch (err) {
        mp.chat.debug('sirenLightsUpdater error');
    }

}, 1000);


mp.vehicles.getVehiclePosition = (vehicle) => {
    let data = {
        x: vehicle.position.x,
        y: vehicle.position.y,
        z: vehicle.position.z,
        h: vehicle.getHeading()
    }
    return data;
}

mp.events.add('vehicles.heading.set', (heading) => {
    let veh = mp.players.local.vehicle;
    if (!veh) return;

    veh.setHeading(heading);
    veh.setOnGroundProperly();
});

mp.events.add('vehicles.onGroundProperly.set', () => {
    let veh = mp.players.local.vehicle;
    if (!veh) return;
    veh.setOnGroundProperly();
});


mp.events.add('vehicles.speedometer.enabled', (enabled) => {
    mp.speedometerEnabled = enabled;
});
mp.events.add("time.main.tick", () => {
    var entity = mp.utils.getNearPlayerOrVehicle(mp.players.local.position, 10);

    if (entity && entity.type == "vehicle") {
        var bootPos = mp.utils.getBootPosition(entity);
        var distToBoot = mp.vdist(mp.players.local.position, bootPos);
        if (distToBoot < 1) {
            if (nearBootVehicleId == null) {
                nearBootVehicleId = entity.remoteId;
                mp.events.call("playerEnterVehicleBoot", mp.players.local, entity);
            }
        } else {
            if (nearBootVehicleId != null) {
                mp.events.call("playerExitVehicleBoot", mp.players.local, mp.vehicles.atRemoteId(nearBootVehicleId));
                nearBootVehicleId = null;
            }
        }

        var hoodPos = mp.utils.getHoodPosition(entity);
        var distToHood = mp.vdist(mp.players.local.position, hoodPos);
        if (distToHood < 1) {
            if (nearHoodVehicleId == null) {
                nearHoodVehicleId = entity.remoteId;
                mp.events.call("playerEnterVehicleHood", mp.players.local, entity);
            }
        } else {
            if (nearHoodVehicleId != null) {
                mp.events.call("playerExitVehicleHood", mp.players.local, mp.vehicles.atRemoteId(nearHoodVehicleId));
                nearHoodVehicleId = null;
            }
        }
    } else {
        if (nearBootVehicleId != null) {
            mp.events.call("playerExitVehicleBoot", mp.players.local, mp.vehicles.atRemoteId(nearBootVehicleId));
            nearBootVehicleId = null;
        }
        if (nearHoodVehicleId != null) {
            mp.events.call("playerExitVehicleHood", mp.players.local, mp.vehicles.atRemoteId(nearHoodVehicleId));
            nearHoodVehicleId = null;
        }
    }
});
var nearBootVehicleId = null,
    nearHoodVehicleId = null;

mp.events.add('render', () => {
    mp.vehicles.forEachInStreamRange((vehicle) => {
        if (mp.vdist(mp.players.local.position, vehicle.position) > 10) return;
        if (vehicle.getVariable('label')) {
            let label = vehicle.getVariable('label');
            mp.game.graphics.drawText(label, [vehicle.position.x, vehicle.position.y, vehicle.position.z + 2.7], {
                font: 0,
                color: [255, 255, 255, 255],
                scale: [0.35, 0.35],
                outline: true,
                centre: true
            });
        }
    });
});
