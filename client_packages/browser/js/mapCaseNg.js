
var mapCaseNgMembersData = {
    list: [],
    ranks: [],
    sortMod: {
        mod: "num",
        update (mod) {
            this.mod = mod;
        }
    },
    rankHead: "Должность",
    setRanks (ranksList) {
        if (typeof ranksList == 'string') ranksList = JSON.parse(ranksList);
        this.ranks = ranksList;
    },
    setMemberRank(id, rank) {
        rank = Math.clamp(rank, 1, this.ranks.length);
        for (var i = 0; i < this.list.length; i++) {
            var rec = this.list[i];
            if (rec.id == id) rec.rank = rank;
        }
    },
    add(members) {
        if (typeof members == 'string') members = JSON.parse(members);
        if (!Array.isArray(members)) members = [members];
        for (var i = 0; i < members.length; i++) {
            this.remove(members[i].id);
            this.list.push(members[i]);
        }
    },
    remove(id) {
        for (var i = 0; i < this.list.length; i++) {
            if (this.list[i].id == id) {
                this.list.splice(i, 1);
                i--;
            }
        }
    },
    dismiss (data) {},
    lowerRank (data) {},
    raiseRank (data) {},
}

var mapCaseNgWindowsData = {
    members: mapCaseNgMembersData,
}

var mapCaseNgData =  {
    menuHeader: 'UNITED STATES<br />ARMY',
    menuTitle: "Добро пожаловать,",
    menuHeaderImg: "img/mapCase/menu-header-ng.svg",
    windowsData: mapCaseNgWindowsData,
    menuBody: {
        members: {
            title: "Список сотрудников",
            img: mapCaseSvgPaths.users,
            windows: ["members"],
        },
    },
}

mapCaseNgMembersData.setRanks(["Старший медик", "Альпака", "Главный уборщик", "Старший Альпака"]);

mapCaseNgMembersData.dismiss = (data) => {
    mp.trigger(`callRemote`, `mapCase.army.members.uval`, data.id);
}

mapCaseNgMembersData.lowerRank = (data) => {
    if (data.rank <= 1)
        return mapCase.showRedMessage(`<span>${data.name}</span><br /> имеет мин. ранг - ${mapCaseNgMembersData.ranks[data.rank - 1]}`);
    mp.trigger(`callRemote`, `mapCase.army.rank.lower`, data.id);
}

mapCaseNgMembersData.raiseRank = (data) => {
    if (data.rank >= mapCaseNgMembersData.ranks.length)
        return mapCase.showRedMessage(`<span>${data.name}</span><br /> имеет макс. ранг - ${mapCaseNgMembersData.ranks[data.rank - 1]}`);
    mp.trigger(`callRemote`, `mapCase.army.rank.raise`, data.id);
}

