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
            player.call('parkings.menu.show', [shape.parkingId]);
            //parkings.spawnParkingVehicle(player, shape.parkingId);
        }
    },
    "playerExitColshape": (player, shape) => {
        if (shape.isParking) {
            player.call('chat.message.push', [`!{#ffffff}${player.name} вышел из колшейпа с parkingId ${shape.parkingId}`]);
            player.call('parkings.menu.close');
        }
    },
    "parkings.vehicle.add": (veh) => {
        parkings.addVehicleToParking(veh);
    },
    "parkings.vehicle.get": (player, parkingId) => {
        console.log(parkingId);
        parkings.spawnParkingVehicle(player, parkingId);
    },
    "playerQuit": (player) => {
        parkings.savePlayerParkingVehicles(player);
    }
}