"use strict";

let routes = call('routes');

module.exports = {
    "init": () => {
        inited(__dirname);
    },
    "routes.points.next": (player) => {
        routes.next(player);
    },
}
