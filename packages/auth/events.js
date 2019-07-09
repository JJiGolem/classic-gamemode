"use strict";
/// Модуль авторизации персоонажа
let auth = require("./index.js");
let utils = call("utils");

module.exports = {
    'auth.login': async (player, data) => {
        //  data = '{"loginOrEmail":"Carter", "password":"123123"}';
        data = JSON.parse(data);

        if (!data.loginOrEmail || data.loginOrEmail.length == 0) {
            /// Заполните поле логина или почты!
            return player.call('auth.login.result', [0]);
        }

        let regLogin = /^[0-9a-z_\.-]{5,20}$/i;
        let regEmail = /^[0-9a-z-_\.]+\@[0-9a-z-_]{1,}\.[a-z]{1,}$/i;
        if (!regLogin.test(data.loginOrEmail) && !regEmail.test(data.loginOrEmail)) {
            /// Некорректное значение логина или почты!
            return player.call('auth.login.result', [1]);
        }

        if (data.password.length < 6 || data.password.length > 20) {
            /// Неверный пароль!
            return player.call('auth.login.result', [2]);
        }

        // let ban = await db.Models.IpBan.findOne({
        //     where: {
        //         ip: player.ip
        //     }
        // });
        // if (ban) {
        //     /// Игрок забанен
        //     player.call('auth.login.result', [3]);
        //     player.kick();
        //     return;
        // }

        let account = await db.Models.Account.findOne({
            where: {
                [Op.or]: {
                    login: data.loginOrEmail,
                    [Op.and]: {
                        email: data.loginOrEmail,
                        confirmEmail: 1
                    }
                },
            },
        });
        
        if (!account) {
            /// Неверный логин или пароль
            return player.call('auth.login.result', [4]);
        }
        if (!auth.comparePassword( data.password, account.password)) {
            /// Неверный логин или пароль
            return player.call('auth.login.result', [4]);
        }
        if (account.socialClub != player.socialClub)
            /// Неверный Social Club 
            return player.call('auth.login.result', [5]);

        if (auth.accountIsOnline(account.id))
            /// Аккаунт уже авторизован
            return player.call('auth.login.result', [6]);

        player.account = account;
        /// Вход в аккаунт выполнен успешно
        player.call('auth.login.result', [7]);
        console.log(player);
    },
    'auth.register': async (player, data) => {
        // data = '{"login":"Carter","email":"test@mail.ru","password":"123123","emailCode":-1}';
        data = JSON.parse(data);

        /// Вы уже зарегистрировали учетную запись!
        if (player.accountRegistrated) return player.call('auth.register.result', [0]);
        /// Логин должен состоять из 5-20 символов!
        if (!data.login || data.login.length < 5 || data.login.length > 20) return player.call('auth.register.result', [1]);
        /// Пароль должен состоять из 6-20 символов!
        if (!data.password || data.password.length < 6 || data.password.length > 20) return player.call('auth.register.result', [2]);
        /// Email должен быть менее 40 символов!
        if (!data.email || data.email.length > 40) return player.call('auth.register.result', [3]);

        let r = /^[0-9a-z_\.-]{5,20}$/i;
        /// Некорректный логин!
        if (!r.test(data.login)) return player.call('auth.register.result', [4]);
        /// Некорректный email!
        r = /^[0-9a-z-_\.]+\@[0-9a-z-_]{1,}\.[a-z]{1,}$/i;
        if (!r.test(data.email)) return player.call('auth.register.result', [5]);

        let account = await db.Models.Account.findOne({
            attributes: ["login", "email", "socialClub", "confirmEmail"],
            where: {
                [Op.or]: {
                    login: data.login,
                    socialClub: player.socialClub,
                    [Op.and]: {
                        email: data.email,
                        confirmEmail: 0
                    }
                }
            }
        });

        if (account) {
            if (account.login.toUpperCase() == data.login.toUpperCase()) {
                /// Логин занят
                return player.call('auth.register.result', [6]);
            } else if (account.email.toUpperCase() == data.email.toUpperCase() && account.confirmEmail) {
                /// Email занят
                return player.call('auth.register.result', [7]);
            } else if (account.socialClub == player.socialClub) {
                /// Аккаунт с Social Club ${player.socialClub} уже зарегистрирован
                return player.call('auth.register.result', [8, player.socialClub]);
            }
        } else {
            var newAccount = await db.Models.Account.create({
                login: data.login,
                socialClub: player.socialClub,
                password: auth.hashPassword(data.password),
                email: data.email,
                regIp: player.ip,
                lastIp: player.ip,
                confirmEmail: 0,
            });

            player.account = newAccount;
            player.accountRegistrated = true;
            /// Аккаунт зарегестрирован успешно
            player.call('auth.register.result', [9]);
            console.log(player);
        }
    },
    "auth.email.confirm": (player) => {
        /// На данный момент подтвердить почту невозможно
        if (utils == null) return player.call('auth.email.confirm.result', [2]);
        let code = mp.randomInteger(100000, 999999);
        utils.sendMail(data.email, `Подтверждение электронной почты`, `Код подтверждения: <b>${code}</b>`);
        auth.setEmailCode(player.account.email, code);
    },
    "auth.email.confirm.code": (player, code) => {
        if (code && auth.getEmailCode(player.account.email) == code) {
            player.account.confirmEmail = 1;
            db.Models.Account.update({
                confirmEmail: 1,
            }, {
                where: {
                    login: player.account.login
                }
            });
            /// Подтверждение почты прошло успешно
            player.call('auth.email.confirm.result', [1]);
        }
        else {
            /// Код подтверждения неверный
            player.call('auth.email.confirm.result', [0]);
        }
    }
};