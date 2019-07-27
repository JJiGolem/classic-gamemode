var data = require('carshow/data.js');

var colorIDs = [];
var colorValues = [];

data.colors.forEach((current)=> {
    colorIDs.push(current.id);
    colorValues.push(current.value);
});

var current;
var list = [];
var carShowInfo;
var currentIndex = 0;
var primary = 0, secondary = 0;
var camera;

var controlsDisabled = false;

mp.events.add('carshow.list.show', (inputList, inputInfo) => {

    mp.players.local.freezePosition(true);
    mp.events.call('hud.enable', false);
    mp.game.ui.displayRadar(false);

    list = inputList;
    carShowInfo = inputInfo;
    //let camera = mp.cameras.new('default', new mp.Vector3(-44 - 4, -1098 - 4, 25 + 2.5), new mp.Vector3(0, 0, 0), 70);
    camera = mp.cameras.new('default', new mp.Vector3(carShowInfo.cameraX, carShowInfo.cameraY, carShowInfo.cameraZ), new mp.Vector3(0, 0, 0), 70);
    //31.673555374145508
    //126.1431884765625
    //camera.pointAtCoord(-44, -1098, 25);
    camera.pointAtCoord(carShowInfo.toX, carShowInfo.toY, carShowInfo.toZ);
    camera.setActive(true);
    mp.game.cam.renderScriptCams(true, false, 0, true, false);

    //current = mp.vehicles.new(mp.game.joaat(list[i].vehiclePropertyModel), new mp.Vector3(-44.08749008178711, -1098.660400390625, 25.74812889099121));
    current = mp.vehicles.new(mp.game.joaat(list[currentIndex].vehiclePropertyModel), new mp.Vector3(carShowInfo.toX, carShowInfo.toY, carShowInfo.toZ));
    //current.setHeading(115);
    current.setHeading(carShowInfo.toH);
    current.setColours(primary, secondary);
    for (var j = 0; j < list.length; j++) {
        mp.chat.debug(`${j}Модель: ${list[j].vehiclePropertyModel} Количество: ${list[j].count} ${list[j].properties.maxFuel}`);
    }

    let models = []; 
    list.forEach((current)=> {
        models.push(current.properties.name);
    })
    mp.callCEFV(`selectMenu.menu = selectMenu.menus["carShowMenu"]`);
    mp.callCEFVN({"selectMenu.menu.items[0].values": models});
    mp.callCEFVN({"selectMenu.menu.items[1].values": colorValues});
    mp.callCEFVN({"selectMenu.menu.items[2].values": colorValues});
    mp.callCEFV(`selectMenu.open()`);
    controlsDisabled = true;
}
);

mp.events.add('render', () => { 
    if (controlsDisabled) {
        mp.game.controls.disableControlAction(1, 200, true); 
    }
});

mp.events.add('carshow.list.close', () => {
    current.destroy();
    camera.setActive(false);
    camera.destroy();
    mp.game.cam.renderScriptCams(false, false, 0, true, false);
    mp.players.local.freezePosition(false);
    mp.events.call('hud.enable', true);
    mp.game.ui.displayRadar(true);
    mp.callCEFV(`selectMenu.close()`);
    controlsDisabled = false;
    mp.events.callRemote('carshow.list.close', carShowInfo.sqlId);
});

mp.events.add('carshow.vehicle.show', (i)=> {
    currentIndex = i;
    current.destroy();
    current = mp.vehicles.new(mp.game.joaat(list[i].vehiclePropertyModel), new mp.Vector3(-44.08749008178711, -1098.660400390625, 25.74812889099121));
    //current.setHeading(115);
    current.setHeading(carShowInfo.toH);
    current.setColours(primary, secondary);
});

mp.events.add('carshow.vehicle.color', (color1, color2) => {
    if (color1 != -1) primary = color1;
    if (color2 != -1) secondary = color2;
    current.setColours(primary, secondary);
});

mp.events.add("carshow.car.buy", (carId) => {
    mp.events.callRemote('carshow.car.buy', list[currentIndex].sqlId, primary, secondary);
});

mp.events.add("carshow.car.buy.ans", (ans, carInfo) => {
    switch (ans) {
        case 0:
            mp.chat.debug('Автомобилей нет');
            mp.notify.error('Т/с нет в наличии', 'Ошибка');
            break;
        case 1:
            mp.chat.debug('Успешно куплен');
            mp.notify.success('Вы приобрели транспорт', 'Успех');
            mp.events.call('chat.message.push', `!{#80c102}Вы успешно приобрели транспортное средство !{#009eec}${carInfo.properties.name}`);
            mp.events.call('chat.message.push', '!{#f3c800}Транспорт доставлен на подземную парковку !{#009eec}Ричман-Глен');
            mp.events.call('chat.message.push', '!{#f3c800}Местоположение парковки отмечено на карте');
            mp.events.call('carshow.list.close');
            break;
    }
});