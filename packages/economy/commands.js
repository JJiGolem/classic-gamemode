"use strict";

let economy = require('./index.js');
let notifs = call("notifications");

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
                let info = economy.getByModuleName(args[0]);
                if (info.length == 0) return notifs != null && notifs.error(player, "Такого модуля не существует", "Ошибка");
                player.call('economy.show', [JSON.stringify(info)]);
            }
        }
    },
}