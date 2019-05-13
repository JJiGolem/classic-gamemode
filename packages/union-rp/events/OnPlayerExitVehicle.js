module.exports = {
    "playerExitVehicle": (player, vehicle) => {
        if (vehicle.player == player) delete vehicle.player;

        if (player && player.hasCuffs) player.playAnimation("mp_arresting", 'idle', 1, 49);
        mp.setVehSpawnTimer(vehicle);
        checkPlayerGangwar(player, vehicle);
    }
}

function checkPlayerGangwar(player, vehicle) {
    var gangwar = player.getVariable("gangwar");
    if (gangwar && player.seat != -1) vehicle.setVariable("gangwar", gangwar);
}
