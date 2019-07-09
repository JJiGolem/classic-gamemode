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
}