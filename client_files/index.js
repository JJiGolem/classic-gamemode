"use strict";
/// Подключение всех модулей на сервере

/// Служебные модули
require('base');
require('utils');
require('browser');
let browserLoaded = false;
let initDone = false;
// 2d text on
/// Автоподключение клиентских модулей
mp.events.add('init', (activeModules) => {
    activeModules.forEach(moduleName => {
        require(moduleName);
    });

    initDone = true;
    if (browserLoaded) {
        mp.events.callRemote('player.joined');
    }
});

mp.events.add('browserDomReady', (browser) => {
    browserLoaded = true;
    if (initDone) {
        // 2d text off
        mp.events.callRemote('player.joined');
    }
});