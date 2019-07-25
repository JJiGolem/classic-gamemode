var current;
var list = [];
var i = 0;
mp.events.add('carshow.list.show', (inputList) => {
    list = inputList;
    let sceneryCamera = mp.cameras.new('default', new mp.Vector3(-44 - 4, -1098 - 4, 25 + 2.5), new mp.Vector3(0, 0, 0), 70);
    //31.673555374145508
    //126.1431884765625
    sceneryCamera.pointAtCoord(-44, -1098, 25);
    sceneryCamera.setActive(true);
    mp.game.cam.renderScriptCams(true, false, 0, true, false);

    current = mp.vehicles.new(mp.game.joaat(list[i].vehiclePropertyModel), new mp.Vector3(-44.08749008178711, -1098.660400390625, 25.74812889099121));
    current.setHeading(115);
    for (var j = 0; j < list.length; j++) {
        mp.chat.debug(`${j}Модель: ${list[j].vehiclePropertyModel} Количество: ${list[j].count} ${list[j].properties.maxFuel}`);
    }

    let models = []; 
    list.forEach((current)=> {
        models.push(current.properties.name);
    })
    mp.callCEFV(`selectMenu.menu = selectMenu.menus["carShowMenu"]`);
    mp.callCEFVN({"selectMenu.menu.items[0].values": models});
    mp.callCEFV(`selectMenu.open()`);
}
);

mp.events.add('carshow.vehicle.show', (i)=> {
    current.destroy();
    current = mp.vehicles.new(mp.game.joaat(list[i].vehiclePropertyModel), new mp.Vector3(-44.08749008178711, -1098.660400390625, 25.74812889099121));
    current.setHeading(115);
});
// function showCar(i) {

// }
// mp.keys.bind(0x25, true, function () {
//     showPreviousCar();
// });

// mp.keys.bind(0x27, true, function () {
//     showNextCar();
// });

// function showNextCar() {
//     current.destroy();
//     if (i == list.length - 1) {
//         i = 0;
//         current = mp.vehicles.new(mp.game.joaat(list[i].vehiclePropertyModel), new mp.Vector3(-44.08749008178711, -1098.660400390625, 25.74812889099121));
//     } else {
//         current = mp.vehicles.new(mp.game.joaat(list[i + 1].vehiclePropertyModel), new mp.Vector3(-44.08749008178711, -1098.660400390625, 25.74812889099121));
//         i++;
//     }
//     current.setHeading(115);
// }

// function showPreviousCar() {
//     current.destroy();
//     if (i == 0) {
//         i = list.length - 1;
//         current = mp.vehicles.new(mp.game.joaat(list[i].vehiclePropertyModel), new mp.Vector3(-44.08749008178711, -1098.660400390625, 25.74812889099121));
//     } else {
//         current = mp.vehicles.new(mp.game.joaat(list[i - 1].vehiclePropertyModel), new mp.Vector3(-44.08749008178711, -1098.660400390625, 25.74812889099121));
//         i--;
//     }
//     current.setHeading(115);
// }

mp.events.add("carshow.car.buy", (carId) => {
    mp.events.callRemote('carshow.car.buy', carId);
});

mp.events.add("carshow.car.buy.ans", (ans, carInfo) => {
    switch (ans) {
        case 0:
            mp.chat.debug('Автомобилей нет');
            break;
        case 1:
            mp.chat.debug('Успешно куплен');
            mp.events.call('chat.message.push', `!{#80c102}Вы успешно приобрели транспортное средство !{#009eec}${carInfo.properties.name}`);
            mp.events.call('chat.message.push', '!{#f3c800}Транспорт доставлен на подземную парковку !{#009eec}Ричман-Глен');
            mp.events.call('chat.message.push', '!{#f3c800}Местоположение парковки отмечено на карте');
            break;
    }
});