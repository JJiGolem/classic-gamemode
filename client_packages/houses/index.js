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
let spawnMarkerAngle;
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
    if (spawnMarkerAngle != null) spawnMarkerAngle.destroy();
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
    if (spawnMarkerAngle != null) spawnMarkerAngle.destroy();
    spawnMarker = mp.markers.new(0, new mp.Vector3(addHouseInfo.spawnX, addHouseInfo.spawnY, addHouseInfo.spawnZ), 1,
        {
            direction: new mp.Vector3(0, 0, 0),
            rotation: new mp.Vector3(0, 0, 0),
            color: [255, 0, 0, 255],
            visible: true,
            dimension: 0
        });
    spawnMarkerAngle = mp.markers.new(0, new mp.Vector3(addHouseInfo.spawnX + Math.sin((360 - addHouseInfo.angle) * Math.PI/180) * 0.5, addHouseInfo.spawnY + Math.cos((360 - addHouseInfo.angle) * Math.PI/180) * 0.5, addHouseInfo.spawnZ - 1), 0.25,
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

    spawnMarkerAngle.destroy();
    spawnMarkerAngle = null;

    carPlaceMarker.destroy();
    carPlaceMarker = null;

    mp.events.callRemote("house.add.carDrop");

    mp.busy.remove('house.add');
    mp.callCEFV(`selectMenu.show = false`);
    mp.events.callRemote("house.add", JSON.stringify(addHouseInfo));
});






/// Add Interior
let addInteriorInfo = {
    garageId: null,
    class: null,
    numRooms: null,
    rent: null,
    /// Exit
    exitX: null,
    exitY: null,
    exitZ: null,
    /// Enter
    x: null,
    y: null,
    z: null,
    rotation: null,
};
let exitMarker;
enterMarker = null;
let enterMarkerAngle;
let garagesIdCarPlaces = new Array();
mp.events.add('house.add.init', (temp, garagesIdCarPlacesT) => {
    garagesIdCarPlaces = garagesIdCarPlacesT;
    let garagesIdCarPlacesNames = new Array();
    garagesIdCarPlacesNames.push("Нет гаража");
    for (let i = 0; i < garagesIdCarPlacesT.length; i++) {
        garagesIdCarPlacesNames.push(`id:${garagesIdCarPlacesT[i].id} places:${garagesIdCarPlacesT[i].carPlaces}`);
    }
    mp.callCEFV(`selectMenu.menus["houseAddInteriorMenu"].items[0].values = ${JSON.stringify(garagesIdCarPlacesNames)};`);
});
mp.events.add('house.add.interior.open', () => {
    if (mp.busy.includes()) return;
    if (!mp.busy.add('house.add')) return;
    mp.callCEFV(`selectMenu.menu = cloneObj(selectMenu.menus["houseAddInteriorMenu"]);`);
    mp.callCEFV(`selectMenu.show = true`);
});
mp.events.add('house.add.interior.close', () => {
    mp.busy.remove('house.add');
    mp.callCEFV(`selectMenu.show = false`);
    if (exitMarker != null) exitMarker.destroy();
    if (enterMarker != null) enterMarker.destroy();
    if (enterMarkerAngle != null) enterMarkerAngle.destroy();
});
mp.events.add('house.add.interior.exit', () => {
    if (mp.players.local.vehicle) return mp.notify.error("Покиньте авто", "Ошибка");
    addInteriorInfo.exitX = mp.players.local.position.x;
    addInteriorInfo.exitY = mp.players.local.position.y;
    addInteriorInfo.exitZ = mp.players.local.position.z;

    if (exitMarker != null) exitMarker.destroy();
    exitMarker = mp.markers.new(0, new mp.Vector3(addInteriorInfo.exitX, addInteriorInfo.exitY, addInteriorInfo.exitZ), 1,
        {
            direction: new mp.Vector3(0, 0, 0),
            rotation: new mp.Vector3(0, 0, 0),
            color: [0, 255, 0, 255],
            visible: true,
            dimension: 0
        });
    mp.callCEFV(`selectMenu.menu.items[5].values = ["GREEN"];`);
});
mp.events.add('house.add.interior.enter', () => {
    if (mp.players.local.vehicle) return mp.notify.error("Покиньте авто", "Ошибка");
    addInteriorInfo.x = mp.players.local.position.x;
    addInteriorInfo.y = mp.players.local.position.y;
    addInteriorInfo.z = mp.players.local.position.z;
    addInteriorInfo.rotation = mp.players.local.getHeading();

    if (enterMarker != null) enterMarker.destroy();
    if (enterMarkerAngle != null) enterMarkerAngle.destroy();
    enterMarker = mp.markers.new(0, new mp.Vector3(addInteriorInfo.x, addInteriorInfo.y, addInteriorInfo.z), 1,
        {
            direction: new mp.Vector3(0, 0, 0),
            rotation: new mp.Vector3(0, 0, 0),
            color: [255, 0, 0, 255],
            visible: true,
            dimension: 0
        });
    enterMarkerAngle = mp.markers.new(0, new mp.Vector3(addInteriorInfo.x + Math.sin((360 - addInteriorInfo.rotation) * Math.PI/180) * 0.5, addInteriorInfo.y + Math.cos((360 - addInteriorInfo.rotation) * Math.PI/180) * 0.5, addInteriorInfo.z - 1), 0.25,
    {
        direction: new mp.Vector3(0, 0, 0),
        rotation: new mp.Vector3(0, 0, 0),
        color: [255, 0, 0, 255],
        visible: true,
        dimension: 0
    });
    mp.callCEFV(`selectMenu.menu.items[4].values = ["RED"];`);
});
mp.events.add('house.add.interior.create', (garageIndex, className, numRooms, rent) => {
    garageIndex = parseInt(garageIndex);
    if (isNaN(garageIndex)) return mp.notify.error("Ошибка в выборе гаража", "Ошибка");
    if (className == "" || className == null) return mp.notify.error("Введите название класса жилья корректно", "Ошибка");
    numRooms = parseInt(numRooms);
    if (isNaN(numRooms)) return mp.notify.error("Введите кол-во комнат корректно", "Ошибка");
    rent = parseFloat(rent);
    if (isNaN(rent)) return mp.notify.error("Введите аренду корректно", "Ошибка");
    if (exitMarker == null) return mp.notify.error("Создайте выход из интерьера", "Ошибка");
    if (enterMarker == null) return mp.notify.error("Создайте вход в интерьер", "Ошибка");

    addInteriorInfo.garageId = garageIndex == 0 ? null : interiorsClasses[garageIndex - 1].id;
    addInteriorInfo.class = className;
    addInteriorInfo.numRooms = numRooms;
    addInteriorInfo.rent =  rent;

    exitMarker.destroy();
    exitMarker = null;

    enterMarker.destroy();
    enterMarker = null;

    enterMarkerAngle.destroy();
    enterMarkerAngle = null;

    mp.busy.remove('house.add');
    mp.callCEFV(`selectMenu.show = false`);
    mp.events.callRemote("house.add.interior", JSON.stringify(addInteriorInfo));
});






/// Add Garage
