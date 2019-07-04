"use strict";
/// Базовый модуль, отвечающий за загрузку остальных модулей, так же выполняет основные сервисные функции
let fs = require('fs');
let path = require('path');


let db = require('./db');
let ignoreModules = require('./ignoreModules');

/// Вызов подключения к БД, подключение всех модулей и вызов их инициализации
db.connect(function() {
    fs.readdirSync(path.dirname(__dirname)).forEach(file => {
        file != 'base' && !ignoreModules.includes(file) && mp.events.add(require('../' + file + '/events'));
    });

    mp.events.call('init');
});