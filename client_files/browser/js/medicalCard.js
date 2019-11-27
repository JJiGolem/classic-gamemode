
var medicalCard = new Vue({
    el: "#medicalCard",
    data: {
        show: false,
        identifier: 228133744323, // Номер карты
        name: "Darian Rockfall", // Имя
        age: 28, // Возраст
        gender: "M", // Пол
        time: "18.11.2019", // Срок
        sign: "D.Rockfall", // Подпись
    },
    filters: {
        split(value) {
            console.log(value);
            value += "";
            return value.replace(/(\d)(?=(\d{4})+(\D|$))/g, '$1 ');
        }
    }
});

// for tests

//medicalCard.show = true;
