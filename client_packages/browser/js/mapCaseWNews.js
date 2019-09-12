
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
                mapCase.showRedMessage("Нет объявлений<br />для редактироания!");
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
        text: "",
        editMod: false,
    }),
    methods: {
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
            mapCase.showLoad();
            mapCase.currentOverWindow = null;
            this.adData.send({...this.adData.ad, text: this.text});
        },
        refuse () {
            mapCase.showLoad();
            mapCase.currentOverWindow = null;
            this.adData.refuse({...this.adData.ad, text: this.text});
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
        maxLength: 380,
        send: (adData) => {},
        refuse: (adData) => {},
    },
    getAd: () => {},
    setAd (adData) {
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
    setRanks (ranksList) {
        this.ranks = ranksList;
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


//api
/*
    mapCaseWnewsMembersData.list = [{ num, name, rank }];

    массив, отображающийся в списке сотрудников
*/
/*
    mapCaseWnewsAdsData.adsAmount = int;

    Кол-во сообщений для редактирования.
*/
/*
    mapCaseWnewsAdsData.setAd({ text: str, author: str });

    Показывает всплывающее окно для редактирования объявления
    Параметр - объект с обязательными свойствами:
        text - содержание объявления
        author - автор объявления
*/
/*
    mapCaseWnewsAdsData.adData.maxLength = int

    Устанавливает максимальное кол-во символов в текстовом поле редактирования сообщения. Стандартно 380.
*/



//Следущие функции необходимо реализовать
//Для примера в них реализованы импровизированные ответы от сервера

//Функция, устанавливающая массив рангов (от младшего к старшему)
mapCaseWnewsMembersData.setRanks(["Старший редахтер", "Альпака", "Главный уборщик", "Старший Альпака"]);


//Функция, срабатывающая при увольнение сотрудника
//data - данные о сотруднике из записи в списке
mapCaseWnewsMembersData.dismiss = (data) => {
    setTimeout(() => {
        mapCase.showRedMessage(`<span>${data.name}</span><br /> был уволен`);

        let index = mapCaseWnewsMembersData.list.indexOf(data);
        mapCaseWnewsMembersData.list.splice(index, 1);
    }, 3000);
}


//Функция, срабатывающая при понижении сотрудника (крайние случаи не обработаны, может выйти за пределы массива рангов)
//data - данные о сотруднике из записи в списке
mapCaseWnewsMembersData.lowerRank = (data) => {
    setTimeout(() => {
        data.rank--;
        mapCase.showGreenMessage(`<span>${data.name}</span><br /> был понижен до ранга ${mapCaseWnewsMembersData.ranks[data.rank]}`);
    }, 3000);
}


//Функция, срабатывающая при повышении сотрудника (крайние случаи не обработаны, может выйти за пределы массива рангов)
//data - данные о сотруднике из записи в списке
mapCaseWnewsMembersData.raiseRank = (data) => {
    setTimeout(() => {
        data.rank++;
        mapCase.showGreenMessage(`<span>${data.name}</span><br /> был повышен до ранга ${mapCaseWnewsMembersData.ranks[data.rank]}`);
    }, 3000);
}

//Функция, срабатывающая при запросе объявления
mapCaseWnewsAdsData.getAd = () => {
    setTimeout(() => {
        let adData = {
            text: "Тачку хачу купить",
            author: "Cy Raider",
        };
        mapCaseWnewsAdsData.setAd(adData);
    }, 3000);
}

//Функция, срабатывающая при отпралении объявления
//adData - информация об объявлении ({ text, author })
mapCaseWnewsAdsData.adData.send = (adData) => {
    console.log(adData);
    setTimeout(() => {
        mapCase.showGreenMessage(`Объявление<br />отправлено!`);
        mapCaseWnewsAdsData.adsAmount--;
    }, 3000);
}

//Функция, срабатывающая при отказе публикации
//adData - информация об объявлении ({ text, author })
mapCaseWnewsAdsData.adData.refuse = (adData) => {
    console.log(adData);
    setTimeout(() => {
        mapCase.showRedMessage(`Отказано<br />в публикации!`);
        mapCaseWnewsAdsData.adsAmount--;
    }, 3000);
}

//for tests

mapCaseWnewsMembersData.list = [
    {
        num: 1,
        name: "Curys Raider",
        rank: 2,
    },
    {
        num: 2,
        name: "Curysirusew Raiderderder",
        rank: 1,
    },
    {
        num: 3,
        name: "Curysirusew Raiderderder",
        rank: 1,
    },
];

mapCaseWnewsAdsData.adsAmount = 2;
