"use strict";
/// Модуль для взаимодействия со всеми экономическими показателями на сервере

let economicIndicators = new Array();
module.exports = {
    async init() {
        economicIndicators = await db.Models.EconomicIndicator.findAll();
        mp.events.call("economy.done");
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