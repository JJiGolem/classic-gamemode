let fishing = require('./index.js');
let inventory;
let notifs;
let utils;

let weight;
let fish;

module.exports = {
    "init": async () => {
        inventory = call('inventory');
        notifs = call('notifications');
        utils = call('utils');
        await fishing.init();
        inited(__dirname);
    },
    "playerEnterColshape": (player, shape) => {
        if (!player.character) return;

        if (shape.isFisher) {
            player.call('fishing.menu.show', [fishing.rodPrice]);
            player.currentColshape = shape;
        }
    },
    "playerExitColshape": (player, shape) => {
        if (!player.character) return;

        if (shape.isFisher) {
            player.call('fishing.menu.close');
            player.currentColshape = null;
        }
    },
    "fishing.game.enter": (player) => {
        if (!player.character) return;
        if (inventory.getItemByItemId(player, fishing.getRodId())) return player.call('fishing.game.enter');

        notifs.error(player, "У вас нет удочки", "Ошибка");
        player.call('fishing.game.exit');
    },
    "fishing.game.start": async (player) => {
        if (!player.character) return;

        clearTimeout(player.timeoutFetch);

        let rod = inventory.getHandsItem(player);
        // console.log(inventory.getHandsItem(player));
        let health = inventory.getParam(rod, 'health').value;

        if (health <= 0) return mp.events.call('fishing.game.exit', player);

        inventory.updateParam(player, rod, 'health', health - 1);

        fish = fishing.fishes[utils.randomInteger(0, fishing.fishes.length - 1)];

        let zone = utils.randomInteger(10, 20);
        let speed = parseInt(health / 5);
        weight = utils.randomFloat(fish.minWeight, fish.maxWeight, 1);
        let time = utils.randomInteger(5, 15);

        player.timeoutFetch = setTimeout(() => {
            try {
                player.call('fishing.game.fetch', [speed, zone, weight]);
            } catch (e) {

            }
        }, time*1000);
    },
    "fishing.game.end": (player, result) => {
        if (!player.character) return;

        let rod = inventory.getItemByItemId(player, fishing.getRodId());
        let health = inventory.getParam(rod, 'health').value;

        if (result) {
            inventory.addItem(player, 15, { weight: weight, name: fish.name }, (e) => {
                if (!e) {
                    notifs.success(player, `${fish.name} весом ${weight} кг добавлен(a) в инвентарь`, 'Отлично!');
                } else {
                    return notifs.error(player, e, 'Ошибка');
                }
            });
        } else {
            notifs.error(player, 'Рыба сорвалась', 'Провал!');
        }

        if (health <= 0) {
            inventory.deleteItem(player, rod);
            notifs.error(player, 'Удочка сломалась', '');
            player.call('fishing.game.exit');
        }
    },
    "fishing.game.exit": (player) => {
        if (!player.character) return;

        clearTimeout(player.timeoutFetch);
    },
    "fishing.rod.buy": (player) => {
        if (!player.character) return;

        fishing.buyRod(player);
    },
    "fishing.fish.sell": (player) => {
        if (!player.character) return;

        fishing.sellFish(player);
    }
}
