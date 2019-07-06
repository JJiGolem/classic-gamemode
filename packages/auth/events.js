"use strict";
/// Модуль авторизации персоонажа
let auth = require("./index.js");

mp.emailCodes = new Map();
module.exports = {
    "regAccount": async (player, data) => {
        data = JSON.parse(data);

        if (player.accountRegistrated) return player.utils.error(`Вы уже зарегистрировали учетную запись!`);
        if (!data.login || data.login.length < 5 || data.login.length > 20) return player.utils.error(`Логин должен состоять из 5-20 символов!`);
        if (!data.password || data.password.length < 6 || data.password.length > 20) return player.utils.error(`Пароль должен состоять из 6-20 символов!`);
        if (!data.email || data.email.length > 40) return player.utils.error(`Email должен быть менее 40 символов!`);

        var r = /^[0-9a-z_\.-]{5,20}$/i;
        if (!r.test(data.login)) return player.utils.error(`Некорректный логин!`);

        var r = /^[0-9a-z-_\.]+\@[0-9a-z-_]{1,}\.[a-z]{1,}$/i;
        if (!r.test(data.email)) return player.utils.error("Некорректный email!");

        if (data.emailCode && data.emailCode != -1 && mp.emailCodes.get(data.email) != data.emailCode) {
            return player.call('showInputPrompt', ["#enterAccount .confirmEmail .code", "Неверный код подтверждения Email!"]);
        }
        var confirmEmail = (data.emailCode && data.emailCode != -1) ? 1 : 0;

        const account = await DB.Models.Account.findOne({
            attributes: ["login", "email", "socialClub", "confirmEmail"],
            where: {
                [Op.or]: {
                    login: data.login,
                    socialClub: player.socialClub,
                    [Op.and]: {
                        email: data.email,
                        confirmEmail: 1
                    }
                }
            }
        });

        if (account) {
            if (account.login.toUpperCase() == data.login.toUpperCase()) {
                return player.call('showInputPrompt', [".regAccount .login", "Логин занят"]);
            } else if (account.email.toUpperCase() == data.email.toUpperCase() && account.confirmEmail) {
                return player.call('showInputPrompt', [".regAccount .email", "Email занят"]);
            } else if (account.socialClub == player.socialClub) {
                return player.call('showInputPrompt', [".regAccount .login", `Аккаунт с Social Club ${player.socialClub} уже зарегистрирован`]);
            }
        } else {
            if (data.emailCode == -1) {
                var code = mp.randomInteger(100000, 999999);
                call("utils").sendMail(data.email, `Подтверждение электронной почты`, `Код подтверждения: <b>${code}</b>`);
                mp.emailCodes.set(data.email, code);
                return player.call("showConfirmCodeModal");
            }

            var newAccount = await DB.Models.Account.create({
                login: data.login,
                socialClub: player.socialClub,
                password: md5(data.password),
                email: data.email,
                regIp: player.ip,
                lastIp: player.ip,
                confirmEmail: confirmEmail,
            });

            player.accountRegistrated = true;
            player.call("regAccountSuccess");

            if (data.emailCode && data.emailCode != -1) player.utils.success(`Email подтвержден!`);
        }
    },
    "authAccount": async (player, loginOrEmail, password) => {
        if (!loginOrEmail || loginOrEmail.length == 0) {
            return player.call('showInputPrompt', [".authAccount .loginOrEmail", "Заполните поле!"]);
        }
        var regLogin = /^[0-9a-z_\.-]{5,20}$/i;
        var regEmail = /^[0-9a-z-_\.]+\@[0-9a-z-_]{1,}\.[a-z]{1,}$/i;
        if (!regLogin.test(loginOrEmail) && !regEmail.test(loginOrEmail)) {
            return player.call('showInputPrompt', [".authAccount .loginOrEmail", "Некорректное значение!"]);
        }

        if (password.length < 6 || password.length > 20) {
            return player.call('showInputPrompt', [".authAccount .password", "Неверный пароль!", 13]);
        }

        var ban = await DB.Models.IpBan.findOne({
            where: {
                ip: player.ip
            }
        });

        if (ban) {
            return player.call('showInputPrompt', [".authAccount .loginOrEmail", "Аккаунт заблокирован"]);
            player.kick();
            return;
        }

        var account = await DB.Models.Account.findOne({
            where: {
                [Op.or]: {
                    login: loginOrEmail,
                    [Op.and]: {
                        email: loginOrEmail,
                        confirmEmail: 1
                    }
                },
                password: md5(password),
            },
        });

        if (!account) {
            return player.call('showInputPrompt', [".authAccount .password", "Неверный логин или пароль"]);
        }
        if (account.socialClub != player.socialClub)
            return player.call('showInputPrompt', [".authAccount .loginOrEmail", "Неверный Social Club"]);

        if (accountIsOnline(account.id))
            return player.call('showInputPrompt', [".authAccount .loginOrEmail", "Аккаунт уже авторизован"]);

        player.account = account;

        initPlayerAchievements(player);
        initLocalVars(player);
        player.utils.success(`Здравствуйте, ${account.login}!`);
        player.utils.initChoiceCharacter();
    },
};