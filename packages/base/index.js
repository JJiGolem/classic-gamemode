"use strict";
/// Базовый модуль, отвечающий за загрузку остальных модулей, так же выполняет основные сервисные функции
let fs = require('fs');
let path = require('path');


global.db = require('./db');
global.ignoreModules = require('./ignoreModules');
let ignoreClientModules = require('./ignoreClientModules');
let activeClientModules = new Array();

/// Подключение функций любого существующего, включенного модуля
/// Если модуль существует, возвращаются его функции (те что в module.exports, в index.js)
/// Если модуль не существует возвращается null
/// Важно перед каждым использованием модуля  проверять подключился ли он!
global.call = (moduleName) => {
    if(!fs.existsSync(path.dirname(__dirname)+ "/" + moduleName + "/index.js") || ignoreModules.includes(moduleName)) return null;
    return require(path.dirname(__dirname)+ "/" + moduleName + "/index.js");
}



/// Вызов подключения к БД, подключение всех модулей и вызов их инициализации
/// Должен быть ниже объявления глобальных функций, что бы они успели загрузииться
db.connect(function() {
    fs.readdirSync(path.dirname(__dirname)).forEach(file => {
        !ignoreModules.includes(file) && fs.existsSync(path.dirname(__dirname)+ "/" + file + "/events.js") && mp.events.add(require('../' + file + '/events'));
    });

    fs.readdirSync(path.dirname(__dirname) + "/../client_packages").forEach(file => {
        !new Array('base', 'index.js', '.listcache', 'browser', 'utils').includes(file) && !ignoreClientModules.includes(file) && activeClientModules.push(file);
    });

    mp.events.call('init');
});

mp.events.add('playerJoin', (player) => {
    player.call('init', [activeClientModules]);
});

/// Main events list
/// init - загрузка всех моделей и событий всех модулей закончена
/// player.joined - пользователь подключен
/// auth.done - пользователь авторизован
/// characterInit.done - пользователь выбрал персоонажа
/// characterInit.create.init - событие которое говорит о том, что создан новый персоонаж(player.character) и нужно повесить на него нужные объекты.