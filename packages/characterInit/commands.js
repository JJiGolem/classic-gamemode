let init = require('./index.js');

module.exports = {
    '/sclothes': {
        args: '',
        description: 'Выдача стартовой одежды',
        access: 6,
        handler: (player, args) => {
            init.setStartClothes(player);
        }
    }
}