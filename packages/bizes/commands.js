let bizService = require('./index.js');
let notifications = call('notifications');

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
            let biz = bizService.getBizByPlayerPos(player);
            if (biz == null) {
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
            let biz = bizService.getBizByPlayerPos(player);
            if (biz == null) {
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
    "/getbizid": {
        access: 1,
        description: "Получить id бизнеса в колшейпе которого находится игрок",
        args: "",
        handler: (player, args) => {
            if (notifications != null) {
                let biz = bizService.getBizByPlayerPos(player);
                if (biz == null) {
                    return notifications.error(player, "Подойдите ближе к бизнесу", "Ошибка");
                }
                else {
                    return notifications.info(player, "Вы находитесь у бизнеса с id " + biz.info.id, "Бизнес");
                } 
            }
        }
    },
    "/setbizprod": {
        access: 6,
        description: "Установить кол-во ресурсов бизнеса",
        args: "[id]:n [amount]:n",
        handler: (player, args) => {
            let biz = bizService.getBizById(player);
            if (biz == null) {
                if (notifications != null) notifications.error(player, "Бизнеса с таким id не существует", "Ошибка");
                return;
            }
        }
    },
    "/fillbizprod": {
        access: 6,
        description: "Установить максимальное ол-во ресурсов всем бизнесам",
        args: "",
        handler: (player, args) => {
            let biz = bizService.getBizByPlayerPos(player);
            if (biz == null) {
                if (notifications != null) notifications.error(player, "Подойдите ближе к бизнесу", "Ошибка");
                return;
            }
        }
    },
    "/setbiztypemaxprod": {
        access: 6,
        description: "Установить максимальное ол-во ресурсов всем бизнесам",
        args: "[type]:n [amount]:n",
        handler: (player, args) => {
            let biz = bizService.getBizByPlayerPos(player);
            if (biz == null) {
                if (notifications != null) notifications.error(player, "Подойдите ближе к бизнесу", "Ошибка");
                return;
            }
        }
    },
}

