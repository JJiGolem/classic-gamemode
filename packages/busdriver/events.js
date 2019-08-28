let bus = require('./index.js');
let money = call('money');
// let vehicles = call('vehicles');

module.exports = {
    "init": () => {
        bus.init();
    },
    "busdriver.employment": (player) => {
        if (player.character.job == 3) {
            mp.events.call("jobs.leave", player);
        } else {
            if (!player.character.passengerLicense) return player.call('notifications.push.error', ['У вас нет прав на пассажирский транспорт', 'Автобусная станция'])
            mp.events.call("jobs.set", player, 3);
        }
    },
    "busdriver.route.add": async (player, data) => {
        data = JSON.parse(data);
        console.log(data);
        let route = await db.Models.BusRoute.create({
            name: data.name,
            level: data.level,
            salary: data.salary
        });
        console.log(route.id);
        data.points.forEach((current) => {
             db.Models.BusRoutePoint.create({
                routeId: route.id,
                x: current.x,
                y: current.y,
                z: current.z,
                isStop: current.isStop
            });
        });
        player.call('notifications.push.success', ['Маршрут создан', 'Route Creator']);
    },
    "vehicle.ready": (player, vehicle, seat) => {
        if (vehicle.key == 'job' && vehicle.owner == 3 && seat == -1) {
            console.log(`${player.name} сел в автобус ${vehicle.id} таксистом`);
            if (!vehicle.isActiveBus) {
                player.call('busdriver.rent.show', [bus.getRentPrice()]);
            } else {
                if (vehicle.busDriverId != player.id) {
                    player.call('notifications.push.error', ['Транспорт уже арендован', 'Автобус']);
                    player.removeFromVehicle();
                }
            }
        }
    },
    "busdriver.rent.accept": (player, accept) => {
        if (!accept || !player.vehicle) {
            player.call('busdriver.rent.ans', [4]);
            if (player.vehicle) player.removeFromVehicle();
            return;
        }
        let vehicle = player.vehicle;
        if (vehicle.key != 'job' || vehicle.owner != 3) {
            player.call('busdriver.rent.ans', [3]);
            return;
        }

        let price = bus.getRentPrice();
        if (player.character.cash < price) {
            player.call('busdriver.rent.ans', [2]);
            if (player.vehicle) player.removeFromVehicle();
            return;
        }

        money.removeCash(player, price, function (result) {
            if (result) {
                vehicle.isActiveBus = true;
                vehicle.busDriverId = player.id;
                let data = [{
                    id: '5',
                    name: 'Пригородный Лос-Сантос'
                },
                {
                    id: '11',
                    name: 'Лос-Сантос - Палето-Бэй'
                }
            ]
                player.call('busdriver.rent.ans', [0, data]);
            } else {
                player.call('busdriver.rent.ans', [1]);
                if (player.vehicle) player.removeFromVehicle();
            }
        });

    },
}