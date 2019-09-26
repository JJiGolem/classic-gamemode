Vue.filter("playerMenuMoneySplit", (value, thisFilter) => {
    if (!thisFilter) return value;
    value = value + '';
    return value.replace(/(\d)(?=(\d{3})+(\D|$))/g, '$1 ') + " $";
});

function playerMenuMoneySplit(value) {
    value = value + '';
    return value.replace(/(\d)(?=(\d{3})+(\D|$))/g, '$1 ');
}

let convertWindowData = {
    coefficient: 123, // API: Коеффициент конвертации.
    acceptConvert(amount) {
        // TODO: Конвертация валюты; amount - СС для обмена.
        mp.trigger(`callRemote`, `donate.convert`, parseInt(amount));
        // playerMenu.coins -= amount;
    }
};

let changenameWindowData = {
    price: 120, // API: Стоимостть смены никнейма.
    acceptChange(firstname, lastname) {
        // TODO: Смена никнейма;
        var name = firstname + " " + lastname;
        mp.trigger(`callRemote`, `donate.nickname.set`, name);
        // playerMenu.coins -= 120;
    }
};

let warnWindowData = {
    amountWarns: 1, // API: Кол-во варнов.
    price: 120, // API: Стоимостть снятия варна.
    takeoffWarn() {
        // TODO: Снятие варна;
        mp.trigger(`callRemote`, `donate.warns.clear`);

        // warnWindowData.amountWarns--; //this не канает...
    }
};

let addslotWindowData = {
    amountSlots: 2, // API: Кол-во слотов.
    maxSlots: 5, // API: Максимальное кол-во слотов.
    price: 120, // API: Стоимостть слота.
    addSlot() {
        // TODO: Добавление слота;
        mp.trigger(`callRemote`, `donate.slots.add`);
        // addslotWindowData.amountSlots++;
    }
};

let settingsmainWindowData = {
    currentWindow: '0',
    microVolume: 20, // API: Громкость микрофона.
    spawnSettings: {
        spawnsPull: ["Улица", "Дом", "Организация"], // API: Варианты спавна.
        currentSpawn: 1, // API: Индекс варианта спавна.
    },
    saveChanges(microVolume, currentSpawn) {
        // TODO: Сохранение изменений;

        mp.trigger(`callRemote`, `settings.spawn.set`, currentSpawn);

        settingsmainWindowData.microVolume = microVolume;
        settingsmainWindowData.spawnSettings.currentSpawn = currentSpawn;
        console.log(microVolume, currentSpawn);
    }
}

let protectionWindowData = {
    email: "erf233423h4@324", // API: адрес почты.
    isConfirmed: 0, // API: Подверждена ли почта.
    passMessage: "изменён 4 дня назад", // API: Сообщение о последнем изменени пароля.
    maxWaiting: 15, // API: Время блока кнопки отмены.
    changeMail(mail) {
        // TODO: Сохранить новый почтовый адрес

        mp.trigger(`callRemote`, `settings.email.set`, mail);

        // protectionWindowData.email = mail;
        // protectionWindowData.isConfirmed = 0;
    },
    sendCode() {
        // TODO: Отправить код на почту
    },
    checkCode() {
        // TODO: Проверить код

        // Если код верный
        protectionWindowData.isConfirmed = true;
        console.log("чекнули");
        // Что иначе, я хз...
    },
    changePassword(oldPass, newPass) {
        // TODO: Сменить пароль
        var data = {
            oldPass: oldPass,
            newPass: newPass
        };
        mp.trigger(`callRemote`, `settings.password.set`, JSON.stringify(data));
        // console.log("Сменили пароль");
        // protectionWindowData.passMessage = "изменён сегодня";
    }
}

let settingsMenuData = {
    head: "Настройки",
    headImg: "img/playerMenu/list.svg",
    menu: [{
            head: "Общие настройки",
            img: playerMenuSvgPaths.settings,
            window: "player-menu-settings-main",
            windowData: settingsmainWindowData
        },
        {
            head: "Защита аккаунта",
            img: playerMenuSvgPaths.insurance,
            window: "player-menu-settings-protection",
            windowData: protectionWindowData
        },
    ],
    bottom: {
        head: "Сбросить пароль",
        img: playerMenuSvgPaths.refresh,
        handler() {
            playerMenu.showConfirmWindow(
                "Подтверждение действия",
                `Вы действительно хотите <br />
                сбросить пароль?
                `,
                () => {
                    // TODO: Сброс пароля
                    console.log("Сбросили пароль");
                },
            );
        }
    },
};

