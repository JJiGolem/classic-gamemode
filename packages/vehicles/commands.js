var vehicles = require('./index.js');
module.exports = {
    "/resp": {
        access: 6,
        description: "Зареспавнить авто",
        args: ``,
        handler: (player, args) => {
            if (player.vehicle) {
                player.removeFromVehicle();
                vehicles.respawnVehicle(player.vehicle);
            }
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
        description: "Взорвать авто",
        args: ``,
        handler: (player, args) => {
            if (!player.vehicle) return;
            player.vehicle.explode();
        }
    },
    "/setveh": {
        access: 5,
        description: "Установить транспорт для новичков/фракции/работы/фермы",
        args: `["newbie"/"job"/"faction"/"farm"] [id фракции/работы/фермы]`,
        handler: async (player, args) => {

            if ((args[0] != "newbie") && (args[0] != "job") && (args[0] != "faction") && (args[0] != "farm")) return player.call('notifications.push.error', ['Неверный синтаксис', 'Ошибка']);

            if (!args[1] && args[0] != "newbie") return player.call('notifications.push.error', ['Неверный синтаксис', 'Ошибка']);
            if (!player.vehicle) return player.call('notifications.push.error', ['Вы должны быть в транспорте', 'Ошибка']);

            if (player.vehicle.key == "private") return player.call('notifications.push.error', ['Это личный транспорт', 'Ошибка']);

            let veh = player.vehicle;

            if (args[0] == "newbie") {
                args[1] = 0;
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
                    fuel: veh.properties.maxFuel * 0.7
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
                    plate: veh.plate,
                    fuel: veh.properties.maxFuel * 0.7
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
                    mp.events.call('admin.notify.all', `!{#f0ff9e}[A] ${player.name} создал/обновил транспорт для новичков`);
                    break;
                case "faction":
                    mp.events.call('admin.notify.all', `!{#f0ff9e}[A] ${player.name} создал/обновил транспорт для фракции с ID ${args[1]}`);
                    break;
                case "job":
                    mp.events.call('admin.notify.all', `!{#f0ff9e}[A] ${player.name} создал/обновил транспорт для работы с ID ${args[1]}`);
                    break;
                case "farm":
                    mp.events.call('admin.notify.all', `!{#f0ff9e}[A] ${player.name} создал/обновил транспорт для фермы с ID ${args[1]}`);
                    break;
            }
        }
    },
    "/setcolor": {
        access: 4,
        description: "Изменить цвет транспорта",
        args: `[цвет 1] [цвет 2]`,
        handler: async (player, args, out) => {

            if (!player.vehicle) return player.call('notifications.push.error', ['Вы должны быть в транспорте', 'Ошибка']);
            if (player.vehicle.key == "private") return player.call('notifications.push.error', ['Это личный транспорт', 'Ошибка']);

            let veh = player.vehicle;
            let color1 = parseInt(args[0]);
            let color2 = parseInt(args[1]);
            veh.setColor(color1, color2);
            veh.color1 = color1;
            veh.color2 = color2;
            if (veh.db) { /// Если автомобиль уже загружен из БД, то обновляем его
                await veh.db.update({
                    color1: color1,
                    color2: color2
                });
                out.info(`${player.name} обновил цвет у т/с №${veh.db.id}`);
            } else {
                out.info('Цвет изменен', player);
            }

        }
    },
    "/delveh": {
        access: 5,
        description: "Удалить транспорт из БД",
        args: ``,
        handler: async (player, args, out) => {
            let veh = player.vehicle;
            if (!veh) return out.error('Вы не в авто!', player);
            clearTimeout(veh.fuelTimer);
            if (!veh.db || veh.key == 'admin') {
                veh.destroy();
                out.info('Автомобиль удален, но его нет в БД', player);
                return;
            }
            try {
                await veh.db.destroy();
                veh.destroy()
                out.info('Автомобиль удален', player);
            } catch (err) {
                console.log(err);
            }

        },
    },
}
