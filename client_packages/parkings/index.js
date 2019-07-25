var currentParkingId;

mp.events.add('parkings.menu.show', (parkingId) => {
    currentParkingId = parkingId;
    mp.callCEFV(`selectMenu.menu = selectMenu.menus["parkingMenu"]`);
    mp.callCEFV(`selectMenu.menu.i = 0`); // temp ?
    mp.callCEFV(`selectMenu.menu.j = 0`);
    mp.callCEFVN({ "selectMenu.show": true });
});

mp.events.add('parkings.menu.close', () => {
    mp.callCEFV(`selectMenu.menu = null`); // temp ?
    mp.callCEFVN({ "selectMenu.show": false });
});

mp.events.add('parkings.vehicle.get', () => {
    mp.events.call('parkings.menu.close');
    mp.events.callRemote('parkings.vehicle.get', currentParkingId);
});