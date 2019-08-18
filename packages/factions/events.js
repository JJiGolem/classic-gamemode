let factions = require('./index.js');
let notifs = require('../notifications');
module.exports = {
    "init": () => {
        factions.init();
    },
    "factions.warehouse.takeBox": (player, type) => {
        factions.takeBox(player, type);
    },
    "factions.warehouse.putBox": (player) => {
        factions.putBox(player);
    },
    "playerEnterVehicle": (player, vehicle, seat) => {
        if (seat != -1 || vehicle.key != 'faction' || !player.character.factionId) return;
        if (player.character.factionId != vehicle.owner) {
            notifs.error(player, `Вы не состоите в организации`, factions.getFaction(vehicle.owner).name);
            player.removeFromVehicle();
        }
    },
};
