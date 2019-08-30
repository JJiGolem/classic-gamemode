var notifs = require('../notifications');
var fib = require('./index');

module.exports = {
    "/fspy": {
        access: 6,
        description: "Установить/снять просшуку.",
        args: "[ид_игрока]:n",
        handler: (player, args, out) => {
            mp.events.call(`fib.spy`, player, args[0]);
        }
    },
}
