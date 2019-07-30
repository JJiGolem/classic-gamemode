var animations = require('./index.js');
module.exports = {
    "init": () => {
        animations.init();
    },
    "animations.play": (player, dict, name, speed, flag) => {
        animations.playAnimation(player, dict, name, speed, flag);
    },
    "animations.stop": (player) => {
        animations.stopAnimation(player);
    }
}