var carshow = require('./index.js');
module.exports = {
    "/buy": {
        handler: (player, args) => {
            mp.events.call('carshow.car.buy', player, args[0]);
        }
    },
    "/cs": {
        handler: (player, args) => {
            player.spawn(new mp.Vector3(-57.056705474853516, -1097.54443359375, 26.422353744506836));
        }
    }
}