"use strict";

module.exports = {
    // Настройки чекпоинта по-умолчанию
    defaultCheckpointData: {
        type: 1,
        position: null,
        scale: 1,
        direction: null,
        color: [255, 255, 255, 100],
        isMarker: false,
    },
    // Настройки чекпоинта
    // checkpointData: {
    //     type: 1,
    //     position: null,
    //     scale: 1,
    //     direction: null,
    //     color: [255, 255, 255, 100],
    //     isMarker: false,
    // },


    start(player, data, points, valid, end) {
        player.route = {
            i: 0,
            points: points,
            valid: valid,
            end: end,
            checkpointData: (data)? data : Object.assign({}, this.defaultCheckpointData)
        };
        player.route.checkpointData.position = points[0];
        player.route.checkpointData.direction = points[1];
        player.call(`routes.checkpoint.create`, [player.route.checkpointData]);
    },
    next(player) {
        if (!player.route) return;
        if (!player.route.valid()) return;
        if (player.route.i >= player.route.points.length - 1) return this.stop(player);
        player.route.i++;
        player.route.checkpointData.position = player.route.points[player.route.i];
        player.route.checkpointData.direction = player.route.points[player.route.i + 1] || null;
        player.call(`routes.checkpoint.create`, [player.route.checkpointData]);
    },
    stop(player) {
        player.call(`routes.checkpoints.destroy`);
        player.route.end();
        delete player.route;
    },
};
