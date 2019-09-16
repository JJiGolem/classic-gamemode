let bands = call('bands');
let factions = call('factions');
let inventory = call('inventory');
let money = call('money');
let notifs = call('notifications');

module.exports = {
    "init": () => {
        bands.init();
    },
    "characterInit.done": (player) => {
        player.call(`bands.bandZones.init`, [bands.convertToClientBandZones()]);
    },
    "bands.capture.start": (player) => {
        bands.startCapture(player);
    },
    "bands.storage.guns.take": (player, index) => {
        if (!player.insideFactionWarehouse) return notifs.error(player, `Вы далеко`, `Склад банды`);
        if (!factions.isBandFaction(player.character.factionId)) return notifs.error(player, `Вы не член группировки`, `Склад банды`);

        var character = player.character;
        var faction = factions.getFaction(character.factionId);
        var header = `Склад ${faction.name}`;

        if (faction.ammo < bands.gunAmmo) return notifs.error(player, `Недостаточно боеприпасов`, header);

        var itemIds = [41, 21, 44, 20, 47, 89, 52];
        var weaponIds = ["weapon_bat", "weapon_pumpshotgun", "weapon_pistol", "weapon_combatpistol", "weapon_microsmg", "weapon_machinepistol", "weapon_compactrifle"];
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
            factions.setAmmo(faction, faction.ammo - bands.gunAmmo);
        });
    },
    "bands.storage.ammo.take": (player, values) => {
        values = JSON.parse(values);
        var index = values[0];
        var ammo = values[1];
        if (!player.insideFactionWarehouse) return notifs.error(player, `Вы далеко`, `Склад банды`);
        if (!factions.isBandFaction(player.character.factionId)) return notifs.error(player, `Вы не член группировки`, `Склад банды`);

        var character = player.character;
        var faction = factions.getFaction(character.factionId);
        var header = `Склад ${faction.name}`;

        var itemIds = [37, 38, 40, 39];
        index = Math.clamp(index, 0, itemIds.length - 1);
        if (faction.ammo < bands.ammoAmmo * ammo) return notifs.error(player, `Недостаточно боеприпасов`, header);

        // inventory.fullDeleteItemsByParams(itemIds[index], ["faction", "owner"], [character.factionId, character.id]);
        var params = {
            count: ammo,
            faction: character.factionId,
            owner: character.id
        };
        inventory.addItem(player, itemIds[index], params, (e) => {
            if (e) return notifs.error(player, e, header);

            notifs.success(player, `Вам выданы ${inventory.getInventoryItem(itemIds[index]).name} (${ammo} ед.)`, header);
            factions.setAmmo(faction, faction.ammo - bands.ammoAmmo * ammo);
        });
    },
    "bands.drugsStash.drugs.buy": (player, data) => {
        data = JSON.parse(data);

        var header = `Наркопритон`;
        if (!player.insideDrugsStash) return notifs.error(player, `Вы далеко`, header);
        if (!factions.isBandFaction(player.character.factionId)) return notifs.error(player, `Вы не член группировки`, header);

        var character = player.character;
        var faction = factions.getFaction(character.factionId);

        var itemIds = [29, 30, 31, 32];
        data.index = Math.clamp(data.index, 0, itemIds.length - 1);
        var price = bands.drugsPrice * data.count;
        // стоимость зависит от уровня влияния
        price -= parseInt(price * bands.getPowerBand(faction.id));
        price = Math.clamp(price, bands.drugsPriceMin * data.count, price);
        if (character.cash < price) return notifs.error(player, `Необходимо $${price}`, header);

        // inventory.fullDeleteItemsByParams(itemIds[index], ["faction", "owner"], [character.factionId, character.id]);
        var params = {
            count: data.count,
        };
        money.removeCash(player, price, (res) => {
            if (!res) return notifs.error(player, `Ошибка списания наличных`, header);
        });
        inventory.addItem(player, itemIds[data.index], params, (e) => {
            if (e) return notifs.error(player, e, header);

            notifs.success(player, `Вы приобрели ${inventory.getInventoryItem(itemIds[data.index]).name} (${data.count} г.)`, header);
        });
    },
    "playerDeath": (player, reason, killer) => {
        // killer = player; // for tests
        debug(`playerDeath | reason ${reason} killer: ${killer} `)
        if (!killer || !killer.character) return;
        if (!player.character) return;
        if (!player.character.factionId) return;
        if (!factions.isBandFaction(player.character.factionId)) return;
        if (!bands.inWar(player.character.factionId)) return;
        if (!killer.character.factionId) return;
        if (!factions.isBandFaction(killer.character.factionId)) return;
        if (killer.character.factionId == player.character.factionId) return;
        if (!bands.inWar(killer.character.factionId)) return;

        var zone = bands.getZoneByPos(player.position);
        if (!zone) return;
        if (!bands.wars[zone.id]) return;

        var killerZone = bands.getZoneByPos(killer.position);
        if (!killerZone) return;
        if (zone.id != killerZone.id) return;

        var war = bands.wars[zone.id];

        bands.giveScore(killer, zone);
    },
};