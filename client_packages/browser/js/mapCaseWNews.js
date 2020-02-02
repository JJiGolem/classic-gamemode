
Vue.component('map-case-wnews-ads', {
    template: "#map-case-wnews-ads",
    props: {
        getAd: Function,
        adsAmount: Number,
    },
    data: () => ({

    }),
    methods: {
        get () {
            if (!this.adsAmount) {
                mapCase.showRedMessage("Нет объявлений<br />для редактирования!");
                return;
            }

            mapCase.showLoad();
            this.getAd();
        },
    }
});

Vue.component("map-case-wnews-over-ads", {
    template: "#map-case-wnews-over-ads",
    props: {
        adData: Object,
    },
    data: () => ({
        header: "Текст объявления:",
        text: "",
        editMod: false,
        refuseMod: false,
    }),
    methods: {
        inputCheck(event) {
            if (event.keyCode == 13)
                event.preventDefault();
            //console.log(event.keyCode)
        },
        update (event) {
            if (event.target.innerText.length > this.adData.maxLength) {
                event.target.innerText = this.text;
                return;
            }
            this.text = event.target.innerText;
        },
        edit () {
            this.editMod = true;
        },
        send () {
            if (!this.text)
                return;
            mapCase.showLoad();
            mapCase.currentOverWindow = null;
            this.adData.send({...this.adData.ad, text: this.text});
        },
        refuse () {
            if (this.refuseMod) {
                if (!this.text)
                    return;
                mapCase.showLoad();
                mapCase.currentOverWindow = null;
                this.adData.refuse({...this.adData.ad, text: this.text});
                return;
            }

            this.header = "Причина отказа:";
            this.$el.children[1].innerText = "";
            this.editMod = true;
            this.refuseMod = true;
        },
        setFocus(enable) {
            mapCase.inputFocus = enable;
        },
    },
    mounted () {
        this.text = this.adData.ad.text;
        this.$el.children[1].innerText = this.text;
    },
});


var mapCaseWnewsAdsData = {
    adsAmount: 0,
    adData: {
        ad: { text: "", author: "" },
        maxLength: 60,
        send: (adData) => {},
        refuse: (adData) => {},
    },
    getAd: () => {},
    setAd (adData) {
        if (typeof adData == 'string') adData = JSON.parse(adData);
        this.adData.ad = adData;

        mapCase.currentOverWindow = `map-case-wnews-over-ads`;
        mapCase.hideLoad();
    },
}

var mapCaseWnewsMembersData = {
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

var mapCaseWnewsWindowsData = {
    ads: mapCaseWnewsAdsData,
    members: mapCaseWnewsMembersData,
}

var mapCaseWnewsData =  {
    menuHeader: "",
    menuHeaderName: "img/mapCase/wnews-head-name.svg",
    menuTitle: "Добро пожаловать,",
    menuHeaderImg: "img/mapCase/menu-header-wnews.svg",
    windowsData: mapCaseWnewsWindowsData,
    menuBody: {
        ads: {
            title: "Объявления",
            img: mapCaseSvgPaths.newsPaper,
            windows: ["ads"],
        },
        members: {
            title: "Список сотрудников",
            img: mapCaseSvgPaths.users,
            windows: ["members"],
        },
    },
}

mapCaseWnewsMembersData.setRanks(["Старший редахтер", "Альпака", "Главный уборщик", "Старший Альпака"]);

mapCaseWnewsMembersData.dismiss = (data) => {
    mp.trigger(`callRemote`, `mapCase.news.members.uval`, data.id);
}

mapCaseWnewsMembersData.lowerRank = (data) => {
    if (data.rank <= 1)
        return mapCase.showRedMessage(`<span>${data.name}</span><br /> имеет мин. ранг - ${mapCaseWnewsMembersData.ranks[data.rank - 1]}`);
    mp.trigger(`callRemote`, `mapCase.news.rank.lower`, data.id);
}

mapCaseWnewsMembersData.raiseRank = (data) => {
    if (data.rank >= mapCaseWnewsMembersData.ranks.length)
        return mapCase.showRedMessage(`<span>${data.name}</span><br /> имеет макс. ранг - ${mapCaseWnewsMembersData.ranks[data.rank - 1]}`);
    mp.trigger(`callRemote`, `mapCase.news.rank.raise`, data.id);
}

mapCaseWnewsAdsData.getAd = () => {
    mp.trigger(`callRemote`, `mapCase.news.ads.get`);
    // setTimeout(() => {
    //     let adData = {
    //         text: "Тачку хачу купить",
    //         author: "Cy Raider",
    //     };
    //     mapCaseWnewsAdsData.setAd(adData);
    // }, 3000);
}

mapCaseWnewsAdsData.adData.send = (adData) => {
    mp.trigger(`callRemote`, `mapCase.news.ads.accept`, JSON.stringify(adData));
    // console.log(adData);
    // setTimeout(() => {
    //     mapCase.showGreenMessage(`Объявление<br />отправлено!`);
    //     mapCaseWnewsAdsData.adsAmount--;
    // }, 3000);
}

mapCaseWnewsAdsData.adData.refuse = (adData) => {
    mp.trigger(`callRemote`, `mapCase.news.ads.cancel`, JSON.stringify(adData));
    // console.log(adData);
    // setTimeout(() => {
    //     mapCase.showRedMessage(`Отказано<br />в публикации!`);
    //     mapCaseWnewsAdsData.adsAmount--;
    // }, 3000);
}

mapCaseWnewsAdsData.adsAmount = 0;
