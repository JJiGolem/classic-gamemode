let timer = require('./index');

module.exports = {
    "/throwtimererror": {
        access: 6,
        description: "Сломать серверный таймер",
        args: "",
        handler: (player, args) => {
            timer.throwError();
        }
    },
}