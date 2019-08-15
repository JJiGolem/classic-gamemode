var taxi = require('./index.js');
// var money = call('money');
// var vehicles = call('vehicles');


module.exports = {
    "init": () => {
        taxi.init();
    },
    "playerEnterColshape": (player, shape) => {
        if (!player.character) return;

        if (shape.isTaxiStation) {
            player.call('chat.message.push', [`!{#ffffff}${player.name} зашел в колшейп taxi`]);
            if (player.character.job == 2) {
                player.call('taxi.jobmenu.show', [1]);
            } else {
                player.call('taxi.jobmenu.show', [0]);
            }
            
            player.currentColshape = shape;
        }
    },
    "playerExitColshape": (player, shape) => {
        if (!player.character) return;

        if (shape.isTaxiStation) {
            player.call('chat.message.push', [`!{#ffffff}${player.name} вышел с колшейпа taxi`]);
            player.call('taxi.jobmenu.close');
            player.currentColshape = null;
        }
    },
    "taxi.employment": (player) => {
        if (player.character.job == 2) {
            mp.events.call("jobs.leave", player);
        } else {
            mp.events.call("jobs.set", player, 2);
        }
    },
}