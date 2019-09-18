let dev = call('dev');

module.exports = {
    "/eval": {
        description: "Выполнить код.",
        access: 6,
        args: "[code]",
        handler: (player, args, out) => {
            var code = args.join(" ");
            out.log(code);
            out.log(eval(code));
        }
    },
    "/build": {
        description: "Вкл/выкл номер сборки в худе.",
        access: 3,
        args: "[состояние]:b",
        handler: (player, args, out) => {
            dev.enableBuild(args[0]);
            if (args[0]) out.info(`${player.name} включил показ сборки сервера`);
            else out.info(`${player.name} выключил показ сборки сервера`);
        }
    },
}
