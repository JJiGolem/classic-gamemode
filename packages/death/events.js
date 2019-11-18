let death = call('death');
let factions = call('factions');
let notifs = call('notifications');

module.exports = {
    "init": () => {
        inited(__dirname);
    },
    "death.wait": (player, time) => {
        player.spawn(player.position);
        player.health = death.health;
        if (player.character.arrestTime) return;
        death.addKnocked(player, time);
        if (time > 5 * 60 * 1000) mp.events.call(`mapCase.ems.calls.add`, player, `Ранение`);
    },
    "death.spawn": (player) => {
        if (player.character.arrestTime) {
            player.spawn(player.position);
            player.dimension = 0;
            player.health = 10;
            return;
        }
        var hospitalPos = factions.getMarker(5).position;
        player.spawn(hospitalPos);
        player.dimension = 0;
        player.health = 10;
        death.removeKnocked(player);
        mp.events.call(`mapCase.ems.calls.remove`, player, player.character.id);
    },
    "playerDeath": (player, reason, killer) => {

    },
    "playerQuit": (player) => {
        if (!player.getVariable("knocked")) return;

        death.addKnocked(player);
    },
};
