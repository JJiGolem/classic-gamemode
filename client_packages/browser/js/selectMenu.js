var selectMenu = new Vue({
    el: "#selectMenu",
    data: {
        show: false,
        menu: null,
        maxItems: 5,
        maxColorValues: 10,
        menus: {
            "characterCreateMainMenu": {
                name: "charactercreatemain",
                header: "Главное меню",
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
                    // {
                    //     text: "Сбросить все изменения",
                    // },
                    {
                        text: "Выйти без сохранения",
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
                    if (eventName == "onItemValueChanged" && e.itemName == "Пол") {
                        selectMenu.menus["characterCreateMainMenu"].items[0].i = e.valueIndex;
                        selectMenu.menus["characterCreateParentsMenu"].items[0].i = 0;
                        selectMenu.menus["characterCreateParentsMenu"].items[1].i = 0;
                        selectMenu.menus["characterCreateParentsMenu"].items[2].i = e.valueIndex == 0 ? 0 : 4;
                        selectMenu.menus["characterCreateParentsMenu"].items[3].i = 0;
                        selectMenu.menus["characterCreateViewMenu"].items = (e.valueIndex == 0) ? cloneObj(selectMenu.menus["characterCreateViewMenu"].defaultItemsMale) : cloneObj(selectMenu.menus["characterCreateViewMenu"].defaultItemsFemale);

                        mp.trigger('characterInit.create.setGender', e.valueIndex);
                    }
                    if (eventName == "onEscapePressed") {
                        selectMenu.menu = selectMenu.menus["characterCreateExitMenu"];
                    }
                    if (eventName == "onItemSelected") {
                        switch (e.itemName) {
                            case "Наследственность":
                                selectMenu.menu = selectMenu.menus["characterCreateParentsMenu"];
                                break;
                            case "Внешность":
                                selectMenu.menu = selectMenu.menus["characterCreateViewMenu"];
                                mp.trigger("characterInit.camera.head");
                                break;
                            case "Сохранить и продолжить":
                                mp.trigger('characterInit.create.continue');
                                selectMenu.menu = selectMenu.menus["characterCreateNameMenu"];
                                break;
                                // case "Сбросить все изменения":
                                //     selectMenu.menu = selectMenu.menus["characterCreateResetMenu"];
                                //     break;
                            case "Выйти без сохранения":
                                selectMenu.menu = selectMenu.menus["characterCreateExitMenu"];
                                break;
                        }
                    }
                }
            },
            "characterCreateParentsMenu": {
                name: "charactercreateparents",
                header: "Наследственность",
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
                        i: 0,
                        j: 0
                    },
                    {
                        text: "Назад",
                    },
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
                    if (eventName == "onEscapePressed" || eventName == 'onBackspacePressed') {
                        selectMenu.menu = selectMenu.menus["characterCreateMainMenu"];
                    }
                    if (eventName == "onItemValueChanged") {
                        switch (e.itemName) {
                            case "Мать":
                                let mothers = [21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 45];
                                mp.trigger('characterInit.create.setMother', mothers[e.valueIndex]);
                                break;
                            case "Отец":
                                let fathers = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 42, 43, 44];
                                mp.trigger('characterInit.create.setFather', fathers[e.valueIndex]);
                                break;
                            case "Сходство":
                                let sim = [100, 75, 50, 25, 0];
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
                                selectMenu.menu = selectMenu.menus["characterCreateMainMenu"];
                                break;
                        }
                    }
                }
            },
            "characterCreateViewMenu": {
                name: "charactercreateview",
                header: "Внешность",

                defaultItemsMale: [{
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
                        i: 0,
                        j: 0
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
                        i: 0,
                        j: 0
                    },
                    {
                        text: "Волосы на лице",
                        values: ["Нет", "Легкая щетина", "Бальбоа", "Круглая борода", "Эспаньолка", "Козлиная бородка", "Островок", "Тонкая бородка", "Неряха", "Мушкетер", "Усы", "Ухоженная борода", "Щетина", "Тонкая бородка", "Подкова", "Карандаш", "Ремень", "Бальбо и баки", "Баки", "Неряшливая борода", "Дали", "Дали и борода", "Руль", "Фауст", "Англичанин", "Голливуд", "Фу Манчу", "Островок с баками", "Широкие баки", "Ширма"],
                        i: 0
                    },
                    {
                        text: "Цвет волос на лице",
                        values: ["#211f1c", "#55362f", "#4b382e", "#4d291b",
                            "#70351e", "#904422", "#a55c36", "#a56944",
                            "#ac744f", "#ae7d57", "#be9161", "#cda670",
                            "#c8a370", "#d5a861", "#e0b775", "#e8c487",
                            "#b78457", "#a85d3d", "#963523", "#7c1411",
                            "#921812", "#a81c14", "#cb371e", "#de411b",
                            "#be532f", "#d34d21", "#907867", "#a78e7a",
                            "#d4bda9", "#e4cfbe"
                        ],
                        i: 0,
                        j: 0
                    },
                    {
                        text: "Брови",
                        values: ["Нет", "Аккуратные", "Модные", "Клеопатра", "Ироничные", "Женственные", "Обольстительные", "Нахмуренные", "Чикса", "Триумф", "Беззаботные", "Дугой", "Мышка", "Двойная высечка", "Впалые", "Карандаш", "Выщипанные", "Прямые", "Естественные", "Пышные", "Неопрятные", "Широкие", "Обычные", "Южноевропейские", "Ухоженные", "Кустистые", "Перышки", "Колючки", "Монобровь", "Крылатые", "Тройная высечка", "Высечка дугой", "Подрезанные", "Сходящие на нет", "Высечка"],
                        i: 0
                    },
                    {
                        text: "Высота бровей",
                        values: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
                        i: 10,
                        min: "Выше", 
                        max: "Ниже",
                    },
                    {
                        text: "Глубина бровей",
                        values: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
                        i: 10,
                        min: "Внутрь",
                        max: "Наружу",
                    },
                    {
                        text: "Цвет бровей",
                        values: ["#211f1c", "#55362f", "#4b382e", "#4d291b",
                            "#70351e", "#904422", "#a55c36", "#a56944",
                            "#ac744f", "#ae7d57", "#be9161", "#cda670",
                            "#c8a370", "#d5a861", "#e0b775", "#e8c487",
                            "#b78457", "#a85d3d", "#963523", "#7c1411",
                            "#921812", "#a81c14", "#cb371e", "#de411b",
                            "#be532f", "#d34d21", "#907867", "#a78e7a",
                            "#d4bda9", "#e4cfbe"
                        ],
                        i: 0,
                        j: 0
                    },
                    {
                        text: "Размер глаз",
                        values: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
                        i: 10,
                        min: "Шире",
                        max: "Уже",
                    },
                    {
                        text: "Цвет глаз",
                        values: ["#50c878", "#008000", "#add8e6", "#0077be", "#b5651d", "#654321", "#d0c383", "#a9a9a9"],
                        i: 0,
                        j: 0
                    },
                    {
                        text: "Глубина переносицы",
                        values: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
                        i: 10,
                        min: "Округлая",
                        max: "Впалая",
                    },
                    {
                        text: "Сдвиг переносицы",
                        values: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
                        i: 10,
                        min: "Левее",
                        max: "Правее",
                    },
                    {
                        text: "Высота расположения носа",
                        values: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
                        i: 10,
                        min: "Выше",
                        max: "Ниже",
                    },
                    {
                        text: "Ширина носа",
                        values: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
                        i: 10,
                        min: "Уже", 
                        max: "Шире", 
                    },
                    {
                        text: "Длина кончика носа",
                        values: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
                        i: 10,
                        min: "Больше", 
                        max: "Меньше", 
                    },
                    {
                        text: "Высота кончика носа",
                        values: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
                        i: 10,
                        min: "Выше", 
                        max: "Ниже", 
                    },
                    {
                        text: "Ширина скул",
                        values: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
                        i: 10,
                        min: "Уже", 
                        max: "Шире", 
                    },
                    {
                        text: "Глубина щек",
                        values: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
                        i: 10,
                        min: "Округлые",
                        max: "Впалые", 
                    },
                    {
                        text: "Толщина губ",
                        values: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
                        i: 10,
                        min: "Шире", 
                        max: "Уже",
                    },
                    {
                        text: "Форма челюсти",
                        values: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
                        i: 10,
                        min: "Меньше", 
                        max: "Больше",
                    },
                    {
                        text: "Ширина челюсти",
                        values: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
                        i: 10,
                        min: "Уже",
                        max: "Шире", 
                    },
                    {
                        text: "Высота подбородка",
                        values: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
                        i: 10,
                        min: "Выше",
                        max: "Ниже", 
                    },
                    {
                        text: "Глубина подбородка",
                        values: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
                        i: 10,
                        min: "Короткий", 
                        max: "Длинный",
                    },
                    {
                        text: "Ширина подбородка",
                        values: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
                        i: 10,
                        min: "Уже", 
                        max: "Шире", 
                    },
                    {
                        text: "Выступ подбородка",
                        values: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
                        i: 10,
                        min: "Наружу", 
                        max: "Внутрь", 
                    },
                    {
                        text: "Ширина шеи",
                        values: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
                        i: 10,
                        min: "Уже", 
                        max: "Шире",
                    },
                    {
                        text: "Дефекты кожи",
                        values: ["Нет", "Корь", "Прыщи", "Пятна", "Сыпь", "Угри", "Налет", "Пустулы", "Прыщики", "Тяжелое акне", "Акне", "Сыпь на щеках", "Сыпь на лице", "Шрамы", "Пубертат", "Язва", "Сыпь на подбородке", "Два лица", "Зона Т", "Сальный", "Крапленый", "Следы акне", "Большие   шрамы", "Герпес", "Лишай"],
                        i: 0
                    },
                    {
                        text: "Старение кожи",
                        values: ["Нет", "Вороньи лапки", "Первые признаки", "Средний возраст", "Признаки старения", "Депрессия", "Преклонный возраст", "Старость", "Обветренная кожа", "Морщинистая кожа", "Обвислая кожа", "Тяжелая жизнь", "Винтаж", "Пенсионер", "Наркоман", "Старик"],
                        i: 0
                    },
                    {
                        text: "Повреждение кожи",
                        values: ["Нет", "Неровная", "Наждак", "Пятнистая", "Грубая", "Жесткая", "Шероховатая", "Загрубелая", "Неровная", "Со складками", "Потрескавшаяся", "Твердая"],
                        i: 0
                    },
                    {
                        text: "Родинки и веснушки",
                        values: ["Нет", "Ангел", "Повсюду", "Местами", "Единичные", "Переносица", "Куколка", "Фея", "Загорелая", "Родинки", "Ряд", "Модель", "Случайность", "Родинки", "Дождик", "Удвоенность", "Одна сторона", "Пары", "Бородавки"],
                        i: 0
                    },
                    {
                        text: "Волосы на теле",
                        values: ["Нет", "Естественные", "Полоса", "Дерево", "Волосатый", "Гризли", "Горилла", "Бритая горилла", "Бикини", "Удар молнии", "Обратная молния", "Сердце", "Боль в груди", "Счастливчик", "Череп", "Улитка", "Слизень", "Волосатые руки"],
                        i: 0
                    },
                    {
                        text: "Цвет волос на теле",
                        values: ["#211f1c", "#55362f", "#4b382e", "#4d291b",
                            "#70351e", "#904422", "#a55c36", "#a56944",
                            "#ac744f", "#ae7d57", "#be9161", "#cda670",
                            "#c8a370", "#d5a861", "#e0b775", "#e8c487",
                            "#b78457", "#a85d3d", "#963523", "#7c1411",
                            "#921812", "#a81c14", "#cb371e", "#de411b",
                            "#be532f", "#d34d21", "#907867", "#a78e7a",
                            "#d4bda9", "#e4cfbe"
                        ],
                        i: 0,
                        j: 0
                    },
                    {
                        text: "Назад",
                    },
                ],
                defaultItemsFemale: [{
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
                        i: 0,
                        j: 0
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
                        i: 0,
                        j: 0
                    },
                    {
                        text: "Брови",
                        values: ["Нет", "Аккуратные", "Модные", "Клеопатра", "Ироничные", "Женственные", "Обольстительные", "Нахмуренные", "Чикса", "Триумф", "Беззаботные", "Дугой", "Мышка", "Двойная высечка", "Впалые", "Карандаш", "Выщипанные", "Прямые", "Естественные", "Пышные", "Неопрятные", "Широкие", "Обычные", "Южноевропейские", "Ухоженные", "Кустистые", "Перышки", "Колючки", "Монобровь", "Крылатые", "Тройная высечка", "Высечка дугой", "Подрезанные", "Сходящие на нет", "Высечка"],
                        i: 0
                    },
                    {
                        text: "Высота бровей",
                        values: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
                        i: 10,
                        min: "Выше",
                        max: "Ниже",
                    },
                    {
                        text: "Глубина бровей",
                        values: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
                        i: 10,
                        min: "Внутрь",
                        max: "Наружу",
                    },
                    {
                        text: "Цвет бровей",
                        values: ["#211f1c", "#55362f", "#4b382e", "#4d291b",
                            "#70351e", "#904422", "#a55c36", "#a56944",
                            "#ac744f", "#ae7d57", "#be9161", "#cda670",
                            "#c8a370", "#d5a861", "#e0b775", "#e8c487",
                            "#b78457", "#a85d3d", "#963523", "#7c1411",
                            "#921812", "#a81c14", "#cb371e", "#de411b",
                            "#be532f", "#d34d21", "#907867", "#a78e7a",
                            "#d4bda9", "#e4cfbe"
                        ],
                        i: 0,
                        j: 0
                    },
                    {
                        text: "Размер глаз",
                        values: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
                        i: 10,
                        min: "Шире", 
                        max: "Уже",
                    },
                    {
                        text: "Цвет глаз",
                        values: ["#50c878", "#008000", "#add8e6", "#0077be", "#b5651d", "#654321", "#d0c383", "#a9a9a9"],
                        i: 0,
                        j: 0
                    },
                    {
                        text: "Глубина переносицы",
                        values: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
                        i: 10,
                        min: "Округлая",
                        max: "Впалая",
                    },
                    {
                        text: "Сдвиг переносицы",
                        values: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
                        i: 10,
                        min: "Левее", 
                        max: "Правее",
                    },
                    {
                        text: "Высота расположения носа",
                        values: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
                        i: 10,
                        min: "Выше", 
                        max: "Ниже", 
                    },
                    {
                        text: "Ширина носа",
                        values: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
                        i: 10,
                        min: "Уже", 
                        max: "Шире",
                    },
                    {
                        text: "Длина кончика носа",
                        values: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
                        i: 10,
                        min: "Больше", 
                        max: "Меньше",
                    },
                    {
                        text: "Высота кончика носа",
                        values: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
                        i: 10,
                        min: "Выше", 
                        max: "Ниже", 
                    },
                    {
                        text: "Ширина скул",
                        values: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
                        i: 10,
                        min: "Уже",
                        max: "Шире",
                    },
                    {
                        text: "Глубина щек",
                        values: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
                        i: 10,
                        min: "Округлые",
                        max: "Впалые",
                    },
                    {
                        text: "Толщина губ",
                        values: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
                        i: 10,
                        min: "Шире",
                        max: "Уже",
                    },
                    {
                        text: "Помада",
                        values: ["Нет", "Цветная матовая", "Цветной блеск", "Матовая линия", "Блестящая линия", "Сильная матовая", "Сильный блеск", "Голая матовая", "Голый блеск", "Нечеткая", "Гейша"],
                        i: 0
                    },
                    {
                        text: "Цвет помады",
                        values: ["#b83e47", "#d45a85", "#d27f94", "#d094a3",
                            "#be758d", "#c8646a", "#9c4140", "#c18b7b",
                            "#d7b9a7", "#d8c3ba", "#d7b9b3", "#c69c8c",
                            "#cc8d76", "#be6e4d", "#c5979c", "#dbb4bd",
                            "#eac3d5", "#e6a4c8", "#db5299", "#cb7c9c",
                            "#8f3646", "#6d2f34", "#af2933", "#ce2737",
                            "#c21817", "#c84a66", "#cc42b2", "#bb1ba2",
                            "#970b94", "#620966", "#6b0646", "#48043c",
                            "#811ca1", "#223a7b", "#214c9d", "#2676ad",
                            "#2396b2", "#2ec2c7", "#39c1a1", "#35b880",
                            "#25943b", "#1d7b11", "#8cd553", "#d1e860",
                            "#dbdf49", "#ddd638", "#d9bd1f", "#d89723",
                            "#df7205", "#a34520", "#e7d7a5", "#eae6d5",
                            "#e2e5e2", "#cccfcd", "#acb0ae", "#5b4d4b",
                            "#221111", "#7aadb0", "#64839e", "#212d5c",
                            "#c3ac92", "#9f8876", "#7d5e53", "#46322a"
                        ],
                        i: 0,
                        j: 0
                    },
                    {
                        text: "Форма челюсти",
                        values: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
                        i: 10,
                        min: "Меньше", 
                        max: "Больше", 
                    },
                    {
                        text: "Ширина челюсти",
                        values: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
                        i: 10,
                        min: "Уже", 
                        max: "Шире", 
                    },
                    {
                        text: "Высота подбородка",
                        values: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
                        i: 10,
                        min: "Выше", 
                        max: "Ниже", 
                    },
                    {
                        text: "Глубина подбородка",
                        values: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
                        i: 10,
                        min: "Короткий", 
                        max: "Длинный", 
                    },
                    {
                        text: "Ширина подбородка",
                        values: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
                        i: 10,
                        min: "Уже",
                        max: "Шире", 
                    },
                    {
                        text: "Выступ подбородка",
                        values: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
                        i: 10,
                        min: "Наружу", 
                        max: "Внутрь", 
                    },
                    {
                        text: "Ширина шеи",
                        values: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
                        i: 10,
                        min: "Уже",
                        max: "Шире", 
                    },
                    {
                        text: "Дефекты кожи",
                        values: ["Нет", "Корь", "Прыщи", "Пятна", "Сыпь", "Угри", "Налет", "Пустулы", "Прыщики", "Тяжелое акне", "Акне", "Сыпь на щеках", "Сыпь на лице", "Шрамы", "Пубертат", "Язва", "Сыпь на подбородке", "Два лица", "Зона Т", "Сальный", "Крапленый", "Следы акне", "Большие   шрамы", "Герпес", "Лишай"],
                        i: 0
                    },
                    {
                        text: "Старение кожи",
                        values: ["Нет", "Вороньи лапки", "Первые признаки", "Средний возраст", "Признаки старения", "Депрессия", "Преклонный возраст", "Старость", "Обветренная кожа", "Морщинистая кожа", "Обвислая кожа", "Тяжелая жизнь", "Винтаж", "Пенсионер", "Наркоман", "Старик"],
                        i: 0
                    },
                    {
                        text: "Повреждение кожи",
                        values: ["Нет", "Неровная", "Наждак", "Пятнистая", "Грубая", "Жесткая", "Шероховатая", "Загрубелая", "Неровная", "Со складками", "Потрескавшаяся", "Твердая"],
                        i: 0
                    },
                    {
                        text: "Родинки и веснушки",
                        values: ["Нет", "Ангел", "Повсюду", "Местами", "Единичные", "Переносица", "Куколка", "Фея", "Загорелая", "Родинки", "Ряд", "Модель", "Случайность", "Родинки", "Дождик", "Удвоенность", "Одна сторона", "Пары", "Бородавки"],
                        i: 0
                    },
                    {
                        text: "Назад",
                    },
                ],
                items: null,
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
                    if (eventName == "onEscapePressed" || eventName == 'onBackspacePressed') {
                        selectMenu.menu = selectMenu.menus["characterCreateMainMenu"];
                    }
                    if (eventName == "onItemFocusChanged") {
                        if (e.itemName == "Волосы на теле" || e.itemName == "Цвет волос на теле") {
                            mp.trigger("characterInit.showTorso", 1);
                        } else {
                            mp.trigger("characterInit.showTorso", 0);
                        }
                    }
                    if (eventName == "onItemValueChanged") {
                        switch (e.itemName) {
                            case "Прическа":
                                mp.trigger('characterInit.create.setHairstyle', e.valueIndex);
                                break;
                            case "Цвет волос":
                                mp.trigger('characterInit.create.setHairColor', e.valueIndex);
                                break;
                            case "Дополнительный цвет волос":
                                mp.trigger('characterInit.create.setHairHighlightColor', e.valueIndex);
                                break;
                            case "Волосы на лице":
                                mp.trigger('characterInit.create.setFacialHair', e.valueIndex);
                                break;
                            case "Цвет волос на лице":
                                mp.trigger('characterInit.create.setFacialHairColor', e.valueIndex);
                                break;
                            case "Брови":
                                mp.trigger('characterInit.create.setEyebrows', e.valueIndex);
                                break;
                            case "Высота бровей":
                                mp.trigger('characterInit.create.setBrowHeight', e.valueIndex);
                                break;
                            case "Глубина бровей":
                                mp.trigger('characterInit.create.setBrowDepth', e.valueIndex);
                                break;
                            case "Цвет бровей":
                                mp.trigger('characterInit.create.setEyebrowColor', e.valueIndex);
                                break;
                            case "Размер глаз":
                                mp.trigger('characterInit.create.setEyeSize', e.valueIndex);
                                break;
                            case "Цвет глаз":
                                mp.trigger('characterInit.create.setEyeColor', e.valueIndex);
                                break;
                            case "Глубина переносицы":
                                mp.trigger('characterInit.create.setNoseBridgeDepth', e.valueIndex);
                                break;
                            case "Сдвиг переносицы":
                                mp.trigger('characterInit.create.setNoseBroken', e.valueIndex);
                                break;
                            case "Высота расположения носа":
                                mp.trigger('characterInit.create.setNoseBottomHeight', e.valueIndex);
                                break;
                            case "Ширина носа":
                                mp.trigger('characterInit.create.setNoseWidth', e.valueIndex);
                                break;
                            case "Длина кончика носа":
                                mp.trigger('characterInit.create.setNoseTipLength', e.valueIndex);
                                break;
                            case "Высота кончика носа":
                                mp.trigger('characterInit.create.setNoseTipHeight', e.valueIndex);
                                break;
                            case "Ширина скул":
                                mp.trigger('characterInit.create.setCheekboneWidth', e.valueIndex);
                                break;
                            case "Глубина щек":
                                mp.trigger('characterInit.create.setCheekDepth', e.valueIndex);
                                break;
                            case "Толщина губ":
                                mp.trigger('characterInit.create.setLipThickness', e.valueIndex);
                                break;
                            case "Помада":
                                mp.trigger('characterInit.create.setLipstick', e.valueIndex);
                                break;
                            case "Цвет помады":
                                mp.trigger('characterInit.create.setLipstickColor', e.valueIndex);
                                break;
                            case "Форма челюсти":
                                mp.trigger('characterInit.create.setJawShape', e.valueIndex);
                                break;
                            case "Ширина челюсти":
                                mp.trigger('characterInit.create.setJawWidth', e.valueIndex);
                                break;
                            case "Высота подбородка":
                                mp.trigger('characterInit.create.setChinHeight', e.valueIndex);
                                break;
                            case "Глубина подбородка":
                                mp.trigger('characterInit.create.setChinDepth', e.valueIndex);
                                break;
                            case "Ширина подбородка":
                                mp.trigger('characterInit.create.setChinWidth', e.valueIndex);
                                break;
                            case "Выступ подбородка":
                                mp.trigger('characterInit.create.setChinIndent', e.valueIndex);
                                break;
                            case "Ширина шеи":
                                mp.trigger('characterInit.create.setNeckWidth', e.valueIndex);
                                break;
                            case "Дефекты кожи":
                                mp.trigger('characterInit.create.setBlemishes', e.valueIndex);
                                break;
                            case "Старение кожи":
                                mp.trigger('characterInit.create.setAgeing', e.valueIndex);
                                break;
                            case "Повреждение кожи":
                                mp.trigger('characterInit.create.setSunDamage', e.valueIndex);
                                break;
                            case "Родинки и веснушки":
                                mp.trigger('characterInit.create.setMolesFreckles', e.valueIndex);
                                break;
                            case "Волосы на теле":
                                mp.trigger('characterInit.create.setChestHair', e.valueIndex, true);
                                break;
                            case "Цвет волос на теле":
                                mp.trigger('characterInit.create.setChestHairColor', e.valueIndex, true);
                                break;
                        }
                    }
                    if (eventName == "onItemSelected") {
                        switch (e.itemName) {
                            case "Назад":
                                mp.trigger("characterInit.camera.head");
                                selectMenu.menu = selectMenu.menus["characterCreateMainMenu"];
                                break;
                        }
                    }
                }
            },
            "characterCreateNameMenu": {
                name: "charactercreatename",
                header: "Имя персоонажа", 
                items: [{
                        text: "Имя",
                        values: [""],
                        i: 0,
                        type: "editable"
                    },
                    {
                        text: "Фамилия",
                        values: [""],
                        i: 0,
                        type: "editable" 
                    },
                    {
                        text: "Принять",
                    },
                    {
                        text: "Назад",
                    },
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
                    if (eventName == "onEscapePressed" || eventName == 'onBackspacePressed') {
                        mp.trigger('characterInit.create.back');
                        selectMenu.menu = selectMenu.menus["characterCreateMainMenu"];
                    }
                    if (eventName == "onItemSelected") {
                        switch (e.itemName) {
                            case "Принять":
                                let reg = /^[A-z]{2,15}$/;
                                if (!reg.test(this.items[0].values[0]) || !reg.test(this.items[1].values[0])) return selectMenu.notification = "Имя и фамилия должны состоять из 2-15 латинских букв каждое.";
                                selectMenu.loader = true;
                                let name = this.items[0].values[0];
                                let surname = this.items[1].values[0];
                                // name = name[0].toUpperCase() + name.toLowerCase().substring(1, 20);
                                // surname = surname[0].toUpperCase() + surname.toLowerCase().substring(1, 20);
                                mp.trigger('characterInit.create.check', name, surname);
                                break;
                            case "Назад":
                                mp.trigger('characterInit.create.back');
                                selectMenu.menu = selectMenu.menus["characterCreateMainMenu"];
                                break;
                        }
                    }
                }
            },
        
            "characterCreateExitMenu": {
                name: "charactercreateexit",
                header: "Хотите выйти?", 
                items: [{
                        text: "Да",
                    },
                    {
                        text: "Нет",
                    },
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
                    if (eventName == "onEscapePressed" || eventName == 'onBackspacePressed') {
                        selectMenu.menu = selectMenu.menus["characterCreateMainMenu"];
                    }
                    if (eventName == "onItemSelected") {
                        switch (e.itemName) {
                            case "Да":
                                selectMenu.menus["characterCreateMainMenu"].items[0].i = 0;
                                selectMenu.menus["characterCreateParentsMenu"].items[0].i = 0;
                                selectMenu.menus["characterCreateParentsMenu"].items[1].i = 0;
                                selectMenu.menus["characterCreateParentsMenu"].items[2].i = 0;
                                selectMenu.menus["characterCreateParentsMenu"].items[3].i = 0;
                                selectMenu.menus["characterCreateViewMenu"].items = cloneObj(selectMenu.menus["characterCreateViewMenu"].defaultItemsMale);
                                mp.trigger('characterInit.create.exit');
                                selectMenu.show = false;
                                break;
                            case "Нет":
                                selectMenu.menu = selectMenu.menus["characterCreateMainMenu"];
                                break;
                        }
                    }
                }
            },
            "parkingMenu": {
                name: "parking",
                header: "Парковка", 
                items: [{
                        text: "Забрать транспорт",
                    },
                    {
                        text: "Закрыть меню",
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
                        if (e.itemName == 'Забрать транспорт') {
                            selectMenu.show = false;
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
                        j: 0
                    },
                    {
                        text: "Дополнительный цвет",
                        values: [],
                        i: 0,
                        j: 0
                    },
                    {
                        text: "Купить"
                    },
                    {
                        text: "Выход"
                    },
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
                            selectMenu.loader = true;
                            mp.trigger(`carshow.car.buy`);
                        }
                        if (e.itemName == 'Выход') {
                            mp.trigger(`carshow.list.close`);
                        }
                    }
                    if (eventName == 'onEscapePressed' || eventName == 'onBackspacePressed') {
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
                            selectMenu.loader = true;
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
                    },
                    {
                        text: "Закрыть",
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
                        if (e.itemName == 'Устроиться на работу') {
                            mp.trigger(`carservice.jobshape.employment`);
                        }
                        if (e.itemName == 'Уволиться с работы') {
                            mp.trigger(`carservice.jobshape.employment`);
                        }
                        if (e.itemName == 'Закрыть') {
                            mp.trigger(`carservice.jobmenu.close`);
                        } else if (e.itemName == 'Помощь') {
                            selectMenu.show = false;
                            modal.showByName("carservice_help");
                        }
                    }
                }
            },
            "houseAddMenu": {
                name: "houseadd",
                header: "Добавление дома",
                items: [{
                        text: "Выберите интерьер",
                        values: [''],
                        i: 0,
                    },
                    {
                        text: "Введите стоимость",
                        values: [""],
                        type: "editable" 
                    },
                    {
                        text: "Поставить вход в дом",
                        values: ['No'],
                        i: 0,
                    },
                    {
                        text: "Поставить выход из дома",
                        values: ['No'],
                        i: 0,
                    },
                    {
                        text: "Создать авто",
                    },
                    {
                        text: "Создать место для парковки автомобиля",
                        values: ['No'],
                        i: 0,
                    },
                    {
                        text: "Создать",
                    },
                    {
                        text: "Закрыть",
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
                        switch (e.itemName) {
                            case "Поставить вход в дом":
                                mp.trigger("house.add.enter");
                                break;
                            case "Поставить выход из дома":
                                mp.trigger("house.add.spawn");
                                break;
                            case "Создать авто":
                                mp.trigger("house.add.carSpawn");
                                break;
                            case "Создать место для парковки автомобиля":
                                mp.trigger("house.add.carPlace");
                                break;
                            case "Создать":
                                mp.trigger("house.add.create", this.items[0].i, this.items[1].values[0]);
                                break;
                            case "Закрыть":
                                mp.trigger("house.add.close");
                                break;
                        }
                    }
                }
            },
            "houseAddInteriorMenu": {
                name: "houseaddinterior",
                header: "Добавление интерьера",
                garagesIds: [],
                items: [{
                        text: "Выберите гараж",
                        values: [''],
                        i: 0,
                    },
                    {
                        text: "Введите класс",
                        values: [""],
                        type: "editable" 
                    },
                    {
                        text: "Введите кол-во комнат",
                        values: [""],
                        type: "editable" 
                    },
                    {
                        text: "Введите коэффициент аренды",
                        values: [""],
                        type: "editable" 
                    },
                    {
                        text: "Поставить спавн в интерьере",
                        values: ['No'],
                        i: 0,
                    },
                    {
                        text: "Поставить выход из интерьера",
                        values: ['No'],
                        i: 0,
                    },
                    {
                        text: "Поставить шкаф в интерьере",
                        values: ['No'],
                        i: 0,
                    },
                    {
                        text: "Создать",
                    },
                    {
                        text: "Закрыть",
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
                        switch (e.itemName) {
                            case "Поставить спавн в интерьере":
                                mp.trigger("house.add.interior.enter");
                                break;
                            case "Поставить выход из интерьера":
                                mp.trigger("house.add.interior.exit");
                                break;
                            case "Поставить шкаф в интерьере":
                                mp.trigger("house.add.interior.holder");
                                break;
                            case "Создать":
                                mp.trigger("house.add.interior.create", selectMenu.menus["houseAddInteriorMenu"].garagesIds[this.items[0].i], this.items[1].values[0], this.items[2].values[0], this.items[3].values[0]);
                                break;
                            case "Закрыть":
                                mp.trigger("house.add.interior.close");
                                break;
                        }
                    }
                }
            },
            "houseAddGarageMenu": {
                name: "houseaddgarage",
                header: "Добавление гаража",
                items: [{
                        text: "Создать авто",
                    },
                    {
                        text: "Добавить парковочное место",
                    },
                    {
                        text: "Удалить парковочное место",
                    },
                    {
                        text: "Поставить спавн в гараже",
                        values: ['No'],
                        i: 0,
                    },
                    {
                        text: "Поставить выход из гаража",
                        values: ['No'],
                        i: 0,
                    },
                    {
                        text: "Создать",
                    },
                    {
                        text: "Закрыть",
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
                        switch (e.itemName) {
                            case "Создать авто":
                                mp.trigger("house.add.garage.carSpawn");
                                break;
                            case "Добавить парковочное место":
                                mp.trigger("house.add.garage.addPlace");
                                break;
                            case "Удалить парковочное место":
                                mp.trigger("house.add.garage.removePlace");
                                break;
                            case "Поставить спавн в гараже":
                                mp.trigger("house.add.garage.enter");
                                break;
                            case "Поставить выход из гаража":
                                mp.trigger("house.add.garage.exit");
                                break;
                            case "Создать":
                                mp.trigger("house.add.garage.create");
                                break;
                            case "Закрыть":
                                mp.trigger("house.add.garage.close");
                                break;
                        }
                    }
                }
            },
            "bizEconomic": {
                name: "bizeconomic",
                header: "Экономика бизнеса",
                items: [{
                        text: "Сохранить",
                    },
                    {
                        text: "Закрыть",
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
                        switch (e.itemName) {
                            case "Сохранить":
                                let params = new Array();
                                this.items.forEach(item => {
                                    if (item.paramKey == null) return;
                                    params.push({
                                        key: item.paramKey,
                                        value: item.values[item.i]
                                    });
                                });
                                params.push();
                                mp.trigger("biz.finance.save", JSON.stringify(params));
                                selectMenu.show = false;
                                break;
                            case "Закрыть":
                                mp.trigger("biz.finance.close");
                                selectMenu.show = false;
                                break;
                        }
                    }
                    if (eventName == 'onBackspacePressed' || eventName == 'onEscapePressed') {
                        mp.trigger("biz.finance.close");
                        selectMenu.show = false;
                    }
                }
            },
            "fuelStationMenu": {
                name: "fuelstation",
                header: "АЗС",
                items: [{
                        text: "Выбрать количество литров",
                        i: 0,
                    },
                    {
                        text: "Заправить полный бак",
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
                        if (e.itemName == 'Выбрать количество литров') {
                            mp.trigger(`fuelstations.fill.litres.show`);
                        }
                        if (e.itemName == 'Заправить полный бак') {
                            mp.trigger(`fuelstations.fill.fulltank`);
                        }
                        if (e.itemName == 'Отмена') {
                            mp.trigger(`fuelstations.menu.close`);
                        }
                    }
                }
            },
            "taxiJobMenu": {
                name: "taxijob",
                header: "Управляющий таксопарком",
                items: [{
                        text: "Устроиться на работу",
                        i: 0,
                    },
                    {
                        text: "Помощь",
                        i: 0,
                    },
                    {
                        text: "Закрыть",
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
                        if (e.itemName == 'Устроиться на работу') {
                            mp.trigger(`taxi.jobmenu.employment`);
                        }
                        if (e.itemName == 'Уволиться с работы') {
                            mp.trigger(`taxi.jobmenu.employment`);
                        }
                        if (e.itemName == 'Закрыть') {
                            mp.trigger(`taxi.jobmenu.close`);
                        } else if (e.itemName == 'Помощь') {
                            selectMenu.show = false;
                            modal.showByName("taxi_help");
                        }
                    }
                }
            },
            "fishingMenu": {
                name: "fishing",
                header: "Рыбалка",
                items: [{
                        text: 'Купить удочку',
                        i: 0
                    },
                    {
                        text: 'Продать рыбу',
                        i: 0
                    },
                    {
                        text: 'Помощь',
                        i: 0
                    },
                    {
                        text: "Закрыть",
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
                        if (e.itemName == 'Купить удочку') {
                            mp.trigger(`fishing.rod.buy`);
                        }
                        if (e.itemName == 'Закрыть') {
                            mp.trigger(`fishing.menu.close`);
                        }
                        if (e.itemName == 'Продать рыбу') {
                            mp.trigger(`fishing.fish.sell`);
                        } else if (e.itemName == 'Помощь') {
                            selectMenu.show = false;
                            modal.showByName("fishing_help");
                        }
                    }
                }
            },
            "factionGiveRank": {
                name: "factionGiveRank",
                header: "Название организации",
                items: [{
                        text: "Ранг",
                        values: ['Ранг 1', 'Ранг 2', 'Ранг 3', 'Ранг 4', 'Ранг 5', 'Ранг 6'],
                        i: 0,
                    },
                    {
                        text: "Установить",
                        location: "center",
                        i: 0,
                    },
                    {
                        text: "Закрыть",
                        location: "center",
                        i: 0,
                    }
                ],
                i: 0,
                j: 0,
                playerId: null,
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
                        if (e.itemName == 'Установить') {
                            var rank = this.items[0].i + 1;
                            mp.trigger("callRemote", "factions.giverank.set", JSON.stringify([this.playerId, rank]));
                            selectMenu.show = false;
                        } else if (e.itemName == 'Закрыть') {
                            selectMenu.show = false;
                        }
                    }
                }
            },
            "factionControl": {
                name: "factionControl",
                header: "Организация",
                items: [{
                        text: "Онлайн состав"
                    },
                    {
                        text: "Полный состав"
                    },
                    {
                        text: "Ранги"
                    },
                    {
                        text: "Транспорт"
                    },
                    {
                        text: "Доступ к складу"
                    },
                    {
                        text: "Доступ к составу"
                    },
                    {
                        text: "Закрыть"
                    }
                ],
                i: 0,
                j: 0,
                inviteRank: 1,
                uvalRank: 1,
                giveRankRank: 1,
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
                        if (e.itemName == 'Закрыть') selectMenu.show = false;
                        else if (e.itemName == 'Онлайн состав') {
                            selectMenu.loader = true;
                            mp.trigger(`callRemote`, `factions.control.members.online.show`);
                        } else if (e.itemName == 'Полный состав') {
                            selectMenu.loader = true;
                            mp.trigger(`callRemote`, `factions.control.members.offline.show`);
                        } else if (e.itemName == 'Ранги') {
                            var ranks = selectMenu.menus["factionControlRanks"].ranks;
                            var maxRankName = ranks[ranks.length - 1].name;
                            if (statistics['factionRank'].value != maxRankName) return selectMenu.notification = "Вы не лидер";
                            selectMenu.showByName("factionControlRanks");
                        } else if (e.itemName == 'Транспорт') {
                            var ranks = selectMenu.menus["factionControlRanks"].ranks;
                            var maxRankName = ranks[ranks.length - 1].name;
                            if (statistics['factionRank'].value != maxRankName) return selectMenu.notification = "Вы не лидер";
                            selectMenu.loader = true;
                            mp.trigger(`callRemote`, `factions.control.vehicles.show`);
                        } else if (e.itemName == 'Доступ к складу') {
                            var ranks = selectMenu.menus["factionControlRanks"].ranks;
                            var maxRankName = ranks[ranks.length - 1].name;
                            if (statistics['factionRank'].value != maxRankName) return selectMenu.notification = "Вы не лидер";
                            selectMenu.loader = true;
                            mp.trigger(`callRemote`, `factions.control.warehouse.show`);
                        } else if (e.itemName == 'Доступ к составу') {
                            var ranks = selectMenu.menus["factionControlRanks"].ranks;
                            var maxRankName = ranks[ranks.length - 1].name;
                            if (statistics['factionRank'].value != maxRankName) return selectMenu.notification = "Вы не лидер";
                            selectMenu.menus['factionControlAccessMembers'].show(this.inviteRank, this.uvalRank, this.giveRankRank);
                        }
                    }
                }
            },
            "factionControlMembers": {
                name: "factionControlMembers",
                header: "Состав",
                items: [{
                        text: "Dunhill"
                    },
                    {
                        text: "Carter"
                    },
                    {
                        text: "Swift"
                    },
                    {
                        text: "Вернуться"
                    }
                ],
                i: 0,
                j: 0,
                rankNames: [],
                members: [],
                init(data) {
                    if (typeof data == 'string') data = JSON.parse(data);

                    var items = [];
                    data.members.forEach(member => {
                        items.push({
                            text: member.name
                        });
                    });
                    items.push({
                        text: "Вернуться"
                    });
                    selectMenu.setItems('factionControlMembers', items);

                    this.rankNames = data.rankNames;
                    this.members = data.members;
                },
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
                        if (e.itemName == 'Вернуться') selectMenu.showByName("factionControl");
                        else {
                            selectMenu.menus["factionControlMember"].init(this.members[e.itemIndex], this.rankNames);
                            selectMenu.showByName("factionControlMember");
                        }
                    } else if (eventName == 'onBackspacePressed') selectMenu.showByName("factionControl");
                }
            },
            "factionControlMember": {
                name: "factionControlMember",
                header: "Сотрудник",
                items: [{
                        text: "Имя",
                        values: [`Dunhill`]
                    },
                    {
                        text: "Ранг",
                        values: ['Ранг 1', 'Ранг 2', 'Ранг 3', 'Ранг 4', 'Ранг 5', 'Ранг 6'],
                        i: 0,
                    },
                    {
                        text: "Установить"
                    },
                    {
                        text: "Уволить"
                    },
                    {
                        text: "Вернуться"
                    }
                ],
                i: 0,
                j: 0,
                member: null,
                init(member, rankNames) {
                    this.items[0].values[0] = member.name;
                    this.items[1].values = rankNames;
                    this.items[1].i = member.rank - 1;

                    this.member = member;
                },
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
                        if (e.itemName == 'Установить') {
                            var data = {
                                rank: this.items[1].i + 1
                            };
                            if (this.member.id != null) data.recId = this.member.id;
                            else if (this.member.sqlId != null) data.sqlId = this.member.sqlId;

                            selectMenu.loader = true;
                            mp.trigger(`callRemote`, `factions.control.members.ranks.set`, JSON.stringify(data));
                        } else if (e.itemName == 'Уволить') {
                            var data = {};
                            if (this.member.id != null) data.recId = this.member.id;
                            else if (this.member.sqlId != null) data.sqlId = this.member.sqlId;

                            selectMenu.loader = true;
                            mp.trigger(`callRemote`, `factions.control.members.uval`, JSON.stringify(data));
                        } else if (e.itemName == 'Вернуться') selectMenu.showByName("factionControlMembers");
                    } else if (eventName == 'onBackspacePressed') selectMenu.showByName("factionControlMembers");
                }
            },
            "factionControlRanks": {
                name: "factionControlRanks",
                header: "Ранги",
                items: [{
                        text: "Ранг 1",
                        values: [`$999`]
                    },
                    {
                        text: "Ранг 2",
                        values: [`$999`]
                    },
                    {
                        text: "Ранг 3",
                        values: [`$999`]
                    },
                    {
                        text: "Ранг 4",
                        values: [`$999`]
                    },
                    {
                        text: "Вернуться"
                    }
                ],
                i: 0,
                j: 0,
                ranks: [],
                init(ranks) {
                    if (typeof ranks == 'string') ranks = JSON.parse(ranks);

                    var items = [];
                    ranks.forEach(rank => {
                        items.push({
                            text: rank.name,
                            values: [`$${rank.pay}`]
                        });
                    });
                    items.push({
                        text: `Вернуться`
                    });

                    selectMenu.setItems('factionControlRanks', items);
                    this.ranks = ranks;
                },
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
                        if (e.itemName == 'Вернуться') selectMenu.showByName("factionControl");
                        else {
                            selectMenu.menus["factionControlRank"].init(this.ranks[e.itemIndex]);
                            selectMenu.showByName("factionControlRank");
                        }
                    } else if (eventName == 'onBackspacePressed') selectMenu.showByName("factionControl");
                }
            },
            "factionControlRank": {
                name: "factionControlRank",
                header: "Ранг 1",
                items: [{
                        text: "Название",
                        values: [`Килла`],
                        type: 'editable',
                    },
                    {
                        text: "Зарплата",
                        values: [`$9999`],
                    },
                    {
                        text: "Сохранить"
                    },
                    {
                        text: "Вернуться"
                    }
                ],
                i: 0,
                j: 0,
                rank: null,
                init(rank) {
                    if (typeof rank == 'string') rank = JSON.parse(rank);

                    this.header = `Ранг ${rank.rank}`;
                    this.items[0].values[0] = rank.name;
                    this.items[1].values[0] = `$${rank.pay}`;

                    this.rank = rank;
                },
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
                        if (e.itemName == 'Вернуться') selectMenu.showByName("factionControlRanks");
                        else if (e.itemName == 'Сохранить') {
                            var data = {
                                rank: this.rank.rank,
                                name: this.items[0].values[0]
                            };
                            if (!data.name) return selectMenu.notification = "Введите название ранга";

                            selectMenu.show = false;
                            mp.trigger(`callRemote`, `factions.control.ranks.set`, JSON.stringify(data));
                        }
                    } else if (eventName == 'onBackspacePressed') selectMenu.showByName("factionControlRanks");
                }
            },
            "factionControlVehicles": {
                name: "factionControlVehicles",
                header: "Транспорт",
                items: [{
                        text: "Infernus",
                        values: [`PM777`]
                    },
                    {
                        text: "Вернуть авто",
                        values: [`$999`],
                    },
                    {
                        text: "Вернуться"
                    }
                ],
                i: 0,
                j: 0,
                respawnPrice: -1,
                vehicles: [],
                init(data) {
                    if (typeof data == 'string') data = JSON.parse(data);

                    var items = [];
                    data.vehicles.forEach(veh => {
                        items.push({
                            text: veh.name,
                            values: [veh.plate]
                        });
                    });
                    items.push({
                        text: `Вернуть авто`,
                        values: [`$${this.respawnPrice}`]
                    });
                    items.push({
                        text: `Вернуться`
                    });
                    selectMenu.setItems('factionControlVehicles', items);

                    this.vehicles = data.vehicles;
                },
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
                        if (e.itemName == 'Вернуться') selectMenu.showByName("factionControl");
                        else if (e.itemName == 'Вернуть авто') {
                            mp.trigger(`callRemote`, `factions.control.vehicles.respawn`);
                        } else {
                            var rankNames = selectMenu.menus['factionControlRanks'].ranks.map(x => x.name);
                            selectMenu.menus['factionControlVehicle'].init(this.vehicles[e.itemIndex], rankNames);
                            selectMenu.showByName('factionControlVehicle');
                        }
                    } else if (eventName == 'onBackspacePressed') selectMenu.showByName("factionControl");
                }
            },
            "factionControlVehicle": {
                name: "factionControlVehicle",
                header: "Infernus",
                items: [{
                        text: "Название",
                        values: [`Infernus`],
                    },
                    {
                        text: "Номер",
                        values: [`PM7777`],
                    },
                    {
                        text: "Мин. ранг",
                        values: [`Ранг 1`, `Ранг 2`],
                        i: 0
                    },
                    {
                        text: "Сохранить"
                    },
                    {
                        text: "Вернуться"
                    }
                ],
                i: 0,
                j: 0,
                vehicle: null,
                init(vehicle, rankNames) {
                    this.header = vehicle.name;
                    this.items[0].values[0] = vehicle.name;
                    this.items[1].values[0] = vehicle.plate;
                    this.items[2].values = rankNames;
                    this.items[2].i = (vehicle.minRank) ? vehicle.minRank - 1 : 0;

                    this.vehicle = vehicle;
                },
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
                        if (e.itemName == 'Вернуться') selectMenu.showByName("factionControlVehicles");
                        else if (e.itemName == 'Сохранить') {
                            var data = {
                                vehId: this.vehicle.id,
                                rank: this.items[2].i + 1
                            };
                            if (data.rank == this.vehicle.minRank) return selectMenu.notification = "Ранг уже установлен";
                            selectMenu.show = false;
                            mp.trigger(`callRemote`, `factions.control.vehicles.minRank.set`, JSON.stringify(data));
                        }
                    } else if (eventName == 'onBackspacePressed') selectMenu.showByName("factionControlVehicles");
                }
            },
            "factionControlStorage": {
                name: "factionControlStorage",
                header: "Доступ к складу",
                items: [{
                        text: "Форма",
                    },
                    {
                        text: "Снаряжение",
                    },
                    {
                        text: "Вооружение",
                    },
                    {
                        text: "Патроны",
                    },
                    {
                        text: "Вернуться"
                    }
                ],
                i: 0,
                j: 0,
                clothesRanks: [],
                itemRanks: [],
                init(data) {
                    if (typeof data == 'string') data = JSON.parse(data);

                    this.clothesRanks = data.clothesRanks;
                    this.itemRanks = data.itemRanks;
                },
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
                        if (e.itemName == 'Вернуться') selectMenu.showByName("factionControl");
                        else if (e.itemName == 'Форма') {
                            var menu = selectMenu.menus[`factionControlStorageClothes`];
                            menu.show(this.clothesRanks);
                        } else if (e.itemName == 'Снаряжение') {
                            var menu = selectMenu.menus[`factionControlStorageItems`];
                            menu.show(this.itemRanks);
                        } else if (e.itemName == 'Вооружение') {
                            var menu = selectMenu.menus[`factionControlStorageGuns`];
                            menu.show(this.itemRanks);
                        } else if (e.itemName == 'Патроны') {
                            var menu = selectMenu.menus[`factionControlStorageAmmo`];
                            menu.show(this.itemRanks);
                        }
                    } else if (eventName == 'onBackspacePressed') selectMenu.showByName("factionControl");
                }
            },
            "factionControlStorageClothes": {
                name: "factionControlStorageClothes",
                header: "Доступ к форме",
                items: [{
                    text: "Вернуться"
                }],
                i: 0,
                j: 0,
                show(clothesRanks) {
                    var factionId = playerMenu.factionId;
                    if (!factionId) return;
                    var list = ["government", "lspd", "lssd", "fib", "hospital", "army", "news",
                        "band", "band", "band", "band",
                        "mafia", "mafia", "mafia"
                    ];
                    if (factionId > list.length) return;
                    var str = list[factionId - 1];
                    var menu = selectMenu.menus[`${str}Clothes`];
                    if (!menu) return selectMenu.notification = "Формы нет в наличии";
                    var rankNames = selectMenu.menus['factionControlRanks'].ranks.map(x => x.name);
                    var items = [];
                    for (var i = 0; i < menu.items.length - 1; i++) {
                        items.push({
                            text: menu.items[i].text,
                            values: rankNames,
                            i: 0,
                        });
                    }
                    items.push({
                        text: "Вернуться"
                    });
                    for (var i = 0; i < clothesRanks.length; i++) {
                        var rank = clothesRanks[i];
                        items[rank.clothesIndex].i = rank.rank - 1;
                    }

                    selectMenu.setItems(this.name, items);
                    selectMenu.showByName(this.name);
                },
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
                        if (e.itemName == 'Вернуться') selectMenu.showByName("factionControlStorage");
                        else {
                            selectMenu.show = false;
                            var data = {
                                index: e.itemIndex,
                                rank: item.i + 1
                            };
                            mp.trigger(`callRemote`, `factions.control.clothes.rank.set`, JSON.stringify(data));
                        }
                    } else if (eventName == 'onBackspacePressed') selectMenu.showByName("factionControlStorage");
                }
            },
            "factionControlStorageItems": {
                name: "factionControlStorageItems",
                header: "Доступ к снаряжению",
                items: [{
                    text: "Вернуться"
                }],
                i: 0,
                j: 0,
                itemIds: [],
                show(itemRanks) {
                    var factionId = playerMenu.factionId;
                    if (!factionId) return;
                    var list = ["government", "lspd", "lssd", "fib", "hospital", "army", "news",
                        "band", "band", "band", "band",
                        "mafia", "mafia", "mafia"
                    ];
                    if (factionId > list.length) return;
                    var str = list[factionId - 1];
                    var menu = selectMenu.menus[`${str}Items`];
                    if (!menu) return selectMenu.notification = "Снаряжения нет в наличии";
                    var rankNames = selectMenu.menus['factionControlRanks'].ranks.map(x => x.name);
                    var items = [];
                    for (var i = 0; i < menu.items.length - 1; i++) {
                        items.push({
                            text: menu.items[i].text,
                            values: rankNames,
                            i: 0,
                        });
                    }
                    items.push({
                        text: "Вернуться"
                    });

                    for (var i = 0; i < menu.itemIds.length; i++) {
                        var itemId = menu.itemIds[i];
                        var minRank = itemRanks.find(x => x.itemId == itemId);
                        items[i].i = (minRank) ? minRank.rank - 1 : 0;
                    }

                    this.itemIds = menu.itemIds;
                    selectMenu.setItems(this.name, items);
                    selectMenu.showByName(this.name);
                },
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
                        if (e.itemName == 'Вернуться') selectMenu.showByName("factionControlStorage");
                        else {
                            selectMenu.show = false;
                            var data = {
                                itemId: this.itemIds[e.itemIndex],
                                rank: item.i + 1
                            };
                            mp.trigger(`callRemote`, `factions.control.items.rank.set`, JSON.stringify(data));
                        }
                    } else if (eventName == 'onBackspacePressed') selectMenu.showByName("factionControlStorage");
                }
            },
            "factionControlStorageGuns": {
                name: "factionControlStorageGuns",
                header: "Доступ к вооружению",
                items: [{
                    text: "Вернуться"
                }],
                i: 0,
                j: 0,
                itemIds: [],
                show(itemRanks) {
                    var factionId = playerMenu.factionId;
                    if (!factionId) return;
                    var list = ["government", "lspd", "lssd", "fib", "hospital", "army", "news",
                        "band", "band", "band", "band",
                        "mafia", "mafia", "mafia"
                    ];
                    if (factionId > list.length) return;
                    var str = list[factionId - 1];
                    var menu = selectMenu.menus[`${str}Guns`];
                    if (!menu) return selectMenu.notification = "Оружия нет в наличии";
                    var rankNames = selectMenu.menus['factionControlRanks'].ranks.map(x => x.name);
                    var items = [];
                    for (var i = 0; i < menu.items.length - 1; i++) {
                        items.push({
                            text: menu.items[i].text,
                            values: rankNames,
                            i: 0,
                        });
                    }
                    items.push({
                        text: "Вернуться"
                    });

                    for (var i = 0; i < menu.itemIds.length; i++) {
                        var itemId = menu.itemIds[i];
                        var minRank = itemRanks.find(x => x.itemId == itemId);
                        items[i].i = (minRank) ? minRank.rank - 1 : 0;
                    }

                    this.itemIds = menu.itemIds;
                    selectMenu.setItems(this.name, items);
                    selectMenu.showByName(this.name);
                },
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
                        if (e.itemName == 'Вернуться') selectMenu.showByName("factionControlStorage");
                        else {
                            selectMenu.show = false;
                            var data = {
                                itemId: this.itemIds[e.itemIndex],
                                rank: item.i + 1
                            };
                            mp.trigger(`callRemote`, `factions.control.items.rank.set`, JSON.stringify(data));
                        }
                    } else if (eventName == 'onBackspacePressed') selectMenu.showByName("factionControlStorage");
                }
            },
            "factionControlStorageAmmo": {
                name: "factionControlStorageAmmo",
                header: "Доступ к патронам",
                items: [{
                    text: "Вернуться"
                }],
                i: 0,
                j: 0,
                itemIds: [],
                show(itemRanks) {
                    var factionId = playerMenu.factionId;
                    if (!factionId) return;
                    var list = ["government", "lspd", "lssd", "fib", "hospital", "army", "news",
                        "band", "band", "band", "band",
                        "mafia", "mafia", "mafia"
                    ];
                    if (factionId > list.length) return;
                    var str = list[factionId - 1];
                    var menu = selectMenu.menus[`${str}Ammo`];
                    if (!menu) return selectMenu.notification = "Патронов нет в наличии";
                    var rankNames = selectMenu.menus['factionControlRanks'].ranks.map(x => x.name);
                    var items = [];
                    for (var i = 0; i < menu.items.length - 1; i++) {
                        items.push({
                            text: menu.items[i].text,
                            values: rankNames,
                            i: 0,
                        });
                    }
                    items.push({
                        text: "Вернуться"
                    });

                    for (var i = 0; i < menu.itemIds.length; i++) {
                        var itemId = menu.itemIds[i];
                        var minRank = itemRanks.find(x => x.itemId == itemId);
                        items[i].i = (minRank) ? minRank.rank - 1 : 0;
                    }

                    this.itemIds = menu.itemIds;
                    selectMenu.setItems(this.name, items);
                    selectMenu.showByName(this.name);
                },
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
                        if (e.itemName == 'Вернуться') selectMenu.showByName("factionControlStorage");
                        else {
                            selectMenu.show = false;
                            var data = {
                                itemId: this.itemIds[e.itemIndex],
                                rank: item.i + 1
                            };
                            mp.trigger(`callRemote`, `factions.control.items.rank.set`, JSON.stringify(data));
                        }
                    } else if (eventName == 'onBackspacePressed') selectMenu.showByName("factionControlStorage");
                }
            },
            "factionControlAccessMembers": {
                name: "factionControlAccessMembers",
                header: "Доступ к составу",
                items: [{
                        text: "Приглашение",
                        values: [`Ранг 1`],
                    },
                    {
                        text: "Увольнение",
                        values: [`Ранг 1`],
                    },
                    {
                        text: "Повышение/понижение",
                        values: [`Ранг 1`],
                    },
                    {
                        text: "Вернуться"
                    }
                ],
                i: 0,
                j: 0,
                show(inviteRank, uvalRank, giveRankRank) {
                    var rankNames = selectMenu.menus['factionControlRanks'].ranks.map(x => x.name);

                    Vue.set(this.items[0], 'values', rankNames);
                    Vue.set(this.items[0], 'i', inviteRank - 1);

                    Vue.set(this.items[1], 'values', rankNames);
                    Vue.set(this.items[1], 'i', uvalRank - 1);

                    Vue.set(this.items[2], 'values', rankNames);
                    Vue.set(this.items[2], 'i', giveRankRank - 1);

                    selectMenu.showByName(this.name);
                },
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
                        if (e.itemName == 'Вернуться') selectMenu.showByName("factionControl");
                        else {
                            selectMenu.show = false;
                            var data = {
                                index: e.itemIndex,
                                rank: item.i + 1
                            };
                            var key = ["inviteRank", "uvalRank", "giveRankRank"][data.index];
                            selectMenu.menus['factionControl'][key] = data.rank;
                            mp.trigger(`callRemote`, `factions.control.members.access.set`, JSON.stringify(data));
                        }
                    } else if (eventName == 'onBackspacePressed') selectMenu.showByName("factionControl");
                }
            },
            "governmentStorage": {
                name: "governmentStorage",
                header: "Склад Government",
                items: [{
                        text: "Раздевалка",
                    },
                    {
                        text: "Снаряжение"
                    },
                    {
                        text: "Вооружение"
                    },
                    {
                        text: "Патроны"
                    },
                    {
                        text: "Закрыть"
                    },
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
                        if (e.itemName == 'Раздевалка') {
                            selectMenu.showByName("governmentClothes");
                        } else if (e.itemName == 'Снаряжение') {
                            selectMenu.showByName("governmentItems");
                        } else if (e.itemName == 'Вооружение') {
                            selectMenu.showByName("governmentGuns");
                        } else if (e.itemName == 'Патроны') {
                            selectMenu.showByName("governmentAmmo");
                        } else if (e.itemName == 'Закрыть') {
                            selectMenu.show = false;
                        }
                    }
                }
            },
            "governmentClothes": {
                name: "governmentClothes",
                header: "Раздевалка Government",
                items: [{
                        text: "Охрана"
                    },
                    {
                        text: "Секретарь"
                    },
                    {
                        text: "Судья"
                    },
                    {
                        text: "Адвокат"
                    },
                    {
                        text: "Губернатор"
                    },
                    // {
                    //     text: "Бронежилет"
                    // },
                    {
                        text: "Вернуться"
                    },
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
                        if (e.itemName == 'Вернуться') selectMenu.showByName("governmentStorage");
                        // else if (e.itemName == 'Бронежилет') mp.trigger(`callRemote`, `police.storage.armour.take`);
                        else {
                            selectMenu.show = false;
                            mp.trigger(`callRemote`, `government.storage.clothes.take`, e.itemIndex);
                        }
                    } else if (eventName == 'onBackspacePressed') selectMenu.showByName("governmentStorage");
                }
            },
            "governmentItems": {
                name: "governmentItems",
                header: "Снаряжение Government",
                items: [{
                        text: "Аптечка"
                    },
                    {
                        text: "Наручники",
                    },
                    {
                        text: "Вернуться"
                    },
                ],
                i: 0,
                j: 0,
                itemIds: [24, 28],
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
                        if (e.itemName == "Вернуться") selectMenu.showByName("governmentStorage");
                        else mp.trigger(`callRemote`, `government.storage.items.take`, e.itemIndex);
                    } else if (eventName == 'onBackspacePressed') selectMenu.showByName("governmentStorage");
                }
            },
            "governmentGuns": {
                name: "governmentGuns",
                header: "Вооружение Government",
                items: [{
                        text: "Stun Gun"
                    },
                    {
                        text: "Heavy Pistol"
                    },
                    {
                        text: "Assault SMG"
                    },
                    {
                        text: "Advanced Rifle"
                    },
                    {
                        text: "Bullpup Shotgun"
                    },
                    {
                        text: "Вернуться"
                    },
                ],
                i: 0,
                j: 0,
                itemIds: [19, 80, 87, 100, 93],
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
                        if (e.itemName == "Вернуться") selectMenu.showByName("governmentStorage");
                        else mp.trigger(`callRemote`, `government.storage.guns.take`, e.itemIndex);
                    } else if (eventName == 'onBackspacePressed') selectMenu.showByName("governmentStorage");
                }
            },
            "governmentAmmo": {
                name: "governmentAmmo",
                header: "Патроны Government",
                items: [{
                        text: "Патроны - 9mm",
                        values: ["12 ед.", "24 ед.", "32 ед."],
                    },
                    {
                        text: "Патроны - 12mm",
                        values: ["8 ед.", "16 ед.", "24 ед."],
                    },
                    {
                        text: "Патроны - 5.56mm",
                        values: ["12 ед.", "24 ед.", "32 ед."],
                    },
                    {
                        text: "Патроны - 7.62mm",
                        values: ["10 ед.", "20 ед.", "30 ед."],
                    },
                    {
                        text: "Вернуться"
                    },
                ],
                i: 0,
                j: 0,
                itemIds: [37, 38, 40, 39],
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
                        var values = JSON.stringify([e.itemIndex, parseInt(e.itemValue)]);
                        if (e.itemName == "Вернуться") selectMenu.showByName("governmentStorage");
                        else mp.trigger(`callRemote`, `government.storage.ammo.take`, values);
                    } else if (eventName == 'onBackspacePressed') selectMenu.showByName("governmentStorage");
                }
            },
            "governmentService": {
                name: "governmentService",
                header: "Government Service",
                items: [{
                        text: "Оплата штрафов",
                    },
                    {
                        text: "Восстановление ключей"
                    },
                    {
                        text: "Дубликат ключей"
                    },
                    // {
                    //     text: "Помощь штату"
                    // },
                    {
                        text: "Закрыть"
                    },
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
                        if (e.itemName == "Оплата штрафов") {
                            if (!selectMenu.menus["governmentServiceFines"].fines.length) return selectMenu.notification = `Вы не имеете штрафы`;
                            selectMenu.showByName("governmentServiceFines");
                        } else if (e.itemName == "Восстановление ключей") {
                            if (selectMenu.menus["governmentServiceVehKeys"].items.length <= 1) return selectMenu.notification = `Вы не имеете авто`;
                            selectMenu.menus["governmentServiceVehKeys"].isDublicate = false;
                            selectMenu.showByName("governmentServiceVehKeys");
                        } else if (e.itemName == "Дубликат ключей") {
                            if (selectMenu.menus["governmentServiceVehKeys"].items.length <= 1) return selectMenu.notification = `Вы не имеете авто`;
                            selectMenu.menus["governmentServiceVehKeys"].isDublicate = true;
                            selectMenu.showByName("governmentServiceVehKeys");
                        } else if (e.itemName == "Помощь штату") {
                            selectMenu.showByName("governmentServiceHelp");
                        } else selectMenu.show = false;
                    }
                }
            },
            "governmentServiceFines": {
                name: "governmentServiceFines",
                header: "Оплата штрафов",
                items: [{
                        text: "Штраф #999",
                    },
                    {
                        text: "Штраф #999",
                    },
                    {
                        text: "Штраф #999",
                    },
                    {
                        text: "Штраф #999",
                    },
                    {
                        text: "Вернуться"
                    },
                ],
                i: 0,
                j: 0,
                fines: [],
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
                        if (e.itemName == "Вернуться") selectMenu.showByName("governmentService");
                        else {
                            var fine = this.fines[e.itemIndex];
                            var items = selectMenu.menus["governmentServiceFine"].items;
                            items[0].values[0] = `ID: ${fine.id}`;
                            items[1].values[0] = `ID: ${fine.copId}`;
                            items[2].values[0] = `$${fine.price}`;
                            selectMenu.showByName("governmentServiceFine");
                            selectMenu.menu.fineI = e.itemIndex;
                            selectMenu.notification = `Причина: ${fine.cause}`;
                        }
                    } else if (eventName == 'onBackspacePressed') selectMenu.showByName("governmentService");
                }
            },
            "governmentServiceFine": {
                name: "governmentServiceFine",
                header: "Оплата",
                items: [{
                        text: "Штраф",
                        values: ["ID: 999"]
                    },
                    {
                        text: "Жетон офицера",
                        values: ["ID: 999"]
                    },
                    {
                        text: "Сумма",
                        values: ["$999"]
                    },
                    {
                        text: "Оплатить"
                    },
                    {
                        text: "Вернуться"
                    },
                ],
                i: 0,
                j: 0,
                fineI: null,
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
                        if (e.itemName == "Вернуться") selectMenu.showByName("governmentServiceFines");
                        else if (e.itemName == "Оплатить") {
                            mp.trigger(`callRemote`, `government.service.fines.pay`, this.fineI);
                            selectMenu.show = false;
                        }
                    } else if (eventName == 'onBackspacePressed') selectMenu.showByName("governmentServiceFines");
                }
            },
            "governmentServiceVehKeys": {
                name: "governmentServiceVehKeys",
                header: "Восстановление ключей",
                items: [{
                        text: "Infernus",
                        value: ["Plate"]
                    },
                    {
                        text: "Infernus",
                        value: ["Plate"]
                    },
                    {
                        text: "Infernus",
                        value: ["Plate"]
                    },
                    {
                        text: "Infernus",
                        value: ["Plate"]
                    },
                    {
                        text: "Вернуться"
                    },
                ],
                i: 0,
                j: 0,
                isDublicate: false,
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
                        if (e.itemName == "Вернуться") selectMenu.showByName("governmentService");
                        else {
                            var data = {
                                index: e.itemIndex,
                                isDublicate: this.isDublicate
                            };
                            mp.trigger(`callRemote`, `government.service.keys.veh.restore`, JSON.stringify(data));
                            selectMenu.show = false;
                        }
                    } else if (eventName == 'onBackspacePressed') selectMenu.showByName("governmentService");
                }
            },
            "governmentServiceHelp": {
                name: "governmentServiceHelp",
                header: "Помощь штату",
                items: [{
                        text: "Репорт",
                    },
                    // {
                    //     text: "Рейтинг помощников",
                    // }
                    {
                        text: "Вернуться"
                    },
                ],
                i: 0,
                j: 0,
                isDublicate: false,
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
                        if (e.itemName == "Вернуться") selectMenu.showByName("governmentService");
                        else if (e.itemName == "Репорт") {
                            selectMenu.show = false;
                            bugTracker.show = true;
                        }
                    } else if (eventName == 'onBackspacePressed') selectMenu.showByName("governmentService");
                }
            },
            "lspdStorage": {
                name: "lspdStorage",
                header: "Склад LSPD",
                items: [{
                        text: "Раздевалка",
                    },
                    {
                        text: "Снаряжение"
                    },
                    {
                        text: "Вооружение"
                    },
                    {
                        text: "Патроны"
                    },
                    {
                        text: "Закрыть"
                    },
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
                        if (e.itemName == 'Раздевалка') {
                            selectMenu.showByName("lspdClothes");
                        } else if (e.itemName == 'Снаряжение') {
                            selectMenu.showByName("lspdItems");
                        } else if (e.itemName == 'Вооружение') {
                            selectMenu.showByName("lspdGuns");
                        } else if (e.itemName == 'Патроны') {
                            selectMenu.showByName("lspdAmmo");
                        } else if (e.itemName == 'Закрыть') {
                            selectMenu.show = false;
                        }
                    }
                }
            },
            "lspdClothes": {
                name: "lspdClothes",
                header: "Раздевалка LSPD",
                items: [{
                        text: "Кадет"
                    },
                    {
                        text: "Офицер №1"
                    },
                    {
                        text: "Офицер №2"
                    },
                    {
                        text: "Детектив №1"
                    },
                    {
                        text: "Детектив №2"
                    },
                    {
                        text: "SWAT"
                    },
                    {
                        text: "Зам. Шефа"
                    },
                    {
                        text: "Шеф"
                    },
                    {
                        text: "Вернуться"
                    },
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
                        if (e.itemName == 'Вернуться') return selectMenu.showByName("lspdStorage");
                        else mp.trigger(`callRemote`, `police.storage.clothes.take`, e.itemIndex);
                        selectMenu.show = false;
                    } else if (eventName == 'onBackspacePressed') selectMenu.showByName("lspdStorage");
                }
            },
            "lspdItems": {
                name: "lspdItems",
                header: "Снаряжение LSPD",
                items: [{
                        text: "Наручники"
                    },
                    {
                        text: "Аптечка",
                    },
                    {
                        text: "Бронежилет"
                    },
                    {
                        text: "Вернуться"
                    },
                ],
                i: 0,
                j: 0,
                itemIds: [28, 24, 3],
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
                        if (e.itemName == "Вернуться") selectMenu.showByName("lspdStorage");
                        else if (e.itemName == 'Бронежилет') mp.trigger(`callRemote`, `police.storage.armour.take`);
                        else mp.trigger(`callRemote`, `police.storage.items.take`, e.itemIndex);
                    } else if (eventName == 'onBackspacePressed') selectMenu.showByName("lspdStorage");
                }
            },
            "lspdGuns": {
                name: "lspdGuns",
                header: "Вооружение LSPD",
                items: [{
                        text: "Фонарик"
                    },
                    {
                        text: "Дубинка"
                    },
                    {
                        text: "Тайзер"
                    },
                    {
                        text: "Пистолет"
                    },
                    {
                        text: "SMG"
                    },
                    {
                        text: "Дробовик"
                    },
                    {
                        text: "Карабин"
                    },
                    {
                        text: "Вернуться"
                    },
                ],
                i: 0,
                j: 0,
                itemIds: [18, 17, 19, 20, 48, 21, 22],
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
                        if (e.itemName == "Вернуться") selectMenu.showByName("lspdStorage");
                        else mp.trigger(`callRemote`, `police.storage.guns.take`, e.itemIndex);
                    } else if (eventName == 'onBackspacePressed') selectMenu.showByName("lspdStorage");
                }
            },
            "lspdAmmo": {
                name: "lspdAmmo",
                header: "Патроны LSPD",
                items: [{
                        text: "Патроны - 9mm",
                        values: ["12 ед.", "24 ед.", "32 ед."],
                    },
                    {
                        text: "Патроны - 12mm",
                        values: ["8 ед.", "16 ед.", "24 ед."],
                    },
                    {
                        text: "Патроны - 5.56mm",
                        values: ["12 ед.", "24 ед.", "32 ед."],
                    },
                    {
                        text: "Патроны - 7.62mm",
                        values: ["10 ед.", "20 ед.", "30 ед."],
                    },
                    {
                        text: "Вернуться"
                    },
                ],
                i: 0,
                j: 0,
                itemIds: [37, 38, 40, 39],
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
                        var values = JSON.stringify([e.itemIndex, parseInt(e.itemValue)]);
                        if (e.itemName == "Вернуться") selectMenu.showByName("lspdStorage");
                        else mp.trigger(`callRemote`, `police.storage.ammo.take`, values);
                    } else if (eventName == 'onBackspacePressed') selectMenu.showByName("lspdStorage");
                }
            },
            "lssdStorage": {
                name: "lssdStorage",
                header: "Склад BCSD",
                items: [{
                        text: "Раздевалка",
                    },
                    {
                        text: "Снаряжение"
                    },
                    {
                        text: "Вооружение"
                    },
                    {
                        text: "Патроны"
                    },
                    {
                        text: "Закрыть"
                    },
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
                        if (e.itemName == 'Раздевалка') {
                            selectMenu.showByName("lssdClothes");
                        } else if (e.itemName == 'Снаряжение') {
                            selectMenu.showByName("lssdItems");
                        } else if (e.itemName == 'Вооружение') {
                            selectMenu.showByName("lssdGuns");
                        } else if (e.itemName == 'Патроны') {
                            selectMenu.showByName("lssdAmmo");
                        } else if (e.itemName == 'Закрыть') {
                            selectMenu.show = false;
                        }
                    }
                }
            },
            "lssdClothes": {
                name: "lssdClothes",
                header: "Раздевалка BCSD",
                items: [{
                        text: "Кадет"
                    },
                    {
                        text: "Deputy Sheriff №1"
                    },
                    {
                        text: "Deputy Sheriff №2"
                    },
                    {
                        text: "Спец. Отдел"
                    },
                    {
                        text: "Мотопатруль"
                    },
                    {
                        text: "Зам. Шефа"
                    },
                    {
                        text: "Шеф"
                    },
                    {
                        text: "Вернуться"
                    },
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
                        if (e.itemName == 'Вернуться') return selectMenu.showByName("lssdStorage");
                        else mp.trigger(`callRemote`, `police.storage.clothes.take`, e.itemIndex);
                        selectMenu.show = false;
                    } else if (eventName == 'onBackspacePressed') selectMenu.showByName("lssdStorage");
                }
            },
            "lssdItems": {
                name: "lssdItems",
                header: "Снаряжение BCSD",
                items: [{
                        text: "Наручники"
                    },
                    {
                        text: "Аптечка"
                    },
                    {
                        text: "Бронежилет"
                    },
                    {
                        text: "Вернуться"
                    },
                ],
                i: 0,
                j: 0,
                itemIds: [28, 24, 3],
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
                        if (e.itemName == "Вернуться") selectMenu.showByName("lssdStorage");
                        else if (e.itemName == 'Бронежилет') mp.trigger(`callRemote`, `police.storage.armour.take`);
                        else mp.trigger(`callRemote`, `police.storage.items.take`, e.itemIndex);
                    } else if (eventName == 'onBackspacePressed') selectMenu.showByName("lssdStorage");
                }
            },
            "lssdGuns": {
                name: "lssdGuns",
                header: "Вооружение BCSD",
                items: [{
                        text: "Фонарик"
                    },
                    {
                        text: "Дубинка"
                    },
                    {
                        text: "Тайзер"
                    },
                    {
                        text: "Пистолет"
                    },
                    {
                        text: "SMG"
                    },
                    {
                        text: "Дробовик"
                    },
                    {
                        text: "Карабин"
                    },
                    {
                        text: "Вернуться"
                    },
                ],
                i: 0,
                j: 0,
                itemIds: [18, 17, 19, 20, 48, 21, 22],
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
                        if (e.itemName == "Вернуться") selectMenu.showByName("lssdStorage");
                        else mp.trigger(`callRemote`, `police.storage.guns.take`, e.itemIndex);
                    } else if (eventName == 'onBackspacePressed') selectMenu.showByName("lssdStorage");
                }
            },
            "lssdAmmo": {
                name: "lssdAmmo",
                header: "Патроны BCSD",
                items: [{
                        text: "Патроны - 9mm",
                        values: ["12 ед.", "24 ед.", "32 ед."],
                    },
                    {
                        text: "Патроны - 12mm",
                        values: ["8 ед.", "16 ед.", "24 ед."],
                    },
                    {
                        text: "Патроны - 5.56mm",
                        values: ["12 ед.", "24 ед.", "32 ед."],
                    },
                    {
                        text: "Патроны - 7.62mm",
                        values: ["10 ед.", "20 ед.", "30 ед."],
                    },
                    {
                        text: "Вернуться"
                    },
                ],
                i: 0,
                j: 0,
                itemIds: [37, 38, 40, 39],
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
                        var values = JSON.stringify([e.itemIndex, parseInt(e.itemValue)]);
                        if (e.itemName == "Вернуться") selectMenu.showByName("lssdStorage");
                        else mp.trigger(`callRemote`, `police.storage.ammo.take`, values);
                    } else if (eventName == 'onBackspacePressed') selectMenu.showByName("lssdStorage");
                }
            },
            "fibStorage": {
                name: "fibStorage",
                header: "Склад FIB",
                items: [{
                        text: "Раздевалка",
                    },
                    {
                        text: "Снаряжение"
                    },
                    {
                        text: "Вооружение"
                    },
                    {
                        text: "Патроны"
                    },
                    {
                        text: "Закрыть"
                    },
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
                        if (e.itemName == 'Раздевалка') {
                            selectMenu.showByName("fibClothes");
                        } else if (e.itemName == 'Снаряжение') {
                            selectMenu.showByName("fibItems");
                        } else if (e.itemName == 'Вооружение') {
                            selectMenu.showByName("fibGuns");
                        } else if (e.itemName == 'Патроны') {
                            selectMenu.showByName("fibAmmo");
                        } else if (e.itemName == 'Закрыть') {
                            selectMenu.show = false;
                        }
                    }
                }
            },
            "fibClothes": {
                name: "fibClothes",
                header: "Раздевалка FIB",
                items: [{
                        text: "Стажер"
                    },
                    {
                        text: "Агент (деловая)"
                    },
                    {
                        text: "Агент (рабочая)"
                    },
                    {
                        text: "ATF/HRT"
                    },
                    {
                        text: "Агент №2"
                    },
                    {
                        text: "Агент №3"
                    },
                    {
                        text: "Вернуться"
                    },
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
                        if (e.itemName == 'Вернуться') return selectMenu.showByName("fibStorage");
                        else mp.trigger(`callRemote`, `fib.storage.clothes.take`, e.itemIndex);
                        selectMenu.show = false;
                    } else if (eventName == 'onBackspacePressed') selectMenu.showByName("fibStorage");
                }
            },
            "fibItems": {
                name: "fibItems",
                header: "Снаряжение FIB",
                items: [{
                        text: "Наручники"
                    },
                    {
                        text: "Аптечка"
                    },
                    {
                        text: "Прослушка"
                    },
                    {
                        text: "Бронежилет"
                    },
                    {
                        text: "Вернуться"
                    },
                ],
                i: 0,
                j: 0,
                itemIds: [28, 24, 4, 3],
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
                        if (e.itemName == "Вернуться") selectMenu.showByName("fibStorage");
                        else if (e.itemName == 'Бронежилет') mp.trigger(`callRemote`, `fib.storage.armour.take`);
                        else mp.trigger(`callRemote`, `fib.storage.items.take`, e.itemIndex);
                    } else if (eventName == 'onBackspacePressed') selectMenu.showByName("fibStorage");
                }
            },
            "fibGuns": {
                name: "fibGuns",
                header: "Вооружение FIB",
                items: [{
                        text: "Heavy Sniper"
                    },
                    {
                        text: "Carbine Rifle Mk II"
                    },
                    {
                        text: "Combat PDW"
                    },
                    {
                        text: "Pistol .50"
                    },
                    {
                        text: "Stun Gun"
                    },
                    {
                        text: "Pump Shotgun Mk II"
                    },
                    {
                        text: "Вернуться"
                    },
                ],
                i: 0,
                j: 0,
                itemIds: [107, 99, 88, 46, 19, 91],
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
                        if (e.itemName == "Вернуться") selectMenu.showByName("fibStorage");
                        else mp.trigger(`callRemote`, `fib.storage.guns.take`, e.itemIndex);
                    } else if (eventName == 'onBackspacePressed') selectMenu.showByName("fibStorage");
                }
            },
            "fibAmmo": {
                name: "fibAmmo",
                header: "Патроны FIB",
                items: [{
                        text: "Патроны - 9mm",
                        values: ["12 ед.", "24 ед.", "32 ед."],
                    },
                    {
                        text: "Патроны - 12mm",
                        values: ["8 ед.", "16 ед.", "24 ед."],
                    },
                    {
                        text: "Патроны - 5.56mm",
                        values: ["12 ед.", "24 ед.", "32 ед."],
                    },
                    {
                        text: "Патроны - 7.62mm",
                        values: ["10 ед.", "20 ед.", "30 ед."],
                    },
                    {
                        text: "Вернуться"
                    },
                ],
                i: 0,
                j: 0,
                itemIds: [37, 38, 40, 39],
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
                        var values = JSON.stringify([e.itemIndex, parseInt(e.itemValue)]);
                        if (e.itemName == "Вернуться") selectMenu.showByName("fibStorage");
                        else mp.trigger(`callRemote`, `fib.storage.ammo.take`, values);
                    } else if (eventName == 'onBackspacePressed') selectMenu.showByName("fibStorage");
                }
            },
            "armyStorage": {
                name: "armyStorage",
                header: "Склад ARMY",
                items: [{
                        text: "Раздевалка",
                    },
                    {
                        text: "Снаряжение"
                    },
                    {
                        text: "Вооружение"
                    },
                    {
                        text: "Патроны"
                    },
                    {
                        text: "Закрыть"
                    },
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
                        if (e.itemName == 'Раздевалка') {
                            selectMenu.showByName("armyClothes");
                        } else if (e.itemName == 'Снаряжение') {
                            selectMenu.showByName("armyItems");
                        } else if (e.itemName == 'Вооружение') {
                            selectMenu.showByName("armyGuns");
                        } else if (e.itemName == 'Патроны') {
                            selectMenu.showByName("armyAmmo");
                        } else if (e.itemName == 'Закрыть') {
                            selectMenu.show = false;
                        }
                    }
                }
            },
            "armyClothes": {
                name: "armyClothes",
                header: "Раздевалка ARMY",
                items: [{
                        text: "Новобранец"
                    },
                    {
                        text: "Сержант"
                    },
                    {
                        text: "Штаб-Сержант"
                    },
                    {
                        text: "Уоррент-Сержант"
                    },
                    {
                        text: "Мл. офицер"
                    },
                    {
                        text: "Ст. офицер"
                    },
                    {
                        text: "Парад. Офицер"
                    },
                    {
                        text: "Ген. Штаб"
                    },
                    {
                        text: "Парад. Ген. Штаб"
                    },
                    {
                        text: "Пилот"
                    },
                    {
                        text: "Спецназ"
                    },
                    {
                        text: "Вернуться"
                    },
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
                        if (e.itemName == 'Вернуться') return selectMenu.showByName("armyStorage");
                        else mp.trigger(`callRemote`, `army.storage.clothes.take`, e.itemIndex);
                        selectMenu.show = false;
                    } else if (eventName == 'onBackspacePressed') selectMenu.showByName("armyStorage");
                }
            },
            "armyItems": {
                name: "armyItems",
                header: "Снаряжение ARMY",
                items: [{
                        text: "Аптечка"
                    },
                    {
                        text: "Наручники"
                    },
                    {
                        text: "Сухпай"
                    },
                    {
                        text: "Бронежилет"
                    },
                    {
                        text: "Вернуться"
                    },
                ],
                i: 0,
                j: 0,
                itemIds: [24, 28, 132, 3],
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
                        if (e.itemName == "Вернуться") selectMenu.showByName("armyStorage");
                        else if (e.itemName == 'Бронежилет') mp.trigger(`callRemote`, `army.storage.armour.take`);
                        else mp.trigger(`callRemote`, `army.storage.items.take`, e.itemIndex);
                    } else if (eventName == 'onBackspacePressed') selectMenu.showByName("armyStorage");
                }
            },
            "armyGuns": {
                name: "armyGuns",
                header: "Вооружение ARMY",
                items: [{
                        text: "Дубинка"
                    },
                    {
                        text: "Пистолет"
                    },
                    {
                        text: "SMG"
                    },
                    {
                        text: "Дробовик"
                    },
                    {
                        text: "Карабин"
                    },
                    {
                        text: "Снайперка"
                    },
                    {
                        text: "Вернуться"
                    },
                ],
                i: 0,
                j: 0,
                itemIds: [17, 80, 48, 21, 22, 107],
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
                        if (e.itemName == "Вернуться") selectMenu.showByName("armyStorage");
                        else mp.trigger(`callRemote`, `army.storage.guns.take`, e.itemIndex);
                    } else if (eventName == 'onBackspacePressed') selectMenu.showByName("armyStorage");
                }
            },
            "armyAmmo": {
                name: "armyAmmo",
                header: "Патроны ARMY",
                items: [{
                        text: "Патроны - 9mm",
                        values: ["12 ед.", "24 ед.", "32 ед."],
                    },
                    {
                        text: "Патроны - 12mm",
                        values: ["8 ед.", "16 ед.", "24 ед."],
                    },
                    {
                        text: "Патроны - 5.56mm",
                        values: ["12 ед.", "24 ед.", "32 ед."],
                    },
                    {
                        text: "Патроны - 7.62mm",
                        values: ["10 ед.", "20 ед.", "30 ед."],
                    },
                    {
                        text: "Вернуться"
                    },
                ],
                i: 0,
                j: 0,
                itemIds: [37, 38, 40, 39],
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
                        var values = JSON.stringify([e.itemIndex, parseInt(e.itemValue)]);
                        if (e.itemName == "Вернуться") selectMenu.showByName("armyStorage");
                        else mp.trigger(`callRemote`, `army.storage.ammo.take`, values);
                    } else if (eventName == 'onBackspacePressed') selectMenu.showByName("armyStorage");
                }
            },
            "hospitalStorage": {
                name: "hospitalStorage",
                header: "Склад Hospital",
                items: [{
                        text: "Раздевалка",
                    },
                    {
                        text: "Снаряжение"
                    },
                    {
                        text: "Закрыть"
                    },
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
                        if (e.itemName == 'Раздевалка') {
                            selectMenu.showByName("hospitalClothes");
                        } else if (e.itemName == 'Снаряжение') {
                            selectMenu.showByName("hospitalItems");
                        } else if (e.itemName == 'Закрыть') {
                            selectMenu.show = false;
                        }
                    }
                }
            },
            "hospitalClothes": {
                name: "hospitalClothes",
                header: "Раздевалка Hospital",
                items: [{
                        text: "Форма №1"
                    },
                    {
                        text: "Форма №2"
                    },
                    {
                        text: "Форма №3"
                    },
                    {
                        text: "Форма №4"
                    },
                    {
                        text: "Форма №5"
                    },
                    {
                        text: "Форма №6"
                    },
                    {
                        text: "Вернуться"
                    },
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
                        if (e.itemName == 'Вернуться') selectMenu.showByName("hospitalStorage");
                        else {
                            selectMenu.show = false;
                            mp.trigger(`callRemote`, `hospital.storage.clothes.take`, e.itemIndex);
                        }
                    } else if (eventName == 'onBackspacePressed') selectMenu.showByName("hospitalStorage");
                }
            },
            "hospitalItems": {
                name: "hospitalItems",
                header: "Снаряжение Hospital",
                items: [{
                        text: "Малая аптечка"
                    },
                    {
                        text: "Большая аптечка"
                    },
                    {
                        text: "Пластырь"
                    },
                    {
                        text: "Адреналин"
                    },
                    {
                        text: "Вернуться"
                    },
                ],
                i: 0,
                j: 0,
                itemIds: [24, 27, 25, 26],
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
                        if (e.itemName == "Вернуться") selectMenu.showByName("hospitalStorage");
                        else mp.trigger(`callRemote`, `hospital.storage.items.take`, e.itemIndex);
                    } else if (eventName == 'onBackspacePressed') selectMenu.showByName("hospitalStorage");
                }
            },
            "newsStorage": {
                name: "newsStorage",
                header: "Склад Weazel News",
                items: [{
                        text: "Раздевалка",
                    },
                    // {
                    //     text: "Снаряжение"
                    // },
                    {
                        text: "Закрыть"
                    },
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
                        if (e.itemName == 'Раздевалка') {
                            selectMenu.showByName("newsClothes");
                            // } else if (e.itemName == 'Снаряжение') {
                            // selectMenu.showByName("hospitalItems");
                        } else if (e.itemName == 'Закрыть') {
                            selectMenu.show = false;
                        }
                    }
                }
            },
            "newsClothes": {
                name: "newsClothes",
                header: "Раздевалка Weazel News",
                items: [{
                        text: "Стажер"
                    },
                    {
                        text: "Мл. Состав"
                    },
                    {
                        text: "Ст. Состав"
                    },
                    {
                        text: "Директор"
                    },
                    {
                        text: "Вернуться"
                    },
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
                        if (e.itemName == 'Вернуться') selectMenu.showByName("newsStorage");
                        else {
                            selectMenu.show = false;
                            mp.trigger(`callRemote`, `news.storage.clothes.take`, e.itemIndex);
                        }
                    } else if (eventName == 'onBackspacePressed') selectMenu.showByName("newsStorage");
                }
            },
            "bandStorage": {
                name: "bandStorage",
                header: "Склад банды",
                items: [{
                        text: "Вооружение"
                    },
                    {
                        text: "Патроны"
                    },
                    {
                        text: "Влияние"
                    },
                    {
                        text: "Общак"
                    },
                    {
                        text: "Склад"
                    },
                    {
                        text: "Закрыть"
                    },
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
                        if (e.itemName == 'Вооружение') {
                            selectMenu.showByName("bandGuns");
                        } else if (e.itemName == 'Патроны') {
                            selectMenu.showByName("bandAmmo");
                        } else if (e.itemName == 'Влияние') {
                            selectMenu.showByName("bandPower");
                        } else if (e.itemName == 'Общак') {
                            selectMenu.showByName("bandCash");
                        } else if (e.itemName == 'Склад') {
                            selectMenu.showByName("bandWarehouse");
                        } else if (e.itemName == 'Закрыть') {
                            selectMenu.show = false;
                        }
                    }
                }
            },
            "bandGuns": {
                name: "bandGuns",
                header: "Вооружение банды",
                items: [{
                        text: "Baseball Bat"
                    },
                    {
                        text: "Pump Shotgun"
                    },
                    {
                        text: "Pistol"
                    },
                    {
                        text: "Combat Pistol"
                    },
                    {
                        text: "Micro SMG"
                    },
                    {
                        text: "Machine Pistol"
                    },
                    {
                        text: "Compact Rifle"
                    },
                    {
                        text: "Вернуться"
                    },
                ],
                i: 0,
                j: 0,
                itemIds: [41, 21, 44, 20, 47, 89, 52],
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
                        if (e.itemName == "Вернуться") selectMenu.showByName("bandStorage");
                        else mp.trigger(`callRemote`, `bands.storage.guns.take`, e.itemIndex);
                    } else if (eventName == 'onBackspacePressed') selectMenu.showByName("bandStorage");
                }
            },
            "bandAmmo": {
                name: "bandAmmo",
                header: "Патроны банды",
                items: [{
                        text: "Патроны - 9mm",
                        values: ["12 ед.", "24 ед.", "32 ед."],
                    },
                    {
                        text: "Патроны - 12mm",
                        values: ["8 ед.", "16 ед.", "24 ед."],
                    },
                    {
                        text: "Патроны - 5.56mm",
                        values: ["12 ед.", "24 ед.", "32 ед."],
                    },
                    {
                        text: "Патроны - 7.62mm",
                        values: ["10 ед.", "20 ед.", "30 ед."],
                    },
                    {
                        text: "Вернуться"
                    },
                ],
                i: 0,
                j: 0,
                itemIds: [37, 38, 40, 39],
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
                        var values = JSON.stringify([e.itemIndex, parseInt(e.itemValue)]);
                        if (e.itemName == "Вернуться") selectMenu.showByName("bandStorage");
                        else mp.trigger(`callRemote`, `bands.storage.ammo.take`, values);
                    } else if (eventName == 'onBackspacePressed') selectMenu.showByName("bandStorage");
                }
            },
            "bandPower": {
                name: "bandPower",
                header: "Влияние в гетто",
                items: [{
                        text: "Банда 1",
                        values: ["99 зон (100%)"],
                    },
                    {
                        text: "Банда 1",
                        values: ["99 зон (100%)"],
                    },
                    {
                        text: "Банда 1",
                        values: ["99 зон (100%)"],
                    },
                    {
                        text: "Банда 1",
                        values: ["99 зон (100%)"],
                    },
                    {
                        text: "Вернуться"
                    },
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
                        if (e.itemName == "Вернуться") selectMenu.showByName("bandStorage");
                    } else if (eventName == 'onBackspacePressed') selectMenu.showByName("bandStorage");
                }
            },
            "bandCash": {
                name: "bandCash",
                header: "Общак банды",
                items: [{
                        text: "Баланс",
                        values: ["$999999"],
                    },
                    {
                        text: "Сумма",
                        values: [""],
                        type: "editable",
                    },
                    {
                        text: "Пополнить",
                    },
                    {
                        text: "Снять",
                    },
                    {
                        text: "Выписать чек",
                    },
                    {
                        text: "Вернуться"
                    },
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
                        if (e.itemName == "Пополнить") {
                            var sum = this.items[1].values[0];
                            if (isNaN(sum)) return notifications.push(`error`, `Требуется число`);
                            if (sum <= 0) return notifications.push(`error`, `Требуется положительное число`);
                            selectMenu.show = false;
                            mp.trigger(`callRemote`, `bands.storage.cash.put`, sum);
                        } else if (e.itemName == "Снять") {
                            var sum = this.items[1].values[0];
                            if (isNaN(sum)) return notifications.push(`error`, `Требуется число`);
                            if (sum <= 0) return notifications.push(`error`, `Требуется положительное число`);
                            selectMenu.show = false;
                            mp.trigger(`callRemote`, `bands.storage.cash.take`, sum);
                        } else if (e.itemName == "Выписать чек") {
                            selectMenu.showByName("bandCashCheck");
                        }
                        if (e.itemName == "Вернуться") selectMenu.showByName("bandStorage");
                    } else if (eventName == 'onBackspacePressed' && this.i != 1) selectMenu.showByName("bandStorage");
                }
            },
            "bandCashCheck": {
                name: "bandCashCheck",
                header: "Чек на пополнение общака",
                items: [{
                        text: "ID игрока",
                        values: [""],
                        type: "editable",
                    },
                    {
                        text: "Сумма $",
                        values: [""],
                        type: "editable",
                    },
                    {
                        text: "Предложить"
                    },
                    {
                        text: "Вернуться"
                    },
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
                        if (e.itemName == 'Предложить') {
                            var playerId = this.items[0].values[0];
                            var sum = this.items[1].values[0];
                            if (isNaN(playerId) || isNaN(sum)) return notifications.push(`error`, `Требуется число`);
                            if (playerId < 0 || sum <= 0) return notifications.push(`error`, `Требуется положительное число`);
                            var data = {
                                playerId: parseInt(this.items[0].values[0]),
                                sum: parseInt(this.items[1].values[0]),
                            };
                            selectMenu.show = false;
                            mp.trigger(`callRemote`, `factions.cash.offer`, JSON.stringify(data));
                        } else if (e.itemName == 'Вернуться') {
                            selectMenu.showByName("bandCash");
                        }
                    } else if (eventName == 'onBackspacePressed' && this.i > 1)
                        selectMenu.showByName("bandCash");
                }
            },
            "bandWarehouse": {
                name: "bandWarehouse",
                header: "Склад",
                items: [{
                        text: "Открыть",
                    },
                    {
                        text: "Закрыть"
                    },
                    {
                        text: "Вернуться"
                    },
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
                        if (e.itemName == 'Открыть') {
                            selectMenu.show = false;
                            mp.trigger(`callRemote`, `bands.storage.state`, true);
                        } else if (e.itemName == 'Закрыть') {
                            selectMenu.show = false;
                            mp.trigger(`callRemote`, `bands.storage.state`, false);
                        } else if (e.itemName == 'Вернуться') {
                            selectMenu.showByName("bandStorage");
                        }
                    } else if (eventName == 'onBackspacePressed')
                        selectMenu.showByName("bandStorage");
                }
            },
            "mafiaStorage": {
                name: "mafiaStorage",
                header: "Склад мафии",
                items: [{
                        text: "Вооружение"
                    },
                    {
                        text: "Патроны"
                    },
                    {
                        text: "Влияние"
                    },
                    {
                        text: "Общак"
                    },
                    {
                        text: "Склад"
                    },
                    {
                        text: "Закрыть"
                    },
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
                        if (e.itemName == 'Вооружение') {
                            selectMenu.showByName("mafiaGuns");
                        } else if (e.itemName == 'Патроны') {
                            selectMenu.showByName("mafiaAmmo");
                        } else if (e.itemName == 'Влияние') {
                            selectMenu.showByName("mafiaPower");
                        } else if (e.itemName == 'Общак') {
                            selectMenu.showByName("mafiaCash");
                        } else if (e.itemName == 'Склад') {
                            selectMenu.showByName("mafiaWarehouse");
                        } else if (e.itemName == 'Закрыть') {
                            selectMenu.show = false;
                        }
                    }
                }
            },
            "mafiaGuns": {
                name: "mafiaGuns",
                header: "Вооружение мафии",
                items: [{
                        text: "Pistol"
                    },
                    {
                        text: "Pistol .50"
                    },
                    {
                        text: "Mini SMG"
                    },
                    {
                        text: "SMG"
                    },
                    {
                        text: "Sawed-Off Shotgun"
                    },
                    {
                        text: "Double Barrel Shotgun"
                    },
                    {
                        text: "Assault Rifle"
                    },
                    {
                        text: "Carbine Rifle"
                    },
                    {
                        text: "Вернуться"
                    },
                ],
                i: 0,
                j: 0,
                itemIds: [44, 46, 90, 48, 49, 96, 50, 22],
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
                        if (e.itemName == "Вернуться") selectMenu.showByName("mafiaStorage");
                        else mp.trigger(`callRemote`, `mafia.storage.guns.take`, e.itemIndex);
                    } else if (eventName == 'onBackspacePressed') selectMenu.showByName("mafiaStorage");
                }
            },
            "mafiaAmmo": {
                name: "mafiaAmmo",
                header: "Патроны мафии",
                items: [{
                        text: "Патроны - 9mm",
                        values: ["12 ед.", "24 ед.", "32 ед."],
                    },
                    {
                        text: "Патроны - 12mm",
                        values: ["8 ед.", "16 ед.", "24 ед."],
                    },
                    {
                        text: "Патроны - 5.56mm",
                        values: ["12 ед.", "24 ед.", "32 ед."],
                    },
                    {
                        text: "Патроны - 7.62mm",
                        values: ["10 ед.", "20 ед.", "30 ед."],
                    },
                    {
                        text: "Вернуться"
                    },
                ],
                i: 0,
                j: 0,
                itemIds: [37, 38, 40, 39],
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
                        var values = JSON.stringify([e.itemIndex, parseInt(e.itemValue)]);
                        if (e.itemName == "Вернуться") selectMenu.showByName("mafiaStorage");
                        else mp.trigger(`callRemote`, `mafia.storage.ammo.take`, values);
                    } else if (eventName == 'onBackspacePressed') selectMenu.showByName("mafiaStorage");
                }
            },
            "mafiaPower": {
                name: "mafiaPower",
                header: "Влияние в бизнесах",
                items: [{
                        text: "Мафия 1",
                        values: ["99 биз. (100%)"],
                    },
                    {
                        text: "Мафия 2",
                        values: ["99 биз. (100%)"],
                    },
                    {
                        text: "Мафия 3",
                        values: ["99 биз. (100%)"],
                    },
                    {
                        text: "Вернуться"
                    },
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
                        if (e.itemName == "Вернуться") selectMenu.showByName("mafiaStorage");
                    } else if (eventName == 'onBackspacePressed') selectMenu.showByName("mafiaStorage");
                }
            },
            "mafiaCash": {
                name: "mafiaCash",
                header: "Общак мафии",
                items: [{
                        text: "Баланс",
                        values: ["$999999"],
                    },
                    {
                        text: "Сумма",
                        values: [""],
                        type: "editable",
                    },
                    {
                        text: "Пополнить",
                    },
                    {
                        text: "Снять",
                    },
                    {
                        text: "Выписать чек",
                    },
                    {
                        text: "Вернуться"
                    },
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
                        if (e.itemName == "Пополнить") {
                            var sum = this.items[1].values[0];
                            if (isNaN(sum)) return notifications.push(`error`, `Требуется число`);
                            if (sum <= 0) return notifications.push(`error`, `Требуется положительное число`);
                            selectMenu.show = false;
                            mp.trigger(`callRemote`, `mafia.storage.cash.put`, sum);
                        } else if (e.itemName == "Снять") {
                            var sum = this.items[1].values[0];
                            if (isNaN(sum)) return notifications.push(`error`, `Требуется число`);
                            if (sum <= 0) return notifications.push(`error`, `Требуется положительное число`);
                            selectMenu.show = false;
                            mp.trigger(`callRemote`, `mafia.storage.cash.take`, sum);
                        } else if (e.itemName == "Выписать чек") {
                            selectMenu.showByName("mafiaCashCheck");
                        }
                        if (e.itemName == "Вернуться") selectMenu.showByName("mafiaStorage");
                    } else if (eventName == 'onBackspacePressed' && this.i != 1) selectMenu.showByName("mafiaStorage");
                }
            },
            "mafiaCashCheck": {
                name: "mafiaCashCheck",
                header: "Чек на пополнение общака",
                items: [{
                        text: "ID игрока",
                        values: [""],
                        type: "editable",
                    },
                    {
                        text: "Сумма $",
                        values: [""],
                        type: "editable",
                    },
                    {
                        text: "Предложить"
                    },
                    {
                        text: "Вернуться"
                    },
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
                        if (e.itemName == 'Предложить') {
                            var playerId = this.items[0].values[0];
                            var sum = this.items[1].values[0];
                            if (isNaN(playerId) || isNaN(sum)) return notifications.push(`error`, `Требуется число`);
                            if (playerId < 0 || sum <= 0) return notifications.push(`error`, `Требуется положительное число`);
                            var data = {
                                playerId: parseInt(this.items[0].values[0]),
                                sum: parseInt(this.items[1].values[0]),
                            };
                            selectMenu.show = false;
                            mp.trigger(`callRemote`, `factions.cash.offer`, JSON.stringify(data));
                        } else if (e.itemName == 'Вернуться') {
                            selectMenu.showByName("mafiaCash");
                        }
                    } else if (eventName == 'onBackspacePressed' && this.i > 1)
                        selectMenu.showByName("mafiaCash");
                }
            },
            "mafiaWarehouse": {
                name: "mafiaWarehouse",
                header: "Склад",
                items: [{
                        text: "Открыть"
                    },
                    {
                        text: "Закрыть"
                    },
                    {
                        text: "Вернуться"
                    },
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
                        if (e.itemName == 'Открыть') {
                            selectMenu.show = false;
                            mp.trigger(`callRemote`, `mafia.storage.state`, true);
                        } else if (e.itemName == 'Закрыть') {
                            selectMenu.show = false;
                            mp.trigger(`callRemote`, `mafia.storage.state`, false);
                        } else if (e.itemName == 'Вернуться') {
                            selectMenu.showByName("mafiaStorage");
                        }
                    } else if (eventName == 'onBackspacePressed')
                        selectMenu.showByName("mafiaStorage");
                }
            },
            "mafiaBizWar": {
                name: "mafiaBizWar",
                header: "Отжатие бизнеса",
                items: [{
                        text: "Бизнес 1",
                        values: ["ID: 1"],
                    },
                    {
                        text: "Бизнес 2",
                        values: ["ID: 2"],
                    },
                    {
                        text: "Бизнес 3",
                        values: ["ID: 3"],
                    },
                    {
                        text: "Закрыть"
                    },
                ],
                i: 0,
                j: 0,
                names: ["Мафия 1", "Мафия 2", "Мафия 3"],
                counts: [111, 222, 333],
                bizCount: 1000,
                update() {
                    var item = this.items[this.i];
                    var name = this.names[item.factionId - 12];
                    var count = this.counts[item.factionId - 12];
                    var per = parseInt(count / this.bizCount * 100);

                    selectMenu.notification = `Крыша: ${name}. Влияние: ${count} биз. ( ${per}% )`;
                },
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
                        if (e.itemName != 'Закрыть') {
                            var bizId = parseInt(this.items[e.itemIndex].values[0].split(":")[1]);
                            mp.trigger(`callRemote`, `mafia.bizWar.start`, bizId);
                        }
                        selectMenu.show = false;
                    } else if (eventName == "onItemFocusChanged") {
                        if (e.itemName != "Закрыть") this.update();
                    } else if (eventName == 'onBackspacePressed')
                        selectMenu.show = false;
                }
            },
            "drugsStash": {
                name: "drugsStash",
                header: "Наркопритон",
                items: [{
                        text: "Наркотик 1",
                        values: ["3 г.", "7 г.", "10 г."],
                    },
                    {
                        text: "Наркотик 2",
                        values: ["3 г.", "7 г.", "10 г."],
                    },
                    {
                        text: "Наркотик 3",
                        values: ["3 г.", "7 г.", "10 г."],
                    },
                    {
                        text: "Наркотик 4",
                        values: ["3 г.", "7 г.", "10 г."],
                    },
                    {
                        text: "Закрыть"
                    },
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
                        var data = {
                            index: e.itemIndex,
                            count: parseInt(e.itemValue)
                        };
                        if (e.itemName != "Закрыть") mp.trigger(`callRemote`, `bands.drugsStash.drugs.buy`, JSON.stringify(data));
                        selectMenu.show = false;
                    }
                }
            },
            "dmvMenu": {
                name: "dmv",
                header: "Покупка лицензий",
                items: [{
                        text: 'Легковой транспорт',
                        values: ["$100"]
                    },
                    {
                        text: 'Пассажирский транспорт',
                        values: ["$100"]
                    },
                    {
                        text: 'Мотоциклы',
                        values: ["$100"]
                    },
                    {
                        text: 'Грузовой транспорт',
                        values: ["$100"]
                    },
                    {
                        text: 'Воздушный транспорт',
                        values: ["$100"]
                    },
                    {
                        text: 'Водный транспорт',
                        values: ["$100"]
                    },
                    {
                        text: 'Закрыть',
                    },
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
                        selectMenu.loader = true;
                        //mp.trigger(`dmv.menu.close`);
                        if (e.itemName == 'Легковой транспорт') {
                            mp.trigger('callRemote', 'dmv.license.buy', 0);
                        }
                        if (e.itemName == 'Пассажирский транспорт') {
                            mp.trigger('callRemote', 'dmv.license.buy', 1);
                        }
                        if (e.itemName == 'Мотоциклы') {
                            mp.trigger('callRemote', 'dmv.license.buy', 2);
                        }
                        if (e.itemName == 'Грузовой транспорт') {
                            mp.trigger('callRemote', 'dmv.license.buy', 3);
                        }
                        if (e.itemName == 'Воздушный транспорт') {
                            mp.trigger('callRemote', 'dmv.license.buy', 4);
                        }
                        if (e.itemName == 'Водный транспорт') {
                            mp.trigger('callRemote', 'dmv.license.buy', 5);
                        }
                        if (e.itemName == 'Закрыть') {
                            selectMenu.loader = false;
                            mp.trigger(`dmv.menu.close`);
                        }
                    }
                }
            },
            "busJobMenu": {
                name: "busjob",
                header: "Управляющий станцией",
                items: [{
                        text: "Устроиться на работу",
                        i: 0,
                    },
                    {
                        text: "Помощь",
                        i: 0,
                    },
                    {
                        text: "Закрыть",
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
                        if (e.itemName == 'Устроиться на работу') {
                            mp.trigger(`callRemote`, `busdriver.employment`);
                            mp.trigger(`busdriver.jobmenu.close`);
                        }
                        if (e.itemName == 'Уволиться с работы') {
                            mp.trigger(`callRemote`, `busdriver.employment`);
                            mp.trigger(`busdriver.jobmenu.close`);
                        }
                        if (e.itemName == 'Закрыть') {
                            mp.trigger(`busdriver.jobmenu.close`);
                        } else if (e.itemName == 'Помощь') {
                            selectMenu.show = false;
                            modal.showByName("bus_help");
                        }
                    }
                }
            },
            "routeCreator": {
                name: "routecreator",
                header: "Route Creator",
                items: [{
                        text: "Название маршрута",
                        values: [""],
                        type: "editable"
                    },
                    {
                        text: "Цена за точку",
                        values: [""],
                        type: "editable"
                    },
                    {
                        text: "Уровень автобусника",
                        values: ['0', '1'],
                        i: 0,
                    },
                    {
                        text: "Добавить чекпоинт",
                    },
                    {
                        text: "Добавить остановку",
                    },
                    {
                        text: "Удалить последнюю точку",
                    },
                    {
                        text: "Сохранить",
                    },
                    {
                        text: "Очистить",
                    },
                    {
                        text: "Закрыть",
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
                        switch (e.itemName) {
                            case 'Добавить чекпоинт':
                                mp.trigger('routecreator.checkpoint.add', 0);
                                break;
                            case 'Добавить остановку':
                                mp.trigger('routecreator.checkpoint.add', 1);
                                break;
                            case 'Сохранить':
                                mp.trigger('routecreator.route.save', this.items[0].values[0], this.items[1].values[0], this.items[2].i);
                                break;
                            case 'Закрыть':
                                mp.trigger('routecreator.close');
                                break;
                            case 'Удалить последнюю точку':
                                mp.trigger('routecreator.checkpoint.delete');
                                break;
                            case 'Очистить':
                                mp.trigger('routecreator.route.clear');
                                break;
                        }
                    }
                }
            },
            "busMenu": {
                name: "busmenu",
                header: "Выбор маршрута",
                items: [{
                        text: "Маршрут",
                        values: ['1', '2'],

                    },
                    {
                        text: "Оплата за проезд",
                        values: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
                        min: "$0",
                        max: "$10",
                    },
                    {
                        text: "Начать работу",
                    },
                    {
                        text: "Отмена",
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
                        if (e.itemName == 'Начать работу') {
                            mp.trigger(`busdriver.menu.start`, this.items[0].i, this.items[1].values[this.items[1].i]);
                            mp.trigger(`busdriver.menu.close`);
                            loader.show = true;
                        }
                        if (e.itemName == 'Отмена') {
                            mp.trigger(`busdriver.menu.close`);
                            mp.trigger('callRemote', 'busdriver.menu.closed');
                        }
                    }
                }
            },
            "tuningMain": {
                name: "tuningMain",
                header: "LS Customs",
                headerImg: "lsc.png",
                items: [{
                        text: "Ремонт кузова",
                        values: ['$100']
                    },
                    {
                        text: "Цвета"
                    },
                    // {
                    //     text: "Двигатель"
                    // },
                    // {
                    //     text: "Тормоза"
                    // },
                    // {
                    //     text: "Трансмиссия"
                    // },
                    // {
                    //     text: "Подвеска"
                    // },
                    // {
                    //     text: "Броня"
                    // },
                    // {
                    //     text: "Турбонаддув"
                    // },
                    // {
                    //     text: "Закрыть"
                    // },
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
                        mp.trigger('tuning.lastIndex.set', e.itemIndex);
                        switch (e.itemName) {
                            case 'Закрыть':
                                mp.trigger('tuning.end');
                                break;
                            case 'Ремонт кузова':
                                mp.trigger('tuning.repair');
                                break;
                            case 'Цвета':
                                mp.trigger('tuning.colorMenu.show');
                                break;
                            case 'Двигатель':
                                mp.trigger('tuning.defaultMenu.show', 'engineType');
                                break;
                            case 'Тормоза':
                                mp.trigger('tuning.defaultMenu.show', 'brakeType');
                                break;
                            case 'Трансмиссия':
                                mp.trigger('tuning.defaultMenu.show', 'transmissionType');
                                break;
                            case 'Подвеска':
                                mp.trigger('tuning.defaultMenu.show', 'suspensionType');
                                break;
                            case 'Броня':
                                mp.trigger('tuning.defaultMenu.show', 'armourType');
                                break;
                            // case 'Турбонаддув':
                            //     mp.trigger('tuning.turboMenu.show');
                            //     break;
                            case 'Спойлер':
                                mp.trigger('tuning.defaultMenu.show', 'spoiler');
                                break;
                            case 'Передний бампер':
                                mp.trigger('tuning.defaultMenu.show', 'frontBumper');
                                break;
                            case 'Задний бампер':
                                mp.trigger('tuning.defaultMenu.show', 'rearBumper');
                                break;
                            case 'Пороги':
                                mp.trigger('tuning.defaultMenu.show', 'sideSkirt');
                                break;
                            case 'Глушитель':
                                mp.trigger('tuning.defaultMenu.show', 'exhaust');
                                break;
                            case 'Рама':
                                mp.trigger('tuning.defaultMenu.show', 'frame');
                                break;
                            case 'Решетка радиатора':
                                mp.trigger('tuning.defaultMenu.show', 'grille');
                                break;
                            case 'Капот':
                                mp.trigger('tuning.defaultMenu.show', 'hood');
                                break;
                            case 'Крыло':
                                mp.trigger('tuning.defaultMenu.show', 'fender');
                                break;
                            case 'Правое крыло':
                                mp.trigger('tuning.defaultMenu.show', 'rightFender');
                                break;
                            case 'Крыша':
                                mp.trigger('tuning.defaultMenu.show', 'roof');
                                break;
                            case 'Покрасочные работы':
                                mp.trigger('tuning.defaultMenu.show', 'livery');
                                break;
                            case 'Колеса':
                                mp.trigger('tuning.defaultMenu.show', 'frontWheels');
                                break;
                            case 'Тонировка':
                                mp.trigger('tuning.defaultMenu.show', 'windowTint');
                                break;
                            case 'Фары':
                                mp.trigger('tuning.defaultMenu.show', 'xenon');
                                break;
                            case 'Номерные знаки':
                                mp.trigger('tuning.defaultMenu.show', 'plateHolder');
                                break;
                            case 'Неон':
                                mp.trigger('tuning.defaultMenu.show', 'neon');
                                break;

                        }
                    }
                    if (eventName == 'onEscapePressed' || eventName == 'onBackspacePressed') {
                        mp.trigger('tuning.end');
                    }
                }
            },
            "tuningColors": {
                name: "tuningColors",
                header: "Покраска",
                headerImg: "lsc.png",
                items: [{
                        text: "Основной цвет",
                        values: [],
                        i: 0,
                        j: 0
                    },
                    {
                        text: "Дополнительный цвет",
                        values: []
                    },
                    {
                        text: "Покрасить",
                        values: ['$100']
                    },
                    {
                        text: "Назад"
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
                    if (eventName == 'onItemValueChanged') {
                        if (e.itemName == 'Основной цвет') {
                            mp.trigger(`tuning.colors`, e.valueIndex, -1);
                        }
                        if (e.itemName == 'Дополнительный цвет') {
                            mp.trigger(`tuning.colors`, -1, e.valueIndex);
                        }
                    }
                    if (eventName == 'onItemSelected') {
                        if (e.itemName == 'Назад') {
                            mp.trigger('tuning.menu.show');
                            mp.trigger('tuning.params.set')
                        }
                        if (e.itemName == 'Покрасить') {
                            mp.trigger('tuning.colors.confirm')
                        }
                    }
                    if (eventName == 'onEscapePressed' || eventName == 'onBackspacePressed') {
                        mp.trigger('tuning.menu.show');
                        mp.trigger('tuning.params.set')
                    }
                }
            },
            "tuningTurbo": {
                name: "tuningTurbo",
                header: "Турбонаддув",
                headerImg: "lsc.png",
                items: [{
                        text: "Нет",
                        values: ['$100']
                    },
                    {
                        text: "Турбонаддув",
                        values: ['$100']
                    },
                    {
                        text: "Назад"
                    },
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
                        if (e.itemName == 'Назад') {
                            mp.trigger('tuning.menu.show');
                        } else {
                            if (item.values[0] == 'уст.') return selectMenu.notification = 'Этот элемент уже установлен';
                            let index = e.itemIndex - 1;
                            mp.trigger('tuning.buy', 18, index);
                        }
                    }
                    if (eventName == 'onEscapePressed' || eventName == 'onBackspacePressed') {
                        mp.trigger('tuning.menu.show');
                        //mp.trigger('tuning.params.set')
                    }
                }
            },
            "tuningDefault": {
                name: "tuningDefault",
                header: "",
                headerImg: "lsc.png",
                items: [],
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
                    if (eventName == 'onItemFocusChanged') {
                        let index = e.itemIndex - 1;
                        mp.trigger('tuning.mod.set', -1, index);
                    }
                    if (eventName == 'onItemSelected') {
                        if (e.itemName == 'Назад') {
                            mp.trigger('tuning.menu.show');
                            mp.trigger('tuning.params.set')
                        } else {
                            if (item.values[0] == 'уст.') return selectMenu.notification = 'Этот элемент уже установлен';
                            let index = e.itemIndex - 1;
                            mp.trigger('tuning.buy', -1, index);
                        }
                    }
                    if (eventName == 'onEscapePressed' || eventName == 'onBackspacePressed') {
                        mp.trigger('tuning.menu.show');
                        mp.trigger('tuning.params.set')
                    }
                }
            },
            "farm": {
                name: "farm",
                header: "Ферма",
                items: [{
                        text: "Работа",
                    },
                    {
                        text: "О ферме",
                    },
                    {
                        text: "Помощь"
                    },
                    {
                        text: "Закрыть"
                    },
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
                        if (e.itemName == 'Работа') {
                            selectMenu.showByName("farmJob");
                        } else if (e.itemName == 'О ферме') {
                            selectMenu.showByName("farmInfo");
                        } else if (e.itemName == 'Помощь') {
                            selectMenu.show = false;
                            modal.showByName("farm_help");
                        } else if (e.itemName == 'Купить') {
                            selectMenu.loader = true;
                            mp.trigger(`callRemote`, `farms.buy`);
                        } else if (e.itemName == 'Управление') {
                            selectMenu.showByName("farmControl");
                        } else if (e.itemName == 'Закрыть') {
                            selectMenu.show = false;
                        }
                    }
                }
            },
            "farmJob": {
                name: "farmJob",
                header: "Должности",
                items: [{
                        text: "Работник",
                    },
                    {
                        text: "Фермер"
                    },
                    {
                        text: "Тракторист"
                    },
                    {
                        text: "Пилот"
                    },
                    {
                        text: "Уволиться"
                    },
                    {
                        text: "Вернуться"
                    },
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
                        if (e.itemName == 'Работник') {
                            mp.trigger(`callRemote`, `farms.job.start`, 0);
                        } else if (e.itemName == 'Фермер') {
                            mp.trigger(`callRemote`, `farms.job.start`, 1);
                        } else if (e.itemName == 'Тракторист') {
                            mp.trigger(`callRemote`, `farms.job.start`, 2);
                        } else if (e.itemName == 'Пилот') {
                            mp.trigger(`callRemote`, `farms.job.start`, 3);
                        } else if (e.itemName == 'Уволиться') {
                            mp.trigger(`callRemote`, `farms.job.stop`);
                        } else if (e.itemName == 'Вернуться') {
                            selectMenu.showByName("farm");
                        }
                    } else if (eventName == 'onBackspacePressed')
                        selectMenu.showByName("farm");
                }
            },
            "farmInfo": {
                name: "farmInfo",
                header: "О ферме",
                items: [{
                        text: "Ферма",
                        values: ["ID 111"],
                    },
                    {
                        text: "Хозяин",
                        values: ["Swift Slade"],
                    },
                    {
                        text: "Баланс",
                        values: ["$999"],
                    },
                    {
                        text: "Налог. баланс",
                        values: ["$999"],
                    },
                    {
                        text: "Зарплата",
                        values: ["$30"],
                    },
                    {
                        text: "Премия фермера",
                        values: ["$50"],
                    },
                    {
                        text: "Премия тракториста",
                        values: ["$70"],
                    },
                    {
                        text: "Премия пилота",
                        values: ["$80"],
                    },
                    {
                        text: "Количество полей",
                        values: ["10 ед."],
                    },
                    {
                        text: "Вернуться"
                    },
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
                        if (e.itemName == 'Вернуться') {
                            selectMenu.showByName("farm");
                        }
                    } else if (eventName == 'onBackspacePressed')
                        selectMenu.showByName("farm");
                }
            },
            "farmControl": {
                name: "farmControl",
                header: "Управление фермой",
                items: [{
                        text: "Зерно",
                    },
                    {
                        text: "Удобрение",
                    },
                    {
                        text: "Урожай"
                    },
                    {
                        text: "Баланс"
                    },
                    {
                        text: "Зарплаты"
                    },
                    {
                        text: "Продать"
                    },
                    {
                        text: "Вернуться"
                    },
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
                        if (e.itemName == 'Зерно') {
                            selectMenu.showByName("farmControlGrains");
                        } else if (e.itemName == 'Удобрение') {
                            selectMenu.showByName("farmControlSoils");
                        } else if (e.itemName == 'Урожай') {
                            selectMenu.showByName("farmControlCrops");
                        } else if (e.itemName == 'Баланс') {
                            selectMenu.showByName("farmControlBalance");
                        } else if (e.itemName == 'Зарплаты') {
                            selectMenu.showByName("farmControlPays");
                        } else if (e.itemName == 'Продать') {
                            selectMenu.showByName("farmControlSell");
                        } else if (e.itemName == 'Вернуться') {
                            selectMenu.showByName("farm");
                        }
                    } else if (eventName == 'onBackspacePressed')
                        selectMenu.showByName("farm");

                }
            },
            "farmControlGrains": {
                name: "farmControlGrains",
                header: "Зерно фермы",
                items: [{
                        text: "Цена $ за 1 ед.",
                        values: ["999"],
                        type: "editable"
                    },
                    {
                        text: "Установить"
                    },
                    {
                        text: "Вернуться"
                    },
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
                        if (e.itemName == 'Установить') {
                            var price = this.items[0].values[0];
                            if (isNaN(price)) return notifications.push(`error`, `Требуется число`);
                            mp.trigger(`callRemote`, `farms.grains.price.set`, parseInt(price));
                        } else if (e.itemName == 'Вернуться') {
                            selectMenu.showByName("farmControl");
                        }
                    } else if (eventName == 'onBackspacePressed' && this.i != 0)
                        selectMenu.showByName("farmControl");
                }
            },
            "farmControlSoils": {
                name: "farmControlSoils",
                header: "Удобрение фермы",
                items: [{
                        text: "Цена $ за 1 ед.",
                        values: ["999"],
                        type: "editable"
                    },
                    {
                        text: "Установить"
                    },
                    {
                        text: "Вернуться"
                    },
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
                        if (e.itemName == 'Установить') {
                            var price = this.items[0].values[0];
                            if (isNaN(price)) return notifications.push(`error`, `Требуется число`);
                            mp.trigger(`callRemote`, `farms.soils.price.set`, parseInt(price));
                        } else if (e.itemName == 'Вернуться') {
                            selectMenu.showByName("farmControl");
                        }
                    } else if (eventName == 'onBackspacePressed' && this.i != 0)
                        selectMenu.showByName("farmControl");
                }
            },
            "farmControlCrops": {
                name: "farmControlCrops",
                header: "Урожай фермы",
                items: [{
                        text: "Тип урожая",
                        values: ["Урожай А", "Урожай Б", "Урожай С"],
                    },
                    {
                        text: "Цена $ за 1 ед.",
                        values: ["999"],
                        type: "editable"
                    },
                    {
                        text: "Установить"
                    },
                    {
                        text: "Вернуться"
                    },
                ],
                i: 0,
                j: 0,
                cropsPrice: [],
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
                        if (e.itemName == 'Установить') {
                            var field = this.items[0].i;
                            var price = this.items[1].values[0];
                            if (isNaN(price)) return notifications.push(`error`, `Требуется число`);
                            var data = {
                                price: parseInt(price),
                                field: field
                            };
                            mp.trigger(`callRemote`, `farms.crops.price.set`, JSON.stringify(data));
                        } else if (e.itemName == 'Вернуться') {
                            selectMenu.showByName("farmControl");
                        }
                    } else if (eventName == 'onItemValueChanged') {
                        this.items[1].values[0] = this.cropsPrice[e.valueIndex];
                    } else if (eventName == 'onBackspacePressed' && this.i != 1)
                        selectMenu.showByName("farmControl");
                }
            },
            "farmControlBalance": {
                name: "farmControlBalance",
                header: "Баланс фермы",
                items: [{
                        text: "Тип баланса",
                        values: ["Основной", "Налог"],
                    },
                    {
                        text: "Сумма $",
                        values: ["0"],
                        type: "editable"
                    },
                    {
                        text: "Установить"
                    },
                    {
                        text: "Вернуться"
                    },
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
                        if (e.itemName == 'Установить') {
                            var balance = this.items[0].i;
                            var sum = this.items[1].values[0];
                            if (isNaN(sum)) return notifications.push(`error`, `Требуется число`);
                            var data = {
                                sum: parseInt(sum),
                                balance: balance
                            };
                            selectMenu.loader = true;
                            mp.trigger(`callRemote`, `farms.balance.set`, JSON.stringify(data));
                        } else if (e.itemName == 'Вернуться') {
                            selectMenu.showByName("farmControl");
                        }
                    } else if (eventName == 'onBackspacePressed' && this.i != 1)
                        selectMenu.showByName("farmControl");
                }
            },
            "farmControlPays": {
                name: "farmControlPays",
                header: "Зарплаты фермы",
                items: [{
                        text: "Должность",
                        values: ["Работник", "Фермер", "Тракторист", "Пилот"],
                    },
                    {
                        text: "Сумма $",
                        values: ["0"],
                        type: "editable"
                    },
                    {
                        text: "Установить"
                    },
                    {
                        text: "Вернуться"
                    },
                ],
                i: 0,
                j: 0,
                pays: [],
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
                        if (e.itemName == 'Установить') {
                            var job = this.items[0].i;
                            var sum = this.items[1].values[0];
                            if (isNaN(sum)) return notifications.push(`error`, `Требуется число`);
                            var data = {
                                sum: parseInt(sum),
                                job: job
                            };
                            mp.trigger(`callRemote`, `farms.pay.set`, JSON.stringify(data));
                        } else if (e.itemName == 'Вернуться') {
                            selectMenu.showByName("farmControl");
                        }
                    } else if (eventName == 'onItemValueChanged') {
                        this.items[1].values[0] = this.pays[e.valueIndex];
                    } else if (eventName == 'onBackspacePressed' && this.i != 1)
                        selectMenu.showByName("farmControl");
                }
            },
            "farmControlSell": {
                name: "farmControlSell",
                header: "Продажа фермы",
                items: [{
                        text: "В штат",
                        values: ["$999"],
                    },
                    {
                        text: "Игроку",
                    },
                    {
                        text: "Вернуться"
                    },
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
                        if (e.itemName == 'В штат') {
                            selectMenu.loader = true;
                            mp.trigger(`callRemote`, `farms.sell.state`);
                        } else if (e.itemName == 'Игроку') {
                            selectMenu.showByName("farmControlSellToPlayer");
                        } else if (e.itemName == 'Вернуться') {
                            selectMenu.showByName("farmControl");
                        }
                    } else if (eventName == 'onBackspacePressed')
                        selectMenu.showByName("farmControl");
                }
            },
            "farmControlSellToPlayer": {
                name: "farmControlSellToPlayer",
                header: "Продажа фермы игроку",
                items: [{
                        text: "ID игрока",
                        values: [""],
                        type: "editable",
                    },
                    {
                        text: "Сумма $",
                        values: [""],
                        type: "editable",
                    },
                    {
                        text: "Предложить"
                    },
                    {
                        text: "Вернуться"
                    },
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
                        if (e.itemName == 'Предложить') {
                            var playerId = this.items[0].values[0];
                            var sum = this.items[1].values[0];
                            if (isNaN(playerId) || isNaN(sum)) return notifications.push(`error`, `Требуется число`);
                            if (playerId < 0 || sum <= 0) return notifications.push(`error`, `Требуется положительное число`);
                            var data = {
                                playerId: parseInt(this.items[0].values[0]),
                                sum: parseInt(this.items[1].values[0]),
                            };
                            mp.trigger(`callRemote`, `farms.sell.player`, JSON.stringify(data));
                            selectMenu.show = false;
                        } else if (e.itemName == 'Вернуться') {
                            selectMenu.showByName("farmControlSell");
                        }
                    } else if (eventName == 'onBackspacePressed' && this.i > 1)
                        selectMenu.showByName("farmControlSell");
                }
            },
            "farmWarehouse": {
                name: "farmWarehouse",
                header: "Склад фермы",
                items: [{
                        text: "Зерно",
                    },
                    {
                        text: "Урожай"
                    },
                    {
                        text: "О складе"
                    },
                    {
                        text: "Закрыть"
                    },
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
                        if (e.itemName == 'Зерно') {
                            selectMenu.showByName("farmGrains");
                        } else if (e.itemName == 'Урожай') {
                            selectMenu.showByName("farmProducts");
                        } else if (e.itemName == 'О складе') {
                            selectMenu.showByName("farmWarehouseInfo");
                        } else if (e.itemName == 'Закрыть') {
                            selectMenu.show = false;
                        }
                    }
                }
            },
            "farmWarehouseInfo": {
                name: "farmWarehouseInfo",
                header: "О складе",
                items: [{
                        text: "Зерно",
                        values: ["9999 из 9999 ед. ($999)"],
                    },
                    {
                        text: "Урожай А",
                        values: ["9999 из 9999 ед. ($999)"],
                    },
                    {
                        text: "Урожай Б",
                        values: ["9999 из 9999 ед. ($999)"],
                    },
                    {
                        text: "Урожай С",
                        values: ["9999 из 9999 ед. ($999)"],
                    },
                    {
                        text: "Вернуться"
                    },
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
                        if (e.itemName == 'Вернуться') {
                            selectMenu.showByName("farmWarehouse");
                        }
                    } else if (eventName == 'onBackspacePressed')
                        selectMenu.showByName("farmWarehouse");
                }
            },
            "farmGrains": {
                name: "farmGrains",
                header: "Зерно",
                items: [{
                        text: "Загрузка",
                    },
                    {
                        text: "Продажа"
                    },
                    {
                        text: "Вернуться"
                    },
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
                        if (e.itemName == 'Загрузка') {
                            selectMenu.showByName("farmGrainsTake");
                        } else if (e.itemName == 'Продажа') {
                            selectMenu.showByName("farmGrainsSell");
                        } else if (e.itemName == 'Вернуться') {
                            selectMenu.showByName("farmWarehouse");
                        }
                    } else if (eventName == 'onBackspacePressed')
                        selectMenu.showByName("farmWarehouse");
                }
            },
            "farmGrainsTake": {
                name: "farmGrainsTake",
                header: "Загрузка зерна",
                items: [{
                        text: "Участок",
                        values: ["Поле №999"],
                    },
                    {
                        text: "Тип зерна",
                        values: ["Урожай А", "Урожай Б", "Урожай С"],
                    },
                    {
                        text: "Загрузить",
                    },
                    {
                        text: "Вернуться"
                    },
                ],
                i: 0,
                j: 0,
                init(fieldIds) {
                    if (typeof fieldIds == 'string') fieldIds = JSON.parse(fieldIds);

                    selectMenu.setItemValues(this.name, 'Участок', fieldIds.map(x => `Поле №${x}`));
                },
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
                        if (e.itemName == 'Загрузить') {
                            var data = {
                                field: this.items[0].i,
                                grain: this.items[1].i,
                            };
                            selectMenu.show = false;
                            mp.trigger(`callRemote`, `farms.warehouse.grains.take`, JSON.stringify(data));
                        } else if (e.itemName == 'Вернуться') {
                            selectMenu.showByName("farmGrains");
                        }
                    } else if (eventName == 'onBackspacePressed')
                        selectMenu.showByName("farmGrains");
                }
            },
            "farmGrainsSell": {
                name: "farmGrainsSell",
                header: "Продажа зерна",
                items: [{
                        text: "Продать",
                    },
                    {
                        text: "Вернуться"
                    },
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
                        if (e.itemName == 'Продать') {
                            selectMenu.show = false;
                            mp.trigger(`callRemote`, `farms.warehouse.grains.sell`);
                        } else if (e.itemName == 'Вернуться') {
                            selectMenu.showByName("farmGrains");
                        }
                    } else if (eventName == 'onBackspacePressed')
                        selectMenu.showByName("farmGrains");
                }
            },
            "farmProducts": {
                name: "farmProducts",
                header: "Урожай",
                items: [{
                        text: "Выгрузка",
                    },
                    {
                        text: "Загрузка"
                    },
                    {
                        text: "Покупка на руки"
                    },
                    {
                        text: "Вернуться"
                    },
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
                        if (e.itemName == 'Выгрузка') {
                            selectMenu.showByName("farmProductsFill");
                        } else if (e.itemName == 'Загрузка') {
                            selectMenu.showByName("farmProductsBuy");
                        } else if (e.itemName == 'Покупка на руки') {
                            selectMenu.showByName("farmProductsInvBuy");
                        } else if (e.itemName == 'Вернуться') {
                            selectMenu.showByName("farmWarehouse");
                        }
                    } else if (eventName == 'onBackspacePressed')
                        selectMenu.showByName("farmWarehouse");
                }
            },
            "farmProductsFill": {
                name: "farmProductsFill",
                header: "Выгрузка урожая",
                items: [{
                        text: "Выгрузить",
                    },
                    {
                        text: "Вернуться"
                    },
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
                        if (e.itemName == 'Выгрузить') {
                            selectMenu.show = false;
                            mp.trigger(`callRemote`, `farms.warehouse.products.fill`);
                        } else if (e.itemName == 'Вернуться') {
                            selectMenu.showByName("farmProducts");
                        }
                    } else if (eventName == 'onBackspacePressed')
                        selectMenu.showByName("farmProducts");
                }
            },
            "farmProductsBuy": {
                name: "farmProductsBuy",
                header: "Покупка урожая",
                items: [{
                        text: "Урожай",
                        values: ["Урожай А", "Урожай Б", "Урожай С"],
                    },
                    {
                        text: "Количество",
                        values: ["100 ед.", "200 ед.", "300 ед.", "400 ед.", "500 ед.", "600 ед.", "700 ед.", "800 ед.", "900 ед.", "1000 ед.",
                            "1100 ед.", "1200 ед.", "1300 ед.", "1400 ед.", "1500 ед.", "1600 ед.", "1700 ед.", "1800 ед.", "1900 ед.", "2000 ед."
                        ],
                    },
                    {
                        text: "Купить"
                    },
                    {
                        text: "Вернуться"
                    },
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
                        if (e.itemName == 'Купить') {
                            var data = {
                                index: this.items[0].i,
                                count: parseInt(this.items[1].values[this.items[1].i]),
                            };
                            selectMenu.show = false;
                            mp.trigger(`callRemote`, `farms.warehouse.products.buy`, JSON.stringify(data));
                        } else if (e.itemName == 'Вернуться') {
                            selectMenu.showByName("farmProducts");
                        }
                    } else if (eventName == 'onBackspacePressed')
                        selectMenu.showByName("farmProducts");
                }
            },
            "farmProductsInvBuy": {
                name: "farmProductsInvBuy",
                header: "Покупка на руки",
                items: [{
                        text: "Урожай",
                        values: ["Урожай А", "Урожай Б", "Урожай С"],
                    },
                    {
                        text: "Количество",
                        values: ["4 ед.", "8 ед.", "12 ед."],
                    },
                    {
                        text: "Купить"
                    },
                    {
                        text: "Вернуться"
                    },
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
                        if (e.itemName == 'Купить') {
                            var data = {
                                index: this.items[0].i,
                                count: parseInt(this.items[1].values[this.items[1].i]),
                            };
                            selectMenu.show = false;
                            mp.trigger(`callRemote`, `farms.warehouse.products.inv.buy`, JSON.stringify(data));
                        } else if (e.itemName == 'Вернуться') {
                            selectMenu.showByName("farmProducts");
                        }
                    } else if (eventName == 'onBackspacePressed')
                        selectMenu.showByName("farmProducts");
                }
            },
            "farmSoilsWarehouse": {
                name: "farmSoilsWarehouse",
                header: "Склад с удобрением",
                items: [{
                        text: "Загрузка",
                    },
                    {
                        text: "Продажа"
                    },
                    {
                        text: "О складе"
                    },
                    {
                        text: "Закрыть"
                    },
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
                        if (e.itemName == 'Загрузка') {
                            selectMenu.show = false;
                            mp.trigger(`callRemote`, `farms.soilsWarehouse.take`);
                        } else if (e.itemName == 'Продажа') {
                            selectMenu.show = false;
                            mp.trigger(`callRemote`, `farms.soilsWarehouse.sell`);
                        } else if (e.itemName == 'О складе') {
                            selectMenu.showByName("farmSoilsWarehouseInfo");
                        } else if (e.itemName == 'Закрыть') {
                            selectMenu.show = false;
                        }
                    }
                }
            },
            "farmSoilsWarehouseInfo": {
                name: "farmSoilsWarehouseInfo",
                header: "О складе",
                items: [{
                        text: "Удобрение",
                        values: [`9999 из 9999 ед.`],
                    },
                    {
                        text: "Вернуться"
                    },
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
                        if (e.itemName == 'Вернуться') {
                            selectMenu.showByName("farmSoilsWarehouse")
                        }
                    } else if (eventName == 'onBackspacePressed')
                        selectMenu.showByName("farmSoilsWarehouse");
                }
            },
            "carrierLoad": {
                name: "carrierLoad",
                header: "Грузоперевозчик",
                items: [{
                        text: "Склады",
                    },
                    {
                        text: "Товар",
                    },
                    {
                        text: "Заказы",
                    },
                    {
                        text: "Закрыть"
                    },
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
                        if (e.itemName == 'Склады') {
                            selectMenu.showByName("carrierLoadWarehouses");
                        } else if (e.itemName == 'Товар') {
                            selectMenu.showByName("carrierLoadProducts");
                        } else if (e.itemName == 'Заказы') {
                            var orders = selectMenu.menus["carrierLoadBizOrders"].bizOrders;
                            if (!orders.length) return selectMenu.notification = "Список заказов пуст";
                            selectMenu.showByName("carrierLoadBizOrders");
                        } else if (e.itemName == 'Закрыть') {
                            selectMenu.show = false;
                        }
                    }
                }
            },
            "carrierLoadWarehouses": {
                name: "carrierLoadWarehouses",
                header: "Склады",
                items: [{
                        text: "Фермы",
                    },
                    {
                        text: "Вернуться"
                    },
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
                        if (e.itemName == 'Фермы') {
                            selectMenu.showByName("carrierLoadFarms");
                        } else if (e.itemName == 'Вернуться') {
                            selectMenu.showByName("carrierLoad");
                        }
                    } else if (eventName == 'onBackspacePressed')
                        selectMenu.showByName("carrierLoad");
                }
            },
            "carrierLoadFarms": {
                name: "carrierLoadFarms",
                header: "Фермы",
                farms: [{
                        grains: 123,
                        grainsMax: 321,
                        grainPrice: 111,
                        soils: 123,
                        soilsMax: 321,
                        soilPrice: 222,
                    },
                    {
                        grains: 123,
                        grainsMax: 321,
                        grainPrice: 111,
                        soils: 123,
                        soilsMax: 321,
                        soilPrice: 222,
                    }
                ],
                update() {
                    var i = this.items[0].i;
                    Vue.set(this.items[1].values, 0, `${this.farms[i].grains} из ${this.farms[i].grainsMax} ед.`);
                    Vue.set(this.items[2].values, 0, `$${this.farms[i].grainPrice}`);
                    Vue.set(this.items[3].values, 0, `${this.farms[i].soils} из ${this.farms[i].soilsMax} ед.`);
                    Vue.set(this.items[4].values, 0, `$${this.farms[i].soilPrice}`);
                },
                items: [{
                        text: "Ферма",
                        values: ["ID: 1"],
                        i: 0,
                    },
                    {
                        text: "Зерно",
                        values: ["9999 из 9999 ед."],
                    },
                    {
                        text: "Цена зерна",
                        values: ["$999"]
                    },
                    {
                        text: "Удобрение",
                        values: ["9999 из 9999 ед."],
                    },
                    {
                        text: "Цена удобрения",
                        values: ["$999"]
                    },
                    {
                        text: "Вернуться"
                    },
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
                        if (e.itemName == 'Вернуться') {
                            selectMenu.showByName("carrierLoadWarehouses");
                        }
                    } else if (eventName == 'onItemValueChanged') {
                        if (e.itemName == 'Ферма') {
                            // this.update();
                        }
                    } else if (eventName == 'onBackspacePressed')
                        selectMenu.showByName("carrierLoadWarehouses");
                }
            },
            "carrierLoadBizOrders": {
                name: "carrierLoadBizOrders",
                header: "Заказы бизнесов",
                items: [{
                        text: "Бизнес 1",
                        values: [`999 ед.`]
                    },
                    {
                        text: "Бизнес 2",
                        values: [`999 ед.`]
                    },
                    {
                        text: "Вернуться"
                    },
                ],
                i: 0,
                j: 0,
                bizOrders: [],
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
                        if (e.itemName == 'Вернуться') {
                            selectMenu.showByName("carrierLoad");
                        } else {
                            var order = this.bizOrders[e.itemIndex];
                            var items = selectMenu.menus["carrierLoadBizOrder"].items;
                            items[0].values[0] = order.bizName;
                            items[1].values[0] = order.ownerName || "-";
                            items[2].values[0] = order.prodName;
                            items[3].values[0] = order.prodCount + " ед.";
                            items[4].values[0] = "$" + order.orderPrice;
                            items[5].values[0] = order.distance + " м.";
                            items[6].values[0] = "$" + (order.prodCount * order.prodPrice);

                            selectMenu.setProp("carrierLoadBizOrder", "bizId", order.bizId);
                            selectMenu.showByName("carrierLoadBizOrder");
                        }
                    } else if (eventName == 'onBackspacePressed')
                        selectMenu.showByName("carrierLoad");
                }
            },
            "carrierLoadBizOrder": {
                name: "carrierLoadBizOrder",
                header: "Заказ бизнеса",
                items: [{
                        text: "Бизнес",
                        values: ["АЗС на Грув"],
                    },
                    {
                        text: "Владелец",
                        values: ["Carter Slade"]
                    },
                    {
                        text: "Товар",
                        values: ["Топливо"],
                    },
                    {
                        text: "Количество",
                        values: ["999 ед."],
                    },
                    {
                        text: "Сумма",
                        values: ["$999"],
                    },
                    {
                        text: "Расстояние",
                        values: ["999 м."],
                    },
                    {
                        text: "Принять",
                        values: ["$111"],
                    },
                    {
                        text: "Вернуться"
                    },
                ],
                i: 0,
                j: 0,
                bizId: null,
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
                        if (e.itemName == 'Вернуться') {
                            selectMenu.showByName("carrierLoadBizOrders");
                        } else if (e.itemName == 'Принять') {
                            selectMenu.show = false;
                            mp.trigger(`callRemote`, `carrier.load.orders.take`, this.bizId);
                        }
                    } else if (eventName == 'onBackspacePressed')
                        selectMenu.showByName("carrierLoadBizOrders");
                }
            },
            "carrierLoadProducts": {
                name: "carrierLoadProducts",
                header: "Товар",
                items: [{
                        text: "Тип товара",
                        values: ["Зерно", "Удобрение"]
                    },
                    {
                        text: "Количество",
                        values: [""],
                        type: "editable"
                    },
                    {
                        text: "Купить",
                        values: ["$999"]
                    },
                    {
                        text: "Списать",
                        values: ["-999%"]
                    },
                    {
                        text: "Вернуться"
                    },
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
                        if (e.itemName == 'Купить') {
                            var product = this.items[0].i;
                            var count = this.items[1].values[0];
                            if (isNaN(count)) return notifications.push(`error`, `Требуется число`);
                            if (count <= 0) return notifications.push(`error`, `Требуется положительное число`);
                            var data = {
                                count: parseInt(count),
                                product: product
                            };
                            selectMenu.loader = true;
                            mp.trigger(`callRemote`, `carrier.load.products.buy`, JSON.stringify(data));
                        } else if (e.itemName == 'Списать') {
                            selectMenu.loader = true;
                            mp.trigger(`callRemote`, `carrier.load.products.sell`);
                        } else if (e.itemName == 'Вернуться') {
                            selectMenu.showByName("carrierLoad");
                        }
                    } else if (eventName == 'onBackspacePressed' && this.i != 1)
                        selectMenu.showByName("carrierLoad");
                }
            },
            "carrierJob": {
                name: "carrierJob",
                header: "Работа грузоперевозчика",
                items: [{
                        text: "Устроиться",
                    },
                    {
                        text: "Уволиться",
                    },
                    {
                        text: "Помощь"
                    },
                    {
                        text: "Закрыть"
                    },
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
                        if (e.itemName == 'Устроиться') {
                            mp.trigger(`callRemote`, `carrier.job.start`);
                        } else if (e.itemName == 'Уволиться') {
                            mp.trigger(`callRemote`, `carrier.job.stop`);
                        } else if (e.itemName == 'Помощь') {
                            selectMenu.show = false;
                            modal.showByName("carrier_help");
                        } else if (e.itemName == 'Закрыть') {
                            selectMenu.show = false;
                        }
                    }
                }
            },
            "carrierCropUnload": {
                name: "carrierCropUnload",
                header: "Продажа урожая",
                items: [{
                        text: "Цена за 1 ед.",
                        values: [`$9999`]
                    },
                    {
                        text: "Продать"
                    },
                    {
                        text: "Закрыть"
                    },
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
                        if (e.itemName == 'Продать') {
                            selectMenu.show = false;
                            mp.trigger(`callRemote`, `carrier.cropUnload.sell`);
                        } else if (e.itemName == 'Закрыть') {
                            selectMenu.show = false;
                        }
                    }
                }
            },
            "maskShop": {
                name: "maskShop",
                header: "Магазин масок",
                headerImg: "masks.png",
                items: [],
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
                        if (e.itemName == 'Выйти') {
                            mp.trigger('masks.shop.exit');
                        } else {
                            mp.trigger('masks.buy', e.itemIndex, e.valueIndex);
                            selectMenu.loader = true;
                        }
                    }
                    if (eventName == 'onItemFocusChanged') {
                        if (e.itemName != 'Выйти') {
                            mp.trigger('masks.set', e.itemIndex, e.valueIndex);
                        }
                    }
                    if (eventName == 'onItemValueChanged') {
                        mp.trigger('masks.set', e.itemIndex, e.valueIndex);
                    }
                    if (eventName == 'onBackspacePressed' || eventName == 'onEscapePressed')
                        mp.trigger('masks.shop.exit');
                }
            },
            "barbershopMain": {
                name: "barbershopMain",
                header: "Парикмахерская",
                headerImg: "",
                items: [],
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
                        if (e.itemName == 'Выйти') {
                            mp.trigger('barbershop.exit');
                        }
                        if (e.itemName == 'Прически') {
                            mp.trigger('barbershop.hairstylesMenu.show');
                        }
                        if (e.itemName == 'Растительность на лице') {
                            mp.trigger('barbershop.facialHairMenu.show');
                        }
                        if (e.itemName == 'Цвет волос') {
                            mp.trigger('barbershop.colorMenu.show', 0);
                        }
                        if (e.itemName == 'Доп. цвет волос') {
                            mp.trigger('barbershop.colorMenu.show', 1);
                        }
                        if (e.itemName == 'Цвет растительности на лице') {
                            mp.trigger('barbershop.colorMenu.show', 2);
                        }
                    }

                    if (eventName == 'onBackspacePressed' || eventName == 'onEscapePressed')
                        mp.trigger('barbershop.exit');
                }
            },
            "barbershopHairstyles": {
                name: "barbershopHairstyles",
                header: "Прически",
                headerImg: "",
                items: [],
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

                    if (eventName == 'onItemFocusChanged') {
                        if (e.itemName != 'Назад') {
                            mp.trigger('barbershop.hairstyle.set', e.itemIndex);
                        }
                    }
                    if (eventName == 'onItemSelected') {
                        if (e.itemName == 'Назад') {
                            mp.trigger('barbershop.mainMenu.show');
                        } else {
                            mp.trigger('barbershop.hairstyle.buy', e.itemIndex);
                        }
                    }

                    if (eventName == 'onBackspacePressed' || eventName == 'onEscapePressed')
                        mp.trigger('barbershop.mainMenu.show');
                }
            },
            "barbershopFacialHair": {
                name: "barbershopFacialHair",
                header: "Растительность",
                headerImg: "",
                items: [],
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

                    if (eventName == 'onItemFocusChanged') {
                        if (e.itemName != 'Назад') {
                            mp.trigger('barbershop.facialHair.set', e.itemIndex);
                        }
                    }
                    if (eventName == 'onItemSelected') {
                        if (e.itemName == 'Назад') {
                            mp.trigger('barbershop.mainMenu.show');
                        } else {
                            mp.trigger('barbershop.facialHair.buy', e.itemIndex);
                        }
                    }

                    if (eventName == 'onBackspacePressed' || eventName == 'onEscapePressed')
                        mp.trigger('barbershop.mainMenu.show');
                }
            },
            "barbershopColor": {
                name: "barbershopColor",
                header: "Выбор цвета",
                headerImg: "",
                items: [{
                        text: 'Цвета',
                        values: []
                    },
                    {
                        text: 'Применить',
                        values: ['$100']

                    },
                    {
                        text: 'Назад'

                    },
                ],
                i: 0,
                j: 0,
                hairIndex: 0,
                handler(eventName) {
                    var item = this.items[this.i];
                    var e = {
                        menuName: this.name,
                        itemName: item.text,
                        itemIndex: this.i,
                        itemValue: (item.i != null && item.values) ? item.values[item.i] : null,
                        valueIndex: item.i,
                    };

                    if (eventName == 'onItemValueChanged') {
                        this.hairIndex = e.valueIndex;
                        mp.trigger('barbershop.color.set', e.valueIndex);
                    }
                    if (eventName == 'onItemSelected') {
                        if (e.itemName == 'Назад') {
                            mp.trigger('barbershop.mainMenu.show');
                        }
                        if (e.itemName == 'Применить') {
                            mp.trigger('barbershop.color.buy', this.hairIndex);
                        }
                    }

                    if (eventName == 'onBackspacePressed' || eventName == 'onEscapePressed')
                        mp.trigger('barbershop.mainMenu.show');
                }
            },
            "supermarketMain": {
                name: "supermarketMain",
                header: "Супермаркет",
                headerImg: "",
                items: [{
                        text: 'Мобильная связь'
                    },
                    {
                        text: 'Продукты'
                    },
                    {
                        text: 'Табачные изделия'
                    },
                    {
                        text: 'Сумки'
                    },
                    {
                        text: 'Прочие товары'
                    },
                    {
                        text: 'Закрыть'
                    },
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
                        if (e.itemName == 'Закрыть') {
                            selectMenu.show = false;
                        }
                        if (e.itemName == 'Мобильная связь') {
                            selectMenu.showByName('supermarketMobile');
                        }
                        if (e.itemName == 'Продукты') {
                            selectMenu.showByName('supermarketFood');
                        }
                        if (e.itemName == 'Табачные изделия') {
                            selectMenu.showByName('supermarketTobacco');
                        }
                        if (e.itemName == 'Сумки') {
                            selectMenu.showByName('supermarketBags');
                        }
                        if (e.itemName == 'Прочие товары') {
                            selectMenu.showByName('supermarketStuff');
                        }
                    }

                    if (eventName == 'onBackspacePressed' || eventName == 'onEscapePressed') {
                        selectMenu.show = false;
                    }

                }
            },
            "supermarketMobile": {
                name: "supermarketMobile",
                header: "Мобильная связь",
                headerImg: "",
                items: [{
                        text: 'Купить телефон',
                        values: ['$100']
                    },
                    {
                        text: 'Сменить номер телефона',
                        values: ['$100']
                    },
                    {
                        text: 'Назад'
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
                        if (e.itemName == 'Назад') {
                            selectMenu.showByName('supermarketMain');
                        }
                        if (e.itemName == 'Сменить номер телефона') {
                            selectMenu.showByName('supermarketNumberChange');
                        }
                        if (e.itemName == 'Купить телефон') {
                            selectMenu.loader = true;
                            mp.trigger('supermarket.phone.buy');
                        }
                    }
                    if (eventName == 'onBackspacePressed' || eventName == 'onEscapePressed') {
                        selectMenu.showByName('supermarketMain');
                    }
                }
            },
            "supermarketNumberChange": {
                name: "supermarketNumberChange",
                header: "Смена номера",
                headerImg: "",
                items: [{
                        text: 'Новый номер',
                        type: "editable",
                        values: [""],
                    },
                    {
                        text: 'Сменить',
                        values: ["$100"],
                    },
                    {
                        text: 'Назад'
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
                        if (e.itemName == 'Назад') {
                            selectMenu.showByName('supermarketMobile');
                        }
                        if (e.itemName == 'Сменить') {
                            selectMenu.loader = true;
                            let number = selectMenu.menu.items[0].values[0];
                            mp.trigger('supermarket.number.change', number);
                        }
                    }
                    if ((eventName == 'onBackspacePressed' && this.i != 0) || eventName == 'onEscapePressed') {
                        selectMenu.showByName('supermarketMobile');
                    }

                }
            },
            "supermarketFood": {
                name: "supermarketFood",
                header: "Продукты",
                headerImg: "",
                items: [{
                        text: 'Бутылка воды',
                        values: ["$100"],
                    },
                    /*
                    {
                        text: 'Плитка шоколада',
                        values: ["$100"],
                    },*/
                    {
                        text: 'Назад'
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
                        if (e.itemName == 'Назад') {
                            selectMenu.showByName('supermarketMain');
                        } else {
                            selectMenu.loader = true;
                        }
                        if (e.itemName == 'Бутылка воды') {
                            mp.trigger('callRemote', 'supermarket.products.buy', 0);
                        }
                        if (e.itemName == 'Плитка шоколада') {
                            mp.trigger('callRemote', 'supermarket.products.buy', 1);
                        }
                    }
                    if (eventName == 'onBackspacePressed' || eventName == 'onEscapePressed') {
                        selectMenu.showByName('supermarketMain');
                    }
                }
            },
            "supermarketTobacco": {
                name: "supermarketTobacco",
                header: "Табачные изделия",
                headerImg: "",
                items: [{
                        text: 'Сигареты "Redwood"',
                        values: ["$100"],
                    },
                    {
                        text: 'Назад'
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
                        if (e.itemName == 'Назад') {
                            selectMenu.showByName('supermarketMain');
                        } else {
                            selectMenu.loader = true;
                        }
                        if (e.itemName == 'Сигареты "Redwood"') {
                            mp.trigger('callRemote', 'supermarket.products.buy', 2);
                        }
                    }
                    if (eventName == 'onBackspacePressed' || eventName == 'onEscapePressed') {
                        selectMenu.showByName('supermarketMain');
                    }

                }
            },
            "supermarketBags": {
                name: "supermarketBags",
                header: "Сумки",
                headerImg: "",
                items: [{
                        text: 'Зеленая сумка',
                        values: ["$100"],
                    },
                    {
                        text: 'Черная сумка',
                        values: ["$100"],
                    },
                    {
                        text: 'Назад'
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
                        if (e.itemName == 'Назад') {
                            selectMenu.showByName('supermarketMain');
                        } else {
                            selectMenu.loader = true;
                        }
                        if (e.itemName == 'Зеленая сумка') {
                            mp.trigger('callRemote', 'supermarket.products.buy', 6);
                        }
                        if (e.itemName == 'Черная сумка') {
                            mp.trigger('callRemote', 'supermarket.products.buy', 7);
                        }
                    }
                    if (eventName == 'onBackspacePressed' || eventName == 'onEscapePressed') {
                        selectMenu.showByName('supermarketMain');
                    }

                }
            },
            "supermarketStuff": {
                name: "supermarketStuff",
                header: "Прочие товары",
                headerImg: "",
                items: [{
                        text: 'Веревка',
                        values: ["$100"],
                    },
                    {
                        text: 'Мешок',
                        values: ["$100"],
                    },
                    {
                        text: 'Канистра',
                        values: ["$100"],
                    },
                    {
                        text: 'Аптечка',
                        values: ["$100"],
                    },
                    {
                        text: 'Спички',
                        values: ["$100"],
                    },
                    {
                        text: 'Назад'
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
                        if (e.itemName == 'Назад') {
                            selectMenu.showByName('supermarketMain');
                        } else {
                            selectMenu.loader = true;
                        }
                        if (e.itemName == 'Веревка') {
                            mp.trigger('callRemote', 'supermarket.products.buy', 3);
                        }
                        if (e.itemName == 'Мешок') {
                            mp.trigger('callRemote', 'supermarket.products.buy', 4);
                        }
                        if (e.itemName == 'Канистра') {
                            mp.trigger('callRemote', 'supermarket.products.buy', 5);
                        }
                        if (e.itemName == 'Аптечка') {
                            mp.trigger('callRemote', 'supermarket.products.buy', 8);
                        }
                        if (e.itemName == 'Спички') {
                            mp.trigger('callRemote', 'supermarket.products.buy', 9);
                        }
                    }
                    if (eventName == 'onBackspacePressed' || eventName == 'onEscapePressed') {
                        selectMenu.showByName('supermarketMain');
                    }

                }
            },
            "ammunationMain": {
                name: "ammunationMain",
                header: "Магазин оружия",
                headerImg: "ammunation.png",
                items: [{
                        text: 'Огнестрельное оружие'
                    },
                    {
                        text: 'Боеприпасы'
                    },
                    {
                        text: 'Бронежилеты'
                    },
                    {
                        text: 'Закрыть'
                    },
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
                        if (e.itemName == 'Закрыть') {
                            selectMenu.show = false;
                        }
                        if (e.itemName == 'Огнестрельное оружие') {
                            selectMenu.showByName('ammunationFirearms');
                        }
                        if (e.itemName == 'Боеприпасы') {
                            selectMenu.showByName('ammunationAmmo');
                        }
                        if (e.itemName == 'Бронежилеты') {
                            selectMenu.showByName('ammunationArmour');
                        }
                    }

                    if (eventName == 'onBackspacePressed' || eventName == 'onEscapePressed') {
                        selectMenu.show = false;
                    }

                }
            },
            "ammunationFirearms": {
                name: "ammunationFirearms",
                header: "Огнестрельное оружие",
                headerImg: "ammunation.png",
                items: [],
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
                        if (e.itemName == 'Назад') {
                            selectMenu.showByName('ammunationMain');
                        } else {
                            selectMenu.loader = true;
                            mp.trigger('callRemote', 'ammunation.weapon.buy', item.weaponId);
                        }
                    }
                    if (eventName == 'onBackspacePressed' || eventName == 'onEscapePressed') {
                        selectMenu.showByName('ammunationMain');
                    }
                }
            },
            "ammunationAmmo": {
                name: "ammunationAmmo",
                header: "Боеприпасы",
                headerImg: "ammunation.png",
                items: [],
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
                        if (e.itemName == 'Назад') {
                            selectMenu.showByName('ammunationMain');
                        } else {
                            selectMenu.loader = true;
                            let values = JSON.stringify([e.itemIndex, parseInt(e.itemValue)]);
                            mp.trigger('callRemote', 'ammunation.ammo.buy', values);
                        }
                    }
                    if (eventName == 'onBackspacePressed' || eventName == 'onEscapePressed') {
                        selectMenu.showByName('ammunationMain');
                    }
                }
            },
            "ammunationArmour": {
                name: "ammunationArmour",
                header: "Бронежилеты",
                headerImg: "ammunation.png",
                items: [],
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
                        if (e.itemName == 'Назад') {
                            selectMenu.showByName('ammunationMain');
                        } else {
                            selectMenu.loader = true;
                            mp.trigger('callRemote', 'ammunation.armour.buy', e.itemIndex);
                        }
                    }
                    if (eventName == 'onBackspacePressed' || eventName == 'onEscapePressed') {
                        selectMenu.showByName('ammunationMain');
                    }
                }
            },
            "wedding": {
                name: "wedding",
                header: "Свадьба",
                items: [{
                        text: "Брак"
                    },
                    {
                        text: "Развод"
                    },
                    {
                        text: "Закрыть"
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
                        if (e.itemName == 'Брак') mp.trigger(`wedding.add.offer`);
                        else if (e.itemName == 'Развод') mp.trigger(`callRemote`, `wedding.remove`);
                        selectMenu.show = false;
                    }
                }
            },
            "clothingMain": {
                name: "clothingMain",
                header: "Одежда",
                headerImg: "",
                items: [],
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
                        if (e.itemName == 'Закрыть') {
                            mp.trigger('clothingShop.exit');
                        }
                        if (e.itemName == 'Тело') {
                            mp.trigger('clothingShop.item.set', 'tops', 0, 0);
                            selectMenu.showByName('clothingTops');
                        }
                        if (e.itemName == 'Браслеты') {
                            mp.trigger('clothingShop.item.set', 'bracelets', 0, 0);
                            selectMenu.showByName('clothingBracelets');
                        }
                        if (e.itemName == 'Серьги') {
                            mp.trigger('clothingShop.item.set', 'ears', 0, 0);
                            selectMenu.showByName('clothingEars');
                        }
                        if (e.itemName == 'Очки') {
                            mp.trigger('clothingShop.item.set', 'glasses', 0, 0);
                            selectMenu.showByName('clothingGlasses');
                        }
                        if (e.itemName == 'Часы') {
                            mp.trigger('clothingShop.item.set', 'watches', 0, 0);
                            selectMenu.showByName('clothingWatches');
                        }
                        if (e.itemName == 'Галстуки') {
                            mp.trigger('clothingShop.item.set', 'ties', 0, 0);
                            selectMenu.showByName('clothingTies');
                        }
                        if (e.itemName == 'Головные уборы') {
                            mp.trigger('clothingShop.item.set', 'hats', 0, 0);
                            selectMenu.showByName('clothingHats');
                        }
                        if (e.itemName == 'Ноги') {
                            mp.trigger('clothingShop.item.set', 'pants', 0, 0);
                            selectMenu.showByName('clothingPants');
                        }
                        if (e.itemName == 'Обувь') {
                            mp.trigger('clothingShop.item.set', 'shoes', 0, 0);
                            selectMenu.showByName('clothingShoes');
                        }
                    }

                    if (eventName == 'onBackspacePressed' || eventName == 'onEscapePressed') {
                        mp.trigger('clothingShop.exit');
                    }

                }
            },
            "clothingTops": {
                name: "clothingTops",
                header: "Тело",
                headerImg: "",
                items: [],
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
                    if (eventName == 'onItemFocusChanged') {
                        if (e.itemName != 'Назад') {
                            mp.trigger('clothingShop.item.set', 'tops', e.itemIndex, e.valueIndex);
                        }
                    }
                    if (eventName == 'onItemValueChanged') {
                        mp.trigger('clothingShop.item.set', 'tops', e.itemIndex, e.valueIndex);
                    }
                    if (eventName == 'onItemSelected') {
                        if (e.itemName == 'Назад') {
                            selectMenu.showByName('clothingMain');
                            selectMenu.menus["clothingTops"].i = 0;
                            selectMenu.menus["clothingTops"].j = 0;
                            mp.trigger('clothingShop.inputClothes.set');
                        } else {
                            selectMenu.loader = true;
                            mp.trigger('clothingShop.item.buy', 'tops', e.itemIndex, e.valueIndex);
                        }
                    }
                    if (eventName == 'onBackspacePressed' || eventName == 'onEscapePressed') {
                        selectMenu.showByName('clothingMain');
                        selectMenu.menus["clothingTops"].i = 0;
                        selectMenu.menus["clothingTops"].j = 0;
                        mp.trigger('clothingShop.inputClothes.set');
                    }
                }
            },
            "clothingBracelets": {
                name: "clothingBracelets",
                header: "Браслеты",
                headerImg: "",
                items: [],
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
                    if (eventName == 'onItemFocusChanged') {
                        if (e.itemName != 'Назад') {
                            mp.trigger('clothingShop.item.set', 'bracelets', e.itemIndex, e.valueIndex);
                        }
                    }
                    if (eventName == 'onItemValueChanged') {
                        mp.trigger('clothingShop.item.set', 'bracelets', e.itemIndex, e.valueIndex);
                    }
                    if (eventName == 'onItemSelected') {
                        if (e.itemName == 'Назад') {
                            selectMenu.showByName('clothingMain');
                            selectMenu.menus["clothingBracelets"].i = 0;
                            selectMenu.menus["clothingBracelets"].j = 0;
                            mp.trigger('clothingShop.inputClothes.set');
                        } else {
                            selectMenu.loader = true;
                            mp.trigger('clothingShop.item.buy', 'bracelets', e.itemIndex, e.valueIndex);
                        }
                    }
                    if (eventName == 'onBackspacePressed' || eventName == 'onEscapePressed') {
                        selectMenu.showByName('clothingMain');
                        selectMenu.menus["clothingBracelets"].i = 0;
                        selectMenu.menus["clothingBracelets"].j = 0;
                        mp.trigger('clothingShop.inputClothes.set');
                    }

                }
            },
            "clothingEars": {
                name: "clothingEars",
                header: "Серьги",
                headerImg: "",
                items: [],
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
                    if (eventName == 'onItemFocusChanged') {
                        if (e.itemName != 'Назад') {
                            mp.trigger('clothingShop.item.set', 'ears', e.itemIndex, e.valueIndex);
                        }
                    }
                    if (eventName == 'onItemValueChanged') {
                        mp.trigger('clothingShop.item.set', 'ears', e.itemIndex, e.valueIndex);
                    }
                    if (eventName == 'onItemSelected') {
                        if (e.itemName == 'Назад') {
                            selectMenu.showByName('clothingMain');
                            selectMenu.menus["clothingEars"].i = 0;
                            selectMenu.menus["clothingEars"].j = 0;
                            mp.trigger('clothingShop.inputClothes.set');
                        } else {
                            selectMenu.loader = true;
                            mp.trigger('clothingShop.item.buy', 'ears', e.itemIndex, e.valueIndex);
                        }
                    }
                    if (eventName == 'onBackspacePressed' || eventName == 'onEscapePressed') {
                        selectMenu.showByName('clothingMain');
                        selectMenu.menus["clothingEars"].i = 0;
                        selectMenu.menus["clothingEars"].j = 0;
                        mp.trigger('clothingShop.inputClothes.set');
                    }
                }
            },
            "clothingGlasses": {
                name: "clothingGlasses",
                header: "Очки",
                headerImg: "",
                items: [],
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
                    if (eventName == 'onItemFocusChanged') {
                        if (e.itemName != 'Назад') {
                            mp.trigger('clothingShop.item.set', 'glasses', e.itemIndex, e.valueIndex);
                        }
                    }
                    if (eventName == 'onItemValueChanged') {
                        mp.trigger('clothingShop.item.set', 'glasses', e.itemIndex, e.valueIndex);
                    }
                    if (eventName == 'onItemSelected') {
                        if (e.itemName == 'Назад') {
                            selectMenu.showByName('clothingMain');
                            selectMenu.menus["clothingGlasses"].i = 0;
                            selectMenu.menus["clothingGlasses"].j = 0;
                            mp.trigger('clothingShop.inputClothes.set');
                        } else {
                            selectMenu.loader = true;
                            mp.trigger('clothingShop.item.buy', 'glasses', e.itemIndex, e.valueIndex);
                        }
                    }
                    if (eventName == 'onBackspacePressed' || eventName == 'onEscapePressed') {
                        selectMenu.showByName('clothingMain');
                        selectMenu.menus["clothingGlasses"].i = 0;
                        selectMenu.menus["clothingGlasses"].j = 0;
                        mp.trigger('clothingShop.inputClothes.set');
                    }
                }
            },
            "clothingWatches": {
                name: "clothingWatches",
                header: "Часы",
                headerImg: "",
                items: [],
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
                    if (eventName == 'onItemFocusChanged') {
                        if (e.itemName != 'Назад') {
                            mp.trigger('clothingShop.item.set', 'watches', e.itemIndex, e.valueIndex);
                        }
                    }
                    if (eventName == 'onItemValueChanged') {
                        mp.trigger('clothingShop.item.set', 'watches', e.itemIndex, e.valueIndex);
                    }
                    if (eventName == 'onItemSelected') {
                        if (e.itemName == 'Назад') {
                            selectMenu.showByName('clothingMain');
                            selectMenu.menus["clothingWatches"].i = 0;
                            selectMenu.menus["clothingWatches"].j = 0;
                            mp.trigger('clothingShop.inputClothes.set');
                        } else {
                            selectMenu.loader = true;
                            mp.trigger('clothingShop.item.buy', 'watches', e.itemIndex, e.valueIndex);
                        }
                    }
                    if (eventName == 'onBackspacePressed' || eventName == 'onEscapePressed') {
                        selectMenu.showByName('clothingMain');
                        selectMenu.menus["clothingWatches"].i = 0;
                        selectMenu.menus["clothingWatches"].j = 0;
                        mp.trigger('clothingShop.inputClothes.set');
                    }
                }
            },
            "clothingTies": {
                name: "clothingTies",
                header: "Галстуки",
                headerImg: "",
                items: [],
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
                    if (eventName == 'onItemFocusChanged') {
                        if (e.itemName != 'Назад') {
                            mp.trigger('clothingShop.item.set', 'ties', e.itemIndex, e.valueIndex);
                        }
                    }
                    if (eventName == 'onItemValueChanged') {
                        mp.trigger('clothingShop.item.set', 'ties', e.itemIndex, e.valueIndex);
                    }
                    if (eventName == 'onItemSelected') {
                        if (e.itemName == 'Назад') {
                            selectMenu.showByName('clothingMain');
                            selectMenu.menus["clothingTies"].i = 0;
                            selectMenu.menus["clothingTies"].j = 0;
                            mp.trigger('clothingShop.inputClothes.set');
                        } else {
                            selectMenu.loader = true;
                            mp.trigger('clothingShop.item.buy', 'ties', e.itemIndex, e.valueIndex);
                        }
                    }
                    if (eventName == 'onBackspacePressed' || eventName == 'onEscapePressed') {
                        selectMenu.showByName('clothingMain');
                        selectMenu.menus["clothingTies"].i = 0;
                        selectMenu.menus["clothingTies"].j = 0;
                        mp.trigger('clothingShop.inputClothes.set');
                    }
                }
            },
            "clothingHats": {
                name: "clothingHats",
                header: "Головные уборы",
                headerImg: "",
                items: [],
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
                    if (eventName == 'onItemFocusChanged') {
                        if (e.itemName != 'Назад') {
                            mp.trigger('clothingShop.item.set', 'hats', e.itemIndex, e.valueIndex);
                        }
                    }
                    if (eventName == 'onItemValueChanged') {
                        mp.trigger('clothingShop.item.set', 'hats', e.itemIndex, e.valueIndex);
                    }
                    if (eventName == 'onItemSelected') {
                        if (e.itemName == 'Назад') {
                            selectMenu.showByName('clothingMain');
                            selectMenu.menus["clothingHats"].i = 0;
                            selectMenu.menus["clothingHats"].j = 0;
                            mp.trigger('clothingShop.inputClothes.set');
                        } else {
                            selectMenu.loader = true;
                            mp.trigger('clothingShop.item.buy', 'hats', e.itemIndex, e.valueIndex);
                        }
                    }
                    if (eventName == 'onBackspacePressed' || eventName == 'onEscapePressed') {
                        selectMenu.showByName('clothingMain');
                        selectMenu.menus["clothingHats"].i = 0;
                        selectMenu.menus["clothingHats"].j = 0;
                        mp.trigger('clothingShop.inputClothes.set');
                    }
                }
            },
            "clothingPants": {
                name: "clothingPants",
                header: "Ноги",
                headerImg: "",
                items: [],
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
                    if (eventName == 'onItemFocusChanged') {
                        if (e.itemName != 'Назад') {
                            mp.trigger('clothingShop.item.set', 'pants', e.itemIndex, e.valueIndex);
                        }
                    }
                    if (eventName == 'onItemValueChanged') {
                        mp.trigger('clothingShop.item.set', 'pants', e.itemIndex, e.valueIndex);
                    }
                    if (eventName == 'onItemSelected') {
                        if (e.itemName == 'Назад') {
                            selectMenu.showByName('clothingMain');
                            selectMenu.menus["clothingPants"].i = 0;
                            selectMenu.menus["clothingPants"].j = 0;
                            mp.trigger('clothingShop.inputClothes.set');
                        } else {
                            selectMenu.loader = true;
                            mp.trigger('clothingShop.item.buy', 'pants', e.itemIndex, e.valueIndex);
                        }
                    }
                    if (eventName == 'onBackspacePressed' || eventName == 'onEscapePressed') {
                        selectMenu.showByName('clothingMain');
                        selectMenu.menus["clothingPants"].i = 0;
                        selectMenu.menus["clothingPants"].j = 0;
                        mp.trigger('clothingShop.inputClothes.set');
                    }
                }
            },
            "clothingShoes": {
                name: "clothingShoes",
                header: "Обувь",
                headerImg: "",
                items: [],
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
                    if (eventName == 'onItemFocusChanged') {
                        if (e.itemName != 'Назад') {
                            mp.trigger('clothingShop.item.set', 'shoes', e.itemIndex, e.valueIndex);
                        }
                    }
                    if (eventName == 'onItemValueChanged') {
                        mp.trigger('clothingShop.item.set', 'shoes', e.itemIndex, e.valueIndex);
                    }
                    if (eventName == 'onItemSelected') {
                        if (e.itemName == 'Назад') {
                            selectMenu.showByName('clothingMain');
                            selectMenu.menus["clothingShoes"].i = 0;
                            selectMenu.menus["clothingShoes"].j = 0;
                            mp.trigger('clothingShop.inputClothes.set');
                        } else {
                            selectMenu.loader = true;
                            mp.trigger('clothingShop.item.buy', 'shoes', e.itemIndex, e.valueIndex);
                        }
                    }
                    if (eventName == 'onBackspacePressed' || eventName == 'onEscapePressed') {
                        selectMenu.showByName('clothingMain');
                        selectMenu.menus["clothingShoes"].i = 0;
                        selectMenu.menus["clothingShoes"].j = 0;
                        mp.trigger('clothingShop.inputClothes.set');
                    }
                }
            },
            "dump": {
                name: "dump",
                header: "Свалка",
                items: [{
                        text: "Сдать мусор"
                    },
                    {
                        text: "Закрыть"
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
                        if (e.itemName == 'Сдать мусор') mp.trigger(`callRemote`, `bins.trash.sell`);
                        selectMenu.show = false;
                    }
                }
            },
            "eateryMain": {
                name: "eateryMain",
                header: "Закусочная",
                headerImg: "",
                items: [{
                        text: 'Гамбургер',
                        values: ["$100"],
                    },
                    {
                        text: 'Хот-дог',
                        values: ["$100"],
                    },
                    {
                        text: 'Кусок пиццы',
                        values: ["$100"],
                    },
                    {
                        text: 'Пачка чипсов',
                        values: ["$100"],
                    },
                    {
                        text: 'Банка колы',
                        values: ["$100"],
                    },
                    {
                        text: 'Закрыть'
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
                        if (e.itemName == 'Закрыть') {
                            selectMenu.show = false;
                        } else {
                            selectMenu.loader = true;
                        }
                        if (e.itemName == 'Гамбургер') {
                            mp.trigger('callRemote', 'eatery.products.buy', 0);
                        }
                        if (e.itemName == 'Хот-дог') {
                            mp.trigger('callRemote', 'eatery.products.buy', 1);
                        }
                        if (e.itemName == 'Кусок пиццы') {
                            mp.trigger('callRemote', 'eatery.products.buy', 2);
                        }
                        if (e.itemName == 'Пачка чипсов') {
                            mp.trigger('callRemote', 'eatery.products.buy', 3);
                        }
                        if (e.itemName == 'Банка колы') {
                            mp.trigger('callRemote', 'eatery.products.buy', 4);
                        }
                    }
                    if (eventName == 'onBackspacePressed' || eventName == 'onEscapePressed') {
                        selectMenu.show = false;
                    }
                }
            },
            "vehiclePropAdd": {
                name: "vehiclePropAdd",
                header: "Добавление т/с",
                items: [{
                        text: 'Модель',
                        type: "editable"
                    },
                    {
                        text: 'Название т/с',
                        type: "editable"
                    },
                    {
                        text: 'Тип т/с',
                        values: ["0 (авто)", "1 (мото)", "2 (вело)"],
                    },
                    {
                        text: 'Цена',
                        type: "editable"
                    },
                    {
                        text: 'Объем бака',
                        type: "editable"
                    },
                    {
                        text: 'Расход в минуту',
                        type: "editable"
                    },
                    {
                        text: 'Наличие в автосалоне',
                        values: ["0 (нет)", "1 (есть)"],
                    },
                    {
                        text: 'ID салона',
                        values: ["1 (премиум)", "2 (эконом)", "3 (средний)", "4 (мото)", "5 (вело)"],
                    },
                    {
                        text: 'Коэф. выпадения (1-1000)',
                        type: "editable"
                    },
                    {
                        text: 'Добавить',
                    },
                    {
                        text: 'Закрыть'
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
                        if (e.itemName == 'Закрыть') {
                            selectMenu.show = false;
                        }
                        if (e.itemName == 'Добавить') {
                            let data = {
                                model: this.items[0].values[0],
                                name: this.items[1].values[0],
                                type: parseInt(this.items[2].values[this.items[2].i]),
                                price: parseInt(this.items[3].values[0]),
                                maxFuel: parseInt(this.items[4].values[0]),
                                consumption: parseInt(this.items[5].values[0]),
                                isAvailable: parseInt(this.items[6].values[this.items[6].i]),
                                carShowId: parseInt(this.items[7].values[this.items[7].i]),
                                percentage: parseInt(this.items[8].values[0]),
                            }
                            mp.trigger('callRemote', 'vehicles.props.add', JSON.stringify(data));
                        }
                    }
                    if (eventName == 'onEscapePressed') {
                        selectMenu.show = false;
                    }
                }
            },
            "woodman": {
                name: "woodman",
                header: "Лесопилка",
                items: [{
                        text: "Снаряжение",
                    },
                    {
                        text: "Ресурсы"
                    },
                    {
                        text: "Закрыть"
                    },
                ],
                i: 0,
                j: 0,
                prices: [],
                init(data) {
                    if (typeof data == 'string') data = JSON.parse(data);
                    var items = selectMenu.menus['woodmanItems'].items;
                    items[0].values[0] = `$${data.itemPrices[0]}`;

                    var clothesItems = selectMenu.menus['woodmanItemsClothes'].items;
                    for (var i = 0; i < clothesItems.length - 1; i++) {
                        clothesItems[i].values[0] = `$${data.itemPrices[i + 1]}`;
                    }

                    this.prices = data.itemPrices;

                    selectMenu.menus['woodmanSell'].items[0].values[0] = `$${data.treePrice}`;
                },
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
                        if (e.itemName == 'Работа') {

                        } else if (e.itemName == 'Снаряжение') {
                            selectMenu.showByName("woodmanItems");
                        } else if (e.itemName == 'Ресурсы') {
                            selectMenu.showByName("woodmanSell");
                        } else if (e.itemName == 'Закрыть') {
                            selectMenu.show = false;
                        }
                    }
                }
            },
            "woodmanItems": {
                name: "woodmanItems",
                header: "Снаряжение",
                items: [{
                        text: "Топор",
                        values: ['$9999']
                    },
                    {
                        text: "Форма"
                    },
                    {
                        text: "Вернуться"
                    },
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
                        if (e.itemName == 'Топор') {
                            // selectMenu.show = false;
                            mp.trigger(`callRemote`, `woodman.items.buy`, e.itemIndex);
                        } else if (e.itemName == 'Форма') {
                            selectMenu.showByName("woodmanItemsClothes");
                        } else if (e.itemName == 'Вернуться') {
                            selectMenu.showByName("woodman");
                        }
                    } else if (eventName == 'onBackspacePressed')
                        selectMenu.showByName("woodman");
                }
            },
            "woodmanItemsClothes": {
                name: "woodmanItemsClothes",
                header: "Форма дровосека",
                items: [{
                        text: "Жилетка",
                        values: ['$9999']
                    },
                    {
                        text: "Штаны",
                        values: ['$9999']
                    },
                    {
                        text: "Ботинки",
                        values: ['$9999']
                    },
                    {
                        text: "Вернуться"
                    },
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
                        if (e.itemName == 'Вернуться') {
                            selectMenu.showByName("woodmanItems");
                        } else {
                            // selectMenu.show = false;
                            mp.trigger(`callRemote`, `woodman.clothes.buy`, e.itemIndex);
                        }
                    } else if (eventName == 'onBackspacePressed')
                        selectMenu.showByName("woodmanItems");
                }
            },
            "woodmanSell": {
                name: "woodmanSell",
                header: "Ресурсы",
                items: [{
                        text: "Дерево",
                        values: [`$999`]
                    },
                    {
                        text: "Продать"
                    },
                    {
                        text: "Вернуться"
                    },
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
                        if (e.itemName == 'Продать') {
                            selectMenu.show = false;
                            mp.trigger(`callRemote`, `woodman.items.sell`);
                        } else if (e.itemName == 'Вернуться') {
                            selectMenu.showByName("woodman");
                        }
                    } else if (eventName == 'onBackspacePressed')
                        selectMenu.showByName("woodman");
                }
            },
            "mason": {
                name: "mason",
                header: "Каменоломня",
                items: [{
                        text: "Снаряжение",
                    },
                    {
                        text: "Ресурсы"
                    },
                    {
                        text: "Закрыть"
                    },
                ],
                i: 0,
                j: 0,
                prices: [],
                init(data) {
                    if (typeof data == 'string') data = JSON.parse(data);
                    var items = selectMenu.menus['masonItems'].items;
                    items[0].values[0] = `$${data.itemPrices[0]}`;

                    var clothesItems = selectMenu.menus['masonItemsClothes'].items;
                    for (var i = 0; i < clothesItems.length - 1; i++) {
                        clothesItems[i].values[0] = `$${data.itemPrices[i + 1]}`;
                    }

                    this.prices = data.itemPrices;

                    selectMenu.menus['masonSell'].items[0].values[0] = `$${data.rockPrice}`;
                },
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
                        if (e.itemName == 'Работа') {

                        } else if (e.itemName == 'Снаряжение') {
                            selectMenu.showByName("masonItems");
                        } else if (e.itemName == 'Ресурсы') {
                            selectMenu.showByName("masonSell");
                        } else if (e.itemName == 'Закрыть') {
                            selectMenu.show = false;
                        }
                    }
                }
            },
            "masonItems": {
                name: "masonItems",
                header: "Снаряжение",
                items: [{
                        text: "Кирка",
                        values: ['$9999']
                    },
                    {
                        text: "Форма"
                    },
                    {
                        text: "Вернуться"
                    },
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
                        if (e.itemName == 'Кирка') {
                            // selectMenu.show = false;
                            mp.trigger(`callRemote`, `mason.items.buy`, e.itemIndex);
                        } else if (e.itemName == 'Форма') {
                            selectMenu.showByName("masonItemsClothes");
                        } else if (e.itemName == 'Вернуться') {
                            selectMenu.showByName("mason");
                        }
                    } else if (eventName == 'onBackspacePressed')
                        selectMenu.showByName("mason");
                }
            },
            "masonItemsClothes": {
                name: "masonItemsClothes",
                header: "Форма каменщика",
                items: [{
                        text: "Жилетка",
                        values: ['$9999']
                    },
                    {
                        text: "Штаны",
                        values: ['$9999']
                    },
                    {
                        text: "Ботинки",
                        values: ['$9999']
                    },
                    {
                        text: "Вернуться"
                    },
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
                        if (e.itemName == 'Вернуться') {
                            selectMenu.showByName("masonItems");
                        } else {
                            // selectMenu.show = false;
                            mp.trigger(`callRemote`, `mason.clothes.buy`, e.itemIndex);
                        }
                    } else if (eventName == 'onBackspacePressed')
                        selectMenu.showByName("masonItems");
                }
            },
            "masonSell": {
                name: "masonSell",
                header: "Ресурсы",
                items: [{
                        text: "Камень",
                        values: [`$999`]
                    },
                    {
                        text: "Продать"
                    },
                    {
                        text: "Вернуться"
                    },
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
                        if (e.itemName == 'Продать') {
                            selectMenu.show = false;
                            mp.trigger(`callRemote`, `mason.items.sell`);
                        } else if (e.itemName == 'Вернуться') {
                            selectMenu.showByName("mason");
                        }
                    } else if (eventName == 'onBackspacePressed')
                        selectMenu.showByName("mason");
                }
            },
            "tattooMain": {
                name: "tattooMain",
                header: "Тату-салон",
                headerImg: "",
                items: [{
                        text: 'Голова'
                    },
                    {
                        text: 'Торс'
                    },
                    {
                        text: 'Правая рука'
                    },
                    {
                        text: 'Левая рука'
                    },
                    {
                        text: 'Правая нога'
                    },
                    {
                        text: 'Левая нога'
                    },
                    {
                        text: 'Сведение татуировок'
                    },
                    {
                        text: 'Закрыть'
                    },
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
                        if (e.itemName == 'Закрыть') {
                            mp.trigger('tattoo.exit');
                        }
                        if (e.itemName == 'Торс') {
                            mp.trigger('tattoo.set', 0, 0);
                            selectMenu.showByName('tattooTorso');
                        }
                        if (e.itemName == 'Голова') {
                            mp.trigger('tattoo.set', 1, 0);
                            selectMenu.showByName('tattooHead');
                        }
                        if (e.itemName == 'Левая рука') {
                            mp.trigger('tattoo.set', 2, 0);
                            selectMenu.showByName('tattooLeftArm');
                        }
                        if (e.itemName == 'Правая рука') {
                            mp.trigger('tattoo.set', 3, 0);
                            selectMenu.showByName('tattooRightArm');
                        }
                        if (e.itemName == 'Левая нога') {
                            mp.trigger('tattoo.set', 4, 0);
                            selectMenu.showByName('tattooLeftLeg');
                        }
                        if (e.itemName == 'Правая нога') {
                            mp.trigger('tattoo.set', 5, 0);
                            selectMenu.showByName('tattooRightLeg');
                        }
                        if (e.itemName == 'Сведение татуировок') {
                            mp.trigger('tattoo.delete.show');
                        }
                    }

                    if (eventName == 'onBackspacePressed' || eventName == 'onEscapePressed') {
                        mp.trigger('tattoo.exit');
                    }

                }
            },
            "tattooTorso": {
                name: "tattooTorso",
                header: "Торс",
                headerImg: "",
                items: [],
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
                    if (eventName == 'onItemFocusChanged') {
                        if (e.itemName != 'Назад') {
                            mp.trigger('tattoo.set', 0, e.itemIndex);
                        }
                    }
                    if (eventName == 'onItemSelected') {
                        if (e.itemName == 'Назад') {
                            selectMenu.showByName('tattooMain');
                            selectMenu.menus["tattooTorso"].i = 0;
                            selectMenu.menus["tattooTorso"].j = 0;
                            mp.trigger('tattoo.clear');
                        } else {
                            selectMenu.loader = true;
                            mp.trigger('tattoo.buy', 0, e.itemIndex);
                        }
                    }
                    if (eventName == 'onBackspacePressed' || eventName == 'onEscapePressed') {
                        selectMenu.showByName('tattooMain');
                        selectMenu.menus["tattooTorso"].i = 0;
                        selectMenu.menus["tattooTorso"].j = 0;
                        mp.trigger('tattoo.clear');
                    }
                }
            },
            "tattooHead": {
                name: "tattooHead",
                header: "Голова",
                headerImg: "",
                items: [],
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
                    if (eventName == 'onItemFocusChanged') {
                        if (e.itemName != 'Назад') {
                            mp.trigger('tattoo.set', 1, e.itemIndex);
                        }
                    }
                    if (eventName == 'onItemSelected') {
                        if (e.itemName == 'Назад') {
                            selectMenu.showByName('tattooMain');
                            selectMenu.menus["tattooHead"].i = 0;
                            selectMenu.menus["tattooHead"].j = 0;
                            mp.trigger('tattoo.clear');
                        } else {
                            selectMenu.loader = true;
                            mp.trigger('tattoo.buy', 1, e.itemIndex);
                        }
                    }
                    if (eventName == 'onBackspacePressed' || eventName == 'onEscapePressed') {
                        selectMenu.showByName('tattooMain');
                        selectMenu.menus["tattooHead"].i = 0;
                        selectMenu.menus["tattooHead"].j = 0;
                        mp.trigger('tattoo.clear');
                    }
                }
            },
            "tattooLeftArm": {
                name: "tattooLeftArm",
                header: "Левая рука",
                headerImg: "",
                items: [],
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
                    if (eventName == 'onItemFocusChanged') {
                        if (e.itemName != 'Назад') {
                            mp.trigger('tattoo.set', 2, e.itemIndex);
                        }
                    }
                    if (eventName == 'onItemSelected') {
                        if (e.itemName == 'Назад') {
                            selectMenu.showByName('tattooMain');
                            selectMenu.menus["tattooLeftArm"].i = 0;
                            selectMenu.menus["tattooLeftArm"].j = 0;
                            mp.trigger('tattoo.clear');
                        } else {
                            selectMenu.loader = true;
                            mp.trigger('tattoo.buy', 2, e.itemIndex);
                        }
                    }
                    if (eventName == 'onBackspacePressed' || eventName == 'onEscapePressed') {
                        selectMenu.showByName('tattooMain');
                        selectMenu.menus["tattooLeftArm"].i = 0;
                        selectMenu.menus["tattooLeftArm"].j = 0;
                        mp.trigger('tattoo.clear');
                    }
                }
            },
            "tattooRightArm": {
                name: "tattooRightArm",
                header: "Правая рука",
                headerImg: "",
                items: [],
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
                    if (eventName == 'onItemFocusChanged') {
                        if (e.itemName != 'Назад') {
                            mp.trigger('tattoo.set', 3, e.itemIndex);
                        }
                    }
                    if (eventName == 'onItemSelected') {
                        if (e.itemName == 'Назад') {
                            selectMenu.showByName('tattooMain');
                            selectMenu.menus["tattooRightArm"].i = 0;
                            selectMenu.menus["tattooRightArm"].j = 0;
                            mp.trigger('tattoo.clear');
                        } else {
                            selectMenu.loader = true;
                            mp.trigger('tattoo.buy', 3, e.itemIndex);
                        }
                    }
                    if (eventName == 'onBackspacePressed' || eventName == 'onEscapePressed') {
                        selectMenu.showByName('tattooMain');
                        selectMenu.menus["tattooRightArm"].i = 0;
                        selectMenu.menus["tattooRightArm"].j = 0;
                        mp.trigger('tattoo.clear');
                    }
                }
            },
            "tattooLeftLeg": {
                name: "tattooLeftLeg",
                header: "Левая нога",
                headerImg: "",
                items: [],
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
                    if (eventName == 'onItemFocusChanged') {
                        if (e.itemName != 'Назад') {
                            mp.trigger('tattoo.set', 4, e.itemIndex);
                        }
                    }
                    if (eventName == 'onItemSelected') {
                        if (e.itemName == 'Назад') {
                            selectMenu.showByName('tattooMain');
                            selectMenu.menus["tattooLeftLeg"].i = 0;
                            selectMenu.menus["tattooLeftLeg"].j = 0;
                            mp.trigger('tattoo.clear');
                        } else {
                            selectMenu.loader = true;
                            mp.trigger('tattoo.buy', 4, e.itemIndex);
                        }
                    }
                    if (eventName == 'onBackspacePressed' || eventName == 'onEscapePressed') {
                        selectMenu.showByName('tattooMain');
                        selectMenu.menus["tattooLeftLeg"].i = 0;
                        selectMenu.menus["tattooLeftLeg"].j = 0;
                        mp.trigger('tattoo.clear');
                    }
                }
            },
            "tattooRightLeg": {
                name: "tattooRightLeg",
                header: "Правая нога",
                headerImg: "",
                items: [],
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
                    if (eventName == 'onItemFocusChanged') {
                        if (e.itemName != 'Назад') {
                            mp.trigger('tattoo.set', 5, e.itemIndex);
                        }
                    }
                    if (eventName == 'onItemSelected') {
                        if (e.itemName == 'Назад') {
                            selectMenu.showByName('tattooMain');
                            selectMenu.menus["tattooRightLeg"].i = 0;
                            selectMenu.menus["tattooRightLeg"].j = 0;
                            mp.trigger('tattoo.clear');
                        } else {
                            selectMenu.loader = true;
                            mp.trigger('tattoo.buy', 5, e.itemIndex);
                        }
                    }
                    if (eventName == 'onBackspacePressed' || eventName == 'onEscapePressed') {
                        selectMenu.showByName('tattooMain');
                        selectMenu.menus["tattooRightLeg"].i = 0;
                        selectMenu.menus["tattooRightLeg"].j = 0;
                        mp.trigger('tattoo.clear');
                    }
                }
            },
            "tattooDelete": {
                name: "tattooDelete",
                header: "Сведение татуировок",
                headerImg: "",
                items: [],
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
                    if (eventName == 'onItemFocusChanged') {
                        if (e.itemName != 'Назад') {
                            mp.trigger('tattoo.clear.single', e.itemIndex);
                        }
                    }
                    if (eventName == 'onItemSelected') {
                        if (e.itemName == 'Назад') {
                            selectMenu.showByName('tattooMain');
                            selectMenu.menus["tattooDelete"].i = 0;
                            selectMenu.menus["tattooDelete"].j = 0;
                            mp.trigger('tattoo.clear');
                        } else {
                            selectMenu.loader = true;
                            mp.trigger('tattoo.delete', e.itemIndex);
                        }
                    }
                    if (eventName == 'onBackspacePressed' || eventName == 'onEscapePressed') {
                        selectMenu.showByName('tattooMain');
                        selectMenu.menus["tattooDelete"].i = 0;
                        selectMenu.menus["tattooDelete"].j = 0;
                        mp.trigger('tattoo.clear');
                    }
                }
            },
            "ownVehiclesList": {
                name: "ownVehiclesList",
                header: "Личный транспорт",
                items: [],
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
                        if (e.itemName == 'Закрыть') {
                            selectMenu.show = false;
                        } else {
                            mp.trigger('vehicles.own.menu.show', e.itemIndex);
                        }
                    }
                    if (eventName == 'onBackspacePressed' || eventName == 'onEscapePressed') {
                        selectMenu.show = false;
                    }
                }
            },
            "ownVehicleMenu": {
                name: "ownVehicleMenu",
                header: "Личный транспорт",
                items: [{
                        text: 'Номер',
                        values: ['0']
                    },
                    {
                        text: 'Поиск по GPS'
                    },
                    {
                        text: 'Доставить',
                        values: ['$100']
                    },
                    {
                        text: 'Назад'
                    },
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
                        if (e.itemName == 'Назад') {
                            selectMenu.showByName('ownVehiclesList');
                        }
                        if (e.itemName == 'Поиск по GPS') {
                            selectMenu.show = false;
                            mp.trigger('vehicles.own.find');
                        }
                        if (e.itemName == 'Доставить') {
                            selectMenu.show = false;
                            mp.trigger('vehicles.own.deliver');
                        }
                    }
                    if (eventName == 'onBackspacePressed' || eventName == 'onEscapePressed') {
                        selectMenu.showByName('ownVehiclesList');
                    }
                }
            },
            "rentMenu": {
                name: "rentMenu",
                header: "Аренда",
                items: [{
                        text: "Арендовать транспорт",
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
                        if (e.itemName == 'Арендовать транспорт') {
                            mp.trigger('callRemote', `rent.vehicle.rent`);
                        }
                        if (e.itemName == 'Отмена') {
                            mp.trigger(`rent.rentmenu.close`);
                        }
                    }
                }
            },
            "animations": {
                name: "animations",
                header: "Анимации",
                items: [{
                        text: "Танцы",
                    },
                    {
                        text: "Армия"
                    },
                    {
                        text: "Полиция"
                    },
                    {
                        text: "Медики"
                    },
                    {
                        text: "Гражданские"
                    },
                    {
                        text: "Работы"
                    },
                    {
                        text: "Закрыть"
                    },
                ],
                i: 0,
                j: 0,
                list: {
                    "Танцы": [{
                            id: 926,
                            name: "Дёргать руками и двигаться на месте"
                        },
                        {
                            id: 1027,
                            name: "Медленный танец"
                        },
                        {
                            id: 924,
                            name: "Танец «Кокетка»"
                        },
                        {
                            id: 1213,
                            name: "Танец «В такт музыке»"
                        },
                        {
                            id: 925,
                            name: "Танец «Ласточка»"
                        },
                        {
                            id: 1047,
                            name: "Стриптиз"
                        },
                        {
                            id: 7899,
                            name: "Стриптиз №2"
                        },
                        {
                            id: 10063,
                            name: "Зажигательный танец"
                        },
                        {
                            id: 10064,
                            name: "Jenga"
                        },
                        {
                            id: 10071,
                            name: "Неудачный танец"
                        },
                    ],
                    "Армия": [{
                            id: 1841,
                            name: "Воинское приветствие"
                        },
                        {
                            id: 557,
                            name: "Подтягивания на перекладине"
                        },
                        {
                            id: 1017,
                            name: "Качать бицепсы «Штангой у груди»"
                        },
                        {
                            id: 1060,
                            name: "Отжиматься"
                        },
                        {
                            id: 1126,
                            name: "Качать пресс"
                        },
                        {
                            id: 9947,
                            name: "Пытаться качать прес"
                        },
                        {
                            id: 11003,
                            name: "Проползать под проволкой"
                        },
                    ],
                    "Полиция": [{
                            id: 7016,
                            name: "Держаться руку на кобуре"
                        },
                        {
                            id: 354,
                            name: "Стойка, руки на поясе"
                        },
                        {
                            id: 1279,
                            name: "Стоять, скрестив руки на груди"
                        },
                        {
                            id: 518,
                            name: "Стать на одно колено и что - то высматривать на земле"
                        },
                        {
                            id: 356,
                            name: "Осматривать землю"
                        },
                        {
                            id: 407,
                            name: "Держать руки на ремне"
                        },
                        {
                            id: 526,
                            name: "Достать блокнот и начать записывать"
                        },
                        {
                            id: 6215,
                            name: "Остановить машину и показать на поворот"
                        },
                        {
                            id: 1418,
                            name: "Держаться руки на ремне и оглядываться"
                        },
                        {
                            id: 1797,
                            name: "Фотографировать на фотоаппарат"
                        },
                    ],
                    "Медики": [{
                            id: 520,
                            name: "Осматривать пострадавшего"
                        },
                        {
                            id: 524,
                            name: "Ощупать пострадавшего"
                        },
                        {
                            id: 8247,
                            name: "Схватиться за грудь в области сердца"
                        },
                        {
                            id: 8276,
                            name: "Зубная боль"
                        },
                        {
                            id: 8306,
                            name: "Лежать на боку при этом схватившись за голову"
                        },
                        {
                            id: 1416,
                            name: "Сидеть на полу и держаться за грудную клетку"
                        },
                    ],
                    "Гражданские": [{
                            id: 7241,
                            name: "Взять что-то"
                        },
                        {
                            id: 1016,
                            name: "Демонстрация мышц"
                        },
                        {
                            id: 2414,
                            name: "Встать на колени и завести руки за голову"
                        },
                        {
                            id: 1280,
                            name: "Заниматься йогой №1"
                        },
                        {
                            id: 1281,
                            name: "Заниматься йогой №2"
                        },
                        {
                            id: 6210,
                            name: "Поднять руки в верх"
                        },
                        {
                            id: 1487,
                            name: "Размять мышцы перед дракой"
                        },
                        {
                            id: 8668,
                            name: "Указать направление"
                        },
                        {
                            id: 367,
                            name: "Стоять и держать в руке стаканчик с кофе"
                        },
                        {
                            id: 7472,
                            name: "Достать что-то из кармана и положить перед собой"
                        },
                        {
                            id: 548,
                            name: "Облокотиться на перилла"
                        },
                        {
                            id: 949,
                            name: "Облокотиться об стену спиной"
                        },
                        {
                            id: 953,
                            name: "Облокотиться об стену спиной и говорить по телефону"
                        },
                        {
                            id: 956,
                            name: "Облокотиться об стену спиной и играть в телефон"
                        },
                        {
                            id: 966,
                            name: "Облокотиться об стену спиной и поставить ногу на стену"
                        },
                        {
                            id: 983,
                            name: "Облокотиться об стену спиной рука за руку на груди"
                        },
                        {
                            id: 392,
                            name: "Стоять с широко расставленными руками"
                        },
                        {
                            id: 9854,
                            name: "Стоять сложив руки на поясе"
                        },
                        {
                            id: 9125,
                            name: "Стоять скромно, покачиваясь"
                        },
                        {
                            id: 516,
                            name: "Прилечь на боку"
                        },
                        {
                            id: 286,
                            name: "Почесать в паху"
                        },
                        {
                            id: 310,
                            name: "Курение сигареты"
                        },
                        {
                            id: 135,
                            name: "Испуганно сидеть на корточках"
                        },
                        {
                            id: 1304,
                            name: "Позвонить в дверной звонок"
                        },
                        {
                            id: 1446,
                            name: "Дать офицеру руки, чтобы тот смог надеть наручники"
                        },
                        {
                            id: 1483,
                            name: "Чесать сзади"
                        },
                        {
                            id: 7412,
                            name: "Взламывать замок"
                        },
                        {
                            id: 1642,
                            name: "Удивление"
                        },
                        {
                            id: 1694,
                            name: "Пошлое движение рук"
                        },
                        {
                            id: 1716,
                            name: "Показать фак"
                        },
                        {
                            id: 6300,
                            name: "Приступ"
                        },
                        {
                            id: 1033,
                            name: "Кокетливо сидеть, опираясь на руку"
                        },
                        {
                            id: 1037,
                            name: "Сидеть опираясь на две руки за спиной"
                        },
                        {
                            id: 1219,
                            name: "Сидеть, облокотившись о стену"
                        },
                        {
                            id: 1228,
                            name: "Лежать на спине, закрывая рукой лицо"
                        },
                        {
                            id: 1232,
                            name: "Лежать на животе, смотря в телефон"
                        },
                        {
                            id: 1235,
                            name: "Лежать на животе и болтать поднятыми ногами"
                        },
                        {
                            id: 1239,
                            name: "Лежать на спине"
                        },
                        {
                            id: 8245,
                            name: "Радоваться победе"
                        },
                        {
                            id: 1515,
                            name: "Посылать воздушные поцелуи"
                        },
                        {
                            id: 8079,
                            name: "Снова неудача"
                        },
                        {
                            id: 8336,
                            name: "Сожалеть о содеяном"
                        },
                        {
                            id: 1511,
                            name: "Радость победе с пошлым движением"
                        },
                        {
                            id: 1509,
                            name: "Энергичный гитарист"
                        },
                        {
                            id: 1519,
                            name: "Показывать всем «Факи»"
                        },
                        {
                            id: 8092,
                            name: "Злиться на что-то"
                        },
                        {
                            id: 1526,
                            name: "Наклониться и показывать жест «Тише»"
                        },
                        {
                            id: 1539,
                            name: "Facepalm"
                        },
                        {
                            id: 1529,
                            name: "Докурить и на показуху выкинуть бычёк"
                        },
                        {
                            id: 1540,
                            name: "Дерзко показывать фак"
                        },
                        {
                            id: 1548,
                            name: "Наигранно «Отдать честь»"
                        },
                        {
                            id: 1554,
                            name: "Наигранно показать палец вверх"
                        },
                        {
                            id: 1596,
                            name: "Чрезмерная радость"
                        },
                        {
                            id: 8112,
                            name: "Пъяный"
                        },
                        {
                            id: 1810,
                            name: "Пальцы в стиле «Рок»"
                        },
                        {
                            id: 1900,
                            name: "Показать «Класс»"
                        },
                        {
                            id: 9896,
                            name: "Крутить пятой точкой"
                        },
                        {
                            id: 1924,
                            name: "Подрочи"
                        },
                        {
                            id: 1937,
                            name: "Всё окей"
                        },
                        {
                            id: 1939,
                            name: "Fuck you"
                        },
                        {
                            id: 1942,
                            name: "Виртуозный гитарист"
                        },
                        {
                            id: 1952,
                            name: "Боюсь - боюсь"
                        },
                        {
                            id: 7914,
                            name: "Вести пактивный раговор при этом сложив руки на груди"
                        },
                        {
                            id: 1954,
                            name: "Разминать кулаки"
                        },
                        {
                            id: 1963,
                            name: "Медленно хлопать"
                        },
                        {
                            id: 1968,
                            name: "Махать рукой как «английская королева»"
                        },
                        {
                            id: 7411,
                            name: "Упасть на колени и схватиться за голову"
                        },
                    ],
                    "Работы": [{
                            id: 543,
                            name: "Залезть в двигатель"
                        },
                        {
                            id: 551,
                            name: "Что то прикручивать вверху"
                        },
                        {
                            id: 829,
                            name: "Дробить бетон"
                        },
                        {
                            id: 918,
                            name: "Мыть полы"
                        },
                        {
                            id: 7054,
                            name: "Мыть полы №2"
                        },
                        {
                            id: 1002,
                            name: "Протирать стёкла"
                        },
                        {
                            id: 8081,
                            name: "Копать"
                        },
                        {
                            id: 9952,
                            name: "Натирать горизонтальную поверхность"
                        },
                    ],
                },
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
                        if (e.itemName == 'Закрыть') {
                            selectMenu.show = false;
                            prompt.showByName("animations_stop");
                        } else {
                            var key = Object.keys(this.list)[e.itemIndex];
                            selectMenu.menus["animationList"].init(key, this.list[key]);
                            selectMenu.showByName("animationList");
                        }
                    } else if (eventName == 'onBackspacePressed') {
                        selectMenu.show = false;
                        prompt.showByName("animations_stop");
                    }
                }
            },
            "animationList": {
                name: "animationList",
                header: "Категория",
                items: [{
                        text: "Анимация 1",
                    },
                    {
                        text: "Анимация 2"
                    },
                    {
                        text: "Вернуться"
                    },
                ],
                i: 0,
                j: 0,
                list: null,
                init(header, list) {
                    this.header = header;
                    this.list = list;

                    var items = [];
                    list.forEach(anim => {
                        items.push({
                            text: anim.name
                        });
                    });
                    items.push({
                        text: "Вернуться"
                    });
                    selectMenu.setItems("animationList", items);
                },
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
                        if (e.itemName == 'Вернуться') {
                            selectMenu.showByName("animations");
                        } else {
                            var animId = this.list[e.itemIndex].id;
                            mp.trigger(`callRemote`, `animations.playById`, animId);
                            mp.trigger(`animations.setOwnPlayingAnimId`, animId);
                        }
                    } else if (eventName == 'onBackspacePressed') {
                        selectMenu.showByName("animations");
                    }
                }
            },
            "club": {
                name: "club",
                header: "Название клуба",
                items: [{
                        text: "Напитки",
                    },
                    {
                        text: "Закуски"
                    },
                    {
                        text: "Сигареты"
                    },
                    {
                        text: "Управление"
                    },
                    {
                        text: "Закрыть"
                    },
                ],
                i: 0,
                j: 0,
                hasControl: false,
                alcohol: [],
                snacks: [],
                smoke: [],
                init(data) {
                    if (typeof data == 'string') data = JSON.parse(data);

                    this.header = data.name;
                    this.hasControl = data.hasControl;
                    this.alcohol = data.alcohol;
                    this.snacks = data.snacks;
                    this.smoke = data.smoke;

                    if (this.hasControl) {
                        selectMenu.addItem('club', {
                            text: "Управление"
                        }, 3);
                    } else selectMenu.deleteItem('club', "Управление");

                    var alcoholItems = [];
                    this.alcohol.forEach(el => {
                        alcoholItems.push({
                            text: el.params.name,
                            values: [`$${el.price * data.alcoholPrice}`],
                        });
                    });
                    alcoholItems.push({
                        text: "Вернуться"
                    });

                    var snackItems = [];
                    this.snacks.forEach(el => {
                        snackItems.push({
                            text: el.params.name,
                            values: [`$${el.price * data.alcoholPrice}`],
                        });
                    });
                    snackItems.push({
                        text: "Вернуться"
                    });

                    var smokeItems = [];
                    this.smoke.forEach(el => {
                        smokeItems.push({
                            text: el.params.name,
                            values: [`$${el.price * data.alcoholPrice}`],
                        });
                    });
                    smokeItems.push({
                        text: "Вернуться"
                    });

                    selectMenu.setItems('clubAlcohol', alcoholItems);
                    selectMenu.setItems('clubSnacks', snackItems);
                    selectMenu.setItems('clubSmoke', smokeItems);
                },
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
                        if (e.itemName == 'Напитки') {
                            selectMenu.showByName("clubAlcohol");
                        } else if (e.itemName == 'Закуски') {
                            selectMenu.showByName("clubSnacks");
                        } else if (e.itemName == 'Сигареты') {
                            selectMenu.showByName("clubSmoke");
                        } else if (e.itemName == 'Управление') {
                            selectMenu.showByName("clubControl");
                        } else if (e.itemName == 'Закрыть') {
                            selectMenu.show = false;
                        }
                    } else if (eventName == 'onBackspacePressed') {
                        selectMenu.show = false;
                    }
                }
            },
            "bar": {
                name: "bar",
                header: "Название бара",
                items: [{
                        text: "Напитки",
                    },
                    {
                        text: "Закрыть"
                    }
                ],
                i: 0,
                j: 0,
                alcohol: [],
                init(data) {
                    if (typeof data == 'string') data = JSON.parse(data);

                    this.alcohol = data;

                    var alcoholItems = [];
                    this.alcohol.forEach(el => {
                        alcoholItems.push({
                            text: el.params.name,
                            values: [`$${el.price}`],
                        });
                    });
                    alcoholItems.push({
                        text: "Вернуться"
                    });

                    selectMenu.setItems('barAlcohol', alcoholItems);
                },
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
                        if (e.itemName == 'Напитки') {
                            selectMenu.showByName("barAlcohol");
                        } else if (e.itemName == 'Закрыть') {
                            selectMenu.show = false;
                        }
                    } else if (eventName == 'onBackspacePressed') {
                        selectMenu.show = false;
                    }
                }
            },
            "clubAlcohol": {
                name: "clubAlcohol",
                header: "Напитки",
                items: [{
                        text: "Напиток 1",
                        values: [`$999`]
                    },
                    {
                        text: "Напиток 2",
                        values: [`$999`]
                    },
                    {
                        text: "Вернуться"
                    },
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
                        if (e.itemName == 'Вернуться') {
                            selectMenu.showByName("club");
                        } else {
                            selectMenu.show = false;
                            mp.trigger(`callRemote`, `clubs.alcohol.buy`, e.itemIndex);
                        }
                    } else if (eventName == 'onBackspacePressed') {
                        selectMenu.showByName("club");
                    }
                }
            },
            "barAlcohol": {
                name: "barAlcohol",
                header: "Напитки",
                items: [{
                        text: "Напиток 1",
                        values: [`$999`]
                    },
                    {
                        text: "Напиток 2",
                        values: [`$999`]
                    },
                    {
                        text: "Вернуться"
                    },
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
                        if (e.itemName == 'Вернуться') {
                            selectMenu.showByName("bar");
                        } else {
                            selectMenu.show = false;
                            mp.trigger(`callRemote`, `bar.buy`, e.itemIndex);
                        }
                    } else if (eventName == 'onBackspacePressed') {
                        selectMenu.showByName("bar");
                    }
                }
            },
            "clubSnacks": {
                name: "clubSnacks",
                header: "Закуски",
                items: [{
                        text: "Закуска 1",
                        values: [`$999`]
                    },
                    {
                        text: "Закуска 2",
                        values: [`$999`]
                    },
                    {
                        text: "Вернуться"
                    },
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
                        if (e.itemName == 'Вернуться') {
                            selectMenu.showByName("club");
                        } else {
                            selectMenu.show = false;
                            mp.trigger(`callRemote`, `clubs.snacks.buy`, e.itemIndex);
                        }
                    } else if (eventName == 'onBackspacePressed') {
                        selectMenu.showByName("club");
                    }
                }
            },
            "clubSmoke": {
                name: "clubSmoke",
                header: "Сигареты",
                items: [{
                        text: "Сигарета 1",
                        values: [`$999`]
                    },
                    {
                        text: "Сигарета 2",
                        values: [`$999`]
                    },
                    {
                        text: "Вернуться"
                    },
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
                        if (e.itemName == 'Вернуться') {
                            selectMenu.showByName("club");
                        } else {
                            selectMenu.show = false;
                            mp.trigger(`callRemote`, `clubs.smoke.buy`, e.itemIndex);
                        }
                    } else if (eventName == 'onBackspacePressed') {
                        selectMenu.showByName("club");
                    }
                }
            },
            "clubControl": {
                name: "clubControl",
                header: "Управление",
                items: [{
                        text: "Двери",
                        values: [`Открыть`, `Закрыть`]
                    },
                    {
                        text: "Вернуться"
                    },
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
                        if (e.itemName == 'Вернуться') {
                            selectMenu.showByName("club");
                        } else if (e.itemName == 'Двери') {
                            var isOpen = (e.valueIndex) ? false : true;
                            selectMenu.show = false;
                            mp.trigger(`callRemote`, `clubs.control.open`, isOpen);
                        }
                    } else if (eventName == 'onBackspacePressed') {
                        selectMenu.showByName("club");
                    }
                }
            },
            "winterJob": {
                name: "winterJob",
                header: "Работа уборщика",
                items: [{
                        text: "Устроиться",
                    },
                    {
                        text: "Уволиться",
                    },
                    // {
                    //     text: "Помощь"
                    // },
                    {
                        text: "Закрыть"
                    },
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
                        if (e.itemName == 'Устроиться') {
                            mp.trigger(`callRemote`, `winter.job.start`);
                        } else if (e.itemName == 'Уволиться') {
                            mp.trigger(`callRemote`, `winter.job.stop`);
                        } else if (e.itemName == 'Помощь') {
                            // selectMenu.show = false;
                            // modal.showByName("carrier_help");
                        } else if (e.itemName == 'Закрыть') {
                            selectMenu.show = false;
                        }
                    }
                }
            },
        },

        notification: null,

        showNotifTime: 10000,

        showNotifTimer: null,

        loader: false,

        loaderMaxTime: 10 * 1000,

        loaderTimer: null,
    },
    methods: {
        onKeyDown(e) {
            if (!this.show || this.loader) return;
            if (e.keyCode == 38) { 
                if (this.menu.i == 0) return;
                this.menu.i = Math.clamp(this.menu.i - 1, 0, this.menu.items.length - 1);
                if (this.menu.i < this.menu.j) this.menu.j--;
                this.onItemFocusChanged();
            } else if (e.keyCode == 40) {
                if (this.menu.i == this.menu.items.length - 1) return;
                this.menu.i = Math.clamp(this.menu.i + 1, 0, this.menu.items.length - 1);
                if (this.menu.i - this.menu.j == this.maxItems) this.menu.j++;
                this.onItemFocusChanged();
            } else if (e.keyCode == 37) {
                var item = this.menu.items[this.menu.i];
                if (!item.values || item.i == 0) return;
                item.i = Math.clamp(item.i - 1, 0, item.values.length - 1);
                if (item.i < item.j) item.j--;
                this.onItemValueChanged();
            } else if (e.keyCode == 39) {
                var item = this.menu.items[this.menu.i];
                if (!item.values || item.i == item.values.length - 1) return;
                item.i = Math.clamp(item.i + 1, 0, item.values.length - 1);
                if (item.i - item.j == this.maxColorValues) item.j++;
                this.onItemValueChanged();
            } else if (e.keyCode == 13) {
                this.onItemSelected();
            }
        },
        onKeyUp(e) {
            if (!this.show || this.loader) return;
            if (e.keyCode == 8) {
                this.onBackspacePressed();
            } else if (e.keyCode == 27) {
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
            var values = this.menu.items[index].values;
            if (this.menu.items[index].type == "editable") return 3;
            if (!values || values[0] === "") return -1;
            if (values[0][0] == '#') return 1;
            for (var i = 0; i < values.length; i++) {
                var value = values[i];
                if (typeof value != 'number') return 0;
            }
            return 2;
        },
        onItemSelected() {
            this.notification = null;
            this.menu.handler("onItemSelected");
            mp.trigger(`selectMenu.selectSound.play`);
        },
        onItemValueChanged() {
            this.menu.handler("onItemValueChanged");
            mp.trigger(`selectMenu.focusSound.play`);
        },
        onItemFocusChanged() {
            this.menu.handler("onItemFocusChanged");
            mp.trigger(`selectMenu.focusSound.play`);
        },
        onBackspacePressed() {
            if (this.isEditing) return;
            this.menu.handler("onBackspacePressed");
            mp.trigger(`selectMenu.backSound.play`);
        },
        onEscapePressed() {
            this.menu.handler("onEscapePressed");
            mp.trigger(`selectMenu.backSound.play`);
        },
        showByName(menuName) {
            var menu = this.menus[menuName];
            if (!menu) return;
            this.menu = menu;
            this.show = true;
        },
        setItemValues(menuName, itemName, values) {
            if (typeof values == 'string') values = JSON.parse(values);
            var menu = this.menus[menuName];
            if (!menu) return;
            var item = this.getItemByName(itemName, menu.items);
            if (!item) return;
            Vue.set(item, 'values', values);
            menu.i = 0;
            menu.j = 0;
        },
        setItems(menuName, items) {
            if (typeof items == 'string') items = JSON.parse(items);
            var menu = this.menus[menuName];
            if (!menu) return;
            items.forEach((item) => {
                if (item.i == null) Vue.set(item, 'i', 0);
                if (item.j == null) Vue.set(item, 'j', 0);
                if (!item.values) Vue.set(item, 'values', [""]);
            });
            Vue.set(menu, 'items', items);
            menu.i = 0;
            menu.j = 0;
        },
        getItemByName(name, items) {
            for (var i = 0; i < items.length; i++) {
                var item = items[i];
                if (item.text == name) return item;
            }
            return null;
        },
        addItem(menuName, item, index) {
            var menu = this.menus[menuName];
            if (!menu) return;
            if (typeof item == 'string') item = JSON.parse(item);
            if (this.getItemByName(item.text, menu.items)) return;
            if (item.i == null) Vue.set(item, 'i', 0);
            if (item.j == null) Vue.set(item, 'j', 0);
            if (!item.values) Vue.set(item, 'values', [""]);

            menu.items.splice(index, 0, item);
            menu.i = 0;
            menu.j = 0;
        },
        deleteItem(menuName, itemName) {
            var menu = this.menus[menuName];
            if (!menu) return;
            var items = menu.items;
            for (var i = 0; i < items.length; i++) {
                var item = items[i];
                if (item.text == itemName) {
                    items.splice(i, 1);
                    i--;
                }
            }
        },
        setProp(menuName, propName, propValue) {
            var menu = this.menus[menuName];
            if (!menu) return;
            if (typeof propValue == 'string') propValue = JSON.parse(propValue);
            Vue.set(menu, propName, propValue);
            if (menu.update) menu.update();
        },
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
            var offset = 3.5;
            if (this.menu.items[this.menu.i].i == 0) return 0 - offset + '%';
            var values = this.menu.items[this.menu.i].values;
            var minValue = values[0];
            var maxValue = values[values.length - 1];
            var curValue = values[this.menu.items[this.menu.i].i];
            return (curValue - minValue) / (maxValue - minValue) * 100 - offset + '%';
        },
        headerStyles() {
            return {
                background: `url('img/selectMenu/headers/${this.menu.headerImg}')`,
                backgroundSize: `contain`,
                borderRadius: `1vh 1vh 0 0`,
                height: `10vh`,
            };
        },
        isEditing() {
            return this.show && this.menu && this.valuesType(this.menu.i) == 3;
        },
    },
    watch: {
        notification(val, oldVal) {
            clearTimeout(this.showNotifTimer);
            this.showNotifTimer = setTimeout(() => {
                this.notification = null;
            }, this.showNotifTime);

            if (val) this.loader = false;
        },
        'menu.i': function(val) {
            setTimeout(() => {
                if (this.valuesType(val) == 3) {
                    setCursor(true)
                    var itemText = this.menu.items[val].text;
                    if (this.$refs[itemText]) this.$refs[itemText].focus();
                } else setCursor(false);
            }, 100);
        },
        menu(val) {
            if (val.i == null) Vue.set(this.menu, 'i', 0);
            if (val.j == null) Vue.set(this.menu, 'j', 0);
            val.items.forEach((item) => {
                if (item.i == null) Vue.set(item, 'i', 0);
                if (item.j == null) Vue.set(item, 'j', 0);
                if (!item.values) Vue.set(item, 'values', [""]);
            });

            this.loader = false;
        },
        show(val) {
            if (val) busy.add("selectMenu", false, true);
            else busy.remove("selectMenu", true);
        },
        loader(val) {
            clearTimeout(this.loaderTimer);
            if (!val) return;
            this.loaderTimer = setTimeout(() => {
                this.loader = false;
            }, this.loaderMaxTime);
        }
    },
    mounted() {
        let self = this;
        window.addEventListener('keydown', function(e) {
            if (!self.menu) return;
            if (busy.includes(["inventory", "chat", "terminal", "phone"])) return;
            self.onKeyDown(e);
        });
        window.addEventListener('keyup', function(e) {
            if (!self.menu) return;
            if (busy.includes(["inventory", "chat", "terminal", "phone"])) return;
            self.onKeyUp(e);
        });
    }
});
