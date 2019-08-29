"use strict";

module.exports = {
    "/savedb": {
        access: 6,
        description: "Сохранение БД",
        args: "",
        handler: (player, args) => {
            mp.events.call("serializer.save", player);
        }
    },
}