var carservice = require('./index.js');
module.exports = {
    "/se": {
        access: 6,
        handler: (player, args) => {
            player.spawn(new mp.Vector3(534.1243286132812, -185.2374725341797, 54.19009017944336));
        }
    },
    "/se2": {
        access: 6,
        handler: (player, args) => {
            player.spawn(new mp.Vector3(488.8618469238281, -1318.204467773437, 29.219741821289062));
        }
    },
    "/se3": {
        access: 6,
        handler: (player, args) => {
            player.spawn(new mp.Vector3(-227.66944885253906, -1378.9010009765625, 31.258222579956055));
        }
    }
}