let donateMenuData = {
    head: "Донат",
    headImg: "img/playerMenu/settings.svg",
    menu: [{
            head: "Конвертация валюты",
            img: playerMenuSvgPaths.mailing,
            window: "player-menu-donate-convert",
            windowData: convertWindowData
        },
        {
            head: "Смена никнейма",
            img: playerMenuSvgPaths.idCard,
            window: "player-menu-donate-changename",
            windowData: changenameWindowData
        },
        {
            head: "Снятие варна",
            img: playerMenuSvgPaths.postcard,
            window: "player-menu-donate-warn",
            windowData: warnWindowData
        },
        {
            head: "Добавление слота",
            img: playerMenuSvgPaths.expansion,
            window: "player-menu-donate-addslot",
            windowData: addslotWindowData
        },
    ],
};

let referenceData = {
    code: "LDLSF3", // API: промокод.
    amountInvitees: 4, // API: Кол-во приглашённых.
    amountCompleted: 0, // API: Кол-во выполнивших.
}

let menuBar = [{
        head: "Персонаж",
        window: "player-menu-character",
        windowData: {}
    },
    {
        head: "Настройки",
        window: "player-menu-window-sidebar",
        windowData: settingsMenuData
    },
    {
        head: "Репорт",
        window: "player-menu-report",
        windowData: {}
    },
    {
        head: "Помощь",
        window: "player-menu-help",
        windowData: {}
    },
    {
        head: "Промокод",
        window: "player-menu-reference",
        windowData: referenceData
    },
    {
        head: "Донат",
        window: "player-menu-window-sidebar",
        windowData: donateMenuData
    },
];

let socialData = [{
        head: "Обычный житель",
        img: "./img/playerMenu/user.svg"
    },
    {
        head: "Администратор",
        img: "./img/playerMenu/admin.svg"
    },
    {
        head: "Госслужащий",
        img: "./img/playerMenu/capitol.svg"
    },
    {
        head: "Бандит",
        img: "./img/playerMenu/hat.svg"
    },
    {
        head: "Медиа",
        img: "./img/playerMenu/media.svg"
    },
];

let statistics = [
    // TODO: Заполнить структуру статистики
    {
        head: "Времени на сервере",
        value: "-"
    },
    {
        head: "Пол",
        value: "-"
    },
    {
        head: "Денег на руках",
        value: 0,
        color: "#0f0",
        moneyFilter: true
    },
    {
        head: "Организация",
        value: "-"
    },
    {
        head: "Должность",
        value: "-"
    },
    {
        head: "Работа",
        value: "-"
    },
    {
        head: "Ур. розыска",
        value: "-"
    },
];

let houseInfo = [{
        head: "Номер",
        value: "-",
    },
    {
        head: "Класс",
        value: "-",
    },
    {
        head: "Комнат",
        value: 0,
    },
    {
        head: "Вместительность гаража",
        value: 0,
    },
    {
        head: "Гос. стоимость",
        value: 0,
        color: "#0f0",
        moneyFilter: true
    },
];

let businessInfo = [{
        head: "Тип",
        value: "-"
    },
    {
        head: "Имя",
        value: "-",
    },
    {
        head: "Номер",
        value: 0,
    },
    {
        head: "Гос. стоимость",
        value: 0,
        color: "#0f0",
        moneyFilter: true
    },
];

let skills = [
    // {
    //     head: "Terminator",
    //     value: 20
    // },
    // {
    //     head: "Terminator1",
    //     value: 20
    // }
];

