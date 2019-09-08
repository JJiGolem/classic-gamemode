"use strict";

let routes = call('routes');

module.exports = {
    "init": () => {

    },
    "routes.points.next": (player) => {
        routes.next(player);
    },
}
