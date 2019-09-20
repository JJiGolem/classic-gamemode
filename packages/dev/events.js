"use strict";

let dev = call('dev');

module.exports = {
    "init": () => {
        dev.init();
    },
    "characterInit.done": (player) => {
        if (!dev.showBuild) return;

        player.call(`hud.setData`, [{
            build: dev.getBuild()
        }]);
    },
}
