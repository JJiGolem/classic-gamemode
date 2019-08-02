"use strict";

/// Функции модуля системы финансов игрока
module.exports = {
    /// player - игрок которому перевести средства
    /// number - количество средств
    /// callback - функция колбека, которая вызовется по завершению работы или в случае ошибки
    addCash(player, number, callback) {
        if (callback == null) return;
        number = parseInt(number);
        if (isNaN(number)) callback(false);
        if (number < 0 || number > 1000000000) callback(false);
        if (player == null) callback(false);
        if (player.character == null) callback(false);

        let cash = player.character.cash;
        db.sequelize.transaction(t => {
            player.character.cash = player.character.cash + number;
            return player.character.save({transaction: t});
        }).then(result => {
            this.changing(player);
            callback(true);
        }).catch(err => {
            if (cash != null) {
                player.character.cash = cash;
            }
            callback(false);
        });
    },
    /// id - id персоонажа которому перевести средства
    /// number - количество средств
    /// callback - функция колбека, которая вызовется по завершению работы или в случае ошибки
    addCashById(id, number, callback) {
        if (callback == null) return;
        id = parseInt(id);
        number = parseInt(number);
        if (isNaN(number) || isNaN(id)) callback(false);
        if (number < 0 || number > 1000000000 || id < 0 || id > 100000000) callback(false);

        let player = mp.players.toArray().find( player => {
            if(player.character) {
                return player.character.id == id;
            }
            else {
                return false;
            }
        });
        if (player == null) {
            db.sequelize.transaction(t => {
                return db.Models.Character.findOne({ where: {id: id} , transaction: t}).then( character => {
                    character.cash = character.cash + number;
                    return character.save({transaction: t});
                });
            }).then(result => {
                callback(true);
            }).catch(err => {
                callback(false);
            });
        }
        else {
            this.addCash(player, number, callback);
        }
    },
    addMoney(player, number, callback) {
        if (callback == null) return;
        number = parseInt(number);
        if (isNaN(number)) callback(false);
        if (number < 0 || number > 1000000000) callback(false);
        if (player == null) callback(false);
        if (player.character == null) callback(false);

        let bank = player.character.bank;
        db.sequelize.transaction(t => {
            player.character.bank = player.character.bank + number;
            return player.character.save({transaction: t});
        }).then(result => {
            this.changing(player);
            callback(true);
        }).catch(err => {
            if (bank != null) {
                player.character.bank = bank;
            }
            callback(false);
        });
    },
    addMoneyById(id, number, callback) {
        if (callback == null) return;
        id = parseInt(id);
        number = parseInt(number);
        if (isNaN(number) || isNaN(id)) callback(false);
        if (number < 0 || number > 1000000000 || id < 0 || id > 100000000) callback(false);

        let player = mp.players.toArray().find( player => {
            if(player.character) {
                return player.character.id == id;
            }
            else {
                return false;
            }
        });
        if (player == null) {
            db.sequelize.transaction(t => {
                return db.Models.Character.findOne({ where: {id: id} , transaction: t}).then( character => {
                    character.bank = character.bank + number;
                    return character.save({transaction: t});
                });
            }).then(result => {
                callback(true);
            }).catch(err => {
                callback(false);
            });
        }
        else {
            this.addMoney(player, number, callback);
        }
    },
    removeCash(player, number, callback) {
        if (callback == null) return;
        number = parseInt(number);
        if (isNaN(number)) callback(false);
        if (number < 0 || number > 1000000000) callback(false);
        if (player == null) callback(false);
        if (player.character == null) callback(false);

        let cash = player.character.cash;
        db.sequelize.transaction(t => {
            if (player.character.cash < number) throw new Error();
            player.character.cash = player.character.cash - number;
            return player.character.save({transaction: t});
        }).then(result => {
            this.changing(player);
            callback(true);
        }).catch(err => {
            if (cash != null) {
                player.character.cash = cash;
            }
            callback(false);
        });
    },
    removeCashById(id, number, callback) {
        if (callback == null) return;
        id = parseInt(id);
        number = parseInt(number);
        if (isNaN(number) || isNaN(id)) callback(false);
        if (number < 0 || number > 1000000000 || id < 0 || id > 100000000) callback(false);

        let player = mp.players.toArray().find( player => {
            if(player.character) {
                return player.character.id == id;
            }
            else {
                return false;
            }
        });
        if (player == null) {
            db.sequelize.transaction(t => {
                return db.Models.Character.findOne({ where: {id: id} , transaction: t}).then( character => {
                    if (character.cash < number) throw new Error();
                    character.cash = character.cash - number;
                    return character.save({transaction: t});
                });
            }).then(result => {
                callback(true);
            }).catch(err => {
                callback(false);
            });
        }
        else {
            this.addCash(player, number, callback);
        }
    },
    removeMoney(player, number, callback) {
        if (callback == null) return;
        number = parseInt(number);
        if (isNaN(number)) callback(false);
        if (number < 0 || number > 1000000000) callback(false);
        if (player == null) callback(false);
        if (player.character == null) callback(false);

        let bank = player.character.bank;
        db.sequelize.transaction(t => {
            if (player.character.bank < number) throw new Error();
            player.character.bank = player.character.bank - number;
            return player.character.save({transaction: t});
        }).then(result => {
            this.changing(player);
            callback(true);
        }).catch(err => {
            if (bank != null) {
                player.character.bank = bank;
            }
            callback(false);
        });
    },
    removeMoneyById(id, number, callback) {
        if (callback == null) return;
        id = parseInt(id);
        number = parseInt(number);
        if (isNaN(number) || isNaN(id)) callback(false);
        if (number < 0 || number > 1000000000 || id < 0 || id > 100000000) callback(false);

        let player = mp.players.toArray().find( player => {
            if(player.character) {
                return player.character.id == id;
            }
            else {
                return false;
            }
        });
        if (player == null) {
            db.sequelize.transaction(t => {
                return db.Models.Character.findOne({ where: {id: id} , transaction: t}).then( character => {
                    if (character.bank < number) throw new Error();
                    character.bank = character.bank - number;
                    return character.save({transaction: t});
                });
            }).then(result => {
                callback(true);
            }).catch(err => {
                callback(false);
            });
        }
        else {
            this.addCash(player, number, callback);
        }
    },
    changing(player) {
        player.call("money.change", [player.character.cash, player.character.bank]);
    }
};