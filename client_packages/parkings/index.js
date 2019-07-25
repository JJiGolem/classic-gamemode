mp.events.add('parkings.menu.show', () => {
    mp.callCEFV(`selectMenu.menu = selectMenu.menus["parkingMenu"]`);
    mp.callCEFVN({ "selectMenu.show": true });
});

mp.events.add('parkings.menu.close', () => {
    mp.callCEFVN({ "selectMenu.show": false });
});