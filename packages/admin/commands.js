module.exports = {
    "/msg": {
        access: 4,
        description: "Сообщение в общий чат",
        args: "[сообщение]",
        handler: (player, args) => {
            mp.players.forEach((target) => {
                let admin = player;
                target.call('chat.message.push', [`!{#ebc71b}Администратор ${admin.name}[${admin.id}]: ${args.join(' ')}`]);
            });
        }
    }
}