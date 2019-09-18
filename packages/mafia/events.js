let mafia = call('mafia');
let factions = call('factions');
let inventory = call('inventory');
let notifs = call('notifications');

module.exports = {
    "init": () => {},
    "characterInit.done": (player) => {
        player.call(`mafia.mafiaZones.init`, [mafia.convertToClientMafiaZones()]);
    },
    "mafia.bizWar.start": (player) => {
        mafia.startBizWar(player);
    },
    "mafia.storage.guns.take": (player, index) => {
        if (!player.insideFactionWarehouse) return notifs.error(player, `Вы далеко`, `Склад мафии`);
        if (!factions.isMafiaFaction(player.character.factionId)) return notifs.error(player, `Вы не член мафии`, `Склад мафии`);

        var character = player.character;
        var faction = factions.getFaction(character.factionId);
        var header = `Склад ${faction.name}`;

        if (faction.ammo < mafia.gunAmmo) return notifs.error(player, `Недостаточно боеприпасов`, header);

        var itemIds = [44, 46, 90, 48, 49, 96, 50, 22];
        var weaponIds = ["weapon_pistol", "weapon_pistol50", "weapon_minismg", "weapon_smg", "weapon_sawnoffshotgun", "weapon_dbshotgun", "weapon_assaultrifle", "weapon_carbinerifle"];
        index = Math.clamp(index, 0, itemIds.length - 1);
        var itemId = itemIds[index];

        var gunName = inventory.getInventoryItem(itemId).name;
        var guns = inventory.getArrayByItemId(player, itemId);

        if (guns.length > 0) return notifs.error(player, `Вы уже имеете ${gunName}`, header);

        inventory.fullDeleteItemsByParams(itemId, ["faction", "owner"], [character.factionId, character.id]);
        var params = {
            weaponHash: mp.joaat(weaponIds[index]),
            ammo: 0,
            faction: character.factionId,
            owner: character.id
        };

        inventory.addItem(player, itemId, params, (e) => {
            if (e) return notifs.error(player, e, header);

            notifs.success(player, `Вам выдано оружие ${gunName}`, header);
            factions.setAmmo(faction, faction.ammo - mafia.gunAmmo);
        });
    },
    "mafia.storage.ammo.take": (player, values) => {
        values = JSON.parse(values);
        var index = values[0];
        var ammo = values[1];
        if (!player.insideFactionWarehouse) return notifs.error(player, `Вы далеко`, `Склад мафии`);
        if (!factions.isMafiaFaction(player.character.factionId)) return notifs.error(player, `Вы не член мафии`, `Склад мафии`);

        var character = player.character;
        var faction = factions.getFaction(character.factionId);
        var header = `Склад ${faction.name}`;

        var itemIds = [37, 38, 40, 39];
        index = Math.clamp(index, 0, itemIds.length - 1);
        if (faction.ammo < mafia.ammoAmmo * ammo) return notifs.error(player, `Недостаточно боеприпасов`, header);

        // inventory.fullDeleteItemsByParams(itemIds[index], ["faction", "owner"], [character.factionId, character.id]);
        var params = {
            count: ammo,
            faction: character.factionId,
            owner: character.id
        };
        inventory.addItem(player, itemIds[index], params, (e) => {
            if (e) return notifs.error(player, e, header);

            notifs.success(player, `Вам выданы ${inventory.getInventoryItem(itemIds[index]).name} (${ammo} ед.)`, header);
            factions.setAmmo(faction, faction.ammo - mafia.ammoAmmo * ammo);
        });
    },
};