let helpMessages = [
    // TODO: Массив заполняется вопросами (которые в help)
    {
        question: "Вопрос?",
        answer: ""
    },
    {
        question: "Вопрос?",
        answer: "Ответ"
    },
    {
        question: "Вопрос?",
        answer: "Ответ"
    },
    {
        question: "Вопрос?",
        answer: "Ответ"
    },
    {
        question: "Вопрос?",
        answer: "Ответ Ответ Ответ Ответ Ответ Ответ Ответ Ответ Ответ Ответ Ответ Ответ Ответ Ответ Ответ Ответ Ответ Ответ Ответ Ответ Ответ Ответ Ответ Ответ Ответ Ответ Ответ Ответ Ответ Ответ Ответ Ответ Ответ Ответ Ответ Ответ Ответ Ответ Ответ Ответ Ответ Ответ Ответ Ответ Ответ Ответ Ответ Ответ Ответ Ответ Ответ Ответ Ответ Ответ Ответ Ответ Ответ Ответ Ответ Ответ Ответ"
    },
    {
        question: "Вопрос?",
        answer: "Ответ"
    },
    {
        question: "Вопрос?",
        answer: "Ответ"
    },
    {
        question: "Вопрос?",
        answer: "Ответ"
    },
    {
        question: "Вопрос?",
        answer: "Ответ"
    },
    {
        question: "Вопрос?",
        answer: "Ответ"
    },
    {
        question: "Вопрос?",
        answer: "Ответ"
    },
    {
        question: "Вопрос?",
        answer: "Ответ"
    },
    {
        question: "Вопрос?",
        answer: "Ответ"
    },
    {
        question: "Вопрос?",
        answer: "Ответ"
    },
    {
        question: "Вопрос?",
        answer: "Ответ"
    },
    {
        question: "Вопрос?",
        answer: "Ответ"
    },

];

