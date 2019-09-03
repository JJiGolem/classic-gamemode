module.exports = {
    "/hheal": {
        access: 6,
        description: "Предложить лечение игроку.",
        args: "[ид_игрока]:n",
        handler: (player, args, out) => {
            mp.events.call(`hospital.healing.show`, player, args[0]);
        }
    },
}
