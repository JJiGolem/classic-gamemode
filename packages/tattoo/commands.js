module.exports = {
    "/parsetats": {
        description: "Установить тату",
        access: 6,
        args: "[collection]:s [overlay]:s",
        handler: (player, args, out) => {
            let col = mp.joaat(args[0]);
            let ovr = mp.joaat(args[1]);
            player.setDecoration(col, ovr);
        }
    }
}