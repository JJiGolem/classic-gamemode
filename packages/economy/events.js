"use strict";

let economy = require('./index.js');
let notifs = call('notifications');
let fs = require('fs');

module.exports = {
    "init": () => {
        economy.init();
    },
    "economy.change": (player, data) => {
        data = JSON.parse(data);
        data.forEach(element => {
            element.count = parseFloat(element.count);
            if (isNaN(element.count)) return notifs.error(player, "Один из экономических показателей не float", "Ошибка");;
        });
        economy.setByType(data);
        notifs.success(player, "Успешно обновлено", "Успешно");
    },
}