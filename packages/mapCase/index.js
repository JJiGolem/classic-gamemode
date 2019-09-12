"use strict";
var factions = require('../factions');
var notifs = call('notifications');

module.exports = {
    // Вызовы в планшете ПД
    policeCalls: [],
    // Вызовы в планшете ЕМС
    hospitalCalls: [],
    // Объявления (в очереди) в планшете Ньюс
    newsAds: [],
    // Объявления (готовые в эфир) в планшете Ньюс
    newsAdsEdited: [],
    // Свободный ID новой новости
    adId: 1,

    convertCharactersToResultData(characters) {
        var result = [];
        for (var i = 0; i < characters.length; i++) {
            var character = characters[i];
            var number = (character.Phone) ? character.Phone.number : "-";
            var housePos = null;
            if (character.House) {
                var h = character.House;
                housePos = new mp.Vector3(h.pickupX, h.pickupY, h.pickupZ);
            }
            result.push({
                id: character.id,
                name: character.name,
                phone: number,
                housePos: housePos
            });
        }
        return result;
    },
    convertCharactersToProfileData(character, vehicles) {
        var result = [];
        var number = (character.Phone) ? character.Phone.number : null;
        var housePos = null,
            houseId = 0;
        if (character.House) {
            var h = character.House;
            housePos = new mp.Vector3(h.pickupX, h.pickupY, h.pickupZ);
            houseId = h.id;
        }
        var vehNames = [];
        for (var i = 0; i < vehicles.length; i++)
            vehNames.push(`${vehicles[i].modelName} (${vehicles[i].plate})`);
        var faction = "-";
        if (character.Faction) faction = character.Faction.name;
        var rank = "-";
        if (character.FactionRank) rank = character.FactionRank.name;
        return {
            id: character.id,
            name: character.name,
            phone: number,
            housePos: housePos,
            danger: character.wanted,
            cause: character.wantedCause || "-",
            gender: character.gender,
            housePos: housePos,
            houseId: houseId,
            faction: faction,
            rank: rank,
            veh: vehNames.join(", ").trim() || "-",
        };
    },
    convertWanted(wanted) {
        var result = [];
        for (var i = 0; i < wanted.length; i++) {
            var rec = wanted[i];
            result.push({
                id: rec.character.id,
                name: rec.name,
                description: rec.character.wantedCause,
                danger: rec.character.wanted
            });
        }
        return result;
    },
    convertMembers(members) {
        var result = [];
        for (var i = 0; i < members.length; i++) {
            var rec = members[i];
            var rank = factions.getRankById(rec.character.factionId, rec.character.factionRank);
            result.push({
                id: rec.character.id,
                name: rec.name,
                rank: rank.rank
            });
        }
        return result;
    },
    addPoliceCall(player, description) {
        this.removePoliceCall(player.character.id);
        var call = {
            id: player.character.id,
            name: player.name,
            description: description
        };
        this.policeCalls.push(call);
        notifs.success(player, `Вызов отправлен`, `Police`);
        mp.players.forEach((rec) => {
            if (!rec.character) return;
            if (!factions.isPoliceFaction(rec.character.factionId)) return;

            notifs.info(rec, `Поступил вызов от ${call.name}`, `Планшет PD`);
            rec.call(`mapCase.pd.calls.add`, [call])
        });
    },
    removePoliceCall(id) {
        var deleted = false;
        for (var i = 0; i < this.policeCalls.length; i++) {
            if (this.policeCalls[i].id == id) {
                this.policeCalls.splice(i, 1);
                i--;
                deleted = true;
            }
        }
        if (!deleted) return false;
        mp.players.forEach((rec) => {
            if (!rec.character) return;
            if (!factions.isPoliceFaction(rec.character.factionId)) return;

            rec.call(`mapCase.pd.calls.remove`, [id])
        });
        return true;
    },
    acceptPoliceCall(id) {
        return this.removePoliceCall(id);
    },
    addPoliceWanted(player) {
        mp.players.forEach((rec) => {
            if (!rec.character) return;
            if (!factions.isPoliceFaction(rec.character.factionId)) return;
            rec.call(`mapCase.pd.wanted.add`, [{
                id: player.character.id,
                name: player.name,
                description: player.character.wantedCause || "-",
                danger: player.character.wanted
            }]);
        });
    },
    removePoliceWanted(id) {
        mp.players.forEach((rec) => {
            if (!rec.character) return;
            if (!factions.isPoliceFaction(rec.character.factionId)) return;
            rec.call(`mapCase.pd.wanted.remove`, [id]);
        });
    },
    addPoliceMember(player) {
        if (!factions.isPoliceFaction(player.character.factionId)) return;
        mp.players.forEach((rec) => {
            if (!rec.character) return;
            if (!factions.isPoliceFaction(rec.character.factionId)) return;
            if (rec.character.factionId != player.character.factionId) return;

            rec.call(`mapCase.pd.members.add`, [this.convertMembers([player])]);
        });
    },
    removePoliceMember(player) {
        mp.players.forEach((rec) => {
            if (!rec.character) return;
            if (!factions.isPoliceFaction(rec.character.factionId)) return;

            rec.call(`mapCase.pd.members.remove`, [player.character.id]);
        });
    },
    addHospitalCall(player, description) {
        this.removeHospitalCall(player.character.id);
        var call = {
            id: player.character.id,
            name: player.name,
            description: description
        };
        this.hospitalCalls.push(call);
        notifs.success(player, `Вызов отправлен`, `Hospital`);
        mp.players.forEach((rec) => {
            if (!rec.character) return;
            if (!factions.isHospitalFaction(rec.character.factionId)) return;

            notifs.info(rec, `Поступил вызов от ${call.name}`, `Планшет EMS`);
            rec.call(`mapCase.ems.calls.add`, [call])
        });
    },
    removeHospitalCall(id) {
        var deleted = false;
        for (var i = 0; i < this.hospitalCalls.length; i++) {
            if (this.hospitalCalls[i].id == id) {
                this.hospitalCalls.splice(i, 1);
                i--;
                deleted = true;
            }
        }
        if (!deleted) return false;
        mp.players.forEach((rec) => {
            if (!rec.character) return;
            if (!factions.isHospitalFaction(rec.character.factionId)) return;

            rec.call(`mapCase.ems.calls.remove`, [id])
        });
        return true;
    },
    acceptHospitalCall(id) {
        return this.removeHospitalCall(id);
    },
    addHospitalMember(player) {
        if (!factions.isHospitalFaction(player.character.factionId)) return;
        mp.players.forEach((rec) => {
            if (!rec.character) return;
            if (!factions.isHospitalFaction(rec.character.factionId)) return;
            if (rec.character.factionId != player.character.factionId) return;

            rec.call(`mapCase.ems.members.add`, [this.convertMembers([player])]);
        });
    },
    removeHospitalMember(player) {
        mp.players.forEach((rec) => {
            if (!rec.character) return;
            if (!factions.isHospitalFaction(rec.character.factionId)) return;

            rec.call(`mapCase.ems.members.remove`, [player.character.id]);
        });
    },
    addNewsAd(player, text) {
        // this.removeNewsAd(player.character.id);
        var ad = {
            id: this.adId,
            playerId: player.id,
            author: player.name,
            text: text
        };
        this.adId++;
        this.newsAds.push(ad);
        mp.players.forEach((rec) => {
            if (!rec.character) return;
            if (!factions.isNewsFaction(rec.character.factionId)) return;

            notifs.info(rec, `Поступило объявление от ${ad.author}`, `Планшет Weazel News`);
            rec.call(`mapCase.news.ads.count.set`, [this.newsAds.length]);
        });
    },
    removeNewsAd(id) {
        var deleted = false;
        for (var i = 0; i < this.newsAds.length; i++) {
            if (this.newsAds[i].playerId == id) {
                this.newsAds.splice(i, 1);
                i--;
                deleted = true;
            }
        }
        if (!deleted) return false;
        mp.players.forEach((rec) => {
            if (!rec.character) return;
            if (!factions.isNewsFaction(rec.character.factionId)) return;

            rec.call(`mapCase.news.ads.count.set`, [this.newsAds.length])
        });
        return true;
    },
    getNewsAd(player) {
        if (!this.newsAds.length) return notifs.error(player, `Список объявлений пуст`);

        var ad = this.newsAds.shift();
        player.call(`mapCase.news.ads.show`, [ad]);
        mp.players.forEach((rec) => {
            if (!rec.character) return;
            if (!factions.isNewsFaction(rec.character.factionId)) return;

            rec.call(`mapCase.news.ads.count.set`, [this.newsAds.length])
        });
    },
    acceptAd(player, ad) {
        this.newsAdsEdited.push(ad);
        debug(`Объявления в очереди: `)
        debug(this.newsAds);
        debug(`Готовые объявления: `)
        debug(this.newsAdsEdited);
        var rec = mp.players.at(ad.playerId);
        var header = factions.getFaction(7).name;
        if (rec) notifs.success(rec, `${player.name} принял ваше объявление`, header);
    },
    cancelAd(player, ad) {
        var rec = mp.players.at(ad.playerId);
        var header = factions.getFaction(7).name;
        if (rec) notifs.info(rec, `${player.name} отменил ваше объявление. Причина: ${ad.text}`, header);
    },
    addNewsMember(player) {
        if (!factions.isNewsFaction(player.character.factionId)) return;
        mp.players.forEach((rec) => {
            if (!rec.character) return;
            if (!factions.isNewsFaction(rec.character.factionId)) return;
            if (rec.character.factionId != player.character.factionId) return;

            rec.call(`mapCase.news.members.add`, [this.convertMembers([player])]);
        });
    },
    removeNewsMember(player) {
        mp.players.forEach((rec) => {
            if (!rec.character) return;
            if (!factions.isNewsFaction(rec.character.factionId)) return;

            rec.call(`mapCase.news.members.remove`, [player.character.id]);
        });
    },
};
