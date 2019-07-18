var current;
var list = [];
var i = 0;
mp.events.add('carshow.list.show', (inputList) => {
    list = inputList;
    let sceneryCamera = mp.cameras.new('default', new mp.Vector3(-44 - 4, -1098 - 4, 25 + 2.5), new mp.Vector3(0, 0, 0), 70);
    //31.673555374145508
    //126.1431884765625
    sceneryCamera.pointAtCoord(-44, -1098, 25); //Changes the rotation of the camera to point towards a location
    sceneryCamera.setActive(true);
    mp.game.cam.renderScriptCams(true, false, 0, true, false);

    current = mp.vehicles.new(mp.game.joaat(list[i].vehiclePropertyModel), new mp.Vector3(-44.08749008178711, -1098.660400390625, 25.74812889099121));
    current.setHeading(115);
    for (var j = 0; j < list.length; j++) {
        mp.chat.debug(`${j}Модель: ${list[j].vehiclePropertyModel} Количество: ${list[j].count} ${list[j].properties.maxFuel}`);
    }
    mp.callCEFVN({"selectMenu.show": "true"});
    mp.callCEFVN({"selectMenu.menu.header": "hi"});
}
);
mp.keys.bind(0x25, true, function () {
    showPreviousCar();
});

mp.keys.bind(0x27, true, function () {
    showNextCar();
});

function showNextCar() {
    current.destroy();
    if (i == list.length - 1) {
        i = 0;
        current = mp.vehicles.new(mp.game.joaat(list[i].vehiclePropertyModel), new mp.Vector3(-44.08749008178711, -1098.660400390625, 25.74812889099121));
    } else {
        current = mp.vehicles.new(mp.game.joaat(list[i + 1].vehiclePropertyModel), new mp.Vector3(-44.08749008178711, -1098.660400390625, 25.74812889099121));
        i++;
    }
    current.setHeading(115);
}

function showPreviousCar() {
    current.destroy();
    if (i == 0) {
        i = list.length - 1;
        current = mp.vehicles.new(mp.game.joaat(list[i].vehiclePropertyModel), new mp.Vector3(-44.08749008178711, -1098.660400390625, 25.74812889099121));
    } else {
        current = mp.vehicles.new(mp.game.joaat(list[i - 1].vehiclePropertyModel), new mp.Vector3(-44.08749008178711, -1098.660400390625, 25.74812889099121));
        i--;
    }
    current.setHeading(115);
}