var selectMenu = new Vue({
    el: "#selectMenu",
    data: {
        show: false,
        // Текущее меню
        menu: null,
        // Макс. количество пунктов на экране
        maxItems: 5,
        // Макс. количество цветов в селекторе
        maxColorValues: 10,
        // Доступные структуры меню для использования
        menus: {
            "characterCreateMainMenu": {
                name: "charactercreatemain",
                header: "Главное меню", // заголовок меню, видимый на экране
                items: [{
                        text: "Пол",
                        values: ["Мужской", "Женский"],
                        i: 0
                    },
                    {
                        text: "Наследственность",
                    },
                    {
                        text: "Внешность",
                    },
                    {
                        text: "Сохранить и продолжить",
                    },
                    {
                        text: "Сбросить все изменения",
                    },
                    {
                        text: "Выйти без сохранения",
                    }
                ],
                i: 0, // индекс выбранного пункта
                j: 0, // индекс первого видимого пункта
                handler(eventName) { // обработчик взаимодействия с меню
                    var item = this.items[this.i];
                    var e = {
                        menuName: this.name, // название меню
                        itemName: item.text, // текст пункта меню
                        itemIndex: this.i, // индекс пункта меню
                        itemValue: (item.i != null && item.values) ? item.values[item.i] : null, // значение пункта меню
                        valueIndex: item.i, // индекс значения пункта меню
                    };
                    if (eventName == "onItemValueChanged" && e.itemName == "Пол") {
                        selectMenu.menus["characterCreateMainMenu"].items[0].i = e.valueIndex;
                        selectMenu.menus["characterCreateViewMenu"].items = e.valueIndex == 0 ? selectMenu.menus["characterCreateViewMenu"].itemsMale :
                            selectMenu.menus["characterCreateViewMenu"].itemsFemale;
                        //mp.trigger('characterInit.create.setGender', e.valueIndex);
                    }
                    if (eventName == "onItemSelected") {
                        switch (e.itemName) {
                            case "Наследственность":
                                selectMenu.menu = cloneObj(selectMenu.menus["characterCreateParentsMenu"]);
                                break;
                            case "Внешность":
                                selectMenu.menu = cloneObj(selectMenu.menus["characterCreateViewMenu"]);
                                break;
                            case "Сохранить и продолжить":
                                mp.trigger('characterInit.create.continue');
                                selectMenu.menu = cloneObj(selectMenu.menus["characterCreateNameMenu"]);
                                break;
                            case "Сбросить все изменения":
                                selectMenu.menu = cloneObj(selectMenu.menus["characterCreateResetMenu"]);
                                break;
                            case "Выйти без сохранения":
                                selectMenu.menu = cloneObj(selectMenu.menus["characterCreateExitMenu"]);
                                break;
                        }
                    }
                }
            },
            "characterCreateParentsMenu": {
                name: "charactercreateparents",
                header: "Наследственность", // заголовок меню, видимый на экране
                items: [{
                        text: "Мать",
                        values: ["Ханна", "Обри", "Жасмин", "Жизель", "Амелия", "Изабелла", "Зоуи", "Ава", "Камила", "Вайолет", "София", "Эвелин", "Николь", "Эшли", "Грейси", "Брианна", "Натали", "Оливия", "Элизабет", "Шарлотта", "Эмма", "Мисти"],
                        i: 0
                    },
                    {
                        text: "Отец",
                        values: ["Бенджамин", "Дэниэл", "Джошуа", "Ной", "Эндрю", "Хуан", "Алекс", "Айзек", "Эван", "Итан", "Винсент", "Энджел", "Диего", "Адриан", "Габриэль", "Майкл", "Сантьяго", "Кевин", "Луи", "Сэмюэль", "Энтони", "Клод", "Нико", "Джон"],
                        i: 0
                    },
                    {
                        text: "Сходство",
                        values: ["100% с папой", "75% с папой", "50%", "75% с мамой", "100% с мамой"],
                        i: 0
                    },
                    {
                        text: "Цвет кожи",
                        values: ['#e0c2aa', '#804e40', '#a1765a', '#ebad69', '#cb7d50', '#c47f5b'],
                        i: 0
                    },
                    {
                        text: "Назад",
                    },
                ],
                i: 0, // индекс выбранного пункта
                j: 0, // индекс первого видимого пункта
                handler(eventName) { // обработчик взаимодействия с меню
                    var item = this.items[this.i];
                    var e = {
                        menuName: this.name, // название меню
                        itemName: item.text, // текст пункта меню
                        itemIndex: this.i, // индекс пункта меню
                        itemValue: (item.i != null && item.values) ? item.values[item.i] : null, // значение пункта меню
                        valueIndex: item.i, // индекс значения пункта меню
                    };
                    if (eventName == "onItemValueChanged") {
                        switch (e.itemName) {
                            case "Мать":
                                mp.trigger('characterInit.create.setMother', e.valueIndex);
                                break;
                            case "Отец":
                                mp.trigger('characterInit.create.setFather', e.valueIndex);
                                break;
                            case "Сходство":
                                let sim = [0, 25, 50, 75, 100];
                                mp.trigger('characterInit.create.setSimilarity', sim[e.valueIndex]);
                                break;
                            case "Цвет кожи":
                                let col = [0, 2, 4, 6, 8, 10];
                                mp.trigger('characterInit.create.setSkin', col[e.valueIndex]);
                                break;
                        }
                    }
                    if (eventName == "onItemSelected") {
                        switch (e.itemName) {
                            case "Назад":
                                selectMenu.menu = cloneObj(selectMenu.menus["characterCreateMainMenu"]);
                                break;
                        }
                    }
                }
            },
            "characterCreateViewMenu": {
                name: "charactercreateview",
                header: "Внешность", // заголовок меню, видимый на экране
                itemsMale: [{
                        text: "Прическа",
                        values: [
                            "Под ноль", "Коротко", "Ястреб", "Хипстер", "Челка набок", "Коротко", "Байкер", "Хвост", "Косички", "Прилиза",
                            "Коротко", "Шипы", "Цезарь", "Чоппи", "Дреды", "Длинные", "Лохматый", "Серфингист", "Набок",
                            "Зализ", "Длинные", "Юный хипстер", "Муллет", "Косички", "Пальма", "Молния", "Уиппед", "Зиг-заг", "Снейл", "Хайтоп", "Откинутые",
                            "Андеркат", "Боковой андер", "Колючий ирокез", "Мод", "Слоями", "Флэттоп", "Армеец"
                        ],
                        i: 0
                    },
                    {
                        text: "Цвет волос",
                        values: ["#211f1c", "#55362f", "#4b382e", "#4d291b",
                            "#70351e", "#904422", "#a55c36", "#a56944",
                            "#ac744f", "#ae7d57", "#be9161", "#cda670",
                            "#c8a370", "#d5a861", "#e0b775", "#e8c487",
                            "#b78457", "#a85d3d", "#963523", "#7c1411",
                            "#921812", "#a81c14", "#cb371e", "#de411b",
                            "#be532f", "#d34d21", "#907867", "#a78e7a",
                            "#d4bda9", "#e4cfbe"
                        ],
                        i: 0
                    },
                    {
                        text: "Дополнительный цвет волос",
                        values: ["#211f1c", "#55362f", "#4b382e", "#4d291b",
                            "#70351e", "#904422", "#a55c36", "#a56944",
                            "#ac744f", "#ae7d57", "#be9161", "#cda670",
                            "#c8a370", "#d5a861", "#e0b775", "#e8c487",
                            "#b78457", "#a85d3d", "#963523", "#7c1411",
                            "#921812", "#a81c14", "#cb371e", "#de411b",
                            "#be532f", "#d34d21", "#907867", "#a78e7a",
                            "#d4bda9", "#e4cfbe"
                        ],
                        i: 0
                    },
                    {
                        text: "Волосы на лице",
                        values: ['#e0c2aa', '#804e40', '#a1765a', '#ebad69', '#cb7d50', '#c47f5b'],
                        i: 0
                    },
                    {
                        text: "Цвет волос на лице",
                        values: ['#e0c2aa', '#804e40', '#a1765a', '#ebad69', '#cb7d50', '#c47f5b'],
                        i: 0
                    },
                    {
                        text: "Назад",
                    },
                ],
                itemsFemale: [{
                        text: "Прическа",
                        values: [
                            "Под ноль", "Коротко", "Слои", "Косички", "Хвост", "Ирокез", "Косички", "Боб", "Ястреб", "Ракушка",
                            "Лонг боб", "Свободно", "Пикси", "Бритые виски", "Узел", "Волнистый боб", "Красотка", "Пучок", "Тугой узел",
                            "Твистед боб", "Флэппер боб", "Биг бэнгс", "Плетеные", "Муллет", "Косички", "Листья", "Зиг-заг",
                            "Пигтейл бэнгс", "Волнистые", "Катушка", "Завеса", "Откинутые", "Андеркат",
                            "Боковой андер", "Колючий ирокез", "Бандана", "Слоями", "Скинберд", "Аккуратные", "Шорт боб"
                        ],
                        i: 0
                    },
                    {
                        text: "Цвет волос",
                        values: ["#211f1c", "#55362f", "#4b382e", "#4d291b",
                            "#70351e", "#904422", "#a55c36", "#a56944",
                            "#ac744f", "#ae7d57", "#be9161", "#cda670",
                            "#c8a370", "#d5a861", "#e0b775", "#e8c487",
                            "#b78457", "#a85d3d", "#963523", "#7c1411",
                            "#921812", "#a81c14", "#cb371e", "#de411b",
                            "#be532f", "#d34d21", "#907867", "#a78e7a",
                            "#d4bda9", "#e4cfbe"
                        ],
                        i: 0
                    },
                    {
                        text: "Дополнительный цвет волос",
                        values: ["#211f1c", "#55362f", "#4b382e", "#4d291b",
                            "#70351e", "#904422", "#a55c36", "#a56944",
                            "#ac744f", "#ae7d57", "#be9161", "#cda670",
                            "#c8a370", "#d5a861", "#e0b775", "#e8c487",
                            "#b78457", "#a85d3d", "#963523", "#7c1411",
                            "#921812", "#a81c14", "#cb371e", "#de411b",
                            "#be532f", "#d34d21", "#907867", "#a78e7a",
                            "#d4bda9", "#e4cfbe"
                        ],
                        i: 0
                    },
                    {
                        text: "Назад",
                    },
                ],
                items: this.itemsMale,
                i: 0, // индекс выбранного пункта
                j: 0, // индекс первого видимого пункта
                handler(eventName) { // обработчик взаимодействия с меню
                    var item = this.items[this.i];
                    var e = {
                        menuName: this.name, // название меню
                        itemName: item.text, // текст пункта меню
                        itemIndex: this.i, // индекс пункта меню
                        itemValue: (item.i != null && item.values) ? item.values[item.i] : null, // значение пункта меню
                        valueIndex: item.i, // индекс значения пункта меню
                    };
                    if (eventName == "onItemValueChanged") {
                        switch (e.itemName) {
                            case "Прическа":

                                break;
                            case "Цвет волос":

                                break;
                            case "Дополнительный цвет волос":

                                break;
                            case "Волосы на лице":

                                break;
                        }
                    }
                    if (eventName == "onItemSelected") {
                        switch (e.itemName) {
                            case "Назад":
                                selectMenu.menu = cloneObj(selectMenu.menus["characterCreateMainMenu"]);
                                break;
                        }
                    }
                }
            },
            "characterCreateNameMenu": {
                name: "charactercreatename",
                header: "Имя персоонажа", // заголовок меню, видимый на экране
                items: [{
                        text: "",
                        values: ["Имя"],
                        i: 0,
                        type: "editable" // возможность редактирования значения пункта меню
                    },
                    {
                        text: "",
                        values: ["Фамилия"],
                        i: 0,
                        type: "editable" // возможность редактирования значения пункта меню
                    },
                    {
                        text: "Принять",
                    },
                    {
                        text: "Назад",
                    },
                ],
                i: 0, // индекс выбранного пункта
                j: 0, // индекс первого видимого пункта
                handler(eventName) { // обработчик взаимодействия с меню
                    var item = this.items[this.i];
                    var e = {
                        menuName: this.name, // название меню
                        itemName: item.text, // текст пункта меню
                        itemIndex: this.i, // индекс пункта меню
                        itemValue: (item.i != null && item.values) ? item.values[item.i] : null, // значение пункта меню
                        valueIndex: item.i, // индекс значения пункта меню
                    };
                    if (eventName == "onItemSelected") {
                        switch (e.itemName) {
                            case "Принять":
                                mp.trigger('characterInit.create.check', this.items[0].values[0], this.items[1].values[0]);
                                break;
                            case "Назад":
                                mp.trigger('characterInit.create.back');
                                selectMenu.menu = cloneObj(selectMenu.menus["characterCreateMainMenu"]);
                                break;
                        }
                    }
                }
            },
            "characterCreateResetMenu": {
                name: "charactercreatereset",
                header: "Сбросить все изменения?", // заголовок меню, видимый на экране
                items: [{
                        text: "Да",
                    },
                    {
                        text: "Нет",
                    },
                ],
                i: 0, // индекс выбранного пункта
                j: 0, // индекс первого видимого пункта
                handler(eventName) { // обработчик взаимодействия с меню
                    var item = this.items[this.i];
                    var e = {
                        menuName: this.name, // название меню
                        itemName: item.text, // текст пункта меню
                        itemIndex: this.i, // индекс пункта меню
                        itemValue: (item.i != null && item.values) ? item.values[item.i] : null, // значение пункта меню
                        valueIndex: item.i, // индекс значения пункта меню
                    };
                    if (eventName == "onItemSelected") {
                        switch (e.itemName) {
                            case "Да":
                                mp.trigger('characterInit.create.reset');
                                selectMenu.menu = cloneObj(selectMenu.menus["characterCreateMainMenu"]);
                                break;
                            case "Нет":
                                selectMenu.menu = cloneObj(selectMenu.menus["characterCreateMainMenu"]);
                                break;
                        }
                    }
                }
            },
            "characterCreateExitMenu": {
                name: "charactercreateexit",
                header: "Хотите выйти?", // заголовок меню, видимый на экране
                items: [{
                        text: "Да",
                    },
                    {
                        text: "Нет",
                    },
                ],
                i: 0, // индекс выбранного пункта
                j: 0, // индекс первого видимого пункта
                handler(eventName) { // обработчик взаимодействия с меню
                    var item = this.items[this.i];
                    var e = {
                        menuName: this.name, // название меню
                        itemName: item.text, // текст пункта меню
                        itemIndex: this.i, // индекс пункта меню
                        itemValue: (item.i != null && item.values) ? item.values[item.i] : null, // значение пункта меню
                        valueIndex: item.i, // индекс значения пункта меню
                    };
                    if (eventName == "onItemSelected") {
                        switch (e.itemName) {
                            case "Да":
                                mp.trigger('charCreator.client', false);
                                this.show = false;
                                break;
                            case "Нет":
                                selectMenu.menu = cloneObj(selectMenu.menus["characterCreateMainMenu"]);
                                break;
                        }
                    }
                }
            },
            "parkingMenu": {
                name: "parking",
                header: "Парковка", // заголовок меню, видимый на экране
                items: [{
                        text: "Забрать автомобиль",
                    },
                    {
                        text: "Закрыть меню",
                    }
                ],
                i: 0, // индекс выбранного пункта
                j: 0, // индекс первого видимого пункта
                handler(eventName) { // обработчик взаимодействия с меню
                    var item = this.items[this.i];
                    var e = {
                        menuName: this.name, // название меню
                        itemName: item.text, // текст пункта меню
                        itemIndex: this.i, // индекс пункта меню
                        itemValue: (item.i != null && item.values) ? item.values[item.i] : null, // значение пункта меню
                        valueIndex: item.i, // индекс значения пункта меню
                    };
                    mp.trigger(`chat.message.push`, `!{#ffffff} Событие: ${eventName}`);
                    mp.trigger(`chat.message.push`, `!{#ffffff} ${JSON.stringify(e)}`);
                    if (eventName == 'onItemSelected') {
                        if (e.itemName == 'Забрать автомобиль') {
                            mp.trigger(`parkings.vehicle.get`);
                        }
                        if (e.itemName == 'Закрыть меню') {
                            mp.trigger(`parkings.menu.close`);
                        }
                    }
                }
            },
            "carShowMenu": {
                name: "carshow",
                header: "Автосалон",
                items: [{
                        text: "Модель",
                        values: [],
                        i: 0,
                    },
                    {
                        text: "Основной цвет",
                        values: [],
                        i: 0,
                    },
                    {
                        text: "Дополнительный цвет",
                        values: [],
                        i: 0,
                    },
                    {
                        text: "Купить"
                    }
                ],
                i: 0, // индекс выбранного пункта
                j: 0, // индекс первого видимого пункта
                handler(eventName) { // обработчик взаимодействия с меню
                    var item = this.items[this.i];
                    var e = {
                        menuName: this.name, // название меню
                        itemName: item.text, // текст пункта меню
                        itemIndex: this.i, // индекс пункта меню
                        itemValue: (item.i != null && item.values) ? item.values[item.i] : null, // значение пункта меню
                        valueIndex: item.i, // индекс значения пункта меню
                    };
                    mp.trigger(`chat.message.push`, `!{#ffffff} Событие: ${eventName}`);
                    mp.trigger(`chat.message.push`, `!{#ffffff} ${JSON.stringify(e)}`);
                    if (eventName == 'onItemValueChanged') {
                        if (e.itemName == 'Модель') {
                            mp.trigger(`carshow.vehicle.show`, e.valueIndex);
                        }
                        if (e.itemName == 'Основной цвет') {
                            mp.trigger(`carshow.vehicle.color`, e.valueIndex, -1);
                        }
                        if (e.itemName == 'Дополнительный цвет') {
                            mp.trigger(`carshow.vehicle.color`, -1, e.valueIndex);
                        }
                    }
                    if (eventName == 'onItemSelected') {
                        if (e.itemName == 'Купить') {
                            mp.trigger(`carshow.car.buy`);
                        }
                    }
                    if (eventName == 'onEscapePressed') {
                        mp.trigger(`carshow.list.close`);
                    }
                }
            },
            "carMarketSellMenu": {
                name: "carmarketsell",
                header: "Авторынок",
                items: [{
                        text: "Продать транспорт",
                        i: 0,
                    },
                    {
                        text: "Отмена",
                        i: 0,
                    }
                ],
                i: 0,
                j: 0,
                handler(eventName) {
                    var item = this.items[this.i];
                    var e = {
                        menuName: this.name,
                        itemName: item.text,
                        itemIndex: this.i,
                        itemValue: (item.i != null && item.values) ? item.values[item.i] : null,
                        valueIndex: item.i,
                    };
                    if (eventName == 'onItemSelected') {
                        if (e.itemName == 'Продать транспорт') {
                            mp.trigger(`carmarket.car.sell`);
                        }
                        if (e.itemName == 'Отмена') {
                            mp.trigger(`carmarket.sellmenu.close`);
                        }
                    }
                }
            },
            "carMarketBuyMenu": {
                name: "carmarketbuy",
                header: "Авторынок",
                items: [{
                        text: "Купить транспорт",
                        i: 0,
                    },
                    {
                        text: "Отмена",
                        i: 0,
                    }
                ],
                i: 0,
                j: 0,
                handler(eventName) {
                    var item = this.items[this.i];
                    var e = {
                        menuName: this.name,
                        itemName: item.text,
                        itemIndex: this.i,
                        itemValue: (item.i != null && item.values) ? item.values[item.i] : null,
                        valueIndex: item.i,
                    };
                    if (eventName == 'onItemSelected') {
                        if (e.itemName == 'Купить транспорт') {
                            mp.trigger(`carmarket.car.buy`);
                        }
                        if (e.itemName == 'Отмена') {
                            mp.trigger(`carmarket.buymenu.close`);
                        }
                    }
                }
            },
            "carServiceJobMenu": {
                name: "carservicejob",
                header: "Начальник СТО",
                items: [{
                        text: "Устроиться на работу",
                        i: 0,
                    },
                    {
                        text: "Помощь",
                        i: 0,
                    }
                ],
                i: 0,
                j: 0,
                handler(eventName) {
                    var item = this.items[this.i];
                    var e = {
                        menuName: this.name,
                        itemName: item.text,
                        itemIndex: this.i,
                        itemValue: (item.i != null && item.values) ? item.values[item.i] : null,
                        valueIndex: item.i,
                    };
                    if (eventName == 'onItemSelected') {
                        // if (e.itemName == 'Купить транспорт') {
                        //     mp.trigger(`carmarket.car.buy`);
                        // }
                        // if (e.itemName == 'Отмена') {
                        //     mp.trigger(`carmarket.buymenu.close`);
                        // }
                    }
                }
            },
        },
        // Уведомление
        notification: null,
        // Время показа уведомления
        showNotifTime: 10000,
        // Показ колесика загрузка
        loader: false,
    },
    methods: {
        onKeyUp(e) {
            if (!this.show || this.loader) return;
            if (e.keyCode == 38) { // UP
                if (this.menu.i == 0) return;
                this.menu.i = Math.clamp(this.menu.i - 1, 0, this.menu.items.length - 1);
                if (this.menu.i < this.menu.j) this.menu.j--;
                setTimeout(() => {
                    if (this.valuesType(this.menu.i) == 3) { // editable
                        var itemText = this.menu.items[this.menu.i].text;
                        this.$refs[itemText][0].focus();
                    }
                }, 100);
                this.onItemFocusChanged();
            } else if (e.keyCode == 40) { // DOWN
                if (this.menu.i == this.menu.items.length - 1) return;
                this.menu.i = Math.clamp(this.menu.i + 1, 0, this.menu.items.length - 1);
                if (this.menu.i - this.menu.j == this.maxItems) this.menu.j++;
                setTimeout(() => {
                    if (this.valuesType(this.menu.i) == 3) { // editable
                        var itemText = this.menu.items[this.menu.i].text;
                        this.$refs[itemText][0].focus();
                    }
                }, 100);
                this.onItemFocusChanged();
            } else if (e.keyCode == 37) { // LEFT
                var item = this.menu.items[this.menu.i];
                if (!item.values || item.i == 0) return;
                item.i = Math.clamp(item.i - 1, 0, item.values.length - 1);
                if (item.i < item.j) item.j--;
                this.onItemValueChanged();
            } else if (e.keyCode == 39) { // RIGHT
                var item = this.menu.items[this.menu.i];
                if (!item.values || item.i == item.values.length - 1) return;
                item.i = Math.clamp(item.i + 1, 0, item.values.length - 1);
                if (item.i - item.j == this.maxColorValues) item.j++;
                this.onItemValueChanged();
            } else if (e.keyCode == 13) { // ENTER
                this.onItemSelected();
            } else if (e.keyCode == 8) { // BACKSPACE
                this.onBackspacePressed();
            } else if (e.keyCode == 27) { // ESCAPE
                this.onEscapePressed();
            }
        },
        isItemShow(index) {
            return index >= this.menu.j && index <= this.menu.j + this.maxItems - 1;
        },
        isValueShow(index) {
            var i = this.menu.items[this.menu.i].i;
            return index <= 2;
        },
        isColorValueShow(index) {
            var item = this.menu.items[this.menu.i];
            return index >= item.j && index <= item.j + this.maxColorValues - 1;
        },
        valuesType(index) {
            // 0 - обычное значение, 1 - цвет, 2 - ползунок, 3 - ввод текста, -1 - нет значений
            var values = this.menu.items[index].values;
            if (!values) return -1;
            if (values[0][0] == '#') return 1;
            if (this.menu.items[index].type == "editable") return 3;
            for (var i = 0; i < values.length; i++) {
                var value = values[i];
                if (typeof value != 'number') return 0;
            }
            return 2;
        },
        // ************** События взаимодействия с меню **************
        // Выбран пункт меню
        onItemSelected(e) {
            this.menu.handler("onItemSelected");
        },
        // Изменено значение пункта меню
        onItemValueChanged() {
            this.menu.handler("onItemValueChanged");
        },
        // Изменен фокус пункта меню
        onItemFocusChanged() {
            this.menu.handler("onItemFocusChanged");
        },
        // Нажата клавиша 'Назад'
        onBackspacePressed() {
            this.menu.handler("onBackspacePressed");
        },
        onEscapePressed() {
            this.menu.handler("onEscapePressed");
        },
        // open() {
        //     this.menu.i = 0; // TEMP, нужно разобраться, почему i/j остаются прежними при закрытии/открытии меню
        //     this.menu.j = 0;
        //     this.show = true;
        // },
        // close() {
        //     this.menu = null;
        // }
    },
    computed: {
        items() {
            if (!this.menu) return null;
            var items = this.menu.items.slice(0);
            return items;
        },
        values() {
            if (!this.menu) return null;
            var i = this.menu.items[this.menu.i].i;
            var values = this.menu.items[this.menu.i].values;
            if (!values) return null;
            var result = [values[i - 1] || "", values[i], values[i + 1] || ""];
            return result;
        },
        leftNumberType() {
            var offset = 3.5; // половина от ширины шарика ползунка
            if (this.menu.items[this.menu.i].i == 0) return 0 - offset + '%';
            var values = this.menu.items[this.menu.i].values;
            var maxValue = values[values.length - 1];
            var curValue = values[this.menu.items[this.menu.i].i];
            return curValue / maxValue * 100 - offset + '%';
        }
    },
    watch: {
        notification(val, oldVal) {
            if (oldVal || !val) return;

            var self = this;
            setTimeout(function() {
                self.notification = null;
            }, self.showNotifTime);
        },
    },
    mounted() {
        let self = this;
        window.addEventListener('keyup', function(e) {
            if (!self.menu) return;
            self.onKeyUp(e);
        });
    }
});

