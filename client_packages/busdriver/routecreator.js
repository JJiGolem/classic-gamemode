mp.events.add('routecreator.show', () => {
    mp.busy.remove('routecreator');
    mp.callCEFV(`selectMenu.menu = cloneObj(selectMenu.menus["routeCreator"])`);
    mp.callCEFV(`selectMenu.show = true`);
});


mp.events.add('routecreator.close', () => {
    mp.busy.remove('routecreator');
    mp.callCEFV(`selectMenu.show = false`);
});
