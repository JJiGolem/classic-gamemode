"use strict";

let name = null;
let cost = null;


mp.events.add('house.menu', (houseInfo) => {
    mp.gui.cursor.show(true, true);
    houseInfo.area =  mp.game.ui.getLabelText(mp.game.zone.getNameOfZone(houseInfo.pos[0], houseInfo.pos[1], houseInfo.pos[2]));
    mp.callCEFR('house.menu', []);
    mp.callCEFR('house.load', [houseInfo]);
});

mp.events.add('house.menu.close', (isServer) => {
    if (isServer) mp.callCEFR('house.menu.close', []);
    mp.gui.cursor.show(false, false);
});

mp.events.add('house.menu.enter', (place, isHaveGarage) => {
    if (isHaveGarage) {
        mp.gui.cursor.show(true, true);
        mp.callCEFR('house.menu.enter', [place]);
    }
    else {
        mp.events.callRemote('house.enter', place == 1 ? 0 : 1);
    }
});

mp.events.add('house.menu.enter.close', (isServer) => {
    if (isServer) mp.callCEFR('house.menu.enter.close', []);
    mp.gui.cursor.show(false, false);
});

mp.events.add('house.enter', (place) => {
    mp.events.callRemote('house.enter', place);
});

mp.events.add('house.enter.ans', (isInfoPanel, pos, rot) => {
    mp.console(JSON.stringify({isInfoPanel, pos, rot}));
    if (pos) {
        mp.players.local.setHeading(rot);
        mp.players.local.position = pos;
        mp.game.cam.clampGameplayCamYaw(0, 0);
        mp.gui.cursor.show(false, false);
        isInfoPanel ? mp.callCEFR('house.menu.close', []) : mp.callCEFR('house.menu.enter.close', []);
    }
    else {
        mp.callCEFR('house.enter.ans.err', []);
    }
});

mp.events.add('house.buy', () => {
    mp.events.callRemote('house.buy');
});

mp.events.add('house.buy.ans', (ans, ownerName) => {
    mp.callCEFR('house.buy.ans', [ans, ownerName]);
});


/// Phone app events
mp.events.add('house.lock', (id, isOpened) => {
    mp.events.callRemote('house.lock', id, isOpened);
});

mp.events.add('house.sell.toGov', (id) => {
    mp.events.callRemote('house.sell.toGov', id);
});
mp.events.add('house.sell.toGov.ans', (ans) => {
    mp.callCEFR('house.sell.toGov.ans', [ans]);
});

mp.events.add('house.sell.check', (nameT, idOrNick, costT) => {
    name = nameT;
    cost = costT;
    mp.events.callRemote('house.sell.check', idOrNick);
});
mp.events.add('house.sell.check.ans', (nick) => {
    mp.callCEFR('house.sell.check.ans', [nick, cost]);
});

mp.events.add('house.sell', () => {
    mp.events.callRemote('house.sell', name, cost);
});
mp.events.add('house.sell.ans', (ans) => {
    mp.callCEFR('house.sell.ans', [ans]);
});
mp.events.add('house.sell.stop', () => {
    mp.events.callRemote('house.sell.stop');
});


/// Add house
let addHouseInfo = {
    interiorId: null,
    price: null,
    /// Enter
    pickupX: null,
    pickupY: null,
    pickupZ: null,
    /// Spawn
    spawnX: null,
    spawnY: null,
    spawnZ: null,
    angle: null,
    /// Car place
    carX: null,
    carY: null,
    carZ: null,
    carAngle: null
};
let enterMarker;
let spawnMarker;
let carPlaceMarker;
let interiorsClasses = new Array();
mp.events.add('house.add.init', (interiorsClassesT) => {
    interiorsClasses = interiorsClassesT;
    let interiorsClassesNames = new Array();
    for (let i = 0; i < interiorsClassesT.length; i++) {
        interiorsClassesNames.push(interiorsClassesT[i].class);
    }
    mp.callCEFV(`selectMenu.menus["houseAddMenu"].items[4].values = ${JSON.stringify(interiorsClassesNames)};`);
});
mp.events.add('house.add.open', () => {
    if (mp.busy.includes()) return;
    if (!mp.busy.add('house.add')) return;
    mp.callCEFV(`selectMenu.menu = cloneObj(selectMenu.menus["houseAddMenu"]);`);
    mp.callCEFV(`selectMenu.show = true`);
});
mp.events.add('house.add.close', () => {
    mp.busy.remove('house.add');
    mp.callCEFV(`selectMenu.show = false`);
});
mp.events.add('house.add.enter', () => {
    addHouseInfo.pickupX = mp.players.local.position.x;
    addHouseInfo.pickupY = mp.players.local.position.y;
    addHouseInfo.pickupZ = mp.players.local.position.z;
    enterMarker = mp.markers.new(0, new mp.Vector3(addHouseInfo.pickupX, addHouseInfo.pickupY, addHouseInfo.pickupZ), 1,
        {
            direction: new mp.Vector3(0, 0, 0),
            rotation: new mp.Vector3(0, 0, 0),
            color: [0, 255, 0],
            visible: true,
            dimension: mp.players.local.dimension
        });
    mp.callCEFV(`selectMenu.menu.items[0].values = ["GREEN"];`);
});
mp.events.add('house.add.spawn', () => {
    addHouseInfo.spawnX = mp.players.local.position.x;
    addHouseInfo.spawnY = mp.players.local.position.y;
    addHouseInfo.spawnZ = mp.players.local.position.z;
    addHouseInfo.angle = mp.players.local.getHeading();
    spawnMarker = mp.markers.new(0, new mp.Vector3(addHouseInfo.spawnX, addHouseInfo.spawnY, addHouseInfo.spawnZ), 1,
        {
            direction: new mp.Vector3(0, 0, 0),
            rotation: new mp.Vector3(0, 0, 0),
            color: [255, 0, 0],
            visible: true,
            dimension: mp.players.local.dimension
        });
    mp.callCEFV(`selectMenu.menu.items[1].values = ["RED"];`);
});
mp.events.add('house.add.carSpawn', () => {
    if (mp.players.local.vehicle) return;
    
});
mp.events.add('house.add.carPlace', () => {
    if (!mp.players.local.vehicle) return;
    let pos = mp.vehicles.getVehiclePosition(mp.players.local.vehicle);
    addHouseInfo.carX = pos.x;
    addHouseInfo.carY = pos.y;
    addHouseInfo.carZ = pos.z;
    addHouseInfo.carAngle = pos.h;
    carPlaceMarker = mp.markers.new(0, new mp.Vector3(addHouseInfo.carX, addHouseInfo.carY, addHouseInfo.carZ + 0.5), 1,
        {
            direction: new mp.Vector3(0, 0, 0),
            rotation: new mp.Vector3(0, 0, 0),
            color: [0, 0, 255],
            visible: true,
            dimension: mp.players.local.dimension
        });
    mp.callCEFV(`selectMenu.menu.items[3].values = ["BLUE"];`);
});
mp.events.add('house.add.create', (interiorIndex, price) => {
    addHouseInfo.price = parseInt(price);
    addHouseInfo.interiorId = interiorsClasses[interiorIndex].id;
    mp.callCEFV(`selectMenu.show = false`);
});