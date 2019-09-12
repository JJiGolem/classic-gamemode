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
    "fishing.start": (player) => {
        if (!player.character) return;
        if (!inventory.getItemByItemId(player, fishing.getRodId())) return notifs.error(player, "У вас нет удочки", "Ошибка");

        let cam = fishing.setCamera(player);
        player.call('fishing.game.start', [cam]);
    },
    "fishing.game.start": (player) => {
          if (!player.character) return;

          let rodHealth = inventory.getItemByItemId(player, fishing.getRodId()).params.health;
          let zone = utils.randomInteger(10, 20);
          let speed = rodHealth / 5;
          weight = utils.randomInteger(1,5);
          let timeout = utils.randomInteger(3,10);

          setTimeout(() => {
              player.call('fishing.game.fetch', [speed, zone, weight])
          }, timeout*1000);
    },
    "fishing.game.end": (player, result) => {
        if (!player.character) return;

        if (result) {
            //TODO добавить рыбу в инвентарь
            notifs.success(player, `Рыба весом ${weight} кг добавлена в инвентарь`, 'Отлично!');
        } else {
            return notifs.error(player, 'Рыба сорвалась', 'Провал!');
        }
    },
    "fishing.end": (player) => {
        if (!player.character) return;
        
        player.call('fishing.end');
    },
    "fishing.rod.buy": (player) => {
        if (!player.character) return;

        fishing.buyRod(player);
    },
}