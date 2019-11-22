let rent = require('./index.js');

module.exports = {
    "/addrentpoint": {
        access: 6,
        args: '[blip]:n [blip_color]:n [name]:s',
        handler: async (player, args) => {
            let blip = args[0];
            let color = args[1];
            args.splice(0, 2);
            let name = args.join(' ');
            let point = await db.Models.RentPoint.create({
                x: player.position.x, 
                y: player.position.y,
                z: player.position.z,
                blip: blip,
                blipColor: color,
                name: name
            });
            rent.createRentPoint(point);
        }
    }
}
