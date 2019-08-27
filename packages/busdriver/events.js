let bus = require('./index.js');
// let money = call('money');
// let vehicles = call('vehicles');

module.exports = {
    "init": () => {
        bus.init();

        // let busRoutes = await db.Models.BusRoute.findAll({
        //     include: [{ model: db.Models.BusRoutePoint }]
        // });
        // console.log(busRoutes)
    },
    "busdriver.employment": (player) => {
        if (player.character.job == 3) {
            mp.events.call("jobs.leave", player);
        } else {
            if (!player.character.passengerLicense) return player.call('notifications.push.error', ['У вас нет прав на пассажирский транспорт', 'Автобусная станция'])
            mp.events.call("jobs.set", player, 3);
        }
    },
}