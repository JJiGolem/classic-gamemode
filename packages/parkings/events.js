var parkings = require('./index.js');
module.exports = {
    "init": () => {
        parkings.init();
    },
    "vehicleDeath": (vehicle) => {
        if (vehicle.key == "private") vehicle.parkingId = parkings.getClosestParkingId(vehicle);
    },
    "playerEnterColshape": (player, shape) => {
        if (shape.isParking) {
            player.call('chat.message.push', [`!{#ffffff}${player.name} зашел в колшейп с parkingId ${shape.parkingId}`]);
            player.call('parkings.menu.show');
            parkings.spawnParkingVehicle(player, shape.parkingId);
        }
    },
    "playerExitColshape": (player, shape) => {
        if (shape.isParking) {
            player.call('chat.message.push', [`!{#ffffff}${player.name} вышел из колшейпа с parkingId ${shape.parkingId}`]);
            player.call('parkings.menu.close');
            //parkings.spawnParkingVehicle(player, shape.parkingId);
        }
    },
    "parkings.vehicle.add": (veh) => {
        parkings.addVehicleToParking(veh);
    }
}