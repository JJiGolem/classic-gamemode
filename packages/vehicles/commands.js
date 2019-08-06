var vehicles = require('./index.js');
module.exports = {
    access: 6,
    "/setlic": { // temp
        handler: (player, args) => {
            player.license = args[0];
        }
    },
    "/resp": { // temp
        access: 6,
        handler: (player, args) => {
            if (player.vehicle) {
                player.removeFromVehicle();
                vehicles.respawnVehicle(player.vehicle);
            }
        }
    },
    "/fuel": { // temp 
        access: 6,
        handler: (player, args) => {
            player.call('chat.message.push', [`!{#ffffff} ${player.vehicle.fuel}`]);
        }
    },
    "/setfuel": {
        access: 4,
        description: "Установить топливо транспорту",
        args: `[литры]`,
        handler: (player, args) => {
            if (!player.vehicle) return;
            vehicles.setFuel(player.vehicle, parseInt(args[0]));
        }
    },
    "/ex": {
        access: 6,
        handler: (player, args) => {
            if (!player.vehicle) return;
            player.vehicle.explode();
        }
    },
    "/carpass": {
        access: 6,
        handler: (player, args) => {
            if (!player.vehicle) return;
            let vehicle = player.vehicle;
            let data = {
                id: 3940123342,
                vehType: "Автомобиль",
                name: vehicle.properties.name,
                regDate: "06 Дек 2012",
                price: 111111,
                owners: 1,
                number: vehicle.plate
            }
            player.call('documents.show', ['carPass', data]);
        }
    },
    "/setveh": {
        access: 5,
        description: "Установить транспорт для новичков/фракции/работы",
        args: `["newbie"/"job"/"faction"] [id фракции/работы]`,
        handler: async (player, args) => {

            if ((args[0] != "newbie") && (args[0] != "job") && (args[0] != "faction")) return player.call('notifications.push.error', ['Неверный синтаксис', 'Ошибка']);

            if (!args[1] && args[0] != "newbie") return player.call('notifications.push.error', ['Неверный синтаксис', 'Ошибка']);
            if (!player.vehicle) return player.call('notifications.push.error', ['Вы должны быть в транспорте', 'Ошибка']);

            if (player.vehicle.key == "private") return player.call('notifications.push.error', ['Это личный транспорт', 'Ошибка']);

            let veh = player.vehicle;

            if (args[0] == "newbie") {
                args[1] = 0;
                veh.license = 0;
            }
            if (veh.sqlId) { /// Если автомобиль уже загружен из БД, то обновляем его
                await veh.db.update({
                    key: args[0],
                    owner: args[1],
                    modelName: veh.modelName,
                    color1: veh.color1,
                    color2: veh.color2,
                    x: veh.position.x,
                    y: veh.position.y,
                    z: veh.position.z,
                    h: veh.heading,
                    plate: veh.plate,
                    fuel: veh.properties.maxFuel*0.7
                });
            } else {
                var data = await db.Models.Vehicle.create({ /// Если автомобиля нет в БД, то создаем запись в БД 
                    key: args[0],
                    owner: args[1],
                    modelName: veh.modelName,
                    color1: veh.color1,
                    color2: veh.color2,
                    x: veh.position.x,
                    y: veh.position.y,
                    z: veh.position.z,
                    h: veh.heading,
                    license: veh.license,
                    plate: veh.plate,
                    fuel: veh.properties.maxFuel*0.7
                });
                veh.sqlId = data.id;
                veh.db = data;
            }
            veh.key = args[0];
            veh.owner = args[1];
            veh.x = veh.position.x;
            veh.y = veh.position.y;
            veh.z = veh.position.z;
            veh.h = veh.heading;

            switch (args[0]) {
                case "newbie":
                    mp.players.forEach((current) => { //TODO проверка на адм
                        current.call('chat.message.push', [`!{#f0ff9e}[A] ${player.name} создал/обновил транспорт для новичков`]);
                    });
                    break;
                case "faction":
                    mp.players.forEach((current) => { //TODO проверка на адм
                        current.call('chat.message.push', [`!{#f0ff9e}[A] ${player.name} создал/обновил транспорт для фракции с ID ${args[1]}`]);
                    });
                    break;
                case "job":
                    mp.players.forEach((current) => { //TODO проверка на адм
                        current.call('chat.message.push', [`!{#f0ff9e}[A] ${player.name} создал/обновил транспорт для работы с ID ${args[1]}`]);
                    });
                    break;
            }
        }
    },
    "/fuelstate": {
        access: 6,
        handler: (player, args) => {
            if (!player.vehicle) return;
            player.vehicle.fuelState = parseInt(args[0]);
            player.call('chat.message.push', [`!{#ffffff} установили топливную поломку ${args[0]}`]);
        }
    },
    "/date": {
        access: 6,
        handler: (player, args) => {
            if (!player.vehicle) return;
            let now = new Date();
            player.vehicle.db.update({
                regDate: now
            });
        }
    }
}