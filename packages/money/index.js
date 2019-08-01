"use strict";

/// Функции модуля системы финансов игрока
module.exports = {
    /// player - игрок котороуму перевести средства
    /// number - количество средств
    /// callback - функция колбека, которая вызовется по завершению работы или в случае ошибки
    addCash(player, number, callback) {
        if (callback == null) return;
        number = parseInt(number);
        if (isNaN(number)) callback(false);
        if (number < 0 || number > 100000000) callback(false);
        if (player == null) callback(false);
        if (player.character == null) callback(false);

        db.sequelize.transaction(t => {
            player.character.cash = player.character.cash + number;
            return Promise.all([
                player.character.save({transaction: t})
            ]);
        }).then(result => {
            this.changing(player);
            callback(true);
        }).catch(err => {
            player.character.cash = player.character.cash - number;
            callback(false);
        });
    },
    addMoney(player, number, callback) {
        if (callback == null) return;
        number = parseInt(number);
        if (isNaN(number)) callback(false);
        if (number < 0 || number > 100000000) callback(false);
        if (player == null) callback(false);
        if (player.character == null) callback(false);

        db.sequelize.transaction(t => {
            player.character.bank = player.character.bank + number;
            return Promise.all([
                player.character.save({transaction: t})
            ]);
        }).then(result => {
            this.changing(player);
            callback(true);
        }).catch(err => {
            player.character.bank = player.character.bank - number;
            callback(false);
        });
    },
    removeCash(player, number, callback) {
        if (callback == null) return;
        number = parseInt(number);
        if (isNaN(number)) callback(false);
        if (number < 0 || number > 100000000) callback(false);
        if (player == null) callback(false);
        if (player.character == null) callback(false);

        db.sequelize.transaction(t => {
            player.character.cash = player.character.cash - number;
            if (player.character.cash < 0) throw new Error();
            return Promise.all([
                player.character.save({transaction: t})
            ]);
        }).then(result => {
            this.changing(player);
            callback(true);
        }).catch(err => {
            player.character.cash = player.character.cash + number;
            callback(false);
        });
    },
    removeMoney(player, number, callback) {
        if (callback == null) return;
        number = parseInt(number);
        if (isNaN(number)) callback(false);
        if (number < 0 || number > 100000000) callback(false);
        if (player == null) callback(false);
        if (player.character == null) callback(false);

        db.sequelize.transaction(t => {
            player.character.bank = player.character.bank - number;
            if (player.character.bank < 0) throw new Error();
            return Promise.all([
                player.character.save({transaction: t})
            ]);
        }).then(result => {
            this.changing(player);
            callback(true);
        }).catch(err => {
            player.character.bank = player.character.bank + number;
            callback(false);
        });
    },
    changing(player) {
        player.call("money.change", [player.character.cash, player.character.bank]);
    }
};