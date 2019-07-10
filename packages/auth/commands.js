module.exports = {
    "/auth": {
        access: 5,
        description: "Регистрация",
        args: "[логин] [почта] [пароль]",
        handler: (player, args) => {
            mp.events.call("auth.register", player, `{"login": "${args[0]}", "email": "${args[1]}", "password": "${args[2]}", "emailCode": -1}`);
        }
    },
    "/login": {
        access: 5,
        description: "Вход",
        args: "[логин|почта] [пароль]",
        handler: (player, args) => {
            mp.events.call("auth.login", player, `{"loginOrEmail": "${args[0]}", "password": "${args[1]}"}`);
        }
    },
    "/getmail": {
        access: 5,
        description: "Получить письмо с кодом подтверждения",
        args: "",
        handler: (player, args) => {
            mp.events.call("auth.email.confirm", player);
        }
    },
    "/setcode": {
        access: 5,
        description: "Получить код",
        args: "[код]",
        handler: (player, args) => {
            mp.events.call("auth.email.confirm.code", player, args[0]);
        }
    },
}