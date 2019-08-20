let police = require('./index');

module.exports = {
    "/pcuffs": {
        access: 6,
        description: "Надеть/снять наручники.",
        args: "[ид_игрока]:n",
        handler: (player, args, out) => {
            mp.events.call(`police.cuffs`, player, args[0]);
        }
    },
    "/pfollow": {
        access: 6,
        description: "Вести игрока за собой.",
        args: "[ид_игрока]:n",
        handler: (player, args, out) => {
            mp.events.call(`police.follow`, player, args[0]);
        }
    },
}
