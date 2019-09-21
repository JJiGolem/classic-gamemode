"use strict";
/// Модуль реализующий админские функции
let commands = {};

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
            if (file != 'base' && !ignoreModules.includes(file) && fs.existsSync(path.dirname(__dirname) + "/" + file + '/commands.js'))
            {
                Object.assign(commands, require('../' + file + '/commands'));
                console.log(`[COMMANDS] --${file}`);
            }
        });
        console.log("[COMMANDS] loaded.");
    },
    getCommands() {
        return commands;
    }
};