var playerMenu = new Vue({
    el: "#player-menu",
    data: {
        show: false,
        enable: false,
        lastShowTime: 0,
        menuBar: menuBar,
        socialData: socialData,
        menuBarFocus: menuBar[0],
        name: "Jonathan Rockfall", // API: Имя игрока
        admin: 0,
        factionId: 0,
        media: 0,
        coins: 1000, // API: СС
        dateTimer: null,
        minutesTimer: null,
        time: '00:00',
        date: '00.00.0000',
        confirmation: null,
        codeMod: false,
        code: '',
    },
    computed: {
        blurMod() {
            return this.confirmation;
        },
        socialStatus() {
            // API: социальный статус //0-гражданский/1-админ/2-госс/3-бандит/4-медиа
            if (this.admin) return 1;
            if (this.media) return 4;
            if (!this.factionId) return 0;
            if (this.factionId < 8) return 2;

            return 3;
        },
    },
    methods: {
        onClickMenuBarItem(name) {
            this.menuBarFocus = name;
            settingsmainWindowData.currentWindow = name.window;
        },
        onClickExit() {
            this.show = false;
        },
        showConfirmWindow(head, description, handler, leftWord, rightWord) {
            this.confirmation = {
                head: head,
                description: description,
                leftWord: (leftWord) ? leftWord : 'Принять',
                rightWord: (rightWord) ? rightWord : 'Отказаться',
                acceptHandler: handler,
            }
        },
        enterCode() {
            this.codeMod = true;
            playerMenu.showConfirmWindow(
                "Ввод промокода",
                `Промокод - краткий код, созданный админстрацией для<br /> поощрения игроков<br />
                различными бонусами и игровой валютой
                `,
                this.sendCode,
                "Подтвердить",
                "Назад",
            );
        },
        sendCode() {
            // TODO: Отправка промокода .this.code
            // console.log(this.code);
            mp.trigger(`callRemote`, `promocodes.activate`, this.code);

            this.codeMod = false; //Оставить!
        },
        init(data) {
            if (typeof data == 'string') data = JSON.parse(data);

            this.name = data.playerName;
            this.coins = data.donate;
            this.admin = data.admin;
            this.factionId = data.factionId;

            this.setBiz(data.biz);
            this.setHouse(data.house);
            this.setStatistics(data);
            this.setDonatePrice(data);
            this.setSlots(data.slots);
            this.setPromocode(data.promocode);
            this.setInvited(data.invited);
            this.setCompleted(data.completed);
            this.setMedia(data.media);
            this.setSettings(data.settings);
            this.setEmail(data.email, data.confirmEmail);

            addslotWindowData.maxSlots = data.slotsMax;
        },
        setBiz(biz) {
            if (typeof biz == 'string') biz = JSON.parse(biz);
            if (biz) {
                businessInfo = [{
                        head: "Тип",
                        value: biz.type
                    },
                    {
                        head: "Имя",
                        value: biz.name,
                    },
                    {
                        head: "Номер",
                        value: biz.id,
                    },
                    {
                        head: "Гос. стоимость",
                        value: biz.price,
                        color: "#0f0",
                        moneyFilter: true
                    }
                ];
            } else {
                businessInfo = [];
            }
        },
        setHouse(house) {
            if (typeof house == 'string') house = JSON.parse(house);
            if (house) {
                houseInfo = [{
                        head: "Номер",
                        value: house.id,
                    },
                    {
                        head: "Класс",
                        value: house.class,
                    },
                    {
                        head: "Комнат",
                        value: house.rooms,
                    },
                    {
                        head: "Вместительность гаража",
                        value: house.carPlaces,
                    },
                    {
                        head: "Гос. стоимость",
                        value: house.price,
                        color: "#0f0",
                        moneyFilter: true
                    },
                ];
            } else {
                houseInfo = [];
            }
        },
        setStatistics(stats) {
            if (typeof stats == 'string') stats = JSON.parse(stats);
            statistics[0].value = `${stats.minutes} мин`;
            statistics[1].value = ["Мужской", "Женский"][stats.gender];
            statistics[2].value = stats.cash;
            statistics[3].value = stats.factionName || "-";
            statistics[4].value = stats.factionRank || "-";
            statistics[5].value = stats.jobName || "-";
            statistics[6].value = `${stats.wanted} зв.`;

            clearInterval(this.minutesTimer);
            this.minutesTimer = setInterval(() => {
                var minutes = parseInt(statistics[0].value) + 1;
                statistics[0].value = `${minutes} мин`;
            }, 60000);
        },
        setDonatePrice(data) {
            if (typeof data == 'string') data = JSON.parse(data);

            convertWindowData.coefficient = data.convertCash;
            changenameWindowData.price = data.nicknamePrice;
            warnWindowData.price = data.clearWarnPrice;
            warnWindowData.amountWarns = data.warns;
            addslotWindowData.price = data.slotPrice;
        },
        setFaction(data) {
            if (typeof data == 'string') data = JSON.parse(data);

            this.factionId = data.factionId;
            statistics[3].value = data.factionName || "-";
            statistics[4].value = data.factionRank || "-";
        },
        setFactionRank(data) {
            if (typeof data == 'string') data = JSON.parse(data);

            statistics[4].value = data.factionRank || "-";
        },
        setJob(data) {
            if (typeof data == 'string') data = JSON.parse(data);

            statistics[5].value = data.jobName || "-";
        },
        setSkills(data) {
            if (typeof data == 'string') data = JSON.parse(data);

            data.forEach(skill => {
                skills.push({
                    head: skill.name,
                    value: skill.exp,
                    jobId: skill.jobId,
                });
            });

            this.enable = true;
        },
        setSkill(data) {
            if (typeof data == 'string') data = JSON.parse(data);

            var skill = skills.find(x => x.jobId == data.jobId);
            var oldExp = skill.value;
            skill.value = data.exp;

            if (parseInt(skill.value) > parseInt(oldExp)) prompt.show(`Навык '${skill.head}' повысился до ${skill.value}%`);
            else prompt.show(`Навык '${skill.head}' понизился до ${skill.value}%`);
        },
        setCash(cash) {
            statistics[2].value = cash;
        },
        setDonate(donate) {
            this.coins = donate;
        },
        setWarns(warns) {
            warnWindowData.amountWarns = warns;
        },
        setSlots(slots) {
            addslotWindowData.amountSlots = slots;
        },
        setPromocode(code) {
            referenceData.code = code;
        },
        setInvited(val) {
            referenceData.amountInvitees = val;
        },
        setCompleted(val) {
            referenceData.amountCompleted = val;
        },
        setMedia(val) {
            this.media = val;
        },
        setSettings(settings) {
            settingsmainWindowData.spawnSettings.currentSpawn = settings.spawn;
        },
        setEmail(email, confirm = 0) {
            protectionWindowData.email = email;
            protectionWindowData.isConfirmed = confirm;
        },
    },
    watch: {
        show(val) {
            setCursor(val);
            mp.trigger("blur", val, 300);
            hud.show = !val;
            if (val) busy.add("playerMenu", true);
            else busy.remove("playerMenu", true);

            this.lastShowTime = Date.now();
            if (!val && this.dateTimer) {
                clearInterval(this.dateTimer);
                return;
            }

            function setTime() {
                let date = new Date();
                let hours = date.getHours();
                let minutes = date.getMinutes();
                let day = date.getDate();
                let month = date.getMonth() + 1;
                let year = date.getUTCFullYear();

                if (hours < 10) hours = "0" + hours;
                if (minutes < 10) minutes = "0" + minutes;
                if (day < 10) day = "0" + day;
                if (month < 10) month = "0" + month;
                playerMenu.time = `${hours}:${minutes}`;
                playerMenu.date = `${day}.${month}.${year}`;
            };
            setTime();
            this.dateTimer = setInterval(setTime, 60000);
        },
        codeMod(val) {
            if (val) this.code = '';
        }
    },
    filters: {
        test(val) {
            return "tes";
        }
    },
    mounted() {
        window.addEventListener('keyup', (e) => {
            if (busy.includes(["chat", "terminal", "interaction", "mapCase", "phone", "inventory"])) return;
            if (Date.now() - this.lastShowTime < 500) return;
            if (!this.enable) return;
            if (e.keyCode == 77) this.show = !this.show;
            if (e.keyCode == 27 && this.show) this.show = false;
        });
    },
});

