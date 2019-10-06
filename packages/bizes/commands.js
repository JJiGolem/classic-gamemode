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
        handler: (player, args, out) => {
            let biz = bizService.getBizByPlayerPos(player);
            if (biz == null) {
                return out.error("Подойдите ближе к бизнесу", player);
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
        handler: (player, args, out) => {
            let biz = bizService.getBizByPlayerPos(player);
            if (biz == null) {
                return out.error("Подойдите ближе к бизнесу", player);
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
        handler: (player, args, out) => {
            let biz = bizService.getBizByPlayerPos(player);
            if (biz == null) {
                return out.error("Подойдите ближе к бизнесу", player);
            }
            else {
                return out.info("Вы находитесь у бизнеса с id " + biz.info.id, player);
            } 
        }
    },
    "/setbizprod": {
        access: 6,
        description: "Установить кол-во ресурсов бизнеса",
        args: "[id]:n [amount]:n",
        handler: (player, args, out) => {
            let biz = bizService.getBizById(args[0]);
            if (biz == null) {
                return out.error("Бизнеса с таким id не существует", player);
            }
            biz.info.productsCount = args[1];
            biz.info.save();
        }
    },
    "/fillbizprod": {
        access: 6,
        description: "Заполнить склад всем бизнесам",
        args: "",
        handler: (player, args) => {
            bizService.fillAllBizesProducts();
        }
    },
    "/setbiztypemaxprod": {
        access: 6,
        description: "Установить размер склада всем бизнесам заданного типа",
        args: "[type]:n [amount]:n",
        handler: (player, args) => {
            bizService.setBizesTypeMaxProducts(args[0], args[1]);
        }
    },
    "/getbizinfo": {
        access: 6,
        description: "Получить информацию о бизнесе по id",
        args: "[id]:n",
        handler: (player, args, out) => {
            let biz = bizService.getBizById(args[0]);
            if (biz == null) {
                out.error("Бизнеса с таким id не существует", player);
            }
            else {
                out.info("Информация о бизнесе #" + biz.info.id, player);
                let object = JSON.parse(JSON.stringify(biz.info));
                for (const key in object) {
                    if (!["x", "y", "z", "id", "BizStatistics"].includes(key)) {
                        const element = object[key];
                        out.info(`${key}: ${element}`, player);
                    }
                }
            } 
        }
    },
}

