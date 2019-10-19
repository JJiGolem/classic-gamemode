"use strict";
/// Базовый модуль, отвечающий за загрузку остальных модулей, так же выполняет основные сервисные функции
let fs = require('fs');
let path = require('path');
let exec = require('exec');
let childProcess = require('child_process');

const isBuild = mp.config.isBuild;

global.db = require('./db');
global.ignoreModules = require('./ignoreModules');
let ignoreClientModules = require('./ignoreClientModules');
let activeClientModules = new Array();
global.activeServerModules = new Array();

/// Подключение функций любого существующего, включенного модуля
/// Если модуль существует, возвращаются его функции (те что в module.exports, в index.js)
/// Если модуль не существует или существует, но отключен, то вернется объект с пустыми переменными и функциями с флагом isIgnored = true
/// Использовать после события init во избежание ошибок
global.call = (moduleName) => {
    if (!fs.existsSync(path.dirname(__dirname)+ "/" + moduleName + "/index.js")) return {
        /// Флаг, который говорит о том, что модуль отключен/отсутствует
        isEmpty: true,
    };
    if (ignoreModules.includes(moduleName)) {
        let requireObject = require(path.dirname(__dirname)+ "/" + moduleName + "/index.js");
        let newObject = {
            /// Флаг, который говорит о том, что модуль отключен/отсутствует
            isEmpty: true,
        };
        for (const key in requireObject) {
            const element = requireObject[key];
            if (typeof element === "function") {
                newObject[key] = () => {};
            }
            else {
                newObject[key] = {};
            }
        }
        return newObject;
    }
    return require(path.dirname(__dirname)+ "/" + moduleName + "/index.js");
}

// Дебаг
global.debug = (text) => {
    require('../terminal').debug(text);
}

if (!isBuild) {
    require('../../scripts/dev').compile();
} else {
    childProcess.execSync('npm run test');
}

/// Вызов подключения к БД, подключение всех модулей и вызов их инициализации
/// Должен быть ниже объявления глобальных функций, что бы они успели загрузииться
db.connect(function() {
    fs.readdirSync(path.dirname(__dirname)).forEach(file => {
        if (!ignoreModules.includes(file) && fs.existsSync(path.dirname(__dirname)+ "/" + file + "/events.js")) {
            mp.events.add(require('../' + file + '/events'));
            activeServerModules.push(file);
        } 
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
/// economy.done - загрузка экономических показателей окончена
/// economy.updated - экономические показатели обновлены
/// player.joined - пользователь подключен
/// auth.done - пользователь авторизован
/// characterInit.done - пользователь выбрал персоонажа
/// characterInit.create.init - событие которое говорит о том, что создан новый персоонаж(player.character) и нужно повесить на него нужные объекты.
