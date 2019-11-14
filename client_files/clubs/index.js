"use strict";


/*
    Модуль клубов для мафий.

    created 14.11.19 by Carter Slade
*/

mp.clubs = {
    // Барные стойки в клубах (полигоны)
    bars: {
        // Багама (La Cosa Nostra)
        12: [
            // первая стойка
            [{
                    x: -1390.869873046875,
                    y: -597.3942260742188
                },
                {
                    x: -1394.5435791015625,
                    y: -599.474609375
                },
                {
                    x: -1394.9027099609375,
                    y: -603.2318115234375
                },
                {
                    x: -1393.0018310546875,
                    y: -607.9688110351562
                },
                {
                    x: -1390.001953125,
                    y: -610.6476440429688
                }
            ],
            // вторая стойка
            [{
                    x: -1373.954345703125,
                    y: -624.114501953125
                },
                {
                    x: -1383.229248046875,
                    y: -630.1057739257812
                },
                {
                    x: -1381.6634521484375,
                    y: -632.8622436523438
                },
                {
                    x: -1372.8597412109375,
                    y: -626.2239379882812
                }
            ],
        ],
        // Текила (La Eme)
        13: [
            [{
                    x: -560.07470703125,
                    y: 284.3400573730469
                },
                {
                    x: -559.5648803710938,
                    y: 289.45013427734375
                },
                {
                    x: -561.674560546875,
                    y: 289.3218994140625
                },
                {
                    x: -561.9251098632812,
                    y: 284.5945739746094
                }
            ]
        ],
        // Ванила (Russian Mafia)
        14: [
            [{
                    x: 126.0940933227539,
                    y: -1282.380126953125
                },
                {
                    x: 129.4110107421875,
                    y: -1287.9600830078125
                },
                {
                    x: 131.23081970214844,
                    y: -1287.2015380859375
                },
                {
                    x: 127.67247009277344,
                    y: -1281.123779296875
                }
            ]
        ],
    },
    // Игрок находится возле барной стойки
    isNearBar: false,
    // Клуб, в котором находится игрок (ид организации клуба)
    currentClub: null,

    setNearBar(enable) {
        if (enable == this.isNearBar) return;
        this.isNearBar = enable;
        if (this.isNearBar) mp.prompt.showByName("clubs_buy");
        else mp.prompt.hide();
    },
};

mp.events.add({
    "clubs.setCurrentClub": (factionId) => {
        mp.clubs.currentClub = factionId;
    },
    "time.main.tick": () => {
        if (!mp.clubs.currentClub) return;

        var pos = mp.players.local.position;
        var isNearBar = false;
        mp.clubs.bars[mp.clubs.currentClub].forEach(polygon => {
            if (mp.utils.inPolygon(pos, polygon)) isNearBar = true;
        });
        mp.clubs.setNearBar(isNearBar);
    },
});
