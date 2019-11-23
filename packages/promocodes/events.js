let promocodes = call("promocodes");

// TODO: Временное решение
let tempPayDays = [];

module.exports = {
    "init": async () => {
        tempPayDays = await db.Models.TempPayDay.findAll();
        await promocodes.init();
        inited(__dirname);
    },
    "characterInit.done": (player) => {
        promocodes.check(player);
    },
    "promocodes.activate": (player, code) => {
        // TODO: Временное решение
        if (code.toLowerCase() == 'payday') {
            var notifs = call("notifications");
            if (tempPayDays.find(x => x.characterId == player.character.id)) return notifs.error(player, `Награда уже получена`, `Промокод PayDay`);
            call("money").addCash(player, 10000, (res) => {
                if (!res) return notifs.error(player, `Ошибка начисления наличных`);;

                notifs.success(player, `Получена награда!`, `Промокод PayDay`);
                var tempPayDay = db.Models.TempPayDay.build({
                    characterId: player.character.id
                });
                tempPayDays.push(tempPayDay);
                tempPayDay.save();
            }, `Использование промокода PayDay`);
            return;
        }
        promocodes.activate(player, code);
    },
};
