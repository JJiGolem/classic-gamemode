"use strict";

/// Вход в аккаунт
mp.events.add('auth.login', (data) => {
    mp.events.callRemote('auth.login', data);
});
/// Результат входа в аккаунт
mp.events.add('auth.login.result', result => {
    // mp.callCEFVN({"auth.login.result": result});
    mp.callCEFV(`auth.showLoginResult(${result})`);
    //temp
    mp.callCEFR('pushChatMessage', ["Результат входа " + result]);
});

/// Регистрация аккаунта
mp.events.add('auth.register', (data) => {
    mp.events.callRemote('auth.register', data);
});
/// Результат регистрации аккаунта
mp.events.add('auth.register.result', (result, data) => {
    // mp.callCEFVN('auth.register.result', {"auth.register.result": result, "auth.register.data": data});
    mp.callCEFV(`auth.showRegisterResult(${result})`);
    //temp
    mp.callCEFR('pushChatMessage', ["Результат регистрации " + result]);
});

/// Запрос на отправку кода подтверждения почты
mp.events.add('auth.email.confirm', () => {
    mp.events.callRemote('auth.email.confirm');
});
/// Запорос на проверку кода из письма
mp.events.add('auth.email.confirm.code', (code) => {
    mp.events.callRemote('auth.email.confirm.code', code);
});
/// Ответ проверки почты
mp.events.add('auth.email.confirm.result', (result) => {
    // mp.callCEFVN('auth.email.result', {"auth.email.result": result});
    mp.callCEFV(`auth.showEmailConfirmResult(${result})`);
    //temp
    mp.callCEFR('pushChatMessage', ["Результат проверки кода подтверждения почты " + result]);
});
