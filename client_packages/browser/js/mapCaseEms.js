
var mapCaseEmsCallsData = {
    list: [],
    sortMod: {
        mod: "num",
        update (mod) {
            this.mod = mod;
        }
    },
    accept (data) {},
};

var mapCaseEmsMembersData = {
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

var mapCaseEmsWindowsData = {
    calls: mapCaseEmsCallsData,
    members: mapCaseEmsMembersData,
}

var mapCaseEmsData =  {
    menuHeader: 'EMERGENCY MEDICAL<br />SERVICE',
    menuTitle: "Добро пожаловать,",
    menuHeaderImg: "img/mapCase/menu-header-ems.svg",
    windowsData: mapCaseEmsWindowsData,
    menuBody: {
        calls: {
            title: "Вызовы",
            img: mapCaseSvgPaths.smartphone,
            windows: ["calls"],
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
    mapCaseEmsCallsData.list = [{num, name, description}];

    массив, отображающийся в списке вызовов
*/
/*
    mapCaseEmsMembersData.list = [{ num, name, rank }];

    массив, отображающийся в списке сотрудников
*/


//Следущие функции необходимо реализовать
//Для примера в них реализованы импровизированные ответы от сервера

//Функция, срабатывающая при принятии вызова
//data - данные о вызове
mapCaseEmsCallsData.accept = (data) => {

    setTimeout(() => {
        let index = mapCaseEmsCallsData.list.indexOf(data);

        mapCaseEmsCallsData.list.splice(index, 1);

        mapCase.showGreenMessage(`Вы приняли вызов от <br/><span>${data.name}</span>`);

    }, 3000);
}

//Функция, устанавливающая массив рангов (от младшего к старшему)
mapCaseEmsMembersData.setRanks(["Старший медик", "Альпака", "Главный уборщик", "Старший Альпака"]);


//Функция, срабатывающая при увольнение сотрудника
//data - данные о сотруднике из записи в списке
mapCaseEmsMembersData.dismiss = (data) => {
    setTimeout(() => {
        mapCase.showRedMessage(`<span>${data.name}</span><br /> был уволен`);

        let index = mapCaseEmsMembersData.list.indexOf(data);
        mapCaseEmsMembersData.list.splice(index, 1);
    }, 3000);
}


//Функция, срабатывающая при понижении сотрудника (крайние случаи не обработаны, может выйти за пределы массива рангов)
//data - данные о сотруднике из записи в списке
mapCaseEmsMembersData.lowerRank = (data) => {
    setTimeout(() => {
        data.rank--;
        mapCase.showGreenMessage(`<span>${data.name}</span><br /> был понижен до ранга ${mapCaseEmsMembersData.ranks[data.rank]}`);
    }, 3000);
}


//Функция, срабатывающая при повышении сотрудника (крайние случаи не обработаны, может выйти за пределы массива рангов)
//data - данные о сотруднике из записи в списке
mapCaseEmsMembersData.raiseRank = (data) => {
    setTimeout(() => {
        data.rank++;
        mapCase.showGreenMessage(`<span>${data.name}</span><br /> был повышен до ранга ${mapCaseEmsMembersData.ranks[data.rank]}`);
    }, 3000);
}


//for tests
mapCaseEmsCallsData.list = [
    {
        num: 2,
        name: "Curys Raider",
        description: "ПАльпака покусал",
    },
    {
        num: 1,
        name: "ACurysirusew Raiderderder",
        description: "Альпака покусал",
    },
    {
        num: 3,
        name: "Curysirusew Raiderderder",
        description: "Альпака покусал",
    },
    {
        num: 4,
        name: "Curys Raider",
        description: "Альпака покусал",
    },
];

mapCaseEmsMembersData.list = [
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
