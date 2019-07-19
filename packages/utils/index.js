"use strict";
/// Утилиты и функции использующиеся в нескольких модулях
module.exports = {
    /// Инициализатор функций
    init() {
        
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
};