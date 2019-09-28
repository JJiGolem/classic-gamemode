var changelist = new Vue({
    el: "#changelist",
    data: {
        // Показ на экране
        show: false,
        // Макс. длина строки в списке
        maxLength: 70,
        // Список обновлений
        list: [{
                build: 1200,
                date: "Пн, Сен 16, 2019",
                features: [
                    "Добавлен запрет на отправку в чат пустых сообщений. (Касается и команд /do, /me. /try)",
                    "Теперь после увольнения с работы таксиста удаляется соответствующее приложение с телефона.",
                    "Добавлен запрет на въезд в Los Santos Customs с пассажирами в транспорте.",
                ],
                fixed: [
                    "Исправлен баг с невозможностью продать дом, имея машину на парковке.",
                    "Исправлен баг с возможностью купить второе транспортное средство без дома.",
                    "Исправлен баг с невозможностью выехать из гаража после респавна личного автомобиля.",
                    "Исправлен баг с невозможностью выбрать количество литров на АЗС.",
                    "Исправлен баг с размытием экрана при нажатии на кнопку P.",
                ],
                improvements: [
                    "Теперь транспорт, купленный в автосалоне, не может быть сломан в течение двух дней.",
                    "Теперь при назначении лидера и прочих действиях, связанных с фракциями, в чат выводится название фракции, а не ID.",
                    "Сделано множество исправлений в работе голосового чата.",
                ],
                removed: [
                    "Отключены поломки для фракционного, рабочего и админского транспорта.",
                    "Убраны сообщения в чат при просмотре масок.",
                    "Из магазина масок удалены маски, не имеющие текстуры.",
                ],
            },
            {
                build: 1321,
                date: "Ср, Сен 18, 2019",
                features: [
                    'Настроены аттачи ящиков с БП и медикаментами.',
                    'Настроены аттачи урожая.',
                    'Добавлен килл-лист во время капта.',
                    'Теперь банды могут воровать боеприпасы со склада.',
                    'Незнакомый человек отмечается как "Незнакомец" в чате.',
                    'Добавлено время отдыха между каптами.',
                    'Добавлены блипы бандитов во время капта.',
                    'В HUD добавлено отображение номера сборки сервера.',
                    'Добавлена возможность включить/отключить отображение  ников на F6.',

                ],
                fixed: [
                    'Исправлен баг с поднятием предметов.',
                    'Исправлен баг с появлением курсора после закрытия меню.',
                    'Исправлены наборы женской одежды для Government.',
                    'Исправлен баг с понижением/повышением/увольнением.',
                    'Исправлена возможность прикрепления автомата на спину.',
                    'Исправлены баги с отображением килл-листа.',
                    'Исправлен баг с погрузкой боеприпасов в автомобиль.',
                    'Исправлен баг с типом калибра у дробовика.',
                    'Исправлен баг с зарядкой оружия по ПКМ.',
                    'Исправлен баг с продажей транспорта на авторынке.',

                ],
                improvements: [
                    'Теперь для надевания формы необходимо полностью раздеться.',
                    'Теперь меню закрывается после взятия формы со склада.',
                    'Улучшено быстродействие инвентаря.',
                    'Время ожидания медиков увеличено до трех минут.',
                    'В предложении теперь скрыто имя незнакомца.',
                    'Теперь лидер не может повысить до лидера.',
                    'Команда /pos теперь доступна с 1 уровня администрирования.',

                ],
                removed: [],
            },
            {
                build: 1456,
                date: "Сб, Сен 21, 2019",
                features: [
                    'Теперь при слете автомобилей удаляются ключи из инвентаря.',
                    'Добавлена возможность начать капт через клавишу L.',
                    'Для мафий добавлена возможность взять оружие/патроны.',
                    'Добавлены зоны бизваров.',
                    'Добавлена возможность начать бизвар.',
                    'Добавлены шкала и подсчет киллов для бизвара.',
                    'Добавлено оружие для мафий.',
                    'Добавлен показ влияния у банд и мафий.',
                    'Теперь мафия может поставлять боеприпасы как себе, так и бандитам.',
                    'Бандам и мафиям добавлен общак.',
                    'На сервер добавлена первая тестовая версия личного меню.',
                    'В меню теперь выводится организация, ранг, работа и статистика персонажа.',
                    'В меню выводится информация о доме и бизнесе.',
                    'В меню добавлена информация о скиллах работ.',
                    'В парикмахерские добавлена возможность просмотреть и выбрать прическу.',
                    'В парикмахерские добавлена возможность сменить растительность на лице.',
                    'В парикмахерские добавлен плавный поворот персонажа на A и D.',
                    'В парикмахерские добавлена возможность сменить цвет волос и бороды.',
                ],
                fixed: [
                    'Исправлен баг с остающимся блюром у планшета/инвентаря при двойном нажатии.',
                    'Исправлен баг с миганием килл-листа.',
                    'На ферме убран фарм урожая у багажника.',
                    'Исправлен баг с показом меню взаимодействия во время сбора урожая.',
                    'Исправлен баг с покупкой удочки.',
                    'Исправлен баг с возможностью начать рыбалку.',
                    'Исправлены некоторые баги в приложении для бизнеса.',
                ],
                improvements: [
                    'Врачи теперь могут возить медикаменты в "fbi2".',
                    'Добавлены подсказки после бизвара.',
                    'Бандам добавлена подсказка о скидке в наркопритоне.',
                    'Теперь можно начать захват бизнеса с помощью L.',
                    'Теперь на ферме повышается навык от пополнения пикапа урожаем.',
                    'Теперь работы на ферме доступны в зависимости от навыка.',
                    'Навык грузоперевозчика повышается от доставки зерна/урожая на ферму.',
                    'Теперь при покупке урожая можно указать его количество.',
                    'Теперь максимальное количество продуктов в грузовике зависит от навыка.',
                    'Теперь при продаже автомобиля на авторынке выводится уведомление с ценой его продажи.',
                    'Теперь починка/диагностика в автомастерской недоступны, если на складе нет ресурсов.',
                    'Теперь в автомастерской списываются ресурсы и добавляются деньги в кассу.',
                ],
                removed: [],
            },
            {
                build: 1471,
                date: "Вс, Сен 22, 2019",
                features: [
                    'Добавлена возможность отправить репорт.',
                    'Добавлен антифлуд на отправку репортов.',
                    'Добавлена возможность выдать варн.',
                    'Теперь предмет можно удалить с горячей клавиши.',
                    'Добавлено 5 новых парикмахерских.',
                    'Добавлена шапка в меню магазина масок.',
                    'Добавлена шапка в меню Los Santos Customs.',
                ],
                fixed: [
                    'Исправлен баг с сохранением отыгранных минут.',
                    'Исправлены баги голосового чата и телефона.',
                ],
                improvements: [
                    'Теперь в личном меню отображаются наличные.',
                    'Теперь у персонажа отображается верное количество варнов.',
                    'Теперь нельзя авторизоваться, если аккаунт в бане.',
                    'Теперь в меню можно пролистывать пункты, зажав клавишу.',
                    'Теперь в автомастерских тратятся запчасти и пополняется касса.',
                    'Теперь в АЗС тратится топливо и пополняется касса.',
                    'Теперь в магазине масок тратятся маски и пополняется касса.',
                    'Теперь в парикмахерских тратятся ресурсы и пополняется касса.',
                    'Каждая парикмахерская теперь имеет свою шапку в зависимости от типа.',
                    'Теперь во время примерки масок убираются очки и шляпы.',
                    'Во время просмотра причесок в парикмахерской теперь убираются шляпы, маски и очки.',
                    'Теперь в сообщении репорта выводится ID игрока.',
                    'Теперь в инвентаре выводится название рыбы.',
                    'Изменен внешний вид кнопок навигации по списку игроков.',
                    'Для мафий настроены цвета шкалы бизвара, килл-листа и блипов.',
                ],
                removed: [],
            },
            {
                build: 1536,
                date: "Пт, Сен 27, 2019",
                features: [
                    'В донат добавлена возможность конвертировать валюту, сменить никнейм, снять предупреждение и добавить новый слот.',
                    'Реализована генерация промокодов для игроков.',
                    'Добавлена возможность активировать реферальный промокод.',
                    'Теперь за выполнение условий промокода начисляется награда.',
                    'В личное меню добавлена возможность изменить место спавна.',
                    'В личное меню добавлен статус "Медиа".',
                    'В личное меню добавлена возможность сменить пароль, Email и подтвердить почту.',
                    'Добавлена шкала смерти.',
                    'Добавлено новое вооружение для FIB.',
                    'Реализована синхронизация анимаций. Добавлен функционал для тестирования анимациий.',
                    'Реализован функционал планшета для FIB.',
                    'Добавлено 14 супермаркетов по всей карте.',
                    'В супермаркет добавлена возможность купить телефон.',
                ],
                fixed: [
                    'Исправлен баг с бесконечной загрузкой при получении объявления в планшете Weazel News.',
                    'Исправлен баг с уведомлением в инвентаре.',
                    'Исправлен баг с причиной выдачи розыска.',
                    'Исправлен баг с размером водительского удостоверения.',
                    'Исправлен баг с размытием при нажатии на кнопку "Действия" в меню бизнеса.',
                    'Исправлен баг с поиском в списке игроков.',
                ],
                improvements: [
                    'Теперь для устройства на ферму нужны лицензии.',
                    'Теперь с фермы увольняет при устройстве/увольнении с других работ.',
                    'Добавлена подсказка об изменении скилла на работе.',
                    'В инвентарь добавлена надпись "Без карманов", если на вас нет одежды с карманами.',
                    'Теперь личное меню можно закрыть на ESC.',
                    'Теперь при получении варна увольняет из организации.',
                    'Добавлена проверка на валидность при смене ника.',
                    'Теперь рыбачить можно в любом месте рядом с водой.',
                    'Теперь супермаркеты имеют разные шапки в зависимости от типа.',
                ],
                removed: [],
            },
        ],
        // Текущее обновление на экране
        i: 0,
    },
    methods: {
        prettyText(text) {
            if (text.length > this.maxLength) return text.substring(0, this.maxLength) + "...";

            return text;
        },
    },
    mounted() {
        this.i = this.list.length - 1;
    },
});

// for tests
// changelist.show = true;
