
var governmentBadge = new Vue({
    el: "#governmentBadge",
    data: {
        show: false,
        type: "lspd", // fib, lspd, dcsd
        identifier: 50234, // Номер значка
        name: "Darian Rockfall", // Имя
        rank: "unnamed",
        gender: "Mужской", // Пол (Все кроме fib)
        sign: "D.Rockfall", // Подпись
        directorSign: "E.Wilkinson", // Подпись лидера (только в fib)
    },
});

// for tests

//governmentBadge.show = true;
