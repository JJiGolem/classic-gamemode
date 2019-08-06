module.exports = {
    "/anim": {
        access: 6,
        handler: (player, args) => {
            mp.events.call('animations.play', player, args[0], args[1], args[2], args[3]);
        }
    },
    "/stopanim": {
        access: 6,
        handler: (player, args) => {
            mp.events.call('animations.stop', player);
        }
    }
}