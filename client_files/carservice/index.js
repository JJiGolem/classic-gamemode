let isInCarServiceShape = false;
let isPreparingForDiagnostics = false;
let currentRepairingVehicle;

let carServiceControlsToDisable = false;

mp.isInCarService = () => {
    return isInCarServiceShape;
}

let peds = [{
    model: "a_m_m_hillbilly_01",
    position: {
        x: 541.69775390625,
        y: -192.27578735351562,
        z: 54.48133850097656
    },
    heading: 38.72,
    marker: {
        x: 541.351318359375,
        y: -191.85520935058594,
        z: 53.34,
        color: [255, 255, 125, 120],
        enterEvent: "carservice.jobshape.enter",
        leaveEvent: "carservice.jobshape.leave"
    },
    defaultScenario: 'WORLD_HUMAN_AA_SMOKE'
},
{
    model: "a_m_m_hillbilly_01",
    position: {
        x: 488.8618469238281,
        y: -1318.2044677734375,
        z: 29.219741821289062
    },
    heading: 290.9831237792969,
    marker: {
        x: 489.3613586425781,
        y: -1318.0531005859375,
        z: 28.090497360229492,
        color: [255, 255, 125, 128],
        enterEvent: "carservice.jobshape.enter",
        leaveEvent: "carservice.jobshape.leave"
    },
    defaultScenario: 'WORLD_HUMAN_SMOKING'
},
{
    model: "a_m_m_hillbilly_01",
    position: {
        x: -229.68690490722656,
        y: -1377.2591552734375,
        z: 31.258243560791016
    },
    heading: 212.7614288330078,
    marker: {
        x: -229.38626098632812,
        y: -1377.6666259765625,
        z: 30.118222579956055,
        color: [255, 255, 125, 128],
        enterEvent: "carservice.jobshape.enter",
        leaveEvent: "carservice.jobshape.leave"
    },
    defaultScenario: 'WORLD_HUMAN_AA_COFFEE'
},
]

mp.events.add('characterInit.done', () => {
    peds.forEach((current) => {
        mp.events.call('NPC.create', current);
    })
});

mp.events.add('carservice.jobshape.enter', () => {
    if (mp.busy.includes()) return;
    mp.events.callRemote('carservice.jobshape.enter');
});

mp.events.add('carservice.jobshape.employment', () => {
    mp.callCEFV(`selectMenu.show = false`);
    mp.events.callRemote('carservice.jobshape.employment');
});

mp.events.add('carservice.jobshape.leave', () => {
    mp.events.call('carservice.jobmenu.close');
});

mp.events.add('carservice.jobmenu.show', (state) => {
    mp.callCEFV(`selectMenu.menu = cloneObj(selectMenu.menus["carServiceJobMenu"])`);
    switch (state) {
        case 0:
            mp.callCEFV(`selectMenu.menu.items[0].text = 'Устроиться на работу'`);
            break;
        case 1:
            mp.callCEFV(`selectMenu.menu.items[0].text = 'Уволиться с работы'`);
            break;
    }
    mp.callCEFV(`selectMenu.show = true`);
});

mp.events.add('carservice.jobmenu.close', () => {
    mp.callCEFV(`selectMenu.show = false`);
});

mp.events.add('carservice.shape.enter', () => {
    isInCarServiceShape = true;
});

mp.events.add('carservice.shape.leave', () => {
    isInCarServiceShape = false;
});

mp.events.add('carservice.diagnostics.offer', () => {
    let veh = mp.getCurrentInteractionEntity();
    if (!veh) return;
    if (veh.type != 'vehicle') return;
    //setTimeout(() => {
        let driver = veh.getPedInSeat(-1);
        if (!driver) return mp.notify.error('В т/с нет водителя', 'Ошибка');
        let targetId = mp.players.atHandle(driver).remoteId;
        mp.events.callRemote('carservice.diagnostics.offer', targetId);
        mp.notify.success('Вы предложили диагностику', 'Автомастерская');
    //}, 3000)
});


