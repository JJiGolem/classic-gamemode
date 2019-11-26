let anticheat = require('./index');

module.exports = {
    "/aclist": {
        description: "Посмотреть параметры анти-чита.",
        access: 3,
        args: "",
        handler: (player, args, out) => {
            var text = "ID) Имя (описание) - наказание [состояние]<br/>";
            for (var i = 0; i < anticheat.params.length; i++) {
                var param = anticheat.params[i];
                text += `${param.id}) ${param.name} (${param.description}) - ${param.punish} [${param.enable? 'вкл' : 'выкл'}]<br/>`;
            }
            text += `<br/>Виды наказаний:<br/>`;
            text += `notify: оповестить администраторов<br/>`;
            text += `kick: кикнуть игрока<br/>`;
            out.log(text, player);
        }
    },
    "/acenable": {
        description: "Вкл/выкл параметр анти-чита (состояние - 0/1).",
        access: 3,
        args: "[ид_параметра]:n [состояние]:b",
        handler: (player, args, out) => {
            var param = anticheat.params.find(x => x.id == args[0]);
            if (!param) return out.error(`Параметр #${args[0]} не найден`, player);

            anticheat.enableParam(param.id, args[1]);
            out.info(`${player.name} ${param.enable? 'включил' : 'отключил'} параметр ${param.name}`);
        }
    },
    "/acpunish": {
        description: "Изменить наказание параметра анти-чита (см. /aclist).",
        access: 3,
        args: "[ид_параметра]:n [наказание]",
        handler: (player, args, out) => {
            var param = anticheat.params.find(x => x.id == args[0]);
            if (!param) return out.error(`Параметр #${args[0]} не найден`, player);
            if (!anticheat.punishments.includes(args[1])) return out.error(`Неверное наказание`, player);

            anticheat.setPunishParam(param.id, args[1]);
            out.info(`${player.name} изменил наказание параметра ${param.name} на ${param.punish}`);
        }
    },
}
