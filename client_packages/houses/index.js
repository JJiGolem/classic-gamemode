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
    mp.callCEFV(`selectMenu.menus["houseAddMenu"].items[0].values = ${JSON.stringify(interiorsClassesNames)};`);
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
    if (enterMarker != null) enterMarker.destroy();
    if (spawnMarker != null) spawnMarker.destroy();
    if (carPlaceMarker != null) carPlaceMarker.destroy();
    mp.events.callRemote("house.add.carDrop");
});
mp.events.add('house.add.enter', () => {
    if (mp.players.local.vehicle) return mp.notify.error("Покиньте авто", "Ошибка");
    addHouseInfo.pickupX = mp.players.local.position.x;
    addHouseInfo.pickupY = mp.players.local.position.y;
    addHouseInfo.pickupZ = mp.players.local.position.z;

    if (enterMarker != null) enterMarker.destroy();
    enterMarker = mp.markers.new(0, new mp.Vector3(addHouseInfo.pickupX, addHouseInfo.pickupY, addHouseInfo.pickupZ), 1,
        {
            direction: new mp.Vector3(0, 0, 0),
            rotation: new mp.Vector3(0, 0, 0),
            color: [0, 255, 0, 255],
            visible: true,
            dimension: 0
        });
    mp.callCEFV(`selectMenu.menu.items[2].values = ["GREEN"];`);
});
mp.events.add('house.add.spawn', () => {
    if (mp.players.local.vehicle) return mp.notify.error("Покиньте авто", "Ошибка");
    addHouseInfo.spawnX = mp.players.local.position.x;
    addHouseInfo.spawnY = mp.players.local.position.y;
    addHouseInfo.spawnZ = mp.players.local.position.z;
    addHouseInfo.angle = mp.players.local.getHeading();

    if (spawnMarker != null) spawnMarker.destroy();
    spawnMarker = mp.markers.new(0, new mp.Vector3(addHouseInfo.spawnX, addHouseInfo.spawnY, addHouseInfo.spawnZ), 1,
        {
            direction: new mp.Vector3(0, 0, 0),
            rotation: new mp.Vector3(0, 0, 0),
            color: [255, 0, 0, 255],
            visible: true,
            dimension: 0
        });
    mp.callCEFV(`selectMenu.menu.items[3].values = ["RED"];`);
});
mp.events.add('house.add.carSpawn', () => {
    if (mp.players.local.vehicle) return mp.notify.error("Покиньте авто", "Ошибка");
    mp.events.callRemote("house.add.carSpawn");
});
mp.events.add('house.add.carPlace', () => {
    if (!mp.players.local.vehicle) return mp.notify.error("Сядьте в авто", "Ошибка");
    let pos = mp.vehicles.getVehiclePosition(mp.players.local.vehicle);
    addHouseInfo.carX = pos.x;
    addHouseInfo.carY = pos.y;
    addHouseInfo.carZ = pos.z;
    addHouseInfo.carAngle = pos.h;

    if (carPlaceMarker != null) carPlaceMarker.destroy();
    carPlaceMarker = mp.markers.new(0, new mp.Vector3(addHouseInfo.carX, addHouseInfo.carY, addHouseInfo.carZ + 0.5), 1,
        {
            direction: new mp.Vector3(0, 0, 0),
            rotation: new mp.Vector3(0, 0, 0),
            color: [0, 0, 255, 255],
            visible: true,
            dimension: 0
        });
    mp.events.callRemote("house.add.removeFromVehicle");
    mp.callCEFV(`selectMenu.menu.items[5].values = ["BLUE"];`);
});
mp.events.add('house.add.create', (interiorIndex, price) => {
    interiorIndex = parseInt(interiorIndex);
    if (isNaN(interiorIndex)) return mp.notify.error("Ошибка в выборе интерьера", "Ошибка");
    price = parseInt(price);
    if (isNaN(price)) return mp.notify.error("Введите стоимость корректно", "Ошибка");
    if (enterMarker == null) return mp.notify.error("Создайте вход в дом", "Ошибка");
    if (spawnMarker == null) return mp.notify.error("Создайте выход из дома", "Ошибка");
    if (carPlaceMarker == null) return mp.notify.error("Создайте место спавна авто", "Ошибка");

    addHouseInfo.price = price;
    addHouseInfo.interiorId = interiorsClasses[interiorIndex].id;

    enterMarker.destroy();
    enterMarker = null;

    spawnMarker.destroy();
    spawnMarker = null;

    carPlaceMarker.destroy();
    carPlaceMarker = null;

    mp.events.callRemote("house.add.carDrop");

    mp.busy.remove('house.add');
    mp.callCEFV(`selectMenu.show = false`);
    mp.events.callRemote("house.add", JSON.stringify(addHouseInfo));
});