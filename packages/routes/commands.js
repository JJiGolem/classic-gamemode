let notifs = call('notifications');
let routes = call('routes');

module.exports = {
    "/rtest": {
        access: 6,
        description: "Начать тестовый маршрут",
        args: "",
        handler: (player, args, out) => {
            var points = [player.position, player.position];
            points[0].x += 2;
            points[0].z -= 1;
            points[1].y += 2;
            points[1].z -= 1;
            routes.start(player, routes.defaultCheckpointData, points, () => {
                // срабатывает при каждом enter на чекпоинт
                if (player.vehicle) {
                    notifs.error(player, "Недоступно в авто!")
                    return false;
                }
                return true;
            }, () => {
                notifs.success(player, `Маршрут завершен!`);
            });
        }
    },
}
