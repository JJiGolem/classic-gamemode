var interactionMenu = new Vue({
    el: "#interactionMenu",
    data: {
        show: false,
        // Возможность использования
        enable: true,
        left: 80, /// сдвиг от левой части экрана
        // Текущее меню
        menu: null,
        menus: {
            "vehicle": {
                name: "vehicle", // название меню
                items: [{
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
                    if (item.text == 'FIB') {
                        interactionMenu.menu = interactionMenu.menus["fib_vehicle"];
                    }
                }
            },
            "vehicle_inside": {
                name: "vehicle_inside", // название меню
                items: [{
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
                items: [],
                handler(index) {
                    var item = this.items[index];
                    mp.trigger(`interaction.eject`, index);
                    mp.trigger(`interaction.menu.close`);
                }
            },
            "player_ownmenu": {
                name: "player_ownmenu",
                items: [{
                        text: "Мои документы",
                        icon: "doc.png"
                    },
                    // {
                    //     text: "Анимации",
                    //     icon: "activity.png"
                    // }
                ],
                handler(index) {
                    var item = this.items[index];
                    if (item.text == 'Мои документы') {
                        mp.trigger(`documents.list`);
                        //mp.trigger(`interaction.menu.close`);
                    } else if (item.text == "Захват") {
                        mp.trigger(`interaction.menu.close`);
                        if (captureScore.show) return notifications.push(`error`, `Недоступно`);
                        mp.trigger(`callRemote`, `bands.capture.start`);
                    } else if (item.text == "Захват биз.") {
                        mp.trigger(`interaction.menu.close`);
                        if (captureScore.show) return notifications.push(`error`, `Недоступно`);
                        mp.trigger(`callRemote`, `mafia.bizWar.show`);
                    } else if (item.text == "Эфир") {
                        mp.trigger(`interaction.menu.close`);
                        mp.trigger(`callRemote`, `news.stream`);
                    }
                }
            },
            "player_interaction": {
                name: "player_interaction",
                items: [{
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
                    if (item.text == 'Познакомиться') {
                        interactionMenu.show = false;
                        mp.trigger(`interactionMenu.onClick`, this.name, item.text);
                    } else if (item.text == 'Документы') {
                        mp.trigger(`documents.list`);
                    } else if (item.text == 'Деньги') {
                        //mp.trigger(`interaction.menu.close`);
                        interactionMenu.show = false;
                        mp.trigger(`interaction.money.show`);

                    } else if (item.text == 'Организация') {
                        interactionMenu.menu = interactionMenu.menus["faction"];
                    } else if (item.text == 'Government') {
                        interactionMenu.menu = interactionMenu.menus["government"];
                    } else if (item.text == 'Police') {
                        interactionMenu.menu = interactionMenu.menus["police"];
                    } else if (item.text == 'FIB') {
                        interactionMenu.menu = interactionMenu.menus["fib"];
                    } else if (item.text == 'Hospital') {
                        interactionMenu.menu = interactionMenu.menus["hospital"];
                    } else if (item.text == 'Mafia') {
                        interactionMenu.menu = interactionMenu.menus["mafia"];
                    } else if (item.text == 'Weazel News') {
                        interactionMenu.menu = interactionMenu.menus["news"];
                    }
                }
            },
            "player_docs": {
                name: "player_docs",
                items: [{
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
                    },
                    {
                        text: "Лиц. на оружие",
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
                    if (item.text == 'Лиц. на оружие') {
                        mp.trigger(`documents.showTo`, "gunLicense");
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
                items: [{
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
                    mp.trigger(`interaction.menu.close`);
                }
            },
            "government": {
                name: "government",
                items: [{
                        text: "Наручники",
                    },
                    {
                        text: "Освобождение",
                    },
                    {
                        text: "Следование",
                    },
                    {
                        text: "В авто",
                    },
                ],
                handler(index) {
                    var item = this.items[index];
                    mp.trigger(`interactionMenu.onClick`, this.name, item.text);
                    mp.trigger(`interaction.menu.close`);
                }
            },
            "police": {
                name: "police",
                items: [{
                        text: "Наручники",
                    },
                    {
                        text: "Розыск",
                    },
                    {
                        text: "Арест",
                    },
                    {
                        text: "Следование",
                    },
                    {
                        text: "Лиц. на оружие",
                    },
                    {
                        text: "В авто",
                    },
                ],
                handler(index) {
                    var item = this.items[index];
                    if (item.text == 'Лиц. на оружие') return interactionMenu.showByName("police_gunlicense");
                    mp.trigger(`interactionMenu.onClick`, this.name, item.text);
                    mp.trigger(`interaction.menu.close`);
                }
            },
            "police_gunlicense": {
                name: "police_gunlicense",
                items: [{
                        text: "Выдать",
                    },
                    {
                        text: "Изъять",
                    },
                ],
                handler(index) {
                    var item = this.items[index];
                    mp.trigger(`interactionMenu.onClick`, this.name, item.text);
                    mp.trigger(`interaction.menu.close`);
                }
            },
            "fib": {
                name: "fib",
                items: [{
                        text: "Наручники",
                    },
                    {
                        text: "Розыск",
                    },
                    {
                        text: "Арест",
                    },
                    {
                        text: "Следование",
                    },
                    {
                        text: "Прослушка",
                    },
                    {
                        text: "В авто",
                    },
                ],
                handler(index) {
                    var item = this.items[index];
                    mp.trigger(`interactionMenu.onClick`, this.name, item.text);
                    mp.trigger(`interaction.menu.close`);
                }
            },
            "fib_vehicle": {
                name: "fib_vehicle",
                items: [{
                    text: "Номер",
                }, ],
                handler(index) {
                    var item = this.items[index];
                    mp.trigger(`interactionMenu.onClick`, this.name, item.text);
                    mp.trigger(`interaction.menu.close`);
                }
            },
            "hospital": {
                name: "hospital",
                items: [{
                        text: "Лечить",
                    },
                    {
                        text: "Реанимировать",
                    },
                ],
                handler(index) {
                    var item = this.items[index];
                    mp.trigger(`interactionMenu.onClick`, this.name, item.text);
                    mp.trigger(`interaction.menu.close`);
                }
            },
            "mafia": {
                name: "mafia",
                items: [{
                        text: "Продать крышу",
                    },
                    {
                        text: "Связать",
                    },
                    {
                        text: "Вести",
                    },
                    {
                        text: "Мешок на голову",
                    },
                ],
                handler(index) {
                    var item = this.items[index];
                    mp.trigger(`interaction.menu.close`);
                    mp.trigger(`interactionMenu.onClick`, this.name, item.text);
                }
            },
            "news": {
                name: "news",
                items: [{
                        text: "Эфир",
                    }
                ],
                handler(index) {
                    var item = this.items[index];
                    mp.trigger(`interaction.menu.close`);
                    mp.trigger(`interactionMenu.onClick`, this.name, item.text);
                }
            },
        },
        faction: null,
    },
    methods: {
        imgSrc(index) {
            var item = this.menu.items[index];
            var icon = item.icon || "default.png";
            return "img/interactionMenu/" + icon;
        },
        onClick(index) {
            this.menu.handler(index);
        },
        showByName(name) {
            var menu = this.menus[name];
            if (!menu) return;
            this.menu = menu;
            this.show = true;
        },
        addItems(menuName, items) {
            if (typeof items == 'string') items = JSON.parse(items);
            if (!Array.isArray(items)) items = [items];
            var menu = this.menus[menuName];
            if (!menu) return;
            items.forEach(item => {
                this.deleteItem(menuName, item.text);
                menu.items.push(item);
            });
        },
        deleteItem(menuName, itemText) {
            var menu = this.menus[menuName];
            if (!menu) return;
            for (var i = 0; i < menu.items.length; i++) {
                var item = menu.items[i];
                if (item.text == itemText) {
                    menu.items.splice(i, 1);
                    i--;
                }
            }
        },
    },
    watch: {
        enable(val) {
            if (!val) this.show = false;
        },
        show(val) {
            if (val) {
                busy.add("interaction", true);
                setCursor(true);
            } else {
                busy.remove("interaction", true);
                if (!busy.includes()) setCursor(false);
            }
        },
        faction(val) {
            if (!val) {
                this.deleteItem("player_interaction", "Организация");
                this.deleteItem("player_interaction", "Government");
                this.deleteItem("player_interaction", "Police");
                this.deleteItem("player_interaction", "FIB");
                this.deleteItem("player_interaction", "Hospital");
                this.deleteItem("player_interaction", "Weazel News");
                this.deleteItem("player_interaction", "Mafia");
                this.deleteItem("player_ownmenu", "Захват");
                this.deleteItem("player_ownmenu", "Захват биз.");
                this.deleteItem("player_ownmenu", "Эфир");
                this.deleteItem("vehicle", "FIB");
                return;
            }
            this.addItems("player_interaction", {
                text: "Организация"
            });

            if (val == 1) { // government
                this.addItems("player_interaction", {
                    text: "Government"
                });
            } else this.deleteItem("player_interaction", "Government");


            if (val == 2 || val == 3) { // police
                this.addItems("player_interaction", {
                    text: "Police"
                });
            } else this.deleteItem("player_interaction", "Police");

            if (val == 4) { // fib
                this.addItems("player_interaction", {
                    text: "FIB"
                });
                this.addItems("vehicle", {
                    text: "FIB"
                });
            } else {
                this.deleteItem("player_interaction", "FIB");
                this.deleteItem("vehicle", "FIB");
            }

            if (val == 5) { // hospital
                this.addItems("player_interaction", {
                    text: "Hospital"
                });
            } else this.deleteItem("player_interaction", "Hospital");

            if (val == 7) { // news
                this.addItems("player_interaction", {
                    text: "Weazel News"
                });
                this.addItems("player_ownmenu", {
                    text: "Эфир"
                });
            } else {
                this.deleteItem("player_interaction", "Weazel News");
                this.deleteItem("player_ownmenu", "Эфир");
            }

            if (val >= 8 && val <= 11) { // bands
                var item = {
                    text: "Захват"
                };
                this.addItems("player_ownmenu", {
                    text: "Захват"
                });
            } else this.deleteItem("player_ownmenu", "Захват");
            if (val >= 12 && val <= 14) { // mafia
                this.addItems("player_interaction", {
                    text: "Mafia"
                });
                this.addItems('player_ownmenu', {
                    text: "Захват биз."
                });
            } else {
                this.deleteItem("player_interaction", "Mafia");
                this.deleteItem('player_ownmenu', "Захват биз.");
            }
        }
    },
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
