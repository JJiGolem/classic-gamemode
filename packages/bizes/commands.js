let bizService = require('./index.js');
module.exports = {
    "/createbiz": {
        access: 6,
        description: "Создать бизнес",
        args: "[name]:s [price]:n [type]:n",
        handler: (player, args) => {
            bizService.createBiz(args[0], parseInt(args[1]), parseInt(args[2]), player.position);
        }
    },
    "/gotobiz": {
        access: 6,
        description: "Перейти к бизнесу",
        args: "[id]:n",
        handler: (player, args) => {
            let position = bizService.getBizPosition(parseInt(args[0]));
            if (position) player.position = position;
        }
    },
    "/bizeconomy": {
        access: 6,
        description: "Изменить экономические показатели",
        args: "",
        handler: (player, args) => {
            
        }
    },
}

