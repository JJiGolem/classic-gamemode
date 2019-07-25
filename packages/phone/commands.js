"use strict";
module.exports = {
    "/buyphone": {
        access: 6,
        description: "Покупка телефона",
        args: "",
        handler: (player, args) => {
            mp.events.call("phone.buy", player);
        }
    },
}