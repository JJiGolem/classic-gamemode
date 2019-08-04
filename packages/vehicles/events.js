"use strict";
var vehicles = require('./index.js')
module.exports = {
    "init": () => {
        vehicles.init();
        // let now = new Date();
        // console.log(now);
    },
    "playerEnterVehicle": (player, vehicle, seat) => {
        // console.log('ENGINE ' + vehicle.engineState);
        // console.log('STEERING ' + vehicle.steeringState);
        // console.log('FUEL ' + vehicle.fuelState);
        // console.log('BRAKE ' + vehicle.brakeState);
        // console.log(`multiplier ${vehicle.multiplier}`);
        player.call('chat.message.push', [`!{#70a7ff} Модель ${vehicle.model}`]);
        player.call('chat.message.push', [`!{#70a7ff} Имя модели ${vehicle.modelName}`]);
        player.call('chat.message.push', [`!{#70a7ff} Ключ ${vehicle.key}`]);
        player.call('chat.message.push', [`!{#70a7ff} Владелец ${vehicle.owner}`]);
        player.call('chat.message.push', [`!{#70a7ff} sqlId ${vehicle.sqlId}`]);
        player.call('chat.message.push', [`!{#70a7ff} fuel ${vehicle.fuel}`]);
        player.call('chat.message.push', [`!{#71a0ff} maxfuel ${vehicle.properties.maxFuel}`]);
        player.call('chat.message.push', [`!{#71a0ff} name ${vehicle.properties.name}`]);
        player.call('chat.message.push', [`!{#71a0ff} def consumption ${vehicle.properties.consumption}`]);
        player.call('chat.message.push', [`!{#71a0ff} license ${vehicle.properties.license}`]);
        player.call('chat.message.push', [`!{#71a0ff} parkingHours ${vehicle.parkingHours}`]);

        // if ((vehicle.license != 0) && vehicle.license != player.license) {
        //     player.call('notifications.push.error', ["У вас нет лицензии", "Транспорт"]);
        //     player.removeFromVehicle();
        // }

        if (!vehicle.engine && seat == -1) {
            player.call('prompt.showByName', ['vehicle_engine']);
        }
        if (seat == -1) {
            player.call('vehicles.speedometer.show', [true]);
            player.call('vehicles.speedometer.max.update', [vehicle.properties.maxFuel]);
            player.call('vehicles.speedometer.sync');
            clearInterval(player.indicatorsUpdateTimer);
            player.indicatorsUpdateTimer = setInterval(() => {
                try {
                    player.call('vehicles.speedometer.fuel.update', [Math.ceil(vehicle.fuel)]);
                } catch (err) {
                    console.log(err);
                }
            }, 1000);
        }
        player.call('vehicles.mileage.start', [vehicle.mileage]);
    },
    "playerQuit": (player) => {
        if (player.indicatorsUpdateTimer) {
            clearInterval(player.indicatorsUpdateTimer);
        }
    },
    "vehicleDeath": (vehicle) => {
        vehicles.respawnVehicle(vehicle);
    },
    "playerExitVehicle": (player, vehicle) => {
        if (player.indicatorsUpdateTimer) {
            clearInterval(player.indicatorsUpdateTimer);
        }
        player.call('vehicles.indicators.show', [false]);
        player.call('vehicles.speedometer.show', [false]);
        player.call('prompt.hide');
    },
    "playerStartExitVehicle": (player) => {
        if (player.vehicle.engine) player.vehicle.engine = true;
    },
    "vehicles.engine.toggle": (player) => { /// Включение/выключение двигателя
        if (!player.vehicle) return;
        if (player.vehicle.key == "market") return;
        if (player.vehicle.fuel <= 0) return player.call('notifications.push.error', ['Нет топлива', 'Транспорт']);
        if (player.vehicle.engine == true) {
            player.vehicle.engine = false;
            player.call('vehicles.engine.toggle', [false]);
            player.vehicle.setVariable("engine", false);
        } else {
            player.vehicle.engine = true;
            player.call('vehicles.engine.toggle', [true]);
            player.vehicle.setVariable("engine", true);
            player.call('prompt.hide');
            //if (player.vehicle.key != "job" && player.vehicle.key != "newbie" && player.vehicle.key != "admin") {
            vehicles.generateBreakdowns(player.vehicle);
            //}
            mp.events.call('vehicles.breakdowns.init', player);
        }
    },
    'vehicles.breakdowns.init': (player) => {
        if (!player.vehicle) return;
        let vehicle = player.vehicle;
        try {
            let data = {
                engineState: vehicle.engineState,
                steeringState: vehicle.steeringState,
                fuelState: vehicle.fuelState,
                brakeState: vehicle.brakeState
            }
            player.call('vehicles.breakdowns.init', [data]);
        } catch (err) {
            console.log(err);
        }
    },
    "vehicles.mileage.add": (player, value) => {
        if (!player.vehicle) return;

        if (value < 0.1) return;
        player.vehicle.mileage += value;
        vehicles.updateMileage(player);
        player.call('chat.message.push', [`!{#adff9e} Пробег ${player.vehicle.mileage}`]);
    },
    "entityCreated": (entity) => {
        if (entity.type == "vehicle") {
            entity.setVariable("leftTurnSignal", false);
            entity.setVariable("rightTurnSignal", false);
            entity.setVariable("hood", false);
            entity.setVariable("trunk", false);
        }
    },
    "vehicles.signals.left": (player, state) => {
        if (!player.vehicle) return;
        player.vehicle.setVariable("leftTurnSignal", state);
        player.vehicle.setVariable("rightTurnSignal", false);
    },
    "vehicles.signals.right": (player, state) => {
        if (!player.vehicle) return;
        player.vehicle.setVariable("rightTurnSignal", state);
        player.vehicle.setVariable("leftTurnSignal", false);
    },
    "vehicles.signals.emergency": (player, state) => {
        if (!player.vehicle) return;
        player.vehicle.setVariable("rightTurnSignal", state);
        player.vehicle.setVariable("leftTurnSignal", state);
    },
    "vehicles.hood": (player, vehicleId, state) => {
        let vehicle = mp.vehicles.at(vehicleId);
        if (!vehicle) return;

        vehicle.setVariable("hood", state);
    },
    "vehicles.trunk": (player, vehicleId, state) => {
        let vehicle = mp.vehicles.at(vehicleId);
        if (!vehicle) return;

        vehicle.setVariable("trunk", state);
    },
    "characterInit.done": (player) => {
        mp.events.call('vehicles.private.load', player);
    },
    "vehicles.private.load": (player) => {
        vehicles.loadPrivateVehicles(player);
    },
    "vehicles.lock": (player, vehicleId) => {
        let vehicle = mp.vehicles.at(vehicleId);
        if (!vehicle) return;
        // TEMP 
        // if (vehicle.key != 'private') return player.call('notifications.push.error', ['Это не ваше т/с', 'Ошибка']);
        // if (vehicle.owner != player.character.id) return player.call('notifications.push.error', ['Это не ваше т/с', 'Транспорт']);

        let state = vehicle.locked;
        if (state) {
            vehicle.locked = false;
            player.call('notifications.push.success', ['Вы открыли т/с', 'Транспорт']);
        } else {
            vehicle.locked = true;
            player.call('notifications.push.success', ['Вы закрыли т/с', 'Транспорт']);
        }
    },
    "vehicles.explode": (player, vehicleId) => {
        let vehicle = mp.vehicles.at(vehicleId);
        if (!vehicle) return;
        setTimeout(() => {
            vehicle.explode();
            vehicle.destroy();
        }, 2000);
    },
    "vehicles.ejectlist.get": (player, vehicleId) => {
        let vehicle = mp.vehicles.at(vehicleId);
        if (!vehicle) return;
        let occupants = vehicle.getOccupants();
        if (occupants.length == 0) return;

        let ejectList = [];

        occupants.forEach((current) => {
            console.log(current.name);
            if ((current.id != player.id) && (current.seat != -1)) {
                ejectList.push({
                    id: current.id,
                    name: current.name
                });
            }
        });
        console.log(ejectList);
        if (ejectList.length == 0) return player.call('notifications.push.error', ['В т/с нет пассажиров', 'Транспорт']);;
        player.call('interaction.ejectlist.show', [ejectList]);
    },
    "vehicles.eject": (player, playerToEject) => {
        if (!playerToEject) return;
        playerToEject = JSON.parse(playerToEject);

        let target = mp.players.at(playerToEject.id);
        if (!target) return;
        if (!target.vehicle) return;
        if (target.name != playerToEject.name) return;

        console.log(`выкидываем ${target.name} с id ${target.id}`);
        try {
            target.removeFromVehicle();
            target.call('notifications.push.warning', ['Вас вытолкнули из т/с', 'Транспорт']);
            player.call('notifications.push.success', ['Вы вытолкнули пассажира', 'Транспорт']);
        } catch (err) {
            console.log(err);
        }
    },
    "vehicles.siren.sound": (player, vehicleId) => {
        if (!player.vehicle) return;
        let vehicle = mp.vehicles.at(vehicleId);
        if (!vehicle) return;

        var sirenSound = vehicle.getVariable("sirenSound");
        vehicle.setVariable("sirenSound", !sirenSound);
    },
    "vehicles.siren.lights": (player) => {
        if (!player.vehicle) return;

        var sirenLights = player.vehicle.getVariable("sirenLights");
        if (sirenLights == player.vehicle.siren) return;
        player.vehicle.setVariable("sirenLights", player.vehicle.siren);
    }
}