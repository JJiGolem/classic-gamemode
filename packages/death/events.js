let death = call('death');
let factions = call('factions');
let notifs = call('notifications');

module.exports = {
    "init": () => {
        inited(__dirname);
    },
    "death.wait": (player) => {
        player.spawn(player.position);
        player.health = death.health;
        if (player.cellArrestDate || player.jailArrestDate) return;
        player.setVariable("knocked", true);
        mp.events.call(`mapCase.ems.calls.add`, player, `Ранение`);
    },
    "death.spawn": (player) => {
        if (player.cellArrestDate || player.jailArrestDate) {
            player.spawn(player.position);
            player.health = 10;
            return;
        }
        var hospitalPos = factions.getMarker(5).position;
        player.spawn(hospitalPos);
        player.health = 10;
        player.setVariable("knocked", false);
        mp.events.call(`mapCase.ems.calls.remove`, player, player.character.id);
    },
    "playerDeath": (player, reason, killer) => {

    },
};
