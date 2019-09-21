let bizService = require('./index.js');
module.exports = {
    "/biztest": {
        access: 6,
        handler: (player, args) => {
            console.log(bizService.rentPerDayMult);
        }
    },
    "/createbiz": {
        access: 6,
        description: "Создать бизнес",
        args: "[name]:s [price]:n [type]:n",
        handler: (player, args) => {
            bizService.createBiz(args[0], parseInt(args[1]), parseInt(args[2]), player.position);
        }
    },
    /// тп к бизу
}

