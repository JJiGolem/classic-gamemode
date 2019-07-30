"use strict";
/// Подключение всех модулей на сервере

/// Служебные модули
require('base');
require('utils');
require('browser');

/// Автоподключение клиентских модулей
mp.events.add('init', (activeModules) => {
    activeModules.forEach(moduleName => {
        require(moduleName);
    });
    mp.events.callRemote('player.joined');
});