Vue.component('player-menu-character', {
    template: '#player-menu-character',
    data: () => ({
        statistics: statistics,
        houseInfo: houseInfo,
        businessInfo: businessInfo,
        skills: skills,

        count: 0,
    }),
    computed: {
        skillsList() {
            let newList = [];
            for (let i = 0; i < this.skills.length; i += 2) {
                newList.push([this.skills[i], this.skills[i + 1]]);
            }
            return newList;
        }
    },
    methods: {
        onClickArrow(isDown) {
            if (!isDown && this.count == 0) return;
            if (isDown && this.count > this.skillsList.length - 4) return;
            (isDown) ? this.count++: this.count--;
        }
    }
});

Vue.component('player-menu-settings', {
    template: '#player-menu-settings',
});

Vue.component('player-menu-report', {
    template: '#player-menu-report',
    data: () => ({
        maxlength: 120,
        message: "",
        showHint: false,
        waitTime: 60 * 1000,
        lastSentTime: 0,
    }),
    computed: {
        chars() {
            return this.maxlength - this.message.length;
        },
    },
    methods: {
        send() {
            if (!this.message.length) return;
            var diff = Date.now() - this.lastSentTime;
            if (diff < this.waitTime) return notifications.push('error', `Ожидайте ${parseInt((this.waitTime - diff) / 1000)} сек.`);
            mp.trigger(`callRemote`, `admin.report`, this.message);
            this.lastSentTime = Date.now();

            // Что ниже, оставить!
            this.message = "";
            this.showHint = true;
            setTimeout(() => {
                this.showHint = false;
            }, 5000)
        },
    }
});

Vue.component('player-menu-help', {
    template: "#player-menu-help",
    data: () => ({
        maxlength: 120,
        message: "",
        messages: helpMessages,
        currentAnswer: null,
    }),
    computed: {
        searchResult() {
            // TODO: Более хитрая сортировка, если надо.
            return this.messages.filter(record => record.question.toLowerCase().includes(this.message.toLowerCase()))
        },
    },
    methods: {
        showAnswer(index) {
            if (!this.messages[index].answer) return;
            this.currentAnswer = (index == this.currentAnswer) ? null : index;
        },
        send() {
            if (!this.message.length) return;

            helpMessages.unshift({
                question: this.message,
                answer: ""
            });
            // TODO: Отправка на сервер this.message

            this.message = "";
        },
    },
});

Vue.component('player-menu-reference', {
    template: "#player-menu-reference",
    props: {
        code: String,
        amountInvitees: Number,
        amountCompleted: Number,
    },
    data: () => ({
        /*code: referenceData.code,
        amountInvitees: referenceData.amountInvitees,
        amountCompleted: referenceData.amountCompleted,*/
    }),
});

