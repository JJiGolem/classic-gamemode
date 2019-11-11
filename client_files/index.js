"use strict";
/// Подключение всех модулей на сервере

/// Служебные модули
require('base');
require('utils');
require('browser');
let browserLoaded = false;
let initDone = false;
let showLoadingText = true;

/// Автоподключение клиентских модулей
mp.events.add('init', (activeModules) => {
    activeModules.forEach(moduleName => {
        require(moduleName);
        mp.events.callRemote('console', `LOADED: ${moduleName}`);
    });
    mp.events.callRemote('console', "modules inited");
    initDone = true;
    if (browserLoaded) {
        showLoadingText = false;
        mp.events.callRemote('player.joined');
    }
});

mp.events.add('browserDomReady', (browser) => {
    browserLoaded = true;
    mp.events.callRemote('console', "browser loaded");
    if (initDone) {
        showLoadingText = false;
        mp.events.callRemote('player.joined');
    }
});

mp.events.add('render', () => {
    if (showLoadingText) {
        mp.game.graphics.drawText("Сервер загружается, подождите", [0.5, 0.5], { 
            font: 0, 
            color: [252, 223, 3, 200], 
            scale: [0.5, 0.5], 
            outline: true
        });
    }
});