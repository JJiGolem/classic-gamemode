"use strict";

let economy = require('./index.js');
let notifs = call('notifications');
let fs = require('fs');

module.exports = {
    "init": () => {
        economy.init();
    },
    "economy.change": (player, data) => {
        economy.setByType(JSON.parse(data));
        notifs != null && notifs.success(player, "Успешно обновлено", "Успешно");
    },
}