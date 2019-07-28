var carmarket = require('./index.js');
module.exports = {
    "init": () => {
        carmarket.init();
    },
    "playerEnterColshape": (player, shape) => {
        if (shape.isCarMarket) {
            player.call('carmarket.colshape.enter');
            if (!player.vehicle) {
                player.call('prompt.showByName', ['carmarket_noveh']);
            } else {
                player.call('prompt.showByName', ['carmarket_control']);
            }
        }
    },
    "playerExitColshape": (player, shape) => {
        if (shape.isCarMarket) {
            player.call('carmarket.colshape.leave');
        }
    },
    "carmarket.menu.show": (player) => {
        if (!player.vehicle) return;
        if (!carmarket.isPlayerInCarMarketColshape(player)) return;
        if (player.vehicle.key != 'private' || player.vehicle.owner != player.character.id) return player.call('notifications.push.error', ['Это не ваш транспорт', 'Ошибка']);

    }
}