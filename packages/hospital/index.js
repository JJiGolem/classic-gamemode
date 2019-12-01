"use strict";

module.exports = {
    // Кол-во хп при использования аптечки (самолечение)
    medHealth: 20,
    // Кол-во хп при использования пластыря (самолечение)
    patchHealth: 5,
    // Макс. кол-во хп при использовании аптечки/пластыря (самолечение)
    medMaxHealth: 80,
    // Цена за леченеие 1 ХП игрока (предложение лечения)
    healingPrice: 1,
    // Кол-во боеприпасов, списываемое за выдачу формы
    clothesAmmo: 0,
    // Кол-во медикаментов, списываемое за выдачу снаряжения
    itemMedicines: 100,
    // Цена за реанимацию игрока
    knockedPrice: 50,
    // Анти-флуд получения премии за реанимацию
    knockedWaitTime: 60 * 60 * 1000,
    // Сохраненные реанимации (characterId : time)
    knockedLogs: {},
    // Мин. ранг для выдачи медкарты
    giveMedCardRank: 5,
    // Срок действия медкарты (дни)
    medCardDays: 30,
};