// for tests
// Для своего меню необходимо создать след. структуру (комментарии внутри):
/*var testMenu = {
    name: "test", // название меню, необходимо для отловки событий
    header: "Меню выбора", // заголовок меню, видимый на экране
    items: [{
            text: "Выборочный тип 1", // текст пункта меню, видимый на экране
            // если ОДНО ИЗ значений начинается с '#', то снизу появится селектор цветов
            // если ВСЕ значения - числа, то снизу появится селектор с ползунком
            // в любом другом случае, появится обычный селектор со значениями
            values: ['Выбор 1', 'Выбор 2', 'Выбор 3', 'Выбор 4', 'Выбор 5', 'Выбор 6'], // доступные значения пункта меню
            i: 0, // индекс выбранного значения пункта меню
        },
        {
            text: "Выбор цвета 2",
            values: ['#0bf', '#fb0', '#bf0', '#fb0', '#fb0', '#fb0', '#bf0', '#0fe', '#cd3', 'yellow', 'pink'],
            i: 0, // индекс выбранного значения пункта меню
            j: 0, // индекс первого видимого значения пункта меню (актуально только для цветов)
        },
        {
            text: "Ползунок 2.5",
            values: [0, 10, 20, 30, 40, 50],
            i: 0,
            min: "Минимум", // слово слева от ползунка
            max: "Максимум", // слово справа от ползунка
        },
        {
            text: "Ввод 1",
            values: ["Текст 1"],
            i: 0,
            type: "editable" // возможность редактирования значения пункта меню
        },
        {
            text: "Ввод 2",
            values: ["Текст 2"],
            i: 0,
            type: "editable" // возможность редактирования значения пункта меню
        },
        {
            text: "Ползунок 3.5",
            values: [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 100],
            i: 0,
            min: "Округлые", // слово слева от ползунка
            max: "Впалые", // слово справа от ползунка
        },
        {
            text: "Выборочный тип 4",
            values: ['Выбор 1', 'Выбор 2', 'Выбор 3'],
            i: 0,
        },
        {
            text: "Выбор цвета 5",
            values: ['#0bf', '#fb0', '#bf0'],
            i: 0, // индекс выбранного значения пункта меню
            j: 0, // индекс первого видимого значения пункта меню (актуально только для цветов)
        },
        {
            text: "Центр",
            location: "center" // расположение кнопки (left | center | right)
        },
        {
            text: "Справа",
            location: "right" // расположение кнопки (left | center | right)
        },
        {
            text: "Выборочный тип 7",
            values: ['Выбор 1', 'Выбор 2', 'Выбор 3'],
            i: 0,
        },
        {
            text: "Выбор цвета 8",
            values: ['#0bf', '#fb0', '#bf0'],
            i: 0, // индекс выбранного значения пункта меню
            j: 0, // индекс первого видимого значения пункта меню (актуально только для цветов)
        },
        {
            text: "Обычный тип 9",
        },
    ],
    i: 1, // индекс выбранного пункта
    j: 0, // индекс первого видимого пункта
    handler(eventName) { // обработчик взаимодействия с меню
        var item = this.items[this.i];
        var e = {
            menuName: this.name, // название меню
            itemName: item.text, // текст пункта меню
            itemIndex: this.i, // индекс пункта меню
            itemValue: (item.i != null && item.values) ? item.values[item.i] : null, // значение пункта меню
            valueIndex: item.i, // индекс значения пункта меню
        };
        console.log(`Событие: ${eventName}`);
        console.log(e);
    }
};
// Далее, присвоить эту структуру модулю selectMenu:
selectMenu.menu = testMenu;
// Показываем меню:
selectMenu.show = true;
selectMenu.notification = "Здесь короче тестовое уведомление. У Вас неправильный ник или город прописки!";*/
