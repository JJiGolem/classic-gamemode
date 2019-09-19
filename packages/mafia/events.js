let bizes = call('bizes');
let mafia = call('mafia');
let factions = call('factions');
let inventory = call('inventory');
let money = call('money');
let notifs = call('notifications');

module.exports = {
    "init": () => {
        mafia.init();
    },
    "characterInit.done": (player) => {
        player.call(`mafia.mafiaZones.init`, [mafia.convertToClientMafiaZones()]);

        var warZoneIds = Object.keys(mafia.wars);
        if (!warZoneIds.length) return;
        var factionId = player.character.factionId;
        if (!factions.isMafiaFaction(factionId)) return;

        var war = mafia.wars[warZoneIds[0]];
        var time = mafia.haveTime(war) / 1000;
        if (war.mafia.id == factionId) player.call(`mafia.bizWar.start`, [factionId, war.enemyMafia.id, time, war.mafia.score, war.enemyMafia.score]);
        else if (war.enemyMafia.id == factionId) player.call(`mafia.bizWar.start`, [factionId, war.mafia.id, time, war.enemyMafia.score, war.mafia.score]);
    },
    "mafia.bizWar.show": (player) => {
        var factionId = player.character.factionId;
        if (!factions.isMafiaFaction(factionId)) return notifs.error(player, `Вы не член мафии`);

        var data = {
            bizes: bizes.getBizesForBizWar(factionId),
            names: factions.getMafiaFactions().map(x => x.name),
            bizCount: bizes.getBizCount(),
        };
        player.call(`mafia.bizWar.showMenu`, [data]);
    },
    "mafia.bizWar.start": (player, bizId) => {
        mafia.startBizWar(player, bizId);
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
    "mafia.storage.cash.put": (player, sum) => {
        sum = Math.clamp(sum, 0, 1000000);
        if (!player.insideFactionWarehouse) return notifs.error(player, `Вы далеко`, `Общак мафии`);

        var character = player.character;
        var faction = factions.getFaction(character.factionId);
        var header = `Общак ${faction.name}`;

        if (character.cash < sum) return notifs.error(player, `Необходимо $${sum}`, header);
        money.removeCash(player, sum, (res) => {
            if (!res) return notifs.error(player, `Ошибка списания наличных`, header);

            faction.cash += sum;
            faction.save();
        });

        notifs.success(player, `Пополнено на $${sum}`, header);
    },
    "mafia.storage.cash.take": (player, sum) => {
        sum = Math.clamp(sum, 0, 1000000);
        if (!player.insideFactionWarehouse) return notifs.error(player, `Вы далеко`, `Общак мафии`);

        var character = player.character;
        var faction = factions.getFaction(character.factionId);
        var header = `Общак ${faction.name}`;

        if (faction.cash < sum) return notifs.error(player, `Общак не имеет $${sum}`, header);
        money.addCash(player, sum, (res) => {
            if (!res) return notifs.error(player, `Ошибка начисления наличных`, header);

            faction.cash -= sum;
            faction.save();
        });

        notifs.success(player, `Снято $${sum}`, header);
    },
    "playerDeath": (player, reason, killer) => {
        // killer = player; // for tests
        if (!killer || !killer.character) return;
        if (!player.character) return;
        if (!player.character.factionId) return;
        if (!factions.isMafiaFaction(player.character.factionId)) return;
        if (!mafia.inWar(player.character.factionId)) return;
        if (player.getVariable("knocked")) return;
        if (!killer.character.factionId) return;
        if (!factions.isMafiaFaction(killer.character.factionId)) return;
        if (killer.character.factionId == player.character.factionId) return;
        if (!mafia.inWar(killer.character.factionId)) return;

        var zone = mafia.getZoneByPos(player.position);
        if (!zone) return;
        if (!mafia.wars[zone.id]) return;

        var killerZone = mafia.getZoneByPos(killer.position);
        if (!killerZone) return;
        if (zone.id != killerZone.id) return;

        player.lastWarDeathTime = Date.now();

        mafia.checkReveangeKill(killer);
        mafia.giveScore(killer, player, reason, zone);
    },
};
