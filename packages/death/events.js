let death = call('death');
let notifs = call('notifications');

module.exports = {
    "init": () => {

    },
    "death.wait": (player) => {
        player.spawn(player.position);
        player.health = 1;
        player.setVariable("knocked", true);
    },
    "death.spawn": (player) => {
        // TODO: спавн в больнице
        player.spawn(player.position);
        player.health = 10;
        player.setVariable("knocked", false);
    },
    "playerDeath": (player, reason, killer) => {

    },
};
