"use strict";
/// Функции модуля авторизации
const bcrypt = require('bcryptjs');

//emailCodes = new Map();
module.exports = {
    accountIsOnline(id) {
        if (!id) return false;
        mp.players.forEach((player) => {
            if (player.account && player.account.id == id) return true;
        });
        return false;
    },
    getEmailCodes() {
        return emailCodes;
    },
    getEmailCode(email) {
        return emailCodes.get(email);
    },
    setEmailCodes(emailCodesTemp) {
        emailCodes = emailCodesTemp;
    },
    setEmailCode(email, code) {
        emailCodes.set(email, code);
    },
    hashPassword(passwordNotHashed) {
        return bcrypt.hashSync(passwordNotHashed, bcrypt.genSaltSync(5));
    },
    comparePassword(password, hash) {
        return bcrypt.compareSync(password, hash);
    },
};