"use strict";

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

    },

};




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
