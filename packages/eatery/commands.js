let eatery = require('./index.js');

module.exports = {
    "/addeatery": {
        access: 6,
        args: '[тип]',
        handler: async (player, args, out) => {
            let shop = await db.Models.Eatery.create({
                x: player.position.x,
                y: player.position.y,
                z: player.position.z - 1.3,
                bType: parseInt(args[0])
            });
            eatery.createEatery(shop);
            eatery.addShopToList(shop);
            out.info('Закусочная создана', player);
        }
    }
}