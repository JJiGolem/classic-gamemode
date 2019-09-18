"use strict";
/// Модуль для взаимодействия со всеми экономическими показателями на сервере

let economicIndicators = new Array();
module.exports = {
    async init() {
        console.log("[ECONOMY] load economic indicators...");

        economicIndicators = await db.Models.EconomicIndicator.findAll();
        
        for (let file of fs.readdirSync(path.dirname(__dirname))) {
            if (file != 'base' && !ignoreModules.includes(file) && fs.existsSync(path.dirname(__dirname) + "/" + file + '/index.js'))
            {
                let objects = require('../' + file + '/index');
                for (const key in objects) {
                    if (typeof objects[key] == "number" ||
                        typeof objects[key] == "string" ||
                        typeof objects[key] == "boolean") {
                            let economicIndicator = economicIndicators.find(elem => elem.type == `${file}.${key}`);
                            if (economicIndicator == null) {
                                let economicIndicator = await db.Models.EconomicIndicator.create({
                                    type: `${file}.${key}`,
                                    name: `${file}.${key}`,
                                    description: "",
                                    value: objects[key] + ""
                                });
                                economicIndicators.push(economicIndicator);
                            }
                            else {
                                if (typeof objects[key] == "number") objects[key] = parseFloat(economicIndicator.value);
                                if (typeof objects[key] == "string") objects[key] = economicIndicator.value;
                                if (typeof objects[key] == "boolean") objects[key] = economicIndicator.value == "true";
                            }
                    }
                }
            }
        }

        mp.events.call("economy.done");

        console.log("[ECONOMY] economic indicators loaded.");
    },
    async create(type, name, count) {
        economicIndicators.push(await db.Models.EconomicIndicator.create({type: type, name: name, count: count}));
    },
    getAll() {
        return economicIndicators;
    },
    /// Функция получения своего экономического показателя по типу
    /// Пример типу:
    /// bizes.tax.max
    /// Вернется объект:
    /// {type: "bizes.tax.max", name: "Max tax for bizes", count: 0.5}
    getByType(type) {
        return economicIndicators.find( x => x.type == type);
    },
    /// Функция смены значения по типу
    setByType(array) {
        array.forEach(element => {
            let economicIndicator = economicIndicators.find( x => x.type == element.type);
            economicIndicator.count = element.count;
            economicIndicator.save();
        });
    }
}