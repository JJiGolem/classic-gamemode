var vehicles = require('./index.js');
module.exports = {
    "/test": {
        handler: (player, args) => {
            let testVeh = {
                sqlId: 123,
                model: "police",
                x: player.position.x,
                y: player.position.y,
                z: player.position.z,
                heading: player.heading,
                color1: 111,
                color2: 0,
                key: "faction",
                owner: 1,
                license: 1
            }
            vehicles.spawnVehicle(testVeh);
        }
    },
    "/setlic": {
        handler: (player, args) => {
            player.license = args[0];
        }
    },
    "/resp": {
        handler: (player, args) => {
            if (player.vehicle) {
                player.removeFromVehicle();
                vehicles.respawnVehicle(player.vehicle);
            }
        }
    },
    "/toggle": {
        handler: (player, args) => {
            mp.events.call("vehicle.engine.toggle", player);
        }
    }
}