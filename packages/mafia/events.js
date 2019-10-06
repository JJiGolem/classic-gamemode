let bizes = call('bizes');
let mafia = call('mafia');
let factions = call('factions');
let inventory = call('inventory');
let money = call('money');
let notifs = call('notifications');
let police = call('police');

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
        if (!data.bizes.length) return notifs.error(player, `Все бизнесы захвачены`);
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
        }, `Пополнение общака ${faction.name}`);

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
        }, `Снятие с общака ${faction.name}`);

        notifs.success(player, `Снято $${sum}`, header);
    },
    "mafia.power.sell": (player, data) => {
        data = JSON.parse(data);
        data.sum = Math.clamp(data.sum, 100, 100000);
        var header = `Продажа крыши`;
        var out = (text) => {
            notifs.error(player, text, header);
        };
        if (!factions.isMafiaFaction(player.character.factionId)) return out(`Вы не член мафии`);
        var rank = factions.getRank(player.character.factionId, mafia.bizWarRank);
        if (player.character.factionRank < rank.id) return out(`Доступно с ранга ${rank.name}`);
        var rec = mp.players.at(data.recId);
        if (!rec || !rec.character) return out(`Игрок #${data.recId} не найден`);
        if (player.dist(rec.position) > 10) return out(`${rec.name} далеко`);
        if (!factions.isMafiaFaction(rec.character.factionId)) return out(`${rec.name} не член мафии`);
        rank = factions.getRank(rec.character.factionId, mafia.bizWarRank);
        if (rec.character.factionRank < rank.id) return out(`${rec.name} еще мал для таких сделок`);
        if (player.character.factionId == rec.character.factionId) return out(`${rec.name} в вашей мафии`);

        var biz = bizes.getNearBiz(player);
        if (!biz) return out(`Необходимо находиться у бизнеса`);
        if (biz.info.factionId != player.character.factionId) return out(`${biz.info.name} находится не под вашей крышей`);

        rec.offer = {
            type: "mafia_power_sell",
            playerId: player.id,
            bizId: biz.info.id,
            sum: data.sum
        };
        rec.call(`offerDialog.show`, [`mafia_power_sell`, {
            player: player.name,
            biz: biz.info.name,
            sum: data.sum
        }]);
    },
    "mafia.power.sell.accept": (player) => {
        var header = `Продажа крыши`;
        var out = (text) => {
            notifs.error(player, text, header);
        };
        if (!player.offer || player.offer.type != "mafia_power_sell") return out(`Сделка не найдена`);
        var offer = player.offer;
        delete player.offer;

        var seller = mp.players.at(offer.playerId);
        if (!seller || !seller.character) return out(`Мафиозник не найден`);
        if (player.dist(seller.position) > 10) return out(`${seller.name} далеко`);
        if (player.character.cash < offer.sum) return out(`Необходимо $${sum}`);

        var biz = bizes.getBizById(offer.bizId);
        if (biz.info.factionId != seller.character.factionId) return out(`${biz.info.name} не под крышей ${seller.name}`);

        money.removeCash(player, offer.sum, (res) => {
            if (!res) return out(`Ошибка списания наличных`);
            money.addCash(seller, offer.sum, (res) => {
                if (!res) return notifs.error(seller, `Ошибка начисления наличных`, header);

                bizes.setFactionId(offer.bizId, player.character.factionId);
            }, `Продажа крыши бизнеса #${biz.info.id} игроку ${player.name}`);
        }, `Покупка крыши бизнеса #${biz.info.id} у игрока ${seller.name}`);

        notifs.success(seller, `Крыша ${biz.info.name} продана`, header);
        notifs.success(player, `Крыша ${biz.info.name} куплена`, header);
    },
    "mafia.power.sell.cancel": (player) => {
        if (!player.offer) return;
        var inviter = mp.players.at(player.offer.playerId);
        delete player.offer;
        if (!inviter || !inviter.character) return;
        notifs.info(player, `Предложение отклонено`);
        notifs.info(inviter, `${player.name} отклонил предложение`);
    },
    // снять/надеть веревку
    "mafia.cuffs": (player, data) => {
        if (typeof data == 'string') data = JSON.parse(data);
        var header = `Веревка`;
        var rec = (data.recId != null) ? mp.players.at(data.recId) : mp.players.getNear(player);
        rec = player;
        if (!rec || !rec.character) return notifs.error(player, `Гражданин не найден`, header);
        var dist = player.dist(rec.position);
        if (dist > 20) return notifs.error(player, `${rec.name} далеко`, `Наручники`);
        var character = player.character;
        if (!factions.isMafiaFaction(character.factionId)) return notifs.error(player, `Вы не член мафии`, header);
        if (rec.vehicle) return notifs.error(player, `${rec.name} находится в авто`, header);

        if (!rec.cuffs) {
            var cuffs = (data.cuffsSqlId) ? inventory.getItem(player, data.cuffsSqlId) : inventory.getItemByItemId(player, 54);
            if (!cuffs) return notifs.error(player, `Предмет ${inventory.getName(54)} не найден`, header);
            inventory.deleteItem(player, cuffs);
            police.setCuffs(rec, cuffs);

            notifs.info(rec, `${player.name} связал вас`, header);
            notifs.success(player, `${rec.name} связан`, header);
        } else {
            if (rec.cuffs.itemId != 54) return notifs.error(player, `${rec.name} был обездижен с помощью ${inventory.getName(rec.cuffs.itemId)}`, header);
            inventory.addOldItem(player, rec.cuffs, (e) => {
                if (e) return notifs.error(player, e, header);
            });

            notifs.info(rec, `${player.name} развязал вас`, header);
            notifs.info(player, `${rec.name} развязан`, header);

            police.setCuffs(rec, null);
            delete rec.isFollowing;
            rec.call(`police.follow.stop`);
        }
    },
    "player.faction.changed": (player, oldVal) => {
        if (!mafia.inWar(oldVal)) return;
        player.call(`mafia.bizWar.stop`);
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
