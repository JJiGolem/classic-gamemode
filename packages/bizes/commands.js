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
    "/updatebiz": {
        access: 6,
        description: "Обновить информацию о бизнесе",
        args: "[name]:s [price]:n [type]:n",
        handler: (player, args) => {
            let biz = getBizByPlayerPos(player);
            if (biz == null) {
                let notifications = call('notifications');
                if (notifications != null) notifications.error(player, "Подойдите ближе к бизнесу", "Ошибка");
                return;
            }
            biz.info.name = args[0];
            biz.info.price = parseInt(args[1]);
            biz.info.type = parseInt(args[2]);
            biz.info.save();
        }
    },
    "/setbizfaction": {
        access: 5,
        description: "Установить влияние мафии на бизнес",
        args: "[factionId]:n",
        handler: (player, args) => {
            let biz = getBizByPlayerPos(player);
            if (biz == null) {
                let notifications = call('notifications');
                if (notifications != null) notifications.error(player, "Подойдите ближе к бизнесу", "Ошибка");
                return;
            }
            biz.info.factionId = parseInt(args[1]);
        }
    },
    "/gotobiz": {
        access: 1,
        description: "Перейти к бизнесу",
        args: "[id]:n",
        handler: (player, args) => {
            let position = bizService.getBizPosition(parseInt(args[0]));
            if (position) player.position = position;
        }
    },
}

