"use strict";

// При сохранении/загрузке отдельной таблицы указывать название в единственном числе, как модель (House, PhoneContact)

module.exports = {
    "/savedb": {
        access: 6,
        description: "Сохранение всей БД",
        args: "",
        handler: (player, args) => {
            mp.events.call("serializer.save.all", player);
        }
    },
    "/savetable": {
        access: 6,
        description: "Сохранение выбранной таблицы БД", // "/savetable House"
        args: "",
        handler: (player, args) => {
            mp.events.call("serializer.save.table", player, args[0]);
        }
    },
    "/cltable": {
        access: 6,
        description: "Очищение выбранной таблицы БД",
        args: "",
        handler: (player, args) => {
            mp.events.call("serializer.clear.table", player, args[0]);
        }
    },
    "/loadtable": {
        access: 6,
        description: "Перезапись выбранной таблицы БД",
        args: "",
        handler: (player, args) => {
            mp.events.call("serializer.load.table", player, args[0]);
        }
    },
    "/cleardir": {
        access: 6,
        description: "Очистить директорию с сохраненными файлами json",
        args: "",
        handler: (player) => {
            mp.events.call("serializer.clear.files", player);
        }
    }
}