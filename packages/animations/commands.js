module.exports = {
    "/anim": {
        handler: (player, args) => {
            mp.events.call('animations.play', player, args[0], args[1], args[2], args[3]);
        }
    },
    "/stopanim": {
        handler: (player, args) => {
            mp.events.call('animations.stop', player);
        }
    }
}