var vehicles = require('./index.js');
module.exports = {
    "/test": {
        access: 4,
        description: "",
        args: "",
        handler: (player, args) => {
            let testVeh = {
                sqlId: 123,
                model: "police",
                x: player.position.x,
                y: player.position.y,
                z: player.position.z,
                heading: player.heading,
                color1: 111,
                color2: 0,
                key: "faction",
                owner: "1"
            }
            vehicles.spawnVehicle(testVeh);
        }
    }
}