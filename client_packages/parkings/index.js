var currentParkingId;

mp.events.add('parkings.menu.show', (parkingId) => {
    currentParkingId = parkingId;
    mp.callCEFV(`selectMenu.menu = cloneObj(selectMenu.menus["parkingMenu"])`);
    mp.callCEFV(`selectMenu.show = true`);
});

mp.events.add('parkings.menu.close', () => {
    //mp.callCEFV(`selectMenu.menu = null`);
    mp.callCEFV(`selectMenu.show = false`);
});

mp.events.add('parkings.vehicle.get', () => {
    mp.events.call('parkings.menu.close');
    mp.events.callRemote('parkings.vehicle.get', currentParkingId);
});