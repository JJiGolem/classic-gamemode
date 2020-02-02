
var mapCaseGoverMembersData = {
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

var mapCaseGoverWindowsData = {
    members: mapCaseGoverMembersData,
}

var mapCaseGoverData =  {
    menuHeader: 'GOVERNMENT',
    menuTitle: "Добро пожаловать,",
    menuHeaderImg: "img/mapCase/menu-header-gover.svg",
    windowsData: mapCaseGoverWindowsData,
    menuBody: {
        members: {
            title: "Список сотрудников",
            img: mapCaseSvgPaths.users,
            windows: ["members"],
        },
    },
}

mapCaseGoverMembersData.setRanks(["Старший медик", "Альпака", "Главный уборщик", "Старший Альпака"]);

mapCaseGoverMembersData.dismiss = (data) => {
    mp.trigger(`callRemote`, `mapCase.gover.members.uval`, data.id);
}

mapCaseGoverMembersData.lowerRank = (data) => {
    if (data.rank <= 1)
        return mapCase.showRedMessage(`<span>${data.name}</span><br /> имеет мин. ранг - ${mapCaseGoverMembersData.ranks[data.rank - 1]}`);
    mp.trigger(`callRemote`, `mapCase.gover.rank.lower`, data.id);
}

mapCaseGoverMembersData.raiseRank = (data) => {
    if (data.rank >= mapCaseGoverMembersData.ranks.length)
        return mapCase.showRedMessage(`<span>${data.name}</span><br /> имеет макс. ранг - ${mapCaseGoverMembersData.ranks[data.rank - 1]}`);
    mp.trigger(`callRemote`, `mapCase.gover.rank.raise`, data.id);
}