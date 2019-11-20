"use strict";
/// Модуль реализующий админские функции
let commands = {};

let massTeleportData = {
    position: null,
    dimension: null
};

module.exports = {
    // Кол-во варнов, при которых игрок улетаем в бан
    banWarns: 3,
    // Время снятия бана за варны
    warnsBanDays: 30,
    // Время снятия варна от последнего
    warnDays: 14,

    /// Инициализация админских команд из всех модулей
    init() {
        console.log("[COMMANDS] load commands...");
        fs.readdirSync(path.dirname(__dirname)).forEach(file => {
            if (file != 'base' && !ignoreModules.includes(file) && fs.existsSync(path.dirname(__dirname) + "/" + file + '/commands.js')) {
                Object.assign(commands, require('../' + file + '/commands'));
                console.log(`[COMMANDS] --${file}`);
            }
        });
        console.log("[COMMANDS] loaded.");
    },
    getCommands() {
        return commands;
    },
    isValidArg(type, arg) {
        if (type == "n") return !isNaN(arg) && arg.length > 0;
        if (type == "s") return arg && arg.length > 0;
        if (type == "b") return !isNaN(arg) && (arg == 0 || arg == 1);
        return false;
    },
    toValidArg(type, arg) {
        if (type == "n") return parseFloat(arg);
        if (type == "b") return arg == 1 ? true : false;
        return arg;
    },
    isTerminalCommand(args) {
        return args.indexOf(':') != -1;
    },
    getMassTeleportData() {
        return massTeleportData;
    },
    setMassTeleportData(pos, dimension) {
        massTeleportData.position = pos;
        massTeleportData.dimension = dimension;
    }
};
