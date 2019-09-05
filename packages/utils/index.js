"use strict";
let util = require('util');
/// Утилиты и функции использующиеся в нескольких модулях
module.exports = {
    /// Инициализатор функций
    init() {
        // для удобства использования
        console.logObject = this.logObject;
        Math.clamp = this.clamp;
        mp.players.getBySqlId = this.getPlayerBySqlId;
        mp.players.getByName = this.getPlayerByName;
        mp.players.getNear = this.getNearPlayer;
        mp.vehicles.getBySqlId = this.getVehicleBySqlId;
    },
    /// Отправка писем на почту
    sendMail(to, subject, message) {
        var nodemailer = require("nodemailer");
        var transporter = nodemailer.createTransport({
            service: 'yandex',
            auth: {
                user: 'admin@classic-rp.ru',
                pass: '4dm1ni0_228'
            }
        });
        message += "<br /><br / > С Уважением, Команда Classic RolePlay.";
        const mailOptions = {
            from: 'admin@classic-rp.ru',
            to: to,
            subject: subject,
            html: message
        };
        transporter.sendMail(mailOptions, function(err, info) {
            if (err) console.log(`[MAIL] ${err}`)
            else console.log(`[MAIL] ${info}`);
        });
    },
    randomInteger(min, max) {
        var rand = min - 0.5 + Math.random() * (max - min + 1);
        rand = Math.round(rand);
        return rand;
    },
    // Глубокое логирование JS-объекта без свёрток [Object], [Array] и пр.
    logObject(obj) {
        console.log(util.inspect(obj, {
            showHidden: false,
            depth: null
        }));
    },
    clamp(value, min, max) {
        return Math.max(min, Math.min(max, value));
    },
    getPlayerBySqlId(sqlId) {
        if (!sqlId) return null;
        var result;
        mp.players.forEach((rec) => {
            if (rec.character.id == sqlId) {
                result = rec;
                return;
            }
        });
        return result;
    },
    getPlayerByName(name) {
        if (!name) return null;
        var result;
        mp.players.forEach((rec) => {
            if (rec.name == name) {
                result = rec;
                return;
            }
        });
        return result;
    },
    getNearPlayer(player) {
        var nearPlayer;
        var minDist = 99999;
        mp.players.forEach((rec) => {
            if (rec.id == player.id) return;
            var distance = player.dist(rec.position);
            if (distance < minDist) {
                nearPlayer = rec;
                minDist = distance;
            }
        });
        return nearPlayer;
    },
    getVehicleBySqlId(sqlId) {
        if (!sqlId) return null;
        var result;
        mp.vehicles.forEach((veh) => {
            if (veh.db.id == sqlId) {
                result = veh;
                return;
            }
        });
        return result;
    },
};
