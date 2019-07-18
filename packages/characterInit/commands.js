module.exports = {
    "/charcreate": {
        access: 6,
        description: "Создание персоонажа",
        args: "[имя] [фамилия]",
        handler: (player, args) => {
            player.call('characterInit.create.continue', []);
            mp.events.call("characterInit.create.check", player, `${args[0]} ${args[1]}`, JSON.stringify(player.character));
        }
    },
}