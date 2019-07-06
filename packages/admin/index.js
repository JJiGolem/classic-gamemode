"use strict";
/// Модуль реализующий админские функции
module.exports = {
    /// Инициализация админских команд из всех модулей
    init() {
        console.log("[COMMANDS] load commands...");
        let commands = {};
        fs.readdirSync(path.dirname(__dirname)).forEach(file => {
            if (file != 'base' && !ignoreModules.includes(file) && fs.existsSync(path.dirname(__dirname) + "/" + file + '/commands.js'))
            {
                Object.assign(commands, require('../' + file + '/commands'));
                console.log(`[COMMANDS] --${file}`);
            }
        });
        console.log("[COMMANDS] loaded.");
        return commands;
    },
};