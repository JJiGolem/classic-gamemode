"use strict";
var vehicles = require('./index.js')
module.exports = {
    "init": () => {
        vehicles.init();
    },
    "playerJoin": (player) => { // temp
        player.spawn(new mp.Vector3(-252.91534423828125, -338.6800231933594, 29.70627212524414));
    },
    "playerDeath": (player) => { // temp
        player.health = 100;
        player.spawn(new mp.Vector3(-252.91534423828125, -338.6800231933594, 29.70627212524414));
    },
    "playerEnterVehicle": (player, vehicle, seat) => {
        player.call('chat.message.push', [`!{#70a7ff} Модель ${vehicle.model}`]);
        player.call('chat.message.push', [`!{#70a7ff} Имя модели ${vehicle.modelName}`]);
        player.call('chat.message.push', [`!{#70a7ff} Ключ ${vehicle.key}`]);
        player.call('chat.message.push', [`!{#70a7ff} Владелец ${vehicle.owner}`]);
        player.call('chat.message.push', [`!{#70a7ff} sqlId ${vehicle.sqlId}`]);
        player.call('chat.message.push', [`!{#70a7ff} fuel ${vehicle.fuel}`]);
        player.call('chat.message.push', [`!{#71a0ff} maxfuel ${vehicle.properties.maxFuel}`]);
        player.call('chat.message.push', [`!{#71a0ff} name ${vehicle.properties.name}`]);
        player.call('chat.message.push', [`!{#71a0ff} defaultCons ${vehicle.properties.defaultConsumption}`]);
        player.call('chat.message.push', [`!{#71a0ff} defaultCons ${vehicle.properties.license}`]);

        if ((vehicle.license != 0) && vehicle.license != player.license) {
            player.call('notifications.push.error', ["У вас нет лицензии", "Транспорт"]);
            player.removeFromVehicle();
        }

        if (!vehicle.engine && seat == -1) {
            player.call('chat.message.push', [`!{#adff9e} Нажмите 2, чтобы завести транспортное средство`]);
        }
        // TEMP
        if (seat == -1) {
            player.call('vehicles.indicators.show', [true]);
            player.call('vehicles.indicators.update', [vehicle.fuel]);
            player.indicatorsUpdateTimer = setInterval(() => {
                try {
                    player.call('vehicles.indicators.update', [vehicle.fuel]);
                } catch (err) {
                    console.log(err);
                }
            }, 1000);
        }
        console.log(vehicle.mileage);
        console.log(typeof(vehicle.mileage))
        player.call('vehicles.mileage.start', [vehicle.mileage]);
    },
    "playerExitVehicle": (player, vehicle) => {
        if (player.indicatorsUpdateTimer) {
            clearInterval(player.indicatorsUpdateTimer);
        }
        player.call('vehicles.indicators.show', [false]);
    },
    "playerStartExitVehicle": (player) => {
        if (player.vehicle.engine) player.vehicle.engine = true;
    },
    "vehicles.engine.toggle": (player) => { /// Включение/выключение двигателя
        if (!player.vehicle) return;
        if (player.vehicle.fuel <= 0) return player.call('notifications.push.error', ['Нет топлива', 'Транспорт']);
        if (player.vehicle.engine == true) {
            player.vehicle.engine = false;
        } else {
            player.vehicle.engine = true;
        }
    },
    "vehicles.mileage.add": (player, value) => {
        if (!player.vehicle) return;

        if (value < 0.1) return;
        player.vehicle.mileage += value;
        vehicles.updateMileage(player);
        player.call('chat.message.push', [`!{#adff9e} Пробег ${player.vehicle.mileage}`]);
    }
}