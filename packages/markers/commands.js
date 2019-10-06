let markers = call('markers');

module.exports = {
    "/tpmarkadd": {
        description: "Добавить маркер для телепорта (необходимо указать координаты конечного маркера).",
        access: 3,
        args: "[x]:n [y]:n [z]:n [h]:n",
        handler: (player, args, out) => {
            var posA = player.position;
            posA.z--;
            posA.h = player.heading;

            var posB = new mp.Vector3(args[0], args[1], args[2] - 1);
            posB.h = args[3];

            if (player.dist(posB) < 5) return out.error(`Маркеры расположены слишком близко`, player);

            markers.addTpMarker(posA, posB);
            out.info(`${player.name} добавил ТП-маркер ${JSON.stringify(posA)} => ${JSON.stringify(posB)}`);
        }
    },
    "/tpmarkdel": {
        description: "Удалить маркер для телепорта.",
        access: 3,
        args: "",
        handler: (player, args, out) => {
            var marker = markers.getNearTpMarker(player.position);
            if (!marker) return out.error(`Маркер поблизости не найден`, player);

            markers.removeTpMarker(marker.id);
            out.info(`${player.name} удалил ТП-маркер #${marker.db.id}`);
        }
    },
}
