module.exports = {
    "/cmdName": {
        access: 3,
        description: "Описание",
        args: "[сообщение]",
        handler: (player, args) => {
            console.log(args);
        }
    },
}