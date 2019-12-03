"use strict";

/*
    Модуль планшета.

    created 24.08.19 by Carter Slade
*/

mp.mapCase = {
    enable(val) {
        var faction = mp.factions.faction;
        if (val && (!faction || faction > 7)) return;
        mp.callCEFV(`mapCase.enable = ${val}`);
    },
    type(val) {
        mp.callCEFV(`mapCase.type = \`${val}\``);
    },
    userName(val) {
        mp.callCEFV(`mapCase.userName = \`${val}\``);
    },
    showGreenMessage(text) {
        mp.callCEFV(`mapCase.showGreenMessage(\`${text}\`)`);
    },
    showRedMessage(text) {
        mp.callCEFV(`mapCase.showRedMessage(\`${text}\`)`);
    },
    registerAttachments() {
        // планшет в руке
        mp.attachmentMngr.register("mapCase", "prop_cs_tablet", 26610, new mp.Vector3(0.17, -0.042, 0.09),
            new mp.Vector3(-3, 153, 170), {
                dict: "amb@code_human_in_bus_passenger_idles@female@tablet@base",
                name: "base",
                speed: 1,
                flag: 51
            }
        );
    },
    playShowAnimation(enable) {
        if (enable) mp.attachmentMngr.addLocal("mapCase");
        else mp.attachmentMngr.removeLocal("mapCase");
    },
};
mp.mapCaseGover = {
    addMember(members) {
        if (typeof members == 'object') members = JSON.stringify(members);
        mp.callCEFV(`mapCaseGoverMembersData.add(\`${members}\`)`);
    },
    removeMember(id) {
        mp.callCEFV(`mapCaseGoverMembersData.remove(${id})`);
    },
    setRanks(ranks) {
        if (typeof ranks == 'object') ranks = JSON.stringify(ranks);
        mp.callCEFV(`mapCaseGoverMembersData.setRanks(\`${ranks}\`)`);
    },
    setMemberRank(id, rank) {
        mp.callCEFV(`mapCaseGoverMembersData.setMemberRank(${id}, ${rank})`);
    },
};
mp.mapCasePd = {
    // Время установления личности (ms)
    searchTime: 15 * 1000,
    // Макс. дистанция установления личности
    searchMaxDist: 10,
    // Таймер установления личности
    searchTimer: null,
    // ИД игрока, личность которого устанавливается
    searchPlayerId: null,
    // Время жизни блипа подкрепления (ms)
    emergencyBlipTime: 60000,
    // Блипы, где запросили подкрепление
    emergencyBlips: [],

    menuHeader(text) {
        mp.callCEFV(`mapCasePdData.menuHeader = \`${text}\``);
    },
    setResultData(array) {
        for (var i = 0; i < array.length; i++) {
            var pos = array[i].housePos;
            array[i].num = i + 1;
            array[i].address = mp.utils.getStreetName(pos) || "-";
        }
        if (typeof array == 'object') array = JSON.stringify(array);
        mp.callCEFV(`mapCasePdDBResultData.setResult(\`${array}\`)`);
    },
    setProfileData(data) {
        var pos = data.housePos;
        data.property = "-";
        if (data.housePos) data.property = mp.utils.getStreetName(pos) + `, ${data.houseId}` || "-";
        data.pass = 2608180000 + data.id;
        if (!data.spouse) data.spouse = "-";
        else data.spouse = ((data.gender)? "замужем за " : "женат на ") + data.spouse;
        data.gender = (data.gender) ? "Ж" : "М";

        if (typeof data == 'object') data = JSON.stringify(data);
        mp.callCEFV(`mapCasePdProfileData.setProfileData(\`${data}\`)`);
    },
    addCall(calls) {
        if (typeof calls == 'object') calls = JSON.stringify(calls);
        mp.callCEFV(`mapCasePdCallsData.add(\`${calls}\`)`);
    },
    removeCall(id) {
        mp.callCEFV(`mapCasePdCallsData.remove(${id})`);
    },
    addWanted(wanted) {
        if (typeof wanted == 'object') wanted = JSON.stringify(wanted);
        mp.callCEFV(`mapCasePdWantedData.add(\`${wanted}\`)`);
    },
    removeWanted(id) {
        mp.callCEFV(`mapCasePdWantedData.remove(${id})`);
    },
    addMember(members) {
        if (typeof members == 'object') members = JSON.stringify(members);
        mp.callCEFV(`mapCasePdMembersData.add(\`${members}\`)`);
    },
    removeMember(id) {
        mp.callCEFV(`mapCasePdMembersData.remove(${id})`);
    },
    setRanks(ranks) {
        if (typeof ranks == 'object') ranks = JSON.stringify(ranks);
        mp.callCEFV(`mapCasePdMembersData.setRanks(\`${ranks}\`)`);
    },
    setMemberRank(id, rank) {
        mp.callCEFV(`mapCasePdMembersData.setMemberRank(${id}, ${rank})`);
    },
    startSearch(id) {
        this.stopSearch();
        var rec = mp.players.atRemoteId(id);
        if (!id) return mp.mapCase.showRedMessage(`Игрок <span>#${id}</span> не найден`);
        this.searchPlayerId = id;
        this.searchTimer = mp.timer.add(() => {
            mp.events.callRemote(`mapCase.pd.searchById`, id);
            mp.mapCasePd.stopSearch();
        }, this.searchTime);
    },
    stopSearch(text = null) {
        mp.timer.remove(this.searchTimer);
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
        mp.timer.add(() => {
            var index = this.emergencyBlips.indexOf(blip);
            this.emergencyBlips.splice(index, 1);
            blip.destroy();
        }, this.emergencyBlipTime);
    },
};
mp.mapCaseArmy = {
    addMember(members) {
        if (typeof members == 'object') members = JSON.stringify(members);
        mp.callCEFV(`mapCaseNgMembersData.add(\`${members}\`)`);
    },
    removeMember(id) {
        mp.callCEFV(`mapCaseNgMembersData.remove(${id})`);
    },
    setRanks(ranks) {
        if (typeof ranks == 'object') ranks = JSON.stringify(ranks);
        mp.callCEFV(`mapCaseNgMembersData.setRanks(\`${ranks}\`)`);
    },
    setMemberRank(id, rank) {
        mp.callCEFV(`mapCaseNgMembersData.setMemberRank(${id}, ${rank})`);
    },
};
mp.mapCaseFib = {
    // Время установления личности (ms)
    searchTime: 15 * 1000,
    // Макс. дистанция установления личности
    searchMaxDist: 10,
    // Таймер установления личности
    searchTimer: null,
    // ИД игрока, личность которого устанавливается
    searchPlayerId: null,
    // Время жизни блипа подкрепления (ms)
    emergencyBlipTime: 60000,
    // Блипы, где запросили подкрепление
    emergencyBlips: [],

    setResultData(array) {
        for (var i = 0; i < array.length; i++) {
            var pos = array[i].housePos;
            array[i].num = i + 1;
            array[i].address = mp.utils.getStreetName(pos) || "-";
        }
        if (typeof array == 'object') array = JSON.stringify(array);
        mp.callCEFV(`mapCaseFIBDBResultData.setResult(\`${array}\`)`);
    },
    setProfileData(data) {
        var pos = data.housePos;
        data.property = "-";
        if (data.housePos) data.property = mp.utils.getStreetName(pos) + `, ${data.houseId}` || "-";
        data.pass = 2608180000 + data.id;
        if (!data.spouse) data.spouse = "-";
        else data.spouse = ((data.gender)? "замужем за " : "женат на ") + data.spouse;
        data.gender = (data.gender) ? "Ж" : "М";

        if (typeof data == 'object') data = JSON.stringify(data);
        mp.callCEFV(`mapCaseFIBProfileData.setProfileData(\`${data}\`)`);
    },
    addCall(calls) {
        if (typeof calls == 'object') calls = JSON.stringify(calls);
        mp.callCEFV(`mapCaseFIBCallsData.add(\`${calls}\`)`);
    },
    removeCall(id) {
        mp.callCEFV(`mapCaseFIBCallsData.remove(${id})`);
    },
    addWanted(wanted) {
        if (typeof wanted == 'object') wanted = JSON.stringify(wanted);
        mp.callCEFV(`mapCaseFIBWantedData.add(\`${wanted}\`)`);
    },
    removeWanted(id) {
        mp.callCEFV(`mapCaseFIBWantedData.remove(${id})`);
    },
    addMember(members) {
        if (typeof members == 'object') members = JSON.stringify(members);
        mp.callCEFV(`mapCaseFIBMembersData.add(\`${members}\`)`);
    },
    removeMember(id) {
        mp.callCEFV(`mapCaseFIBMembersData.remove(${id})`);
    },
    setRanks(ranks) {
        if (typeof ranks == 'object') ranks = JSON.stringify(ranks);
        mp.callCEFV(`mapCaseFIBMembersData.setRanks(\`${ranks}\`)`);
    },
    setMemberRank(id, rank) {
        mp.callCEFV(`mapCaseFIBMembersData.setMemberRank(${id}, ${rank})`);
    },
    startSearch(id) {
        this.stopSearch();
        var rec = mp.players.atRemoteId(id);
        if (!id) return mp.mapCase.showRedMessage(`Игрок <span>#${id}</span> не найден`);
        this.searchPlayerId = id;
        this.searchTimer = mp.timer.add(() => {
            mp.events.callRemote(`mapCase.fib.searchById`, id);
            mp.mapCaseFib.stopSearch();
        }, this.searchTime);
    },
    stopSearch(text = null) {
        mp.timer.remove(this.searchTimer);
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
        mp.timer.add(() => {
            var index = this.emergencyBlips.indexOf(blip);
            this.emergencyBlips.splice(index, 1);
            blip.destroy();
        }, this.emergencyBlipTime);
    },
};
mp.mapCaseEms = {
    addCall(calls) {
        if (typeof calls == 'object') calls = JSON.stringify(calls);
        mp.callCEFV(`mapCaseEmsCallsData.add(\`${calls}\`)`);
    },
    removeCall(id) {
        mp.callCEFV(`mapCaseEmsCallsData.remove(${id})`);
    },
    addMember(members) {
        if (typeof members == 'object') members = JSON.stringify(members);
        mp.callCEFV(`mapCaseEmsMembersData.add(\`${members}\`)`);
    },
    removeMember(id) {
        mp.callCEFV(`mapCaseEmsMembersData.remove(${id})`);
    },
    setRanks(ranks) {
        if (typeof ranks == 'object') ranks = JSON.stringify(ranks);
        mp.callCEFV(`mapCaseEmsMembersData.setRanks(\`${ranks}\`)`);
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
        mp.callCEFV(`mapCaseWnewsAdsData.setAd(${ad})`);
    },
    addMember(members) {
        if (typeof members == 'object') members = JSON.stringify(members);
        mp.callCEFV(`mapCaseWnewsMembersData.add(\`${members}\`)`);
    },
    removeMember(id) {
        mp.callCEFV(`mapCaseWnewsMembersData.remove(${id})`);
    },
    setRanks(ranks) {
        if (typeof ranks == 'object') ranks = JSON.stringify(ranks);
        mp.callCEFV(`mapCaseWnewsMembersData.setRanks(\`${ranks}\`)`);
    },
    setMemberRank(id, rank) {
        mp.callCEFV(`mapCaseWnewsMembersData.setMemberRank(${id}, ${rank})`);
    },
};

