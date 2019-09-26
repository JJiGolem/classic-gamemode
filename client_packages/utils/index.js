"use strict";

let playerMovingDisabled = false;

mp.utils = {
    /// Управление камерой
    cam: require('utils/camera.js'),

    /// Возвращает имя улицы
    getStreetName(pos) {
        if (!pos) return null;
        var getStreet = mp.game.pathfind.getStreetNameAtCoord(pos.x, pos.y, pos.z, 0, 0);
        var streetName = mp.game.ui.getStreetNameFromHashKey(getStreet["streetName"]);
        return streetName;
    },
    /// Возвращает название района
    getRegionName(pos) {
        if (!pos) return null;
        return mp.game.ui.getLabelText(mp.game.zone.getNameOfZone(pos.x, pos.y, pos.z));
    },
    /// Возваращает якорь миникарты
    getMinimapAnchor() {
        let sfX = 1.0 / 20.0;
        let sfY = 1.0 / 20.0;
        let safeZone = mp.game.graphics.getSafeZoneSize();
        let aspectRatio = mp.game.graphics.getScreenAspectRatio(false);
        let resolution = mp.game.graphics.getScreenActiveResolution(0, 0);
        let scaleX = 1.0 / resolution.x;
        let scaleY = 1.0 / resolution.y;

        let minimap = {
            width: scaleX * (resolution.x / (4 * aspectRatio)),
            height: scaleY * (resolution.y / 5.674),
            scaleX: scaleX,
            scaleY: scaleY,
            leftX: scaleX * (resolution.x * (sfX * (Math.abs(safeZone - 1.0) * 10))),
            bottomY: 1.0 - scaleY * (resolution.y * (sfY * (Math.abs(safeZone - 1.0) * 10))),
        };

        minimap.rightX = minimap.leftX + minimap.width;
        minimap.topY = minimap.bottomY - minimap.height;
        return minimap;
    },
    /// Convert the object to a string
    objToString(obj) {
        var rs = '';
        var not_first = false;

        for (var k in obj) {
            if (not_first) rs += ',';
            if (typeof obj[k] === 'object') {
                rs += '"' + k + '": {' + objToString(obj[k]) + '}';
            } else if (typeof obj[k] === 'string' || typeof obj[k] === 'function') {
                rs += '"' + k + '":"' + obj[k] + '"';
            } else if (typeof obj[k] === 'number') {
                rs += '"' + k + '":' + obj[k] + '';
            }
            not_first = true;
        }
        return rs;
    },
    //  Иниц. анимации
    requestAnimDict(dict, callback) {
        mp.game.streaming.requestAnimDict(dict);
        while (!mp.game.streaming.hasAnimDictLoaded(dict)) {
            mp.game.wait(0);
        }
        callback();
    },
    // Зыкрытие дверей
    closeDoors() {
        mp.game.object.doorControl(631614199, 461.8065, -994.4086, 25.06443, true, 0.0, 0.0, 0.0);
        mp.game.object.doorControl(631614199, 461.8065, -997.6583, 25.06443, true, 0.0, 0.0, 0.0);
        mp.game.object.doorControl(631614199, 461.8065, -1001.302, 25.06443, true, 0.0, 0.0, 0.0);
        mp.game.object.doorControl(631614199, 461.8065, -994.4086, 25.06443, true, 0.0, 0.0, 0.0);
        mp.game.object.doorControl(-1765048490, 1855.685, 3683.93, 34.59282, false, 0.0, 0.0, 0.0);
        mp.game.object.doorControl(-1501157055, -444.4985, 6017.06, 31.86633, false, 0.0, 0.0, 0.0);
        mp.game.object.doorControl(-1501157055, -442.66, 6015.222, 31.86633, false, 0.0, 0.0, 0.0);
        mp.game.object.doorControl(-1116041313, 127.9552, -1298.503, 29.41962, false, 0.0, 0.0, 0.0);
        mp.game.object.doorControl(-1517873911, 106.3793, -742.6982, 46.51962, false, 0.0, 0.0, 0.0);
        mp.game.object.doorControl(-90456267, 105.7607, -746.646, 46.18266, false, 0.0, 0.0, 0.0);
        mp.game.object.doorControl(-1922281023, -715.6154, -157.2561, 37.67493, false, 0.0, 0.0, 0.01);
        mp.game.object.doorControl(-1922281023, -716.6755, -155.42, 37.67493, false, 0.0, 0.0, 0.01);
        mp.game.object.doorControl(993120320, -561.2866, 293.5044, 87.77851, false, 0.0, 0.0, 0.0);
        mp.game.object.doorControl(993120320, -565.1712, 276.6259, 83.28626, false, 0.0, 0.0, 0.0);
        mp.game.object.doorControl(-2051651622, -31.72353, -1101.847, 26.57225, false, 0.0, 0.0, 0.0);
        mp.game.object.doorControl(1417577297, -37.33113, -1108.873, 26.7198, false, 0.0, 0.0, 0.0);
        mp.game.object.doorControl(2059227086, -39.13366, -1108.218, 26.7198, false, 0.0, 0.0, 0.0);
        mp.game.object.doorControl(1417577297, -60.54582, -1094.749, 26.88872, false, 0.0, 0.0, 0.0);
        mp.game.object.doorControl(2059227086, -59.89302, -1092.952, 26.88362, false, 0.0, 0.0, 0.0);
        mp.game.object.doorControl(-2051651622, -33.80989, -1107.579, 26.57225, false, 0.0, 0.0, 0.0);
        mp.game.object.doorControl(-2051651622, -31.72353, -1101.847, 26.57225, false, 0.0, 0.0, 0.0);
        mp.game.object.doorControl(1417577297, -37.33113, -1108.873, 26.7198, false, 0.0, 0.0, 0.0);
        mp.game.object.doorControl(2059227086, -39.13366, -1108.218, 26.7198, false, 0.0, 0.0, 0.0);
        mp.game.object.doorControl(1417577297, -60.54582, -1094.749, 26.88872, false, 0.0, 0.0, 0.0);
        mp.game.object.doorControl(2059227086, -59.89302, -1092.952, 26.88362, false, 0.0, 0.0, 0.0);
        mp.game.object.doorControl(-2051651622, -33.80989, -1107.579, 26.57225, false, 0.0, 0.0, 0.0);
        mp.game.object.doorControl(-2051651622, -31.72353, -1101.847, 26.57225, false, 0.0, 0.0, 0.0);
        mp.game.object.doorControl(-1844444717, -29.86917, -148.1571, 57.22648, false, 0.0, 0.0, 0.0);
        mp.game.object.doorControl(mp.game.joaat("v_ilev_bank4door02"), -111.0, 6464.0, 32.0, false, 0.0, 0.0, 0.0);
        mp.game.object.doorControl(mp.game.joaat("v_ilev_bank4door01"), -111.0, 6462.0, 32.0, false, 0.0, 0.0, 0.0);
        mp.game.object.doorControl(520341586, -14.86892, -1441.182, 31.19323, true, 0.0, 0.0, 0.01);
        mp.game.object.doorControl(-550347177, -356.0905, -134.7714, 40.01295, false, 0.0, 0.0, 0.0); /// LSC Carcer Way
        mp.game.object.doorControl(270330101, 723.116, -1088.831, 23.23201, false, 0.0, 0.0, 0.0); /// LSC Popular Street
        mp.game.object.doorControl(-550347177, -1145.898, -1991.144, 14.18357, false, 0.0, 0.0, 0.0); /// LSC Greenwich
        mp.game.object.doorControl(-822900180, 1174.656, 2644.159, 40.50673, false, 0.0, 0.0, 0.0); /// LSC Route 68 1)
        mp.game.object.doorControl(-822900180, 1182.307, 2644.166, 40.50784, false, 0.0, 0.0, 0.0); /// LSC Route 68 2)

    },
    /// Загрузка IPL
    requestIpls() {
        /// Больница
        mp.game.streaming.requestIpl("coronertrash");
        mp.game.streaming.requestIpl("Coroner_Int_On");
        /// DMV
        mp.game.streaming.requestIpl("ex_dt1_02_office_02b");
        /// Трейлер Тревора
        mp.game.streaming.requestIpl("TrevorsTrailerTidy");
    },
    // Получить позицию капота авто
    getHoodPosition(veh) {
        if (!veh) return null
        var vehPos = veh.position;
        var hoodPos = veh.getWorldPositionOfBone(veh.getBoneIndexByName("bonnet"));
        var hoodDist = mp.vdist(vehPos, hoodPos);
        if (hoodDist > 10) return null;
        return veh.getOffsetFromInWorldCoords(0, hoodDist + 2, 0);
    },
    // Получить позицию багажника авто
    getBootPosition(veh) {
        if (!veh) return null;
        var vehPos = veh.position;
        var bootPos = veh.getWorldPositionOfBone(veh.getBoneIndexByName("boot"));
        var bootDist = mp.vdist(vehPos, bootPos);
        if (bootDist > 10) return null;
        return veh.getOffsetFromInWorldCoords(0, -bootDist - 1, 0);
    },
    // Получить ближ. игрока
    getNearPlayer(pos) {
        var nearPlayer;
        var minDist = 99999;
        mp.players.forEachInStreamRange((rec) => {
            if (rec == mp.players.local) return;
            var distance = mp.vdist(pos, rec.position);
            if (distance < minDist) {
                nearPlayer = rec;
                minDist = distance;
            }
        });
        return nearPlayer;
    },
    // Получить ближ. авто
    getNearVehicle(pos, range = 10) {
        var nearVehicle;
        var minDist = 99999;
        mp.vehicles.forEachInStreamRange((veh) => {
            var distToVeh = mp.vdist(pos, veh.position);
            if (distToVeh < range) {
                var distToHood = mp.vdist(pos, this.getHoodPosition(veh));
                var distToBoot = mp.vdist(pos, this.getBootPosition(veh));
                var dist = Math.min(distToVeh, distToHood, distToBoot);
                if (dist < minDist) {
                    nearVehicle = veh;
                    minDist = dist;
                }
            }
        });
        if (nearVehicle) nearVehicle.minDist = minDist;
        return nearVehicle;
    },
    // Получить ближ. игрока/авто
    getNearPlayerOrVehicle(pos, range = 10) {
        var nearPlayer = this.getNearPlayer(pos);
        var nearVehicle = this.getNearVehicle(pos);
        if (!nearPlayer) return nearVehicle;
        if (!nearVehicle) return nearPlayer;
        var distToPlayer = mp.vdist(pos, nearPlayer.position);
        if (distToPlayer <= nearVehicle.minDist) return nearPlayer;
        else return nearVehicle;
    },
    // Получить ближ. объект
    getNearObject(pos, range = 10) {
        var nearObj;
        var minDist = 99999;
        mp.objects.forEach((obj) => {
            var distance = vdist(pos, obj.position);
            if (distance < minDist && distance < range) {
                nearObj = obj;
                minDist = distance;
            }
        });
        return nearObj;
    },
    // Рисовать текст на экране
    drawText2d(text, pos = [0.8, 0.5], color = [255, 255, 255, 255], scale = [0.3, 0.3]) {
        mp.game.graphics.drawText(text, pos, {
            font: 0,
            color: color,
            scale: scale,
            outline: true
        });
    },
    // Получить игрока по нику
    getPlayerByName(name) {
        if (!name) return null;
        var result;
        mp.players.forEach((recipient) => {
            if (recipient.name == name) {
                result = recipient;
                return;
            }
        });
        return result;
    },
    /// Отключить управление/движение игроку
    disablePlayerMoving(disable) {
        playerMovingDisabled = disable;
    }
};


