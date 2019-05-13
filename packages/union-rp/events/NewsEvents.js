module.exports = {
    "newsStorage.takeRation": (player) => {
      if (!player.colshape || !player.colshape.newsStorage) return player.utils.error(`Вы не у склада News!`);
      if (!mp.factions.isNewsFaction(player.faction)) return player.utils.error(`Вы не работаете в News!`);
      var items = player.inventory.getArrayByItemId(27);
      for (var sqlId in items)
          if (mp.factions.isNewsFaction(items[sqlId].params.faction)) return player.utils.error(`У Вас уже есть рация Weazel News!`);
      player.inventory.add(27, { faction: player.faction, owner: player.sqlId }, {}, (e) => {
          if (e) return player.utils.error(e);
          player.utils.success(`Вам выдана рация Weazel News!`);
      });
    },
    "newsStorage.takeArmour": (player) => {
        if (!player.colshape || !player.colshape.newsStorage) return player.utils.error(`Вы не у склада News!`);
        if (!mp.factions.isNewsFaction(player.faction)) return player.utils.error(`Вы не работаете в News!`);

        var faction = mp.factions.getBySqlId(player.faction);
        if (!faction) return player.utils.error(`Организация с ID: ${player.faction} не найдена!`);
        var army = faction.name;

        if (faction.products < mp.economy["news_armour_products"].value) return player.utils.error(`Недостаточно боеприпасов!`);
        var items = player.inventory.getArrayByItemId(3);

        for (var sqlId in items)
            if (mp.factions.isNewsFaction(items[sqlId].params.faction)) return player.utils.error(`У Вас уже есть бронежилет ${army}!`);

        mp.fullDeleteItemsByParams(3, ["faction", "owner"], [player.faction, player.sqlId]);

        var params;
        if (player.sex == 1) {
            params = {
                variation: 16,
                texture: 2
            };
        } else {
            params = {
                variation: 18,
                texture: 2
            };
        }

        params.faction = player.faction;
        params.owner = player.sqlId;
        params.armour = 100;
        params.sex = player.sex;

        player.inventory.add(3, params, {}, (e) => {
            if (e) return player.utils.error(e);
            player.utils.success(`Вам выдан бронежилет ${army}!`);
            faction.setProducts(faction.products - mp.economy["news_armour_products"].value);
            mp.logs.addLog(`${player.name} взял со склада Бронежилет News`, 'faction', player.account.id, player.sqlId, {
                faction: player.faction,
                count: 1
            });
        });

    },
}
