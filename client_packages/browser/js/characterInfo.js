var characterInfo = new Vue({
    el: "#characterInfo",
    data: {
        show: false,
        characters: [], // массив с данными о персонажах
        // Индекс текущего персонажа
        i: 0,
        // Возможность создать ещё одного персонажа
        canNewCharacter: true
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
            if (loader.show) return;
            loader.show = true;
            mp.trigger("characterInit.choose");
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

var characterSelector = new Vue({
    el: "#characterSelector",
    methods: {
        left() {
            if (loader.show || this.leftArrowDisabled) return;
            mp.trigger("characterInit.chooseLeft");
        },
        enter() {
            if (loader.show || this.enterDisabled) return;
            loader.show = true;
            mp.trigger("characterInit.choose");
        },
        right() {
            if (loader.show || this.rightArrowDisabled) return;
            mp.trigger("characterInit.chooseRight");
        },
    },
    computed: {
        show() {
            return characterInfo.show && characterInfo.characters.length;
        },
        leftArrowDisabled() {
            return characterInfo.i <= 0;
        },
        rightArrowDisabled() {
            if (characterInfo.i == characterInfo.characters.length - 1 && !characterInfo.canNewCharacter) return true;
            return characterInfo.i > characterInfo.characters.length - 1;
        },
        enterDisabled() {
            return characterInfo.i > characterInfo.characters.length - 1;
        },
    }
});

var createCharacter = new Vue({
    el: "#createCharacter",
    computed: {
        show() {
            return characterInfo.canNewCharacter && characterInfo.show &&
                (characterInfo.i >= characterInfo.characters.length ||
                !characterInfo.characters.length);
        }
    },
    methods: {
        onClickCreateCharacter() {
            alert("Кликнули на создание персонажа");
            // TODO: Реализация...
        }
    }
});
