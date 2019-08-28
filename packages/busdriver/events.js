let bus = require('./index.js');
let money = call('money');
// let vehicles = call('vehicles');
let notify = call('notifications');

module.exports = {
    "init": () => {
        bus.init();
    },
    "busdriver.employment": (player) => {
        if (player.character.job == 3) {
            mp.events.call("jobs.leave", player);
        } else {
            if (!player.character.passengerLicense) return notify.error(player, 'У вас нет прав на пассажирский транспорт', 'Автобусная станция');
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
        notify.success(player, 'Маршрут создан', 'Route Creator');
    },
    "vehicle.ready": (player, vehicle, seat) => {
        if (vehicle.key == 'job' && vehicle.owner == 3 && seat == -1) {
            console.log(`${player.name} сел в автобус ${vehicle.id} таксистом`);
            if (!vehicle.isActiveBus) {
                player.call('busdriver.rent.show', [bus.getRentPrice()]);
            } else {
                if (vehicle.busDriverId != player.id) {
                    notify.error(player, 'Транспорт уже арендован', 'Автобус');
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
                    let routes = bus.getAvailiableRoutes(player);
                    //console.log(routes);
                    if (routes.length == 0) notify.warning(player, 'Нет доступных маршрутов', 'Автобус');
                    player.call('busdriver.rent.ans', [0, routes]);

            } else {
                player.call('busdriver.rent.ans', [1]);
                if (player.vehicle) player.removeFromVehicle();
            }
        });

    },
    "busdriver.route.start": (player, routeId, price) => {
        if (!player.vehicle || !player.vehicle.isActiveBus) return player.call('busdriver.route.start.ans', [0]);
        let route = bus.getRouteById(routeId);
        player.vehicle.hasBusRoute = true;
        player.busRoute = route;
        player.busPointIndex = 0;
        player.busPoints = route.BusRoutePoints.map(function(current) {
            return {
                x: current.x,
                y: current.y,
                z: current.z,
                isStop: current.isStop
            }
        })
        console.log(player.busPoints);
        let label = (price == 0) ? `~y~${player.busRoute.name} \n~g~Проезд бесплатный` : `~y~${player.busRoute.name} \n ~w~Стоимость проезда: ~g~$${price}`;
        player.vehicle.setVariable('label', label);
        player.call('busdriver.route.start.ans', [1, player.busPoints[0]]);
    },
    "busdriver.menu.closed": (player) => {
        if (player.vehicle) player.removeFromVehicle();
    },
    "playerEnterVehicle": (player, vehicle, seat) => {
        if (seat == -1 && vehicle.busDriverId == player.id && !vehicle.hasBusRoute) {
            let routes = bus.getAvailiableRoutes(player);
            if (routes.length == 0) notify.warning(player, 'Нет доступных маршрутов', 'Автобус');
            player.call('busdriver.menu.show', [routes]);
        }
    },
    "playerExitVehicle": (player, vehicle) => {
        if (vehicle.busDriverId == player.id && !vehicle.hasBusRoute && vehicle.isActiveBus) {
            player.call('busdriver.menu.close');
        }
    },
    "busdriver.checkpoint.entered": (player) => {
        if (!player.vehicle) return;
        if (player.vehicle.busDriverId != player.id) return;
        player.busPoints[player.busPointIndex].isStop ? notify.info(player, 'Ожидайте пассажиров', 'Остановка') : notify.success(player, 'Продолжайте движение', 'Маршрут');
        player.busPointIndex++;
        if (player.busPointIndex == player.busPoints.length) player.busPointIndex = 0;
        let point = player.busPoints[player.busPointIndex];
        player.call('busdriver.checkpoint.create', [point]);
    }
}