Vue.component('player-menu-window-sidebar', {
    template: "#player-menu-window-sidebar",
    props: {
        head: String,
        headImg: String,
        menu: Array,
        bottom: Object,
        windowData: Object,
    },
    data: () => ({
        currentWindow: "test",
        menuFocus: null,
    }),
    computed: {
        dataForWindow() {
            return {
                ...this.menuFocus.windowData,
                coins: playerMenu.coins,
            }
        }
    },
    methods: {
        onClickMenuItem(item) {
            this.menuFocus = item;
            settingsmainWindowData.currentWindow = item.window;
        },
    },
    watch: {
        head(val) {
            this.menuFocus = this.menu[0];
        }
    },
    mounted() {
        this.menuFocus = this.menu[0];
    }
});

Vue.component('player-menu-donate-convert', {
    template: "#player-menu-donate-convert",
    props: {
        coefficient: Number,
        acceptConvert: Function,
    },
    data: () => ({
        price: '',
    }),
    computed: {
        virtualCoins() {
            return this.price * this.coefficient;
        },
    },
    methods: {
        inputCheck(event) {
            let regex = new RegExp("[0-9]")
            if (!regex.test(event.key))
                event.preventDefault();
            if (this.price + event.key > playerMenu.coins) {
                this.price = playerMenu.coins;
                event.preventDefault();
            }
        },
        convert() {
            if (!this.price) return;
            playerMenu.showConfirmWindow(
                "Подтверждение действия",
                `Вы действительно хотите ковертировать <br />
                <span style="color: #FFDF29">${playerMenuMoneySplit(this.price)} CC</span> в
                <span style="color: #34DE3B">${playerMenuMoneySplit(this.virtualCoins)} $</span>
                `,
                this.acConvert,
            );

        },
        acConvert() {
            this.acceptConvert(this.price);
            this.price = '';
        },
    }
});

Vue.component('player-menu-donate-changename', {
    template: "#player-menu-donate-changename",
    props: {
        price: Number,
        acceptChange: Function,
        coins: Number,
    },
    data: () => ({
        firstname: '',
        lastname: '',
    }),
    methods: {
        inputCheck(event) {
            let regex = new RegExp("[a-zA-Z]")
            if (!regex.test(event.key))
                event.preventDefault();
        },
        changename() {
            if (!this.firstname || !this.lastname) return;
            if (this.price > this.coins) return;

            playerMenu.showConfirmWindow(
                "Подтверждение действия",
                `Вы действительно хотите <br />
                сменить имя и фамилию?
                `,
                this.acChange,
            );

        },
        acChange() {
            this.acceptChange(this.firstname, this.lastname);
            this.firstname = '';
            this.lastname = '';
        }
    }
});

Vue.component('player-menu-donate-warn', {
    template: "#player-menu-donate-warn",
    props: {
        amountWarns: Number,
        price: Number,
        takeoffWarn: Function,
        coins: Number,
    },
    data: () => ({}),
    computed: {

    },
    methods: {
        localtakeoffWarn() {
            if (!this.amountWarns) return;
            if (this.price > this.coins) return;

            playerMenu.showConfirmWindow(
                "Подтверждение действия",
                `Вы действительно хотите <br />
                снять варн?
                `,
                this.takeoffWarn,
            );
        }
    }
});

Vue.component('player-menu-donate-addslot', {
    template: "#player-menu-donate-addslot",
    props: {
        amountSlots: Number,
        maxSlots: Number,
        price: Number,
        addSlot: Function,
        coins: Number,
    },
    data: () => ({}),
    computed: {

    },
    methods: {
        localaddSlot() {
            if (this.amountSlots == this.maxSlots) return;
            if (this.price > this.coins) return;

            playerMenu.showConfirmWindow(
                "Подтверждение действия",
                `Вы действительно хотите <br />
                добавить слот?
                `,
                this.addSlot,
            );
        }
    }
});