mp.events.add("mapCase.init", (name, factionId) => {
    mp.mapCase.enable(false);
    var type = "";
    if (mp.factions.isGovernmentFaction(factionId)) {
        type = "gover";
    } else if (mp.factions.isPoliceFaction(factionId)) {
        type = "pd";
        if (factionId == 2) mp.mapCasePd.menuHeader("LOS SANTOS<br/>POLICE DEPARTMENT");
        else mp.mapCasePd.menuHeader("BLAINE COUNTY<br/>SHERIFF DEPARTMENT");
    } else if (mp.factions.isFibFaction(factionId)) {
        type = "fib";
    } else if (mp.factions.isArmyFaction(factionId)) {
        type = "ng";
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

mp.events.add("mapCase.animation.show.play", mp.mapCase.playShowAnimation);

mp.events.add("mapCase.message.green.show", mp.mapCase.showGreenMessage);

mp.events.add("mapCase.message.red.show", mp.mapCase.showRedMessage);

mp.events.add("mapCase.gover.members.add", mp.mapCaseGover.addMember);

mp.events.add("mapCase.gover.members.remove", mp.mapCaseGover.removeMember);

mp.events.add("mapCase.gover.ranks.set", mp.mapCaseGover.setRanks);

mp.events.add("mapCase.gover.members.rank.set", mp.mapCaseGover.setMemberRank);

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

mp.events.add("mapCase.army.members.add", mp.mapCaseArmy.addMember);

mp.events.add("mapCase.army.members.remove", mp.mapCaseArmy.removeMember);

mp.events.add("mapCase.army.ranks.set", mp.mapCaseArmy.setRanks);

mp.events.add("mapCase.army.members.rank.set", mp.mapCaseArmy.setMemberRank);

mp.events.add("mapCase.fib.resultData.set", mp.mapCaseFib.setResultData);

mp.events.add("mapCase.fib.profileData.set", mp.mapCaseFib.setProfileData);

mp.events.add("mapCase.fib.calls.add", mp.mapCaseFib.addCall);

mp.events.add("mapCase.fib.calls.remove", mp.mapCaseFib.removeCall);

mp.events.add("mapCase.fib.wanted.add", mp.mapCaseFib.addWanted);

mp.events.add("mapCase.fib.wanted.remove", mp.mapCaseFib.removeWanted);

mp.events.add("mapCase.fib.members.add", mp.mapCaseFib.addMember);

mp.events.add("mapCase.fib.members.remove", mp.mapCaseFib.removeMember);

mp.events.add("mapCase.fib.ranks.set", mp.mapCaseFib.setRanks);

mp.events.add("mapCase.fib.members.rank.set", mp.mapCaseFib.setMemberRank);

mp.events.add("mapCase.fib.search.start", (recId) => {
    mp.mapCaseFib.startSearch(recId);
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
    var start = Date.now();
    var id = mp.mapCasePd.searchPlayerId;
    if (id) { // происходит установление личности
        var rec = mp.players.atRemoteId(id);
        if (!rec) return mp.mapCasePd.stopSearch(`Игрок не найден`);
        var dist = mp.vdist(rec.position, mp.players.local.position);
        if (dist > mp.mapCasePd.searchMaxDist) return mp.mapCasePd.stopSearch(`Игрок далеко`);
    }
    id = mp.mapCaseFib.searchPlayerId;
    if (id) { // происходит установление личности
        var rec = mp.players.atRemoteId(id);
        if (!rec) return mp.mapCaseFib.stopSearch(`Игрок не найден`);
        var dist = mp.vdist(rec.position, mp.players.local.position);
        if (dist > mp.mapCaseFib.searchMaxDist) return mp.mapCaseFib.stopSearch(`Игрок далеко`);
    }
    mp.timeMainChecker.modules.mapCase = Date.now() - start;
});

mp.events.add("mapCase.pd.emergencyBlips.add", (name, pos) => {
    mp.mapCasePd.addEmergencyBlip(name, pos);
});

mp.events.add("mapCase.fib.emergencyBlips.add", (name, pos) => {
    mp.mapCaseFib.addEmergencyBlip(name, pos);
});

mp.mapCase.registerAttachments();
