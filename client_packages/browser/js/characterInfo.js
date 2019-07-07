var characterInfo = new Vue({
    el: "#characterInfo",
    data: {
        show: false,
        characters: [],
        // Индекс текущего персонажа
        i: 0
    },
    methods: {
        pretty(val) {
            val += '';
            return val.replace(/(\d)(?=(\d{3})+(\D|$))/g, '$1 ');
        },
        addCharacter(character) {
            if (typeof character == 'string') character = JSON.parse(character);
            this.characters.push(character);
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
