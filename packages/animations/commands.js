module.exports = {
    "/anim": {
        access: 6,
        handler: (player, args) => {
            console.log(args);
            //mp.events.call('animations.play', player, args[0], args[1], 1, parseInt(args[3]));
            player.playAnimation(args[0], args[1], 1, 49);
            //player.playAnimation('mp_arresting', 'idle', 1, 49)
        }
    },
    "/stopanim": {
        access: 6,
        handler: (player, args) => {
            mp.events.call('animations.stop', player);
        }
    }
}