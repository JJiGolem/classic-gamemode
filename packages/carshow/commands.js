var carshow = require('./index.js');
module.exports = {
    "/buy": {
        access: 6,
        handler: (player, args) => {
            mp.events.call('carshow.car.buy', player, args[0]);
        }
    },
    "/cs": {
        access: 6,
        handler: (player, args) => {
            player.spawn(new mp.Vector3(-57.056705474853516, -1097.54443359375, 26.422353744506836));
        }
    },
    "/cs2": {
        access: 6,
        handler: (player, args) => {
            player.spawn(new mp.Vector3(-212.266357421875, 6216.1689453125, 31.49127960205078));
        }
    }
}