var bugTracker = new Vue({
    el: "#bugTracker",
    data: {
        // Показ интерфейса
        show: false,
        // Очки помощи
        score: 0,
        // Баги
        bugList: [],
        // Выбранный баг
        bugI: -1,
        // Форма создания бага
        form: {
            name: "",
            steps: [""],
            result: "",
            expectedResult: "",
        },
        // Макс. кол-во шагов бага
        stepsMax: 20,
    },
    computed: {
        currentBug() {
            if (this.bugI == -1) return null;

            return this.bugList[this.bugI];
        },
        fillSteps() {
            return this.form.steps.filter(x => x.length > 0);
        },
    },
    watch: {
        bugI(val) {
            if (val == -1) this.clearForm();
        },
        show(val) {
            mp.trigger("blur", val, 300);
            hud.keysShow = !val;
            if (val) {
                busy.add("bugTracker", true, true);
                prompt.showByName("bugTracker_exit");
            } else {
                busy.remove("bugTracker", true);
                prompt.hide();
            }
        },
    },
    methods: {
        initBugList(list) {
            if (typeof list == 'string') list = JSON.parse(list);
            this.bugList = list;
        },
        addBug(bug) {
            if (typeof bug == 'string') bug = JSON.parse(bug);
            this.bugList.push(bug);
        },
        onClickBug(index) {
            if (this.bugI == index) this.bugI = -1;
            else this.bugI = index;
        },
        onClickAddStep() {
            if (this.form.steps.length >= this.stepsMax) return;
            this.form.steps.push("");
        },
        onKeyDownStep(e, index) {
            var step = this.form.steps[index];
            if (e.keyCode == 8 && !step.length) this.form.steps.splice(index, 1);
            else if (e.keyCode == 13 && step.length) {
                if (this.form.steps.length >= this.stepsMax) return;
                this.form.steps.push("");
            }
        },
        onClickCreateBug() {
            if (!this.form.name.length) return this.notify(`Введите название`);
            if (!this.fillSteps.length) return this.notify(`Добавьте шаги воспроизведения`);
            if (!this.form.result.length) return this.notify(`Введите результат`);
            if (!this.form.expectedResult.length) return this.notify(`Введите ожидаемый результат`);

            var data = Object.assign({}, this.form);
            data.steps = this.fillSteps;
            this.clearForm();

            this.callRemote(`bugTracker.bug.create`, data);
        },
        getPlaceholder(index) {
            var list = ["Надеть бронежилет", "Изменить HP бронежилета", "Войти в магазин одежды",
                "Выйти из магазина одежды", "Залезть в авто", "Достать предмет", "Вызвать такси"
            ];
            index %= list.length;
            return list[index];
        },
        clearForm() {
            this.form.name = "";
            this.form.steps = [""];
            this.form.result = "";
            this.form.expectedResult = "";
        },
        notify(text) {
            notifications.error(text, `Помощь штату`);
        },
        callRemote(eventName, data) {
            if (typeof data == 'object') data = JSON.stringify(data);
            // console.log(`callRemote: ${eventName}`);
            // console.log(data)

            mp.trigger("callRemote", eventName, data);
        },
    },
    mounted() {
        window.addEventListener('keyup', (e) => {
            if (e.keyCode == 27 && this.show) this.show = !this.show;
        });
    },
});

// for tests
/*
bugTracker.initBugList([{
    name: "Баг с оружием",
    steps: [
        "Первый шаг такой",
        "Второй шак вот такой",
        "Ну а третий шаг в такой",
    ],
    result: "Получилось вот так вот неправильно",
    expectedResult: "Получилось всё верно",
    author: "Carter Slade",
    executor: "Swifty Swift",
    state: "в очереди",
    build: 1121,
    date: "27.12.20",
}]);
bugTracker.show = true;
*/
