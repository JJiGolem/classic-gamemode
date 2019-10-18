"use strict";
/// Подключение всех модулей на сервере

/// Служебные модули
require('base');
require('utils');
require('browser');
let browserLoaded = false;
let initDone = false;

/// Автоподключение клиентских модулей
mp.events.add('init', (activeModules) => {
    activeModules.forEach(moduleName => {
        require(moduleName);
    });

    if (browserLoaded && initDone) {
        mp.events.callRemote('player.joined');
    }
});

mp.events.add('browserDomReady', (browser) => {
    if (browserLoaded && initDone) {
        mp.events.callRemote('player.joined');
    }
});