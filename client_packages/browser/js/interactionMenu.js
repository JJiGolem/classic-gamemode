var interactionMenu = new Vue({
    el: "#interactionMenu",
    data: {
        show: false,
        left: 80, /// сдвиг от левой части экрана
        // Текущее меню
        menu: null,
        menus: {
            "vehicle": {
                name: "vehicle", // название меню
                items: [
                    {
                        text: "Двери",
                        icon: "key.png"
                    },
                    {
                        text: "Капот",
                        icon: "hood.png"
                    },
                    {
                        text: "Багажник",
                        icon: "trunk.png"
                    }
                ],
                handler(index) {
                    var item = this.items[index];
                    if (item.text == 'Двери') {
                        mp.trigger(`vehicles.lock`);
                        mp.trigger(`interaction.menu.close`);
                    }
                    if (item.text == 'Капот') {
                        mp.trigger(`vehicles.hood`);
                        mp.trigger(`interaction.menu.close`);
                    }
                    if (item.text == 'Багажник') {
                        mp.trigger(`vehicles.trunk`);
                        mp.trigger(`interaction.menu.close`);
                    }
                    if (item.text == 'Диагностика') {
                        mp.trigger(`carservice.diagnostics.offer`);
                        mp.trigger(`interaction.menu.close`);
                    }
                }
            },
            "vehicle_inside": {
                name: "vehicle_inside", // название меню
                items: [
                    {
                        text: "Двери",
                        icon: "key.png"
                    },
                    {
                        text: "Вытолкнуть",
                        icon: "eject.png"
                    }
                ],
                handler(index) {
                    var item = this.items[index];
                    if (item.text == 'Двери') {
                        mp.trigger(`vehicles.lock`);
                        mp.trigger(`interaction.menu.close`);
                    }
                    if (item.text == 'Вытолкнуть') {
                        mp.trigger(`interaction.ejectlist.get`);
                        //mp.trigger(`interaction.menu.close`);
                    }
                    if (item.text == 'Звук сирены') {
                        mp.trigger(`vehicles.siren.sound`);
                        mp.trigger(`interaction.menu.close`);
                    }
                    if (item.text == 'Продать Т/С') {
                        mp.trigger(`interaction.menu.close`);
                        mp.trigger(`vehicles.sell.show`);
                    }
                }
            },
            "vehicle_ejectlist": {
                name: "vehicle_ejectlist",
                items: [
                ],
                handler(index) {
                    var item = this.items[index];
                    mp.trigger(`interaction.eject`, index);
                    mp.trigger(`interaction.menu.close`);
                }
            },
            "player_ownmenu": {
                name: "player_ownmenu",
                items: [
                    {
                        text: "Мои документы",
                        icon: "doc.png"
                    },
                    {
                        text: "Анимации",
                        icon: "activity.png"
                    }
                ],
                handler(index) {
                    var item = this.items[index];
                    if (item.text == 'Мои документы') {
                        mp.trigger(`documents.list`);
                        //mp.trigger(`interaction.menu.close`);
                    }
                }
            },
            "player_interaction": {
                name: "player_interaction",
                items: [
                    {
                        text: "Познакомиться",
                        icon: "hands.png"
                    },
                    {
                        text: "Документы",
                        icon: "doc.png"
                    },
                    {
                        text: "Деньги",
                        icon: "wallet.png"
                    }
                ],
                handler(index) {
                    var item = this.items[index];
                    if (item.text == 'Документы') {
                        mp.trigger(`documents.list`);
                    } else if (item.text == 'Деньги') {
                        //mp.trigger(`interaction.menu.close`);
                        interactionMenu.show = false;
                        mp.trigger(`interaction.money.show`);
                       
                    } else if (item.text == 'Организация') {
                        // TODO: ...
                    }
                }
            },
            "player_docs": {
                name: "player_docs",
                items: [
                    {
                        text: "Паспорт",
                        icon: "doc.png"
                    },
                    {
                        text: "Лицензии на т/с",
                        icon: "doc.png"
                    },
                    {
                        text: "Паспорт т/с",
                        icon: "doc.png"
                    }
                ],
                handler(index) {
                    var item = this.items[index];
                    if (item.text == 'Паспорт') {
                        mp.trigger(`documents.showTo`, "characterPass");
                        mp.trigger(`interaction.menu.close`);
                    }
                    if (item.text == 'Лицензии на т/с') {
                        mp.trigger(`documents.showTo`, "driverLicense");
                        mp.trigger(`interaction.menu.close`);
                    }
                    if (item.text == 'Паспорт т/с') {
                        mp.trigger(`documents.showTo`, "carPass");
                        mp.trigger(`interaction.menu.close`);
                    }
                }
            },
            "carPass_list": {
                name: "carPass_list",
                items: [

                ],
                handler(index) {
                    var item = this.items[index];
                    let plate = item.text.split(' ')[1];
                    mp.trigger('documents.carPass.list.choose', plate);
                    mp.trigger(`interaction.menu.close`);
                }
            },
            "faction": {
                name: "faction",
                items: [
                    {
                        text: "Пригласить",
                    },
                    {
                        text: "Уволить",
                    },
                    {
                        text: "Ранг",
                    }
                ],
                handler(index) {
                    var item = this.items[index];
                    mp.trigger(`interactionMenu.onClick`, this.name, item.text);
                    interactionMenu.show = false;
                }
            },
        }
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
    },
    // watch: {
    //     show(val) {
    //         setCursor(val);
    //         if (val) busy.add("interaction", true);
    //         else busy.remove("interaction", true);
    //     }
    // },
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
            text: "Обмен"
        },
        {
            text: "Документы",
            icon: "doc.png"
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
