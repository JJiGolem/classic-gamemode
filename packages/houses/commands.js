let houseService = require('./index.js');

module.exports = {
    "/gotohouse": {
        description: "Переместиться к дому",
        args: "[id]:n",
        access: 4,
        handler: (player, args) => {
            let house = houseService.getHouseById(args[0]);
            player.position = new mp.Vector3(house.spawnX, house.spawnY, house.spawnZ);
        }
    },
    "/houseadd": {
        description: "Создать дом",
        args: "",
        access: 5,
        handler: (player, args) => {
            player.call("house.add.open", []);
        }
    },
    "/housedrop": {
        description: "Продать дом",
        args: "[id]:n",
        access: 5,
        handler: (player, args) => {
            if (isNaN(parseInt(args[0]))) return;
            houseService.dropHouseById(parseInt(args[0]), player);
        }
    },
    "/houseremove": {
        access: 5,
        handler: (player, args) => {
            if (isNaN(parseInt(args[0]))) return;
            houseService.removeHouse(parseInt(args[0]), player);
        }
    },
    "/housechangeprice": {
        description: "Обновить интерьер у дома",
        access: 5,
        args: "[id]:n [цена дома]:n",
        handler: (player, args) => {
            if (isNaN(parseInt(args[0])) || isNaN(parseInt(args[1]))) return;
            houseService.changePrice(parseInt(args[0]), parseInt(args[1]));
        }
    },
    "/interioradd": {
        description: "Добавить интерьер",
        args: "",
        access: 5,
        handler: (player, args) => {
            player.call("house.add.interior.open", []);
        }
    },
    "/garageadd": {
        description: "Добавить гараж",
        args: "",
        access: 5,
        handler: (player, args) => {
            player.call("house.add.garage.open", []);
        }
    },
    "/housechangeint": {
        description: "Обновить интерьер у дома",
        access: 5,
        args: "[id]:n [interiorId]:n",
        handler: (player, args, out) => {
            if (isNaN(parseInt(args[0])) || isNaN(parseInt(args[1]))) return;
            houseService.changeInterior(parseInt(args[0]), parseInt(args[1]));
        }
    },
}
