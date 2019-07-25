var currentParkingId;

mp.events.add('parkings.menu.show', (parkingId) => {
    currentParkingId = parkingId;
    mp.callCEFV(`selectMenu.menu = selectMenu.menus["parkingMenu"]`);
    mp.callCEFV(`selectMenu.open()`);
});

mp.events.add('parkings.menu.close', () => {
    mp.callCEFV(`selectMenu.close()`);
});

mp.events.add('parkings.vehicle.get', () => {
    mp.events.call('parkings.menu.close');
    mp.events.callRemote('parkings.vehicle.get', currentParkingId);
});