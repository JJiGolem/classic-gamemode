"use strict";

/*
    Модуль планшета.

    created 24.08.19 by Carter Slade
*/

mp.mapCase = {
    enable(val) {
        mp.callCEFV(`mapCase.enable = ${val}`);
    },
    type(val) {
        mp.callCEFV(`mapCase.type = "${val}"`);
    },
    userName(val) {
        mp.callCEFV(`mapCase.userName = "${val}"`);
    },
    showGreenMessage(text) {
        mp.callCEFV(`mapCase.showGreenMessage('${text}')`);
    },
    showRedMessage(text) {
        mp.callCEFV(`mapCase.showRedMessage('${text}')`);
    },
};
mp.mapCasePd = {
    // Время установления личности (ms)
    searchTime: 3000,
    // Макс. дистанция установления личности
    searchMaxDist: 10,
    // Таймер установления личности
    searchTimer: null,
    // ИД игрока, личность которого устанавливается
    searchPlayerId: null,
    // Вреся жизни блипа подкрепления (ms)
    emergencyBlipTime: 60000,
    // Блипы, где запросили подкрепление
    emergencyBlips: [],

    menuHeader(text) {
        mp.callCEFV(`mapCasePdData.menuHeader = "${text}"`);
    },
    setResultData(array) {
        for (var i = 0; i < array.length; i++) {
            var pos = array[i].housePos;
            array[i].num = i + 1;
            array[i].address = mp.utils.getStreetName(pos) || "-";
        }
        if (typeof array == 'object') array = JSON.stringify(array);
        mp.callCEFV(`mapCasePdDBResultData.setResult('${array}')`);
    },
    setProfileData(data) {
        var pos = data.housePos;
        data.property = "-";
        if (data.housePos) data.property = mp.utils.getStreetName(pos) + `, ${data.houseId}` || "-";
        data.pass = 2608180000 + data.id;
        data.gender = (data.gender) ? "Ж" : "М";

        if (typeof data == 'object') data = JSON.stringify(data);
        mp.callCEFV(`mapCasePdProfileData.setProfileData('${data}')`);
    },
    addCall(calls) {
        if (typeof calls == 'object') calls = JSON.stringify(calls);
        mp.callCEFV(`mapCasePdCallsData.add('${calls}')`);
    },
    removeCall(id) {
        mp.callCEFV(`mapCasePdCallsData.remove(${id})`);
    },
    addWanted(wanted) {
        if (typeof wanted == 'object') wanted = JSON.stringify(wanted);
        mp.callCEFV(`mapCasePdWantedData.add('${wanted}')`);
    },
    removeWanted(id) {
        mp.callCEFV(`mapCasePdWantedData.remove(${id})`);
    },
    addMember(members) {
        if (typeof members == 'object') members = JSON.stringify(members);
        mp.callCEFV(`mapCasePdMembersData.add('${members}')`);
    },
    removeMember(id) {
        mp.callCEFV(`mapCasePdMembersData.remove(${id})`);
    },
    setRanks(ranks) {
        if (typeof ranks == 'object') ranks = JSON.stringify(ranks);
        mp.callCEFV(`mapCasePdMembersData.setRanks('${ranks}')`);
    },
    setMemberRank(id, rank) {
        mp.callCEFV(`mapCasePdMembersData.setMemberRank(${id}, ${rank})`);
    },
    startSearch(id) {
        this.stopSearch();
        var rec = mp.players.atRemoteId(id);
        if (!id) return mp.mapCase.showRedMessage(`Игрок <span>#${id}</span> не найден`);
        this.searchPlayerId = id;
        this.searchTimer = setTimeout(() => {
            mp.events.callRemote(`mapCase.pd.searchById`, id);
            mp.mapCasePd.stopSearch();
        }, this.searchTime);
    },
    stopSearch(text = null) {
        clearTimeout(this.searchTimer);
        this.searchTimer = null;
        this.searchPlayerId = null;
        if (text) mp.mapCase.showRedMessage(text);
    },
    addEmergencyBlip(name, pos) {
        var blip = mp.blips.new(133, pos, {
            name: name,
            color: 39
        });
        this.emergencyBlips.push(blip);
        setTimeout(() => {
            var index = this.emergencyBlips.indexOf(blip);
            this.emergencyBlips.splice(index, 1);
            blip.destroy();
        }, this.emergencyBlipTime);
    },
};
mp.mapCaseEms = {
    addCall(calls) {
        if (typeof calls == 'object') calls = JSON.stringify(calls);
        mp.callCEFV(`mapCaseEmsCallsData.add('${calls}')`);
    },
    removeCall(id) {
        mp.callCEFV(`mapCaseEmsCallsData.remove(${id})`);
    },
    addMember(members) {
        if (typeof members == 'object') members = JSON.stringify(members);
        mp.callCEFV(`mapCaseEmsMembersData.add('${members}')`);
    },
    removeMember(id) {
        mp.callCEFV(`mapCaseEmsMembersData.remove(${id})`);
    },
    setRanks(ranks) {
        if (typeof ranks == 'object') ranks = JSON.stringify(ranks);
        mp.callCEFV(`mapCaseEmsMembersData.setRanks('${ranks}')`);
    },
    setMemberRank(id, rank) {
        mp.callCEFV(`mapCaseEmsMembersData.setMemberRank(${id}, ${rank})`);
    },
};
mp.mapCaseNews = {
    setAdsCount(count) {
        mp.callCEFV(`mapCaseWnewsAdsData.adsAmount = ${count}`);
    },
    showAd(ad) {
        if (typeof ad == 'object') ad = JSON.stringify(ad);
        mp.callCEFV(`mapCaseWnewsAdsData.setAd('${ad}')`);
    },
    addMember(members) {
        if (typeof members == 'object') members = JSON.stringify(members);
        mp.callCEFV(`mapCaseWnewsMembersData.add('${members}')`);
    },
    removeMember(id) {
        mp.callCEFV(`mapCaseWnewsMembersData.remove(${id})`);
    },
    setRanks(ranks) {
        if (typeof ranks == 'object') ranks = JSON.stringify(ranks);
        mp.callCEFV(`mapCaseWnewsMembersData.setRanks('${ranks}')`);
    },
    setMemberRank(id, rank) {
        mp.callCEFV(`mapCaseWnewsMembersData.setMemberRank(${id}, ${rank})`);
    },
};

