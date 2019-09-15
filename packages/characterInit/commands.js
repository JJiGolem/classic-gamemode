let init = require('./index.js');

module.exports = {
    '/sclothes': {
        args: '',
        access: 6,
        handler: (player, args) => {
            init.setStartClothes(player);
        }
    }
}