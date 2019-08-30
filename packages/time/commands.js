let time = require('./index');

module.exports = {
    "/payday": {
        access: 6,
        description: "Вызвать PayDay",
        args: "",
        handler: (player, args) => {
            time.payDay();
        }
    }
}
