var auth = new Vue({
    el: "#auth",
    data: {
        show: false,
        loaderShow: true,
        loginOrEmail: "admin",
        password: "123123",
        password2: "",
        login: "",
        email: "",
        code: "",
        prompt: "",
        form: 0,
        promptShowTime: 10000,
        loginMessages: ["Заполните поле логина или почты!",
            "Некорректное значение логина или почты!",
            "Неверный пароль!",
            "todo",
            "Неверный логин или пароль!",
            "Неверный Social Club!",
            "Аккаунт уже авторизован!",
            "Вход в аккаунт выполнен успешно"
        ],
        registerMessages: ["Вы уже зарегистрировали учетную запись!",
            "Логин должен состоять из 5-20 символов!",
            "Пароль должен состоять из 6-20 символов!",
            "Email должен быть менее 40 символов!",
            "Некорректный логин!",
            "Некорректный email!",
            "Логин занят!",
            "Email занят!",
            "Аккаунт с вашим Social Club уже зарегистрирован!",
            "Аккаунт зарегистрирован успешно"
        ],
        emailConfirmMessages: ["Код подтверждения неверный!",
            "Подтверждение почты прошло успешно",
            "На данный момент подтвердить почту невозможно"],
    },
    methods: {
        authAccountHandler() {
            this.prompt = "";
            if (!this.loginOrEmail) {
                this.prompt = "Введите логин или email";
                return;
            }
            var regLogin = /^[0-9a-z_\.-]{5,20}$/i;
            var regEmail = /^[0-9a-z-_\.]+\@[0-9a-z-_]{1,}\.[a-z]{1,}$/i;
            if (!regLogin.test(this.loginOrEmail) && !regEmail.test(this.loginOrEmail)) {
                this.prompt = "Некорректное значение";
                return;
            }

            if (this.password.length < 6 || this.password.length > 20) {
                this.prompt = "Пароль должен содержать от 6 до 20 символов";
                return;
            }

            mp.trigger("auth.login", JSON.stringify({
                loginOrEmail: this.loginOrEmail,
                password: this.password
            }));
            loader.show = true;
        },
        regAccountHandler(emailCode) {
            if (!this.login) {
                this.prompt = "Введите логин";
                return;
            }
            if (!this.email) {
                this.prompt = "Введите Email";
                return;
            }
            if (!this.password.length) {
                this.prompt = "Введите пароль";
                return;
            }

            if (!this.password2.length) {
                this.prompt = "Повторите пароль";
                return;
            }

            if (this.login.length < 5 || this.login.length > 20) {
                this.prompt = "Логин должен содержать от 5 до 20 символов";
                return;
            }
            if (this.email.length > 40) {
                this.prompt = "Email должен быть менее 40 символов";
                return;
            }
            var r = /^[0-9a-z_\.-]{5,20}$/i;
            if (!r.test(this.login)) {
                this.prompt = "Разрешенные символы: буквы латинского алфавита, цифры, дефис или знак подчеркивания";
                return;
            }

            if (this.password.length < 6 || this.password.length > 20) {
                this.prompt = "Пароль должен содержать от 6 до 20 символов";
                return;
            }

            var r = /^[0-9a-z-_\.]+\@[0-9a-z-_]{1,}\.[a-z]{1,}$/i;
            if (!r.test(this.email)) {
                this.prompt = "Некорректный email";
                return;
            }
            if (this.password2 != this.password) {
                this.prompt = "Пароли не совпадают";
                return;
            }

            mp.trigger("auth.register", JSON.stringify({
                login: this.login,
                email: this.email,
                password: this.password,
                emailCode: emailCode
            }));
            loader.show = true;
        },
        recoveryAccountHandler() {
            if (!this.loginOrEmail) {
                this.prompt = "Введите логин или Email";
                return;
            }
            var regLogin = /^[0-9a-z_\.-]{5,20}$/i;
            var regEmail = /^[0-9a-z-_\.]+\@[0-9a-z-_]{1,}\.[a-z]{1,}$/i;
            if (!regLogin.test(this.loginOrEmail) && !regEmail.test(this.loginOrEmail)) {
                this.prompt = "Некорректное значение";
                return;
            }

            // mp.trigger("recoveryAccount", loginOrEmail);
            // TODO: call event
        },
        showLoginResult(code) {
            if (!this.loginMessages[code]) return;
            this.prompt = this.loginMessages[code];
            loader.show = false;
        },
        showRegisterResult(code) {
            if (!this.registerMessages[code]) return;
            this.prompt = this.registerMessages[code];
            loader.show = false;
        },
        showEmailConfirmResult(code) {
            if (!this.emailConfirmMessages[code]) return;
            this.prompt = this.emailConfirmMessages[code];
            loader.show = false;
        },
    },
    computed: {
        header() {
            var headers = ["Войти в аккаунт", "Создание аккаунта", "Восстановление аккаунта", "Подтверждение почты"];
            return headers[this.form];
        }
    },
    watch: {
        prompt(val, oldVal) {
            if (oldVal || !val) return;

            var self = this;
            setTimeout(function() {
                self.prompt = "";
            }, self.promptShowTime);
        },
    }
});
