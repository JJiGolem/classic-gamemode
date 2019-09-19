"use strict";

let economy = require('./index.js');

module.exports = {
    "/economy": {
        access: 6,
        description: "Посмотреть все экономические факторы",
        args: "",
        handler: (player, args) => {
            if (args[0] == null) {
                player.call('economy.show', [JSON.stringify(economy.getAll())]);
            }
            else {
                player.call('economy.show', [JSON.stringify(economy.getByModuleName(args[0]))]);
            }
        }
    },
}