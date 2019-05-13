function accountIsOnline(sqlId) {
    if (!sqlId) return false;
    var isFind = false;
    mp.players.forEach((rec) => {
        if (rec.account && rec.account.id == sqlId) isFind = true;
    });
    return isFind;
}

function characterIsOnline(sqlId) {
    if (!sqlId) return false;
    var isFind = false;
    mp.players.forEach((rec) => {
        if (rec.sqlId == sqlId) isFind = true;
    });
    return isFind;
}

function initLocalVars(player) {
    player.call("setLocalVar", ["maxCharacters", Config.maxCharacters]);
    player.call("setLocalVar", ["maxPickUpItemDist", Config.maxPickUpItemDist]);
    player.call("setLocalVar", ["inventoryItems", mp.inventory.items])
}


mp.emailCodes = new Map();
module.exports = {
    "sendEmailCode": (player, email, login) => {
        //console.log(`sendEmailCode: ${email}`);

        if (player.account) return player.utils.error(`Вы уже вошли в учетную запись!`);
        if (!login || login.length < 5 || login.length > 20) return player.utils.error(`Логин должен состоять из 5-20 символов!`);
        if (!email || email.length > 40) return player.utils.error(`Email должен быть менее 40 символов!`);

        var r = /^[0-9a-z_\.-]{5,20}$/i;
        if (!r.test(login)) return player.utils.error(`Некорректный логин!`);

        var r = /^[0-9a-z-_\.]+\@[0-9a-z-_]{1,}\.[a-z]{1,}$/i;
        if (!r.test(email)) return player.utils.error("Некорректный Email!");

        DB.Handle.query("SELECT login,email FROM accounts WHERE login=? OR (email=? AND confirmEmail=?)", [login, email, 1], (e, result) => {
            if (e) return console.log(e);
            if (result.length > 0) {
                if (result[0].login == login) return player.utils.error(`Логин занят!`);
                else if (result[0].email == email) return player.utils.error(`Email занят!`);
            }

            var code = mp.randomInteger(100000, 999999);
            mp.mailer.sendMail(email, `Подтверждение электронной почты`, `Код подтверждения: <b>${code}</b>`);
            mp.emailCodes.set(email, code);

            player.call(`showConfirmCode`);
        });
    },

    "confirmEmail": (player, email, login) => {
        //console.log(`sendEmailCode: ${email}`);
        //if (player.account) return player.utils.error(`Вы уже вошли в учетную запись!`);
        var r = /^[0-9a-z_\.-]{5,20}$/i;
        if (!r.test(login)) return player.utils.error(`Некорректный логин!`);

        var r = /^[0-9a-z-_\.]+\@[0-9a-z-_]{1,}\.[a-z]{1,}$/i;
        if (!r.test(email)) return player.utils.error("Некорректный Email!");

        var code = mp.randomInteger(100000, 999999);
        mp.mailer.sendMail(email, `Подтверждение электронной почты`, `Код подтверждения: <b>${code}</b>`);
        mp.emailCodes.set(email, code);

        player.call(`showConfirmCode`);
    },

    "confirmEmailCode": (player, loginOrEmail, emailCode) => {
        console.log(`confirmRecoveryCode: ${loginOrEmail} ${emailCode}`);
        //if (player.account.confirmEmail == 1) return player.utils.error(`Email уже подтвержден!`);
        if (mp.emailCodes.get(loginOrEmail) != emailCode) return player.utils.error(`Неверный код подтверждения Email!`);
        player.utils.setLocalVar("accountEmail", loginOrEmail);
        player.utils.setLocalVar("accountConfirmEmail", 1);
        player.account.confirmEmail = 1;
        player.account.email = loginOrEmail;
        DB.Handle.query(`UPDATE accounts SET confirmEmail=? WHERE login=?`, [1, player.account.login]);
        DB.Handle.query(`UPDATE accounts SET email=? WHERE login=?`, [loginOrEmail, player.account.login]);
        return player.utils.success(`Email подтвержден!`);
    },


    "changePassword": (player, data) => {
        data = JSON.parse(data);
        if (!data.old || !data.new || !data.retry) return player.utils.error("Заполните поле корректно!");
        DB.Handle.query(`SELECT * FROM accounts WHERE login=?`, [player.account.login], (e, result) => {
            if (e) return console.log(e);
            if (result.length > 0) {
                if (md5(data.old) != result[0].password) return player.utils.error("Старый пароль невереный!");
                if (data.new.length < 6 || data.new.length > 20) return player.utils.error(`Пароль должен состоять из 6-20 символов!`);
                if (data.old == data.new) return player.utils.error("Новый пароль не должен быть равен старому!");
                if (data.new != data.retry) return player.utils.error("Повторный новый пароль невереный!");
                DB.Handle.query(`UPDATE accounts SET password=? WHERE login=?`, [md5(data.retry), result[0].login]);
                return player.utils.success("Вы успешно сменили пароль!");
            }
        });
    },

    "regAccount": (player, data) => {
        //console.log(`regAccount: ${data}`);
        data = JSON.parse(data);

        if (player.accountRegistrated) return player.utils.error(`Вы уже зарегистрировали учетную запись!`);
        //if (!data.name || data.name.length < 3 || data.name.length > 30) return player.utils.error(`Имя должно состоять из 3-30 символов!`);
        //if (!data.surname || data.surname.length < 3 || data.surname.length > 30) return player.utils.error(`Фамилия должна состоять из 3-30 символов!`);
        //if (!data.country || data.country.length < 3 || data.country.length > 20) return player.utils.error(`Страна должна состоять из 3-20 символов!`);
        //if (!data.city || data.city.length < 3 || data.city.length > 20) return player.utils.error(`Город должен состоять из 3-20 символов!`);
        if (!data.login || data.login.length < 5 || data.login.length > 20) return player.utils.error(`Логин должен состоять из 5-20 символов!`);
        if (!data.password || data.password.length < 6 || data.password.length > 20) return player.utils.error(`Пароль должен состоять из 6-20 символов!`);
        if (!data.email || data.email.length > 40) return player.utils.error(`Email должен быть менее 40 символов!`);

        var r = /^[0-9a-z_\.-]{5,20}$/i;
        if (!r.test(data.login)) return player.utils.error(`Некорректный логин!`);

        var r = /^[0-9a-z-_\.]+\@[0-9a-z-_]{1,}\.[a-z]{1,}$/i;
        if (!r.test(data.email)) return player.utils.error("Некорректный email!");

        if (data.emailCode && data.emailCode != -1 && mp.emailCodes.get(data.email) != data.emailCode) {
            player.call(`lightEmailCode`);
            return player.utils.error(`Неверный код подтверждения Email!`);
        }
        var confirmEmail = (data.emailCode) ? 1 : 0;

        //debug(`regAccount: step A`);
        
        

        DB.Handle.query(`SELECT login,email,socialClub FROM accounts WHERE login=? OR socialClub=? OR (email=? AND confirmEmail=?)`, [data.login, player.socialClub, data.email, 1], (e, result) => {
            //debug(`regAccount: step B ${result}`);
            if (result.length > 0) {
                if (result[0].login.toUpperCase() == data.login.toUpperCase()) {
                    player.call(`lightLogin`);
                    return player.utils.error(`Логин занят!`);
                } else if (result[0].email.toUpperCase() == data.email.toUpperCase()) {
                    player.call(`lightEmail`);
                    return player.utils.error(`Email занят!`);
                } else if (result[0].socialClub == player.socialClub) {
                    return player.utils.error(`Аккаунт с Social Club ${player.socialClub} уже зарегистрирован!`);
                }
            } else {
                if (data.emailCode == -1) return player.call("showConfirmCodeModal");
                
                /*проверяем есть ли промо код*/
                var promoId = 0;
                var rewardProm = 0;
                if(data.promocode){
                    DB.Handle.query(`SELECT * FROM promocodes WHERE code=?`, [data.promocode], (e, result) => {
                        if (result.length > 0) {
                            var dataRevard = JSON.parse(result[0]['reward_config']);
                            promoId = result[0]['id'];
                            rewardProm = dataRevard.register;
                        }
                    });
                }
                /*промокод проверили*/

                var values = [data.login, player.socialClub, md5(data.password), data.email, player.ip, player.ip, confirmEmail,data.promocode];
                DB.Handle.query(`INSERT INTO accounts (login,socialClub,password,email,regIp,lastIp,lastDate,confirmEmail,promocode) VALUES (?,?,?,?,?,?,NOW(),?,?)`,
                    values, (e, result) => {
                        if (e) return console.log(e);

                        player.accountRegistrated = true;
                        player.call("regAccountSuccess");
                        
                        var configPromoData = {
                                    "lvl2":false,
                                    "lvl3":false,
                                    "lvl5":false,
                                    "lvl10":false
                        };
                        
                        /*заносим данные по промокоду*/
                        if(promoId!==0){
                            var promoVals = [promoId,result.insertId,JSON.stringify(configPromoData)];
                            DB.Handle.query(`INSERT INTO promocodes_data (idcode,regId,date,rewarded) VALUES (?,?,NOW(),?)`,promoVals, () => {});
                            DB.Handle.query(`UPDATE promocodes SET reward_sum=reward_sum+? WHERE id=?`,[rewardProm,promoId], () => {});
                        }
                        /* работа с промокодами на этапе регистрации закончилась */
                        
                        if (data.emailCode) player.utils.success(`Email подтвержден!`);
                    });
            }
        });

    },

    "recoveryAccount": (player, loginOrEmail) => {
        //console.log(`recoveryAccount: ${loginOrEmail}`);
        if (!loginOrEmail || loginOrEmail.length == 0) return player.utils.error(`Заполните поле!`);
        var regLogin = /^[0-9a-z_\.-]{5,20}$/i;
        var regEmail = /^[0-9a-z-_\.]+\@[0-9a-z-_]{1,}\.[a-z]{1,}$/i;
        if (!regLogin.test(loginOrEmail) && !regEmail.test(loginOrEmail)) {
            player.call(`lightRecoveryLoginOrEmail`);
            return player.utils.error(`Некорректное значение!`);
        }

        DB.Handle.query("SELECT email FROM accounts WHERE (login=? OR email=?) AND confirmEmail=?", [loginOrEmail, loginOrEmail, 1], (e, result) => {
            if (e) return console.log(e);
            if (result.length == 0) {
                player.call(`lightRecoveryLoginOrEmail`);
                return player.utils.error(`Учетная запись не найдена!`);
            }

            var code = mp.randomInteger(100000, 999999);
            mp.mailer.sendMail(result[0].email, `Восстановление учётной записи`, `Код восстановления: <b>${code}</b>`);
            mp.emailCodes.set(loginOrEmail, code);

            player.call(`recoveryCodeSent`);
        });
    },

    "confirmRecoveryCode": (player, loginOrEmail, emailCode) => {
        //console.log(`confirmRecoveryCode: ${loginOrEmail} ${emailCode}`);

        if (emailCode && mp.emailCodes.get(loginOrEmail) != emailCode) {
            player.call(`lightRecoveryCode`);
            return player.utils.error(`Неверный код подтверждения Email!`);
        }

        player.confirmed = true;
        player.loginOrEmail = loginOrEmail;
        player.call(`recoveryCodeSuccess`);
    },

    "recoveryAccountNewPassword": (player, password) => {
        if (!player.confirmed) return player.utils.error(`Неверный код подтверждения Email!`);
        delete player.confirmed;

        if (!password || password.length < 6 || password.length > 20) return player.utils.error(`Пароль должен состоять из 6-20 символов!`);

        DB.Handle.query("SELECT id FROM accounts WHERE (login=? OR email=?) AND confirmEmail=?", [player.loginOrEmail, player.loginOrEmail, 1], (e, result) => {
            delete player.loginOrEmail;
            if (e) return console.log(e);
            if (result.length == 0) return player.utils.error(`Учетная запись не найдена!`);

            DB.Handle.query("UPDATE accounts SET password=? WHERE id=?", [md5(password), result[0].id], (e) => {
                if (e) return console.log(e);

                player.call(`recoveryNewPasswordSuccess`);
            });
        });

    },

    "authAccount": (player, loginOrEmail, password) => {
        //console.log(`authAccount: ${loginOrEmail} ${password}`);

        if (!loginOrEmail || loginOrEmail.length == 0) {
            player.call('lightTextField', ["#authAccount .loginOrEmail"]);
            return player.utils.error(`Заполните поле!`);
        }
        var regLogin = /^[0-9a-z_\.-]{5,20}$/i;
        var regEmail = /^[0-9a-z-_\.]+\@[0-9a-z-_]{1,}\.[a-z]{1,}$/i;
        if (!regLogin.test(loginOrEmail) && !regEmail.test(loginOrEmail)) {
            player.call('lightTextField', ["#authAccount .loginOrEmail"]);
            return player.utils.error(`Некорректное значение!`);
        }

        if (password.length < 6 || password.length > 20) {
            player.call('lightTextField', ["#authAccount .password"]);
            return player.utils.error(`Неверный пароль!`);
        }

        DB.Handle.query("SELECT * FROM ip_ban WHERE ip=?", [player.ip], (e, result) => {
            if (result.length > 0) {
              player.utils.error("Вы забанены!");
              player.kick();
              return;
            }
        });

        DB.Handle.query(`SELECT * FROM accounts WHERE (login=? OR (email=? AND confirmEmail=?)) AND password=?`,
            [loginOrEmail, loginOrEmail, 1, md5(password)], (e, result) => {
                if (result.length == 0) return player.utils.error(`Неверный логин/пароль!`);
                if (result[0].socialClub != player.socialClub) return player.utils.error(`Неверный Social Club!`);

                if (accountIsOnline(result[0].id))
                    return player.utils.error(`Аккаунт ${result[0].login} уже авторизован!`);

                player.account = {
                    id: result[0].id,
                    login: result[0].login,
                    email: result[0].email,
                    confirmEmail: result[0].confirmEmail,
                    donate: result[0].donate,
                    done: result[0].done,
                    allDonate: 0,
                    promoId: 0,
                    achievements_slot: (result[0].achievements_slot == 0) ? false : true,
                    donate_slot: (result[0].donate_slot == 0) ? false : true,
                };
                
                if(result[0].promocode){
                    //console.log("chek promocode account");
                    DB.Handle.query(`SELECT * FROM promocodes WHERE code=?`,[result[0].promocode], (e, resultCode) => {
                        if (resultCode.length > 0) {
                            player.account.promoId = resultCode[0].id
                        }else{
                            DB.Handle.query(`UPDATE accounts SET promocode='' WHERE id=?`,[player.account.id], (e,result) => {});
                        }
                    });
                }

                initPlayerAchievements(player);
                initLocalVars(player);
                player.utils.success(`Здравствуйте, ${result[0].login}!`);
                player.utils.initChoiceCharacter();

            });
    },

    "closedMode.open": (player, pin) => {
        if (!player.pinCount) player.pinCount = 0;
        if (pin != Config.pin) {
            terminal.info(`${player.name} ввел неверно PIN! - ${pin}<br />IP: ${player.ip}<br /> Social Club: ${player.socialClub}`);
            mp.logs.addLog(`${player.name} ввел неверно PIN! - ${pin}<br />IP: ${player.ip}<br /> Social Club: ${player.socialClub}`, 'main', 0, 0, { pin: pin, ip: player.ip, socialClub: player.socialClub });
            player.pinCount++;
            if (player.pinCount > 2) return player.kick();
            return player.call("lightTextFieldError", [".modal .pin", "Неверный PIN!"]);
        }
        delete player.pinCount;

        player.call("modal.hide");
        player.call("showAuthAccount");
    }
}
