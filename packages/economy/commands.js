"use strict";

let economy = require('./index.js');

module.exports = {
    "/economy": {
        access: 6,
        description: "Посмотреть все экономические факторы",
        args: "",
        handler: (player, args) => {
            player.call('economy.show', [JSON.stringify(economy.getAll())]);
        }
    },
    "/ecfactoradd": {
        access: 6,
        description: "Добавить экономический фактор",
        args: "[Тип]:s [Название]:s [Значение]:n",
        handler: (player, args) => {
            economy.create(args[0], args[1], args[2]);
        }
    },
}