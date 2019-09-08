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
            routes.start(player, points, () => {
                notifs.success(player, `Маршрут завершен!`);
            });
        }
    },
}