Vue.component('player-menu-settings-main', {
    template: "#player-menu-settings-main",
    props: {
        currentWindow: String,
        microVolume: Number,
        spawnSettings: Object,
        saveChanges: Function,
    },
    data: () => ({
        localMicroVolume: 0,
        localCurrentSpawn: 0,
    }),
    computed: {
        watcher() {
            this.localMicroVolume = this.microVolume;
            this.localCurrentSpawn = this.spawnSettings.currentSpawn;
        },
        noChanges() {
            return this.localMicroVolume == this.microVolume &&
                this.localCurrentSpawn == this.spawnSettings.currentSpawn;
        }
    },
    methods: {
        save() {
            if (this.noChanges) return;

            this.saveChanges(parseInt(this.localMicroVolume), this.localCurrentSpawn);
        },
        right() {
            let val = this.localCurrentSpawn;
            let len = this.spawnSettings.spawnsPull.length;

            this.localCurrentSpawn = (val == len - 1) ? 0 : ++val;
        },
        left() {
            let val = this.localCurrentSpawn;
            let len = this.spawnSettings.spawnsPull.length;

            this.localCurrentSpawn = (val == 0) ? len - 1 : --val;
        }
    }
});

Vue.component('player-menu-settings-protection', {
    template: "#player-menu-settings-protection",
    props: {
        email: String,
        isConfirmed: Boolean,
        passMessage: String,
        maxWaiting: Number,
        changeMail: Function,
        changePassword: Function,
        sendCode: Function,
        checkCode: Function,
    },
    data: () => ({
        newEmail: '',
        code: '',
        changeMailMod: false,
        changePassMod: false,
        codeMod: false,
        oldPass: '',
        newPass: '',
        newPass2: '',
        waiting: '',

        seconds: 0,

        //maxWaiting: 10,
        intervalId: null,
    }),
    computed: {
        emailIsValid() {
            var pattern = /^([a-z0-9_\.-])+@[a-z0-9-]+\.([a-z]{2,4}\.)?[a-z]{2,4}$/i;

            return pattern.test(this.newEmail)
        },
        passIsValid() {
            if (!this.oldPass || !this.newPass || !this.newPass2) return false;
            if (this.newPass != this.newPass2) return false;

            return true;
        }
    },
    methods: {
        saveMail() {
            if (!this.emailIsValid)
                return;

            playerMenu.showConfirmWindow(
                "Подтверждение действия",
                `Вы действительно хотите <br />
                сменить адрес почты?
                `,
                this.acSaveMail,
            );
        },
        acSaveMail() {
            this.changeMail(this.newEmail);

            this.newEmail = "";
            this.changeMailMod = false;
        },
        confCode() {
            if (!this.code)
                return;

            this.checkCode()

            this.code = '';
        },
        savePass() {
            if (!this.passIsValid)
                return;
            /*if (!this.oldPass || !this.newPass || !this.newPass2) return;
            if (this.newPass != this.newPass2) return;*/
            playerMenu.showConfirmWindow(
                "Подтверждение действия",
                `Вы действительно хотите <br />
                сменить пароль?
                `,
                this.changePass,
            );
            this.changePassMod = false;
        },
        localsendCode() {
            this.codeMod = true;
            this.waiting = `(${this.maxWaiting})`;
            this.seconds = 0;
            this.intervalId = setInterval(() => {
                this.waiting = `(${this.maxWaiting - ++this.seconds})`;

                if (this.seconds > this.maxWaiting) {
                    this.waiting = '';
                    clearInterval(this.intervalId);
                    this.intervalId = null;
                }

            }, 1000);

            this.sendCode();
        },
        changePass() {
            this.changePassword(this.oldPass, this.newPass);
            this.passCancel();
        },
        cancel() {
            if (this.intervalId)
                return;
            this.changeMailMod = false;
            this.codeMod = false;
            this.code = '';
            this.newEmail = '';
        },
        passCancel() {
            this.changePassMod = false;
            this.oldPass = '';
            this.newPass = '';
            this.newPass2 = '';
        },
        inputCheck(event) {
            let regex = new RegExp("[0-9]")
            if (!regex.test(event.key))
                event.preventDefault();
        },
    },
    watch: {
        isConfirmed(val) {
            if (val) this.codeMod = false;
            this.code = '';

            if (this.intervalId)
                clearInterval(this.intervalId);
            this.intervalId = null;
            this.waiting = '';
        }
    }
});

// playerMenu.show = true;

//playerMenu.showConfirmWindow("Head ex", "description <br /> description")
