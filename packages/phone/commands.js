"use strict";
module.exports = {
    "/buyphone": {
        access: 1,
        description: "Покупка телефона",
        args: "",
        handler: (player, args) => {
            mp.events.call("phone.buy", player);
        }
    },
}