mp.events.add('carservice.diagnostics.preparation', (vehId) => {
    mp.busy.add('carservice.mechanicProcess', false);
    carServiceControlsToDisable = true;

    let vehicle = mp.vehicles.atRemoteId(vehId);

    var hoodPos = getHoodPosition(vehicle);
    if (hoodPos) {
        var hoodDist = mp.vdist(vehicle.position, hoodPos);
        let pos = vehicle.getOffsetFromInWorldCoords(0, hoodDist + 1, 0);
        mp.players.local.taskFollowNavMeshToCoord(pos.x, pos.y, pos.z, 1, -1, 1, true, 0);

    } else {
        let pos = vehicle.getOffsetFromInWorldCoords(0, 2, 0);
        mp.players.local.taskFollowNavMeshToCoord(pos.x, pos.y, pos.z, 1, -1, 1, true, 0);
    }
    mp.timer.add(() => {
        isPreparingForDiagnostics = true;
        currentRepairingVehicle = vehicle;
    }, 1000);

    mp.events.add('render', () => {
        if (isPreparingForDiagnostics) {
            if (!mp.players.local.isWalking()) {
                isPreparingForDiagnostics = false;

                mp.players.local.setHeading(currentRepairingVehicle.getHeading() - 180);

                var hoodPos = getHoodPosition(currentRepairingVehicle);
                if (hoodPos) {
                    var hoodDist = mp.vdist(currentRepairingVehicle.position, hoodPos);
                    let newpos = currentRepairingVehicle.getOffsetFromInWorldCoords(0, hoodDist + 1.8, 0);
                    mp.players.local.position = newpos;
                } else {
                    let newpos = currentRepairingVehicle.getOffsetFromInWorldCoords(0, 1.5, 0);
                    mp.players.local.position = newpos;
                }
                let animType = getRepairAnimType(currentRepairingVehicle);
                mp.timer.add(() => {
                    try {
                        mp.players.local.freezePosition(true);
                    } catch (err) {

                    }
                }, 100);
                mp.events.callRemote('carservice.diagnostics.start', animType);
            }
        }

    });

});

function getHoodPosition(vehicle) {
    if (!vehicle) return null;
    let position = vehicle.getWorldPositionOfBone(vehicle.getBoneIndexByName("bonnet"));
    if (!position.x && !position.y && !position.z) return null;
    return position;
}

function getRepairAnimType(vehicle) {
    let vehClass = vehicle.getClass();
    switch (vehClass) {
        case 2, 9, 12:
            return 1;
        case 8:
            return 2;
        case 5, 6, 7:
            return 3;
        default:
            return 0;
    }
}

mp.events.add('carservice.check.show', (data) => {
    mp.busy.add('carservice.check', true);
    mp.game.graphics.transitionToBlurred(500);
    mp.callCEFV(`check.records = []`);

    if (data.body) {
        mp.callCEFV(`check.records.push({ header: "Повреждения кузова", price: ${data.body.price} })`);
    }
    if (data.engine) {
        if (data.engine.state == 1) {
            mp.callCEFV(`check.records.push({ header: "Неисправность системы охлаждения", price: ${data.engine.price} })`);
        }
        if (data.engine.state == 2) {
            mp.callCEFV(`check.records.push({ header: "Износ поршневых колец", price: ${data.engine.price} })`);
        }
    }
    if (data.steering) {
        if (data.steering.state == 1) {
            mp.callCEFV(`check.records.push({ header: "Неисправность рулевой тяги", price: ${data.steering.price} })`);
        }
        if (data.steering.state == 2) {
            mp.callCEFV(`check.records.push({ header: "Неисправность рулевой колонки", price: ${data.steering.price} })`);
        }
    }
    if (data.fuel) {
        if (data.fuel.state == 1) {
            mp.callCEFV(`check.records.push({ header: "Неисправность впускного коллектора", price: ${data.fuel.price} })`);
        }
        if (data.fuel.state == 2) {
            mp.callCEFV(`check.records.push({ header: "Неисправность воздушного фильтра", price: ${data.fuel.price} })`);
        }
    }
    if (data.brake) {
        if (data.brake.state == 1) {
            mp.callCEFV(`check.records.push({ header: "Неисправность тормозных цилиндров", price: ${data.brake.price} })`);
        }
        if (data.brake.state == 2) {
            mp.callCEFV(`check.records.push({ header: "Износ тормозных колодок", price: ${data.brake.price} })`);
        }
    }
    mp.callCEFV('check.show = true')
});

mp.events.add('carservice.check.close', () => {
    mp.busy.remove('carservice.check');
    mp.game.graphics.transitionFromBlurred(500);
    mp.callCEFV('check.show = false')
});

mp.events.add('carservice.service.end.mechanic', () => {
    carServiceControlsToDisable = false;
    mp.busy.remove('carservice.mechanicProcess');
    mp.players.local.freezePosition(false);
});

mp.events.add('render', () => {
    if (carServiceControlsToDisable) {
        mp.game.controls.disableControlAction(0, 21, true); /// бег
        mp.game.controls.disableControlAction(0, 22, true); /// прыжок
        mp.game.controls.disableControlAction(0, 31, true); /// вперед назад
        mp.game.controls.disableControlAction(0, 30, true); /// влево вправо
        mp.game.controls.disableControlAction(0, 24, true); /// удары
        mp.game.controls.disableControlAction(0, 257, true); // INPUT_ATTACK2
    }
});
