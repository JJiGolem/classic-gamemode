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
    // Макс. кол-во слотов
    slotsMax: 3,

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
        }, `Донат за ${donate} CC`);

        notifs.success(player, `Списано ${donate} CC`, header);
    },
    async setNickname(player, name) {
        var header = `Смена никнейма`;
        var out = (text) => {
            notifs.error(player, text, header);
        };
        if (player.account.donate < this.nicknamePrice) return out(`Необходимо ${this.nicknamePrice} CC`);

        // TODO: check nickname
        let reg = /^[A-z]{2,15} [A-z]{2,15}$/;
        if (!reg.test(name)) return out(`Имя и фамилия должны состоять из 2-15 латинских букв каждое`);

        var character = await db.Models.Character.findOne({
            attributes: ["id"],
            where: {
                name: name
            }
        });

        if (character) return out(`Никнейм ${name} занят`);

        player.name = name;
        player.character.name = name;
        player.character.save();

        this.setDonate(player, player.account.donate - this.nicknamePrice);
        notifs.success(player, `Никнейм персонажа изменен`, header);
        notifs.success(player, `Списано ${this.nicknamePrice} CC`, header);
        mp.events.call("player.name.changed", player);
        // player.kick();
    },
    clearWarn(player) {
        var header = `Снятие варна`;
        var out = (text) => {
            notifs.error(player, text, header);
        };
        if (player.account.donate < this.clearWarnPrice) return out(`Необходимо ${this.clearWarnPrice} CC`);
        if (!player.character.warnNumber) return out(`На персонаже нет варнов`);

        player.character.warnNumber--;
        player.character.save();
        mp.events.call("player.warns.changed", player);

        this.setDonate(player, player.account.donate - this.clearWarnPrice);
        notifs.success(player, `Варн снят`, header);
        notifs.success(player, `Списано ${this.clearWarnPrice} CC`, header);
    },
    addSlot(player) {
        var header = `Добавление слота`;
        var out = (text) => {
            notifs.error(player, text, header);
        };
        if (player.account.slot >= this.slotsMax) return out(`Вы имеете максимальное количество слотов`);
        if (player.account.donate < this.slotPrice) return out(`Необходимо ${this.slotPrice} CC`);

        player.account.slots++;
        player.account.save();
        mp.events.call("player.slots.changed", player);

        this.setDonate(player, player.account.donate - this.slotPrice);
        notifs.success(player, `Добавлен новый слот`, header);
        notifs.success(player, `Списано ${this.slotPrice} CC`, header);
    },
};
