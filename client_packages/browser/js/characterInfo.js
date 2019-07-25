var characterInfo = new Vue({
    el: "#characterInfo",
    data: {
        show: false,
        characters: [], // массив с данными о персонажах
        // Индекс текущего персонажа
        i: 0,
        showCreateCharacter: false, // если true, то показаваем кнопку 'Создать персонажа'
    },
    methods: {
        pretty(val) {
            return prettyMoney(val);
        },
        addCharacter(character) {
            if (typeof character == 'string') character = JSON.parse(character);
            this.characters.push(character);
        },
        onClickCreateCharacter() {
            console.log("Кликнули на создание персонажа");
            // TODO: Реализация...
        }
    }
});

// for tests
/*characterInfo.addCharacter({
    name: "Benedictium Alfagrandsour",
    cash: 13234,
    bank: 52533,
    status: "Администратор",
    hours: 15,
    faction: "Байкеры",
    job: "Доктор наук",
    house: "Ричман Глен (228)",
    biz: "Парикмахерская (28)",
    warns: 1
});
characterInfo.addCharacter({
    name: "Carter Slade",
    cash: 1000,
    bank: 20000,
    status: "Бывалый",
    hours: 30,
    faction: "Groove Street",
    job: "Дальнобойщий",
    house: "Грув Стрит (10)",
    biz: "Автосалон (1)",
    warns: 0
});
characterInfo.show = true;*/
// characterInfo.showCreateCharacter = true;

var characterSelector = new Vue({
    el: "#characterSelector",
    methods: {
        left() {
            if (loader.show) return;
            mp.trigger("characterInit.chooseLeft");
        },
        enter() {
            if (loader.show) return;
            loader.show = true;
            mp.trigger("characterInit.choose");
        },
        right() {
            if (loader.show) return;
            mp.trigger("characterInit.chooseRight");
        }
    },
    computed: {
        show() {
            return characterInfo.show && characterInfo.characters.length;
        }
    }
});
