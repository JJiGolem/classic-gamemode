let logger = call('logger');

module.exports = {
    "/logs": {
        access: 6,
        description: "Посмотреть логи персонажа. Формат даты: ГГГГ-ММ-ДД",
        args: "[ид_персонажа]:n [начало] [конец]",
        handler: async (player, args, out) => {
            out.log(`Загрузка логов персонажа #${args[0]}...`);
            var dateA = new Date(args[1]);
            var dateB = new Date(args[2]);
            if (dateA == "Invalid Date") return out.error(`Неверная дата ${args[0]}`, player);
            if (dateB == "Invalid Date") return out.error(`Неверная дата ${args[1]}`, player);
            var start = Date.now();
            var logs = await logger.loadLogs(args[0], dateA, dateB);
            var ms = Date.now() - start;
            if (!logs.length) return out.error(`Логи не найдены`, player);
            var text = `Логи (с ${dateA.toDateString()} по ${dateB.toDateString()}):<br/>`;
            logs.forEach(log => {
                text += `[ID: ${log.playerId}] [${log.module}] ${log.date.getHours()}:${log.date.getMinutes()} | ${log.text}<br/>`;
            });
            text += `Count: ${logs.length}<br/>`;
            text += `Time: ${ms} ms`;

            out.log(text, player);
        }
    },
}
