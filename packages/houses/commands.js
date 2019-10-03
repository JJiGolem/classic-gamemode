let houseService = require('./index.js');
module.exports = {
    "/ho": {
        access: 6,
        handler: (player, args) => {
            player.spawn(new mp.Vector3(-29.178926467895508, -1849.4302978515625, 25.81756591796875));
        }
    },
    "/houseadd": {
        access: 5,
        handler: (player, args) => {
            player.call("house.add.open", []);
        }
    },
    "/housedrop": {
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
        access: 5,
        handler: (player, args) => {
            if (isNaN(parseInt(args[0])) || isNaN(parseInt(args[1]))) return;
            houseService.changePrice(parseInt(args[0]), parseInt(args[1]));
        }
    },
    "/interioradd": {
        access: 5,
        handler: (player, args) => {
            player.call("house.add.interior.open", []);
        }
    },
    "/garageadd": {
        access: 5,
        handler: (player, args) => {
            player.call("house.add.garage.open", []);
        }
    },
}
