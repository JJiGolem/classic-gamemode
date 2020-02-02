"use strict";

let fs = require('fs');
let path = require('path');

let isInited = false;

global.db = require('./db');
global.ignoreModules = require('./ignoreModules');
let ignoreClientModules = require('./ignoreClientModules');
let activeClientModules = [];
global.activeServerModules = [];

global.call = (moduleName) => {
    if (!fs.existsSync(path.dirname(__dirname)+ "/" + moduleName + "/index.js")) return {
        isEmpty: true,
    };
    if (ignoreModules.includes(moduleName)) {
        let requireObject = require(path.dirname(__dirname)+ "/" + moduleName + "/index.js");
        let newObject = {
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
};

global.inited = (dirname) => {
    let path = dirname.split("\\");
    let moduleName = path[path.length - 1];
    modulesToLoad.splice(modulesToLoad.findIndex(x => x === moduleName), 1);
    if (modulesToLoad.length === 0) {
        if (isInited) throw new Error(`Сервер уже был проинициализирован. Попытка повторной инициализации от модуля ${moduleName}`);
        isInited = true;
        console.log("[BASE] Все модули загружены")
        playersJoinPool.forEach(player => {
            if (player == null) return;
            if (!mp.players.exists(player)) return;
            player.call('init', [activeClientModules]);
        });
    }
};

let modulesToLoad = [];
let playersJoinPool = [];

global.debug = (text) => {
    require('../terminal').debug(text);
};
global.d = (text) => {
    mp.players.forEach(rec => {
        if (!rec.character) return;
        require('../notifications').info(rec, text, `Server DEBUG-LOG`);
    });
};

db.connect(function() {
    fs.readdirSync(path.dirname(__dirname)).forEach(file => {
        if (!ignoreModules.includes(file) && fs.existsSync(path.dirname(__dirname)+ "/" + file + "/events.js")) {
            let events = require('../' + file + '/events');
            mp.events.add(events);
            activeServerModules.push(file);
            if (events["init"] != null) {
                modulesToLoad.push(file);
            }
        }
    });

    fs.readdirSync(path.dirname(__dirname) + "/../client_packages").forEach(file => {
        !['base', 'index.js', '.listcache', 'browser', 'utils'].includes(file) && !ignoreClientModules.includes(file) && activeClientModules.push(file);
    });

    mp.events.call('init');
});

mp.events.add("playerJoin", (player) => {
    player.dimension = player.id + 1;
});

mp.events.add('player.join', (player) => {
    if (modulesToLoad.length !== 0) return playersJoinPool.push(player);
    player.call('init', [activeClientModules]);
});