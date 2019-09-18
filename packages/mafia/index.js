"use strict";

module.exports = {
    // Позиции, где можно проводить бизвары
    bizWarPositions: [{
            id: 0,
            x: 1549.3131103515625,
            y: 2203.40966796875,
        },
        {
            id: 1,
            x: 1063.94775390625,
            y: 2357.687255859375,
        },
        {
            id: 2,
            x: 2953.53466796875,
            y: 2787.001708984375,
        },
        {
            id: 3,
            x: 1534.7117919921875,
            y: -2123.951171875,
        },
        {
            id: 4,
            x: 2386.0888671875,
            y: 3092.919677734375,
        }
    ],
    // Мин. ранг, который может бизварить
    bizWarRank: 8,
    // Зоны, на которых происходит бизвар
    wars: {},
    // Время завершения последнего бизвара (ms)
    lastWarTime: 0,
    // Время отдыха между бизварами (ms)
    waitWarTime: 20 * 60 * 1000,
    // Повторное участие в бизваре после убийства
    reveangeKill: false,
    // Время захвата (ms)
    warTime: 5 * 60 * 1000,
    // Промежуток часов, в который можно начать захват
    bizWarInterval: [14, 23],
    // Кол-во боеприпасов, списываемое за выдачу оружия
    gunAmmo: 100,
    // Кол-во боеприпасов, списываемое за выдачу патронов
    ammoAmmo: 1,

    convertToClientMafiaZones() {
        var zones = this.bizWarPositions.slice();
        var warZoneIds = Object.keys(this.wars);
        if (warZoneIds.length) zones[warZoneIds[0]].flash = true;
        return zones;
    },
};
