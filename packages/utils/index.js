"use strict";
let util = require('util');

/// Утилиты и функции использующиеся в нескольких модулях
let utils = {
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
    randomFloat(min, max, number) {
        // number - количество знаков после запятой
        let rand = min + Math.random() * (max - min);
        return parseFloat(rand).toFixed(number);
    },
    getPointsOnInterval(point1, point2, step) {
        var vectorX = point2.x - point1.x;
        var vectorY = point2.y - point1.y;

        var vectorLenght = Math.sqrt(Math.pow(vectorX, 2) + Math.pow(vectorY, 2));
        var countOfPoint = parseInt(vectorLenght / step);

        var stepX = vectorX / countOfPoint;
        var stepY = vectorY / countOfPoint;

        var pointsOnInterval = [];

        for (var i = 1; i < countOfPoint; i++) {
            var point = {
                x: point1.x + stepX * i,
                y: point1.y + stepY * i
            }
            pointsOnInterval.push(point);
        }

        return pointsOnInterval;
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
            if (!rec.character) return;
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
            if (!veh.db) return;
            if (veh.db.id == sqlId) {
                result = veh;
                return;
            }
        });
        return result;
    },
    getNearVehicle(player, range = 10) {
        var nearVehicle;
        var minDist = 99999;
        mp.vehicles.forEach((veh) => {
            if (veh.id == player.id) return;
            var distance = player.dist(veh.position);
            if (distance < minDist && distance < range) {
                nearVehicle = veh;
                minDist = distance;
            }
        });
        return nearVehicle;
    },
    vdist(posA, posB) {
        return (posA.x - posB.x) * (posA.x - posB.x) + (posA.y - posB.y) * (posA.y - posB.y) + (posA.z - posB.z) * (posA.z - posB.z);
    },
    // Получить расстояние между двумя точками без учета Z
    vdistSqr(posA, posB) {
        return Math.sqrt(Math.pow((posB.x - posA.x), 2) + Math.pow((posB.y - posA.y), 2));
    },
    // Сумма чисел в массиве
    arraySum(array) {
        var sum = 0;
        array.forEach(num => sum += num);
        return sum;
    },
    // Добавить текст над головой игрока
    addOverheadText(player, text, color = [255, 255, 255, 255]) {
        mp.players.forEachInRange(player.position, 20, rec => {
            if (rec.id == player.id) return;
            rec.call(`addOverheadText`, [player.id, text, color]);
        });
    },
    // принадлежит ли позиция полигону
    inPolygon(pos, polygon) {
        var parity = 0;
        for (var i = 0; i < polygon.length - 1; i++) {
            var v = {
                x1: polygon[i].x,
                y1: polygon[i].y,
                x2: polygon[i + 1].x,
                y2: polygon[i + 1].y
            }
            switch (edgeType(v, pos)) {
                case 0:
                    return 2;
                    break;
                case 1:
                    parity = 1 - parity;
                    break;
            }
        }
        var v = {
            x1: polygon[polygon.length - 1].x,
            y1: polygon[polygon.length - 1].y,
            x2: polygon[0].x,
            y2: polygon[0].y
        }
        switch (edgeType(v, pos)) {
            case 0:
                return 2;
                break;
            case 1:
                parity = 1 - parity;
                break;
        }
        return parity;
    },
};
module.exports = utils;

// для удобства использования
console.logObject = utils.logObject;
Math.clamp = utils.clamp;
mp.players.getBySqlId = utils.getPlayerBySqlId;
mp.players.getByName = utils.getPlayerByName;
mp.players.getNear = utils.getNearPlayer;
mp.vehicles.getBySqlId = utils.getVehicleBySqlId;
mp.vehicles.getNear = utils.getNearVehicle;

// ребро касается, пересекается или пох
let edgeType = (vector, a) => {
    switch (classify(vector, a.x, a.y)) {
        case 1:
            return ((vector.y1 < a.y) && (a.y <= vector.y2)) ? 1 : 2;
            break;
        case -1:
            return ((vector.y2 < a.y) && (a.y <= vector.y1)) ? 1 : 2;
            break;
        case 0:
            return 0;
            break;
    }
};

// слева от вектора, справа от вектора, или принадлежит вектору
let classify = (vector, x1, y1) => {
    var pr = (vector.x2 - vector.x1) * (y1 - vector.y1) - (vector.y2 - vector.y1) * (x1 - vector.x1);
    if (pr > 0)
        return 1;
    if (pr < 0)
        return -1;
    return 0;
};
