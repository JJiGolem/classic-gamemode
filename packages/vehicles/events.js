"use strict";
var vehicles = require('./index.js')
module.exports = {
    "init": ()=> {
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
        player.call('chat.message.push', [`!{#70a7ff} Ключ ${vehicle.key}`]);
        player.call('chat.message.push', [`!{#70a7ff} Владелец ${vehicle.owner}`]);
        player.call('chat.message.push', [`!{#70a7ff} sqlId ${vehicle.sqlId}`]);
        if ((vehicle.license != 0) && vehicle.license != player.license) {
            player.call('notifications.push.error', ["У вас нет лицензии", "Транспорт"]);
            player.removeFromVehicle();
        }
    },
    "vehicle.engine.toggle": (player) => {
        if (!player.vehicle) return;
        if (player.vehicle.engine == true) {
            player.vehicle.engine = false;
        } else {
            player.vehicle.engine = true;
        }
    }
}