Math.clamp = function(value, min, max) {
    return Math.max(min, Math.min(max, value));
}

/// Вывод информации в серверную консоль
mp.console = function(object) {
    mp.events.callRemote('console', object);
}

// Вкл/выкл блюр на экране
mp.events.add("blur", (enable, time = 1000) => {
    if (enable) mp.game.graphics.transitionToBlurred(time);
    else mp.game.graphics.transitionFromBlurred(time);
});

// Вкл визуальный эффект
mp.events.add('effect', (effect, duration) => {
    mp.game.graphics.startScreenEffect(effect, duration, false);
});

// Установить пусть GPS на карте
mp.events.add("waypoint.set", (x, y) => {
    mp.game.ui.setNewWaypoint(x, y);
});

// Бессмертие
mp.events.add("godmode.set", (enable) => {
    mp.players.local.setInvincible(enable);
});

/// Отключение движения игрока
mp.events.add('render', () => {
    if (playerMovingDisabled) {
        mp.game.controls.disableControlAction(0, 21, true); /// бег
        mp.game.controls.disableControlAction(0, 22, true); /// прыжок
        mp.game.controls.disableControlAction(0, 31, true); /// вперед назад
        mp.game.controls.disableControlAction(0, 30, true); /// влево вправо
        mp.game.controls.disableControlAction(0, 24, true); /// удары
        mp.game.controls.disableControlAction(1, 200, true); // esc
        mp.game.controls.disableControlAction(0, 140, true); /// удары R
        mp.game.controls.disableControlAction(24, 37, true); /// Tab

        for (let i = 157; i <= 165; i++) {
            mp.game.controls.disableControlAction(24, i, true); /// цифры 1-9
        }
    }
});