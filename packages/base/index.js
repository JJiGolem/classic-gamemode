"use strict";
/// Базовый модуль, отвечающий за загрузку остальных модулей, так же выполняет основные сервисные функции
let fs = require('fs');
let path = require('path');


global.db = require('./db');
global.ignoreModules = require('./ignoreModules');
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
        file != 'base' && !ignoreModules.includes(file) && mp.events.add(require('../' + file + '/events'));
    });

    mp.events.call('init');
});