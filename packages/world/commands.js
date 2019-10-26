module.exports = {
    "/worldadd": {
        access: 3,
        description: "Добавить объект мира. Позиция берется от игрока.<br/>Хеш - по-умолчанию ставить 0.<br/>Типы: 1 - дерево",
        args: "[тип]:n [радиус]:n [хеш]:n",
        handler: (player, args, out) => {
            args[0] = Math.clamp(args[0], 0, 1);
            args[2] = args[2].toString();

            player.call(`world.objects.add`, args);
        }
    },
}
