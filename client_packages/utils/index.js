"use strict";

mp.utils = {};

/// Возвращает имя улицы
mp.utils.getStreetName = (pos) => {
    var getStreet = mp.game.pathfind.getStreetNameAtCoord(pos.x, pos.y, pos.z, 0, 0);
    var streetName = mp.game.ui.getStreetNameFromHashKey(getStreet["streetName"]);
    return streetName;
}

/// Возвращает название района
mp.utils.getRegionName = (pos) => {
    return mp.game.ui.getLabelText(mp.game.zone.getNameOfZone(pos.x, pos.y, pos.z));
}

/// Возваращает якорь миникарты
mp.utils.getMinimapAnchor = () => {
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
}

/// Вывод информации в серверную консоль
mp.console = function(object) {
    mp.events.callRemote('console', object);
}

/// Управление камерой
mp.utils.cam = require('utils/camera.js');

/// Convert the object to a string
mp.utils.objToString = (obj) => {
    var rs = '';
    var not_first = false;

    for(var k in obj){
        if(not_first) rs += ',';
        if(typeof obj[k] === 'object'){
            rs +=  '"'+k+'": {'+objToString(obj[k])+'}';
        }
        else if(typeof obj[k] === 'string' || typeof obj[k] === 'function'){
            rs += '"'+k+'":"'+obj[k]+'"';
        }
        else if(typeof obj[k] === 'number'){
            rs += '"'+k+'":'+obj[k]+'';
        }
        not_first = true;
    }
    return rs;
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
