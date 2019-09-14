"use strict"

let fishing = require('./index.js');
let inventory = call('inventory');
let notifs = call('notifications');
let utils = require('../utils');

let weight;

module.exports = {
    "init": () => {
        fishing.init();
    },
    "playerEnterColshape": (player, shape) => {
        if (!player.character) return;

        if (shape.isFishingPlaceMenu) {
            player.call('fishing.menu.show');
            player.currentColshape = shape;
        }

        if (shape.isFishingPlace) {
            player.call('fishing.game.menu');
            player.currentColshape = shape;
        }
    },
    "playerExitColshape": (player, shape) => {
        if (!player.character) return;

        if (shape.isFishingPlaceMenu) {
            player.call('fishing.menu.close');
            player.currentColshape = null;
        }

        if (shape.isFishingPlace) {
            mp.events.call('fishing.game.menu.close', player);
            player.call('fishing.game.exit');
            player.currentColshape = null;
        }
    },
    "fishing.game.menu": (player) => {
        if (!player.character) return;
        player.call('fishing.game.menu'); 
    },
    "fishing.game.menu.close": (player) => {
        if (!player.character) return;
        player.call('fishing.game.menu.close'); 
    },
    "fishing.game.enter": (player) => {
        if (!player.character) return;
        if (!inventory.getItemByItemId(player, fishing.getRodId())) return notifs.error(player, "У вас нет удочки", "Ошибка");

        let cam = fishing.setCamera(player);
        player.call('fishing.game.enter', [cam]);
    },
    "fishing.game.start": (player) => {
          if (!player.character) return;

          let rod = inventory.getItem(player, inventory.getRodId);
          let health = inventory.getParam(rod, 'health').value;

          inventory.updateParam(player, rod, 'health', health - 5);

          let zone = utils.randomInteger(10, 20);
          let speed = parseInt(health / 5);
          weight = utils.randomInteger(1,5);
          let timeout = utils.randomInteger(3,10);

          setTimeout(() => {
              player.call('fishing.game.fetch', [speed, zone, weight])
          }, timeout*1000);
    },
    "fishing.game.end": (player, result) => {
        if (!player.character) return;

        let rod = inventory.getItem(player, inventory.getRodId);
        let health = inventory.getParam(rod, 'health').value;

        if (result) {
            inventory.addItem(player, 127, { weight: weight }, () => {
                notifs.success(player, `Рыба весом ${weight} кг добавлена в инвентарь`, 'Отлично!');
            })
        } else {
            notifs.error(player, 'Рыба сорвалась', 'Провал!');
        }

        if (health == 0) {
            inventory.deleteItem(player, rod);
            notifs.error(player, 'Удочка сломалась', '')
        }
    },
    "fishing.rod.buy": (player) => {
        if (!player.character) return;

        fishing.buyRod(player);
    },
}