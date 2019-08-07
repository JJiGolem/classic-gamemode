let isInCarServiceShape = false;
let isPreparingForDiagnostics = false;
let currentRepairingVehicle;

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
            mp.chat.debug('показать увольнение')
            break;
    }
    mp.callCEFV(`selectMenu.show = true`);
});

mp.events.add('carservice.jobmenu.close', () => {
    mp.callCEFV(`selectMenu.show = false`);
});

mp.events.add('carservice.shape.enter', () => {
    mp.chat.debug('enter');
    isInCarServiceShape = true;
});

mp.events.add('carservice.shape.leave', () => {
    mp.chat.debug('leave');
    isInCarServiceShape = false;
});


mp.events.add('carservice.diagnostics.offer', () => {
    mp.chat.debug('offer');

    let veh = mp.getCurrentInteractionEntity();
    mp.chat.debug(veh.type);
    if (!veh) return mp.chat.debug('!veh');
    if (veh.type != 'vehicle') return mp.chat.debug(`veh.type != 'vehicle'`);
    let timer = setTimeout(() => {
        try {
            mp.chat.debug('timeout')
            let driver = veh.getPedInSeat(-1);
            mp.chat.debug(driver);
            if (!driver) return mp.notify.error('В т/с нет водителя', 'Ошибка');
            let targetId = mp.players.atHandle(driver).remoteId;
            mp.chat.debug(mp.players.atHandle(driver).remoteId);
            mp.events.callRemote('carservice.diagnostics.offer', targetId);
        } catch (err) {
            mp.chat.debug(JSON.stringify(err));
        }

    }, 3000)

});


mp.events.add('carservice.diagnostics.preparation', (vehId) => {
    mp.chat.debug('prepare');
    let vehicle = mp.vehicles.atRemoteId(vehId);

    var hoodPos = getHoodPosition(vehicle);
    mp.chat.debug(JSON.stringify(hoodPos));
    if (hoodPos) {
        var hoodDist = mp.vdist(vehicle.position, hoodPos);
        let pos = vehicle.getOffsetFromInWorldCoords(0, hoodDist + 1, 0);
        mp.chat.debug(JSON.stringify(pos));
        mp.chat.debug(JSON.stringify(hoodPos));
        mp.players.local.taskFollowNavMeshToCoord(pos.x, pos.y, pos.z, 1, -1, 1, true, 0);

    } else {
        let pos = vehicle.getOffsetFromInWorldCoords(0, 2, 0);
        mp.players.local.taskFollowNavMeshToCoord(pos.x, pos.y, pos.z, 1, -1, 1, true, 0);
    }
    setTimeout(() => {
        isPreparingForDiagnostics = true;
        currentRepairingVehicle = vehicle;
    }, 1000);

    mp.events.add('render', () => {
        if (isPreparingForDiagnostics) {
            mp.chat.debug(mp.players.local.isWalking());
            if (!mp.players.local.isWalking()) {
                isPreparingForDiagnostics = false;
                mp.chat.debug('остановился');
                //mp.players.local.freezePosition(true);
                //mp.events.callRemote('carservice.diagnostics.start');
                mp.players.local.setHeading(currentRepairingVehicle.getHeading() - 180);
                //let newpos = mp.players.local.getOffsetFromInWorldCoords(0, 0.5, 0);

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
                mp.events.callRemote('carservice.diagnostics.start', animType);
            }
        }

    });

});

function getHoodPosition(vehicle) {
    mp.chat.debug('hood position')
    if (!vehicle) return null;
    let position = vehicle.getWorldPositionOfBone(vehicle.getBoneIndexByName("bonnet"));
    if (!position.x && !position.y && !position.z) return null;
    return position;
}

function getRepairAnimType(vehicle) {
    let vehClass = vehicle.getClass();
    mp.chat.debug(vehClass);
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