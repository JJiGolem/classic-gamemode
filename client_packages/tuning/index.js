mp.events.add('mods.num', (type) => { // temp
    let num = mp.players.local.vehicle.getNumMods(type);
    mp.chat.debug(num);
}); 

mp.events.add('mods.label', (type, index) => { // temp
    let label = mp.players.local.vehicle.getModTextLabel(type, index);
    mp.chat.debug(mp.game.ui.getLabelText(label));
}); 

mp.events.add('tuning.menu.show', () => {
    let vehicle = mp.players.local.vehicle;
    vehicle.freezePosition(true);
    mp.callCEFV(`selectMenu.menu = cloneObj(selectMenu.menus["tuningMain"])`);
    mp.callCEFV(`selectMenu.show = true`);
});