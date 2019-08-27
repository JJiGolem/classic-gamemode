let bus = require('./index.js');
// let money = call('money');
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
    }
}