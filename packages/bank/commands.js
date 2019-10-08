let bankService = require('./index.js');

module.exports = {
    "/createbank": {
        access: 6,
        description: "Создать банк",
        args: "",
        handler: (player, args, out) => {
            bankService.createBank(player.position);
            out.success("New bank created", player)
        }
    },
};