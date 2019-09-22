"use strict";

let money = call('money');
let notifs = call('notifications');

module.exports = {
    // Кол-во наличных за 1 ед. доната
    convertCash: 100,
    // Стоимость смены ника
    nicknamePrice: 100,
    // Стоимость снятия варна
    clearWarnPrice: 200,
    // Стоимость открытия нового слота
    slotPrice: 500,

    setDonate(player, donate) {
        donate = parseInt(donate);

        player.account.donate = donate;
        player.account.save();
        mp.events.call("player.donate.changed", player);
    },
    convert(player, donate) {
        donate = parseInt(donate);

        var header = `Конвертация валюты`;
        var out = (text) => {
            notifs.error(player, text, header);
        };
        if (player.account.donate < donate) return out(`Необходимо ${donate} CC`);

        money.addMoney(player, donate * this.convertCash, (res) => {
            if (!res) return out(`Ошибка начисления на банк`);

            this.setDonate(player, player.account.donate - donate);
        });

        notifs.success(player, `Списано ${donate} CC`, header);
    },
    async setNickname(player, name) {
        var header = `Смена никнейма`;
        var out = (text) => {
            notifs.error(player, text, header);
        };
        if (player.account.donate < this.nicknamePrice) return out(`Необходимо ${this.nicknamePrice} CC`);

        // TODO: check nickname

        var character = await db.Models.Character.findOne({
            attributes: ["id"],
            where: {
                name: name
            }
        });

        if (character) return out(`Никнейм ${name} занят`);

        player.character.name = name;
        player.character.save();

        this.setDonate(player, player.account.donate - this.nicknamePrice);
        notifs.success(player, `Никнейм изменен, перезайдите на сервер`, header);
        notifs.success(player, `Списано ${this.nicknamePrice} CC`, header);
        player.kick();
    },
};
