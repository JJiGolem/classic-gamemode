let farms = call('farms');
let notifs = call('notifications');

module.exports = {
    "/farmtp": {
        access: 2,
        description: "Телепортироваться к ферме.",
        args: "[ид_фермы]:n",
        handler: (player, args, out) => {
            var marker = farms.getMarker(args[0]);
            if (!marker) return out.error(`Ферма #${args[0]} не найдена`, player);
            var pos = marker.position;
            pos.z += 2;
            player.position = pos;
            out.info(`Вы телепортировались к ферме #${args[0]}`, player);
        }
    },
}
