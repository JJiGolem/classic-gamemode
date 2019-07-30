"use strict";

module.exports = {
    init() {

    },
    playAnimation(player, dict, name, speed, flag) {
        player.playAnimation(dict, name, speed, flag);
    },
    stopAnimation(player) {
        player.stopAnimation();
    }
}