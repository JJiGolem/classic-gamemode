module.exports = {
    "bandDealer.buyGun": (player, itemId) => {
        // debug(`bandDealer.buyGun: ${player.name} ${itemId}`)
        // TODO: Проверка, стоит ли игрок в колшейпе. Васина контрабанда.

        var gunsInfo = {
            41: {
                price: 200,
                params: {
                    weaponHash: mp.joaat("weapon_bat"),
                },
            },
            42: {
                price: 75,
                params: {
                    weaponHash: mp.joaat("weapon_knuckle"),
                },
            },
            43: {
                price: 300,
                params: {
                    weaponHash: mp.joaat("weapon_knife"),
                },
            },
            44: {
                price: 800,
                params: {
                    weaponHash: mp.joaat("weapon_pistol"),
                },
            },
            45: {
                price: 1200,
                params: {
                    weaponHash: mp.joaat("weapon_appistol"),
                },
            },
            46: {
                price: 1400,
                params: {
                    weaponHash: mp.joaat("weapon_revolver"),
                },
            },
            47: {
                price: 1800,
                params: {
                    weaponHash: mp.joaat("weapon_microsmg"),
                },
            },
            48: {
                price: 1950,
                params: {
                    weaponHash: mp.joaat("weapon_smg"),
                },
            },
            21: {
                price: 2400,
                params: {
                    weaponHash: mp.joaat("weapon_pumpshotgun"),
                },
            },
            49: {
                price: 2700,
                params: {
                    weaponHash: mp.joaat("weapon_sawnoffshotgun"),
                },
            },
            50: {
                price: 2800,
                params: {
                    weaponHash: mp.joaat("weapon_assaultrifle"),
                },
            },
            51: {
                price: 3000,
                params: {
                    weaponHash: mp.joaat("weapon_bullpuprifle"),
                },
            },
            52: {
                price: 3000,
                params: {
                    weaponHash: mp.joaat("weapon_compactrifle"),
                },
            }
        };
        if (!gunsInfo[itemId]) return player.utils.error(`Оружие не найдено!`);
        var info = gunsInfo[itemId];
        if (player.money < info.price) return player.utils.error(`Необходимо ${info.price}$`);
        info.params.ammo = 0;

        player.inventory.add(itemId, info.params, {}, (e) => {
            if (e) return player.utils.error(e);

            // TODO: Начислять % суммы в общак банды, которой принадлежит терра.

            player.utils.setMoney(player.money - info.price);
            player.utils.success(`Вы купили ${mp.inventory.getItem(itemId).name}`);
        });
    },
    "bandDealer.buyAmmo": (player, index, ammo) => {
        // debug(`bandDealer.buyAmmo: ${player.name} ${index} ${ammo}`)
        // TODO: Проверка, стоит ли игрок в колшейпе. Васина контрабанда.

        var itemIds = [37, 38, 40, 39];
        var prices = [6, 7, 7, 6];
        var index = Math.clamp(index, 0, itemIds.length - 1);
        var price = ammo * prices[index];
        if (player.money < price) return player.utils.error(`Необходимо ${price}$`);

        var params = {
            ammo: ammo,
        };
        player.inventory.add(itemIds[index], params, {}, (e) => {
            if (e) return player.utils.error(e);

            // TODO: Начислять % суммы в общак банды, которой принадлежит терра.

            player.utils.setMoney(player.money - price);
            player.utils.success(`Вы купили ${mp.inventory.getItem(itemIds[index]).name}!`);
        });
    },
    "bandDealer.buyDrgus": (player, index, count) => {
        // debug(`bandDealer.buyDrgus: ${player.name} ${index} ${count}`)
        // TODO: Проверка, стоит ли игрок в колшейпе. Васина контрабанда.

        var itemIds = [55, 56, 57, 58];
        var index = Math.clamp(index, 0, itemIds.length - 1);
        var prices = [6, 10, 8, 9];
        var price = count * prices[index];
        if (player.money < price) return player.utils.error(`Необходимо ${price}$`);

        var params = {
            count: count,
        };
        player.inventory.add(itemIds[index], params, {}, (e) => {
            if (e) return player.utils.error(e);

            // TODO: Начислять % суммы в общак банды, которой принадлежит терра.

            player.utils.setMoney(player.money - price);
            player.utils.success(`Вы купили ${mp.inventory.getItem(itemIds[index]).name}!`);
        });
    },
    "bandDealer.buyItems": (player, index) => {
        // Добавил покупку предметов ( Tomat )
        var itemIds = [126];
        var index = Math.clamp(index, 0, itemIds.length - 1);
        var prices = [150];
        var price = prices[index];
        if (player.money < price) return player.utils.error(`Необходимо ${price}$`);
        var params = {
            faction: player.faction,
            owner: player.sqlId
        }; // Если params разные, выводим их в массив
        player.inventory.add(itemIds[index], params, {}, (e) => {
            if (e) return player.utils.error(e);
            // TODO: Начислять % суммы в общак банды, которой принадлежит терра.
            player.utils.setMoney(player.money - price);
            player.utils.success(`Вы купили ${mp.inventory.getItem(itemIds[index]).name}!`);
        });
    },
    "use.gang.tie": (player, recId, status) => {
      let rec = mp.players.at(recId);
      if (!rec) return player.utils.error(`Игрок не найден!`);
      if (rec === player) return player.utils.error(`Вы не можете использовать это на себе!`);
      if (!mp.factions.isGangFaction(player.faction)) return player.utils.error(`Вы не состоите в банде!`);
      if (rec.vehicle) return player.utils.error(`Игрок в авто!`);
      if (player.hasTie) return player.utils.error(`На вас надеты стяжки!`);
      let dist = player.dist(rec.position);
      if (dist > Config.maxInteractionDist) return player.utils.error(`Игрок далеко!`);
      if (!status) {
          if (rec.hasTie) return player.utils.error(`Игрок уже в стяжках!`);
          var cuffsItems = player.inventory.getArrayByItemId(126);
          if (!Object.keys(cuffsItems).length) return player.utils.error(`У вас нет стяжек!`);
          player.inventory.delete(Object.values(cuffsItems)[0].id);
          rec.utils.info(`${player.name} надел на Вас стяжки`);
          player.utils.success(`${rec.name} в стяжках`);
      } else {
          if (!rec.hasTie) return player.utils.error(`Игрок не в стяжках!`);
          var params = {
              faction: player.faction,
              owner: player.sqlId
          };
          /*player.inventory.add(126, params, {}, (e) => {
              if (e) return player.utils.error(e);
          });*/
          rec.utils.info(`${player.name} снял с Вас стяжки`);
          player.utils.info(`${rec.name} без стяжек`);
      }
      rec.utils.setTie(!rec.hasTie);
    },
    "roob.gang.tie": (player, recId) => {
      let rec = mp.players.at(recId);
      if (!rec) return player.utils.error(`Игрок не найден!`);
      if (rec === player) return player.utils.error(`Вы не можете использовать это на себе!`);
      if (!mp.factions.isGangFaction(player.faction)) return player.utils.error(`Вы не состоите в банде!`);
      let dist = player.dist(rec.position);
      if (dist > Config.maxInteractionDist) return player.utils.error(`Игрок далеко!`);
      if (rec.money < 100) return player.utils.error(`У игрока меньше $100`);
      if (mp.getGangRoobers(false, rec.name) > 0) return player.utils.error(`Данного игрока уже недавно грабили!`);
      if (mp.getGangRoobers(true, player.name) > 1) return player.utils.error(`Вы уже ограбили 2 человека в течение часа!`);
      if (rec.vehicle) return player.utils.error(`Игрок в авто!`);
      if (!rec.hasTie) return player.utils.error(`Вы не надели стяжки на игрока!`);
      let money = Math.round(rec.money / 100 * mp.economy["gang_roober_procent"].value);
      if (money > mp.economy["gang_roober_maxsalary"].value) money = mp.economy["gang_roober_maxsalary"].value;
      mp.pushGangRoobers(false, rec.name);
      mp.pushGangRoobers(true, player.name);
      rec.utils.setMoney(rec.money - money);
      rec.utils.error(`Вас ограбили на $${money}`);
      player.utils.setMoney(player.money + money);
      player.utils.success(`Вы совершили ограбление на $${money}`);
    },
    "band.capture.start": (player) => {
        if (!mp.factions.isGangFaction(player.faction)) return player.utils.error(`Вы не член группировки!`);
        if (player.rank < mp.factionRanks[player.faction].length - 2) return player.utils.error(`Вы не можете начать захват территории!`);
        // TODO: Calculate current players' band-zone.
        var zone = mp.bandZonesUtils.getByPos(player.position);
        if (!zone) return player.utils.error(`Вы не на территории гетто!`);

        var faction = mp.factions.getBySqlId(player.faction);
        if (zone.bandId == player.faction) return player.utils.error(`Территория уже под контролем ${faction.name}!`);

        if (zone.capture) return player.utils.error(`На данной территории уже происходит захват!`);
        for (var id in mp.bandZones) {
            let z = mp.bandZones[id];
            if (!z.capture) continue;
            if (z.capture.bandId == player.faction) return player.utils.error(`${faction.name} уже напала на территорию!`);
            if (z.bandId == player.faction && z.capture.bandId == zone.bandId) return player.utils.error(`${mp.factions.getBySqlId(zone.bandId).name} напала на Вас раньше!`);
        }

        if (mp.economy["capt_interval"].value) {
            var minutes = new Date().getMinutes();
            if (minutes) return player.utils.error(`Не подходящее время для захвата!`);
            var hours = new Date().getHours();
            if (hours % mp.economy["capt_interval"].value) return player.utils.error(`В данный период захват не доступен!`);
        }

        zone.startCapture(player.faction);
    },
    "band.capture.exitBandZone": (player) => {
        var gangwar = player.getVariable("gangwar");
        if (!gangwar) return;
        var zone = mp.bandZones[gangwar];
        if (!zone.contains(player.position)) {
            zone.leaveCapture(player);
            player.utils.info(`Вы покинули захват!`);
        }
    },
}

/*
let gangs = [9, 10, 12, 13];
if (gangs.includes(clientStorage.faction)) {
  let haveItem = Object.keys(inventoryAPI.getArrayByItemId(27)).length > 0;
  if (haveItem) {
    if (clientStorage.gangerBinds.roober == 5) {
       $("#interactionMenu").append(`<div class="interaction_item"><div class="icon"><img src="img/interactionMenu/default.png"/></div><div class="text">Связать</div></div>`);
    } else if (clientStorage.gangerBinds.roober == 6) {
      $("#interactionMenu").append(`<div class="interaction_item"><div class="icon"><img src="img/interactionMenu/default.png"/></div><div class="text">Развязать</div></div>`);
      $("#interactionMenu").append(`<div class="interaction_item"><div class="icon"><img src="img/interactionMenu/default.png"/></div><div class="text">Ограбить</div></div>`);
    }
  }
}*/