mp.events.add("mapCase.init", (name, factionId) => {
    mp.mapCase.enable(false);
    var type = "";
    if (mp.factions.isPoliceFaction(factionId)) {
        type = "pd";
        if (factionId == 2) mp.mapCasePd.menuHeader("LOS SANTOS<br/>POLICE DEPARTMENT");
        else mp.mapCasePd.menuHeader("BLAINE COUNTY<br/>SHERIFF DEPARTMENT");
    } else if (mp.factions.isHospitalFaction(factionId)) {
        type = "ems";
    } else if (mp.factions.isNewsFaction(factionId)) {
        type = "wnews";
    } else return;
    mp.mapCase.type(type);
    mp.mapCase.userName(name);
    mp.mapCase.enable(true);
});

mp.events.add("mapCase.enable", mp.mapCase.enable);

mp.events.add("mapCase.message.green.show", mp.mapCase.showGreenMessage);

mp.events.add("mapCase.message.red.show", mp.mapCase.showRedMessage)

mp.events.add("mapCase.pd.resultData.set", mp.mapCasePd.setResultData);

mp.events.add("mapCase.pd.profileData.set", mp.mapCasePd.setProfileData);

mp.events.add("mapCase.pd.calls.add", mp.mapCasePd.addCall);

mp.events.add("mapCase.pd.calls.remove", mp.mapCasePd.removeCall);

mp.events.add("mapCase.pd.wanted.add", mp.mapCasePd.addWanted);

mp.events.add("mapCase.pd.wanted.remove", mp.mapCasePd.removeWanted);

mp.events.add("mapCase.pd.members.add", mp.mapCasePd.addMember);

mp.events.add("mapCase.pd.members.remove", mp.mapCasePd.removeMember);

mp.events.add("mapCase.pd.ranks.set", mp.mapCasePd.setRanks);

mp.events.add("mapCase.pd.members.rank.set", mp.mapCasePd.setMemberRank);

mp.events.add("mapCase.pd.search.start", (recId) => {
    mp.mapCasePd.startSearch(recId);
});

mp.events.add("mapCase.ems.calls.add", mp.mapCaseEms.addCall);

mp.events.add("mapCase.ems.calls.remove", mp.mapCaseEms.removeCall);

mp.events.add("mapCase.ems.members.add", mp.mapCaseEms.addMember);

mp.events.add("mapCase.ems.members.remove", mp.mapCaseEms.removeMember);

mp.events.add("mapCase.ems.ranks.set", mp.mapCaseEms.setRanks);

mp.events.add("mapCase.ems.members.rank.set", mp.mapCaseEms.setMemberRank);

mp.events.add("mapCase.news.ads.count.set", mp.mapCaseNews.setAdsCount);

mp.events.add("mapCase.news.ads.show", mp.mapCaseNews.showAd);

mp.events.add("mapCase.news.members.add", mp.mapCaseNews.addMember);

mp.events.add("mapCase.news.members.remove", mp.mapCaseNews.removeMember);

mp.events.add("mapCase.news.ranks.set", mp.mapCaseNews.setRanks);

mp.events.add("mapCase.news.members.rank.set", mp.mapCaseNews.setMemberRank);

mp.events.add("time.main.tick", () => {
    var id = mp.mapCasePd.searchPlayerId;
    if (id) { // происходит установление личности
        var rec = mp.players.atRemoteId(id);
        if (!rec) return mp.mapCasePd.stopSearch(`Игрок не найден`);
        var dist = mp.vdist(rec.position, mp.players.local.position);
        if (dist > mp.mapCasePd.searchMaxDist) return mp.mapCasePd.stopSearch(`Игрок далеко`);
    }
});

mp.events.add("mapCase.pd.emergencyBlips.add", (name, pos) => {
    mp.mapCasePd.addEmergencyBlip(name, pos);
});
