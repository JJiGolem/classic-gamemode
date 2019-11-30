"use strict";

let jobs = call('jobs');
let notifs = call('notifications');
let routes = call('routes');
let utils = call('utils');

module.exports = {
    // ИД предмета 'Снежок'
    snowballItemId: 117,
    // Кол-во снежков, которое можно подобрать с земли
    snowballCount: 5,
    // Цена аренды трактора
    vehPrice: 100,
    // ЗП за одну точку на тракторе
    pay: 5,
    // Новогодняя одежда
    clothes: {
        0: [ // муж.
            [{
                    itemId: 6,
                    params: {
                        variation: 2,
                        texture: 0,
                        sex: 1,
                        clime: '[-15,20]',
                        name: 'Зимняя шапка',
                    },
                },
                {
                    itemId: 6,
                    params: {
                        variation: 2,
                        texture: 1,
                        sex: 1,
                        clime: '[-15,20]',
                        name: 'Зимняя шапка',
                    },
                },
                {
                    itemId: 6,
                    params: {
                        variation: 2,
                        texture: 2,
                        sex: 1,
                        clime: '[-15,20]',
                        name: 'Зимняя шапка',
                    },
                },
                {
                    itemId: 6,
                    params: {
                        variation: 2,
                        texture: 3,
                        sex: 1,
                        clime: '[-15,20]',
                        name: 'Зимняя шапка',
                    },
                },
                {
                    itemId: 6,
                    params: {
                        variation: 34,
                        texture: 0,
                        sex: 1,
                        clime: '[-15,20]',
                        name: 'Зимняя шапка',
                    },
                },
            ],
            [{
                    itemId: 7,
                    params: {
                        variation: 124,
                        texture: 0,
                        torso: 1,
                        undershirt: 44,
                        sex: 1,
                        pockets: '[7,7,7,7,14,7]',
                        clime: '[-15,20]',
                        name: 'Зимняя куртка',
                    },
                },
                {
                    itemId: 7,
                    params: {
                        variation: 153,
                        texture: 14,
                        torso: 1,
                        undershirt: 44,
                        sex: 1,
                        pockets: '[7,7,7,7,14,7]',
                        clime: '[-15,20]',
                        name: 'Зимняя куртка',
                    },
                },
                {
                    itemId: 7,
                    params: {
                        variation: 168,
                        texture: 2,
                        torso: 1,
                        undershirt: 44,
                        sex: 1,
                        pockets: '[7,7,7,7,14,7]',
                        clime: '[-15,20]',
                        name: 'Зимняя куртка',
                    },
                },
                {
                    itemId: 7,
                    params: {
                        variation: 153,
                        texture: 22,
                        torso: 1,
                        undershirt: 44,
                        sex: 1,
                        pockets: '[7,7,7,7,14,7]',
                        clime: '[-15,20]',
                        name: 'Зимняя куртка',
                    },
                },
            ],
            [{
                    itemId: 8,
                    params: {
                        variation: 9,
                        texture: 0,
                        sex: 1,
                        pockets: '[7,8,7,8,14,8,14,8]',
                        clime: '[-15,20]',
                        name: 'Зимние брюки',
                    },
                },
                {
                    itemId: 8,
                    params: {
                        variation: 9,
                        texture: 5,
                        sex: 1,
                        pockets: '[7,8,7,8,14,8,14,8]',
                        clime: '[-15,20]',
                        name: 'Зимние брюки',
                    },
                },
                {
                    itemId: 8,
                    params: {
                        variation: 9,
                        texture: 6,
                        sex: 1,
                        pockets: '[7,8,7,8,14,8,14,8]',
                        clime: '[-15,20]',
                        name: 'Зимние брюки',
                    },
                },
                {
                    itemId: 8,
                    params: {
                        variation: 9,
                        texture: 9,
                        sex: 1,
                        pockets: '[7,8,7,8,14,8,14,8]',
                        clime: '[-15,20]',
                        name: 'Зимние брюки',
                    },
                },
            ],
            [{
                    itemId: 9,
                    params: {
                        variation: 51,
                        texture: 0,
                        sex: 1,
                        clime: '[-15,20]',
                        name: 'Зимние ботинки',
                    },
                },
                {
                    itemId: 9,
                    params: {
                        variation: 14,
                        texture: 0,
                        sex: 1,
                        clime: '[-15,20]',
                        name: 'Зимние ботинки',
                    },
                },
                {
                    itemId: 9,
                    params: {
                        variation: 14,
                        texture: 1,
                        sex: 1,
                        clime: '[-15,20]',
                        name: 'Зимние ботинки',
                    },
                },
            ]
        ],
        1: [ // жен.
            [{
                    itemId: 6,
                    params: {
                        variation: 5,
                        texture: 0,
                        sex: 0,
                        clime: '[-15,20]',
                        name: 'Зимняя шапка',
                    },
                },
                {
                    itemId: 6,
                    params: {
                        variation: 5,
                        texture: 1,
                        sex: 0,
                        clime: '[-15,20]',
                        name: 'Зимняя шапка',
                    },
                },
                {
                    itemId: 6,
                    params: {
                        variation: 5,
                        texture: 5,
                        sex: 0,
                        clime: '[-15,20]',
                        name: 'Зимняя шапка',
                    },
                },
                {
                    itemId: 6,
                    params: {
                        variation: 5,
                        texture: 7,
                        sex: 0,
                        clime: '[-15,20]',
                        name: 'Зимняя шапка',
                    },
                },
                {
                    itemId: 6,
                    params: {
                        variation: 33,
                        texture: 0,
                        sex: 0,
                        clime: '[-15,20]',
                        name: 'Зимняя шапка',
                    },
                },
            ],
            [{
                    itemId: 7,
                    params: {
                        variation: 150,
                        texture: 14,
                        torso: 9,
                        undershirt: 2,
                        sex: 0,
                        pockets: '[7,7,7,7,14,7]',
                        clime: '[-15,20]',
                        name: 'Зимняя куртка',
                    },
                },
                {
                    itemId: 7,
                    params: {
                        variation: 150,
                        texture: 22,
                        torso: 9,
                        undershirt: 2,
                        sex: 0,
                        pockets: '[7,7,7,7,14,7]',
                        clime: '[-15,20]',
                        name: 'Зимняя куртка',
                    },
                },
                {
                    itemId: 7,
                    params: {
                        variation: 150,
                        texture: 7,
                        torso: 9,
                        undershirt: 2,
                        sex: 0,
                        pockets: '[7,7,7,7,14,7]',
                        clime: '[-15,20]',
                        name: 'Зимняя куртка',
                    },
                },
                {
                    itemId: 7,
                    params: {
                        variation: 150,
                        texture: 5,
                        torso: 9,
                        undershirt: 2,
                        sex: 0,
                        pockets: '[7,7,7,7,14,7]',
                        clime: '[-15,20]',
                        name: 'Зимняя куртка',
                    },
                },
            ],
            [{
                    itemId: 8,
                    params: {
                        variation: 45,
                        texture: 0,
                        sex: 0,
                        pockets: '[7,8,7,8,14,8,14,8]',
                        clime: '[-15,20]',
                        name: 'Зимние брюки',
                    },
                },
                {
                    itemId: 8,
                    params: {
                        variation: 45,
                        texture: 1,
                        sex: 0,
                        pockets: '[7,8,7,8,14,8,14,8]',
                        clime: '[-15,20]',
                        name: 'Зимние брюки',
                    },
                },
                {
                    itemId: 8,
                    params: {
                        variation: 45,
                        texture: 2,
                        sex: 0,
                        pockets: '[7,8,7,8,14,8,14,8]',
                        clime: '[-15,20]',
                        name: 'Зимние брюки',
                    },
                },
                {
                    itemId: 8,
                    params: {
                        variation: 45,
                        texture: 3,
                        sex: 0,
                        pockets: '[7,8,7,8,14,8,14,8]',
                        clime: '[-15,20]',
                        name: 'Зимние брюки',
                    },
                },
            ],
            [{
                    itemId: 9,
                    params: {
                        variation: 52,
                        texture: 0,
                        sex: 0,
                        clime: '[-15,20]',
                        name: 'Зимние ботинки',
                    },
                },
                {
                    itemId: 9,
                    params: {
                        variation: 52,
                        texture: 1,
                        sex: 0,
                        clime: '[-15,20]',
                        name: 'Зимние ботинки',
                    },
                },
                {
                    itemId: 9,
                    params: {
                        variation: 52,
                        texture: 2,
                        sex: 0,
                        clime: '[-15,20]',
                        name: 'Зимние ботинки',
                    },
                },
            ]
        ]
    },

    // получить арендованный трактор игрока
    getVehByDriver(player) {
        return mp.vehicles.toArray().find(x => x.db && x.db.key == 'job' && x.db.owner == 8 && x.driver && x.driver.playerId == player.id && x.driver.characterId == player.character.id);
    },
    // получить игрока, который арендовал грузовик
    getDriverByVeh(veh) {
        if (!veh.driver) return;
        var d = veh.driver;
        return mp.players.toArray().find(x => x.character && x.id == d.playerId && x.character.id == d.characterId);
    },
    // очистить трактор от аренды водителя
    clearVeh(veh) {
        var driver = this.getDriverByVeh(veh);
        if (driver) driver.call("routes.checkpoints.destroy");
        // this.dropBizOrderByVeh(veh);
        delete veh.driver;
        // if (veh.products) {
        //     delete veh.products;
        //     veh.setVariable("label", null);
        // }
    },
    getTractorPoints() {
        var points = [
            [
                new mp.Vector3(-654.2920532226562, -1642.453369140625, 25.0580997467041),
                new mp.Vector3(-655.03515625, -1673.1256103515625, 25.175437927246094),
                new mp.Vector3(-565.2491455078125, -1743.479248046875, 22.1155622438964844),
                new mp.Vector3(-484.2953796386719, -1782.2406005859375, 20.918880462646484),
                new mp.Vector3(-392.7992858886719, -1739.9642333984375, 19.683382034301758),
                new mp.Vector3(-305.93682861328125, -1580.3919677734375, 23.12514877319336),
                new mp.Vector3(-265.5458984375, -1455.3673095703125, 31.20215606689453),
                new mp.Vector3(-270.1459655761719, -1388.9124755859375, 31.265663146972656),
                new mp.Vector3(-268.3664855957031, -1283.2242431640625, 30.834529876708984),
                new mp.Vector3(-265.0310974121094, -1164.4378662109375, 22.98862075805664),
                new mp.Vector3(-246.37081909179688, -1083.180053719375, 24.842971801757812),
                new mp.Vector3(-150.35772705578125, -913.1387939453125, 29.272663116455078),
                new mp.Vector3(-38.2621269260742, -953.2111206054688, 29.37909698486328),
                new mp.Vector3(96.68335723876953, -1001.4390869140625, 29.32448387145996),
                new mp.Vector3(184.3240966796875, -1027.231201171875, 29.32069969177246),
                new mp.Vector3(247.76217651367188, -999.2101440429688, 29.187911987304688),
                new mp.Vector3(300.6017761230469, -855.3385009765625, 29.068342208862305),
                new mp.Vector3(344.67523193359375, -724.8478393554688, 29.22174835205078),
                new mp.Vector3(383.0184326171875, -679.4060668945312, 29.19737434387207),
                new mp.Vector3(403.0129089355469, -704.5912475585938, 29.205183029174805),
                new mp.Vector3(404.1210632324219, -851.376220703125, 29.2924887084961),
                new mp.Vector3(396.18853759765625, -996.7220458984375, 29.30539321899414),
                new mp.Vector3(330.98895263671875, -1038.780517578125, 29.195457458496094),
                new mp.Vector3(269.87762451171875, -1043.7899169921875, 29.15688133239746),
                new mp.Vector3(150.90745544433594, -1006.45068359375, 29.336692810058594),
                new mp.Vector3(151.6217803955078, -893.4631958007812, 30.404172897338867),
                new mp.Vector3(207.66458129882812, -734.9608764648438, 33.977909088134766),
                new mp.Vector3(266.845703125, -585.1871948242188, 43.22456359863281),
                new mp.Vector3(306.1277770996094, -450.10028076171875, 43.51773452758789),
                new mp.Vector3(267.6944885253906, -365.8493957519531, 44.862098693847656),
                new mp.Vector3(136.25758361816406, -315.7079162597656, 45.004119873046875),
                new mp.Vector3(-27.27446174621582, -256.01531982421875, 46.38732147216797),
                new mp.Vector3(-202.70399475097656, -181.4920196533203, 43.74177169799805),
                new mp.Vector3(-316.457552246094, -178.11410522460938, 39.25017166137695),
                new mp.Vector3(-412.6144714355469, -222.9801025390625, 36.261924743652344),
                new mp.Vector3(-526.3804931640625, -278.2295837402344, 35.353397369384766),
                new mp.Vector3(-543.8798217773438, -328.8995666503906, 35.06068801879883),
                new mp.Vector3(-502.6880187988281, -382.20623779296875, 34.83169174194336),
                new mp.Vector3(-313.8511657714844, -407.1492919921875, 29.945598602294922),
                new mp.Vector3(-233.163330078125, -429.3943176269531, 30.786697387695312),
                new mp.Vector3(-224.5269317626953, -547.46044921875, 34.65507888793945),
                new mp.Vector3(-255.5640106201172, -638.6006469726562, 33.37273406982422),
                new mp.Vector3(-244.98068237304688, -687.504638671875, 33.25846862792969),
                new mp.Vector3(-263.45550537109375, -781.9988403320312, 32.25182342529297),
                new mp.Vector3(-271.5507507324219, -872.4359741210938, 31.42973518371582),
                new mp.Vector3(-207.23370361328125, -912.9452514648438, 29.17279052734375),
                new mp.Vector3(-250.12806701660156, -1044.840576171875, 27.444793701171875),
                new mp.Vector3(-280.9338684082031, -1190.47607421875, 23.540868759155273),
                new mp.Vector3(-281.74346923828125, -1393.954833984375, 31.285133590698242),
                new mp.Vector3(-297.0048522949219, -1537.8817138671875, 26.80792808532715),
                new mp.Vector3(-381.7126770019531, -1680.84716796875, 18.844423294067383),
                new mp.Vector3(-426.68115234375, -1763.79931640625, 20.390804290771484),
                new mp.Vector3(-593.4259643554688, -1717.385986328125, 23.21784019470215),
                new mp.Vector3(-653.76953125, -1655.11572265625, 25.37245750427246),
                new mp.Vector3(-637.7229614257812, -1627.47314453125, 25.9925479888916),
            ]
        ];

        var rand = utils.randomInteger(0, points.length - 1);
        return points[rand];
    },
    startTractorRoute(player) {
        var header = `Уборка снега`
        var points = this.getTractorPoints();
        var data = Object.assign({}, routes.defaultCheckpointData);
        data.scale = 4;
        routes.start(player, data, points, () => {
            var veh = player.vehicle;
            if (!veh || !veh.db || veh.db.key != "job" || veh.db.owner != 8) {
                notifs.error(player, `Необходимо находиться в тракторе`, header);
                return false;
            }
            if (player.character.job != 8) {
                notifs.error(player, `Вы не работаете снегоуборщиком`, header);
                return false;
            }
            player.character.pay += this.pay;
            player.character.save();
            return true;
        }, () => {
            notifs.success(player, `Снега стало меньше!`, header);
            jobs.pay(player);
        });
    },
};
