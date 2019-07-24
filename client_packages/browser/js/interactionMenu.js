var interactionMenu = new Vue({
    el: "#interactionMenu",
    data: {
        show: false,
        // Текущее меню
        menu: null
    },
    methods: {
        imgSrc(index) {
            var item = this.menu.items[index];
            var icon = item.icon || "default.png";
            return "img/interactionMenu/" + icon;
        },
        onClick(index) {
            this.menu.handler(index);
        }
    }
});

// for tests
// Для своего меню необходимо создать след. структуру (комментарии внутри):
/*var testMenu = {
    name: "test", // название меню
    items: [{
            text: "Познакомиться", // текст пункта меню
            icon: "handshake.png" // иконка пункта меню (необяз.)
        },
        {
            text: "Обмен",
            icon: "trade.png"
        },
        {
            text: "Документы",
            icon: "card.png"
        },
        {
            text: "Новый пункт"
        }
    ],
    handler(index) { // обработчик кликов на пункт меню
        var item = this.items[index];
        console.log(`Кликнули на пункт: ${item.text}`);
    }
};
// Далее, присвоить эту структуру модулю interactionMenu:
interactionMenu.menu = testMenu;
// Показываем меню:
interactionMenu.show = true;*/
