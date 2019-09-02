let data = require('carshow/data.js');

let colorIDs = [];
let colorValues = [];

let controlsDisabled = false;
let customsId;
let vehicle;

let tuningParams = {
    primaryColour: -1,
    secondaryColour: -1,
}

let colorData = {
    primary: -1,
    secondary: -1
}

data.colors.forEach((current) => {
    colorIDs.push(current.id);
    colorValues.push(current.value);
});

mp.events.add('mods.num', (type) => { // temp
    let num = mp.players.local.vehicle.getNumMods(type);
    mp.chat.debug(num);
}); 

mp.events.add('mods.label', (type, index) => { // temp
    let label = mp.players.local.vehicle.getModTextLabel(type, index);
    mp.chat.debug(mp.game.ui.getLabelText(label));
}); 

mp.events.add('mods.get', (type) => { // temp
    let num = mp.players.local.vehicle.getMod(type);
    mp.chat.debug(num);
}); 

mp.events.add('tuning.start', (id, primary, secondary) => {
    mp.chat.debug(id);
    customsId = id;
    vehicle = mp.players.local.vehicle;
    vehicle.freezePosition(true);
    tuningParams.primaryColour = primary;
    tuningParams.secondaryColour = secondary;
    colorData.primary = primary;
    colorData.secondary = secondary;
    //initTuningParams();
    mp.events.call('tuning.menu.show');
});

mp.events.add('tuning.menu.show', () => {
    mp.callCEFV(`selectMenu.menu = cloneObj(selectMenu.menus["tuningMain"])`);
    mp.callCEFV(`selectMenu.show = true`);
});

mp.events.add('tuning.colorMenu.show', () => {
    mp.callCEFV(`selectMenu.menu = cloneObj(selectMenu.menus["tuningColors"])`);
    mp.callCEFVN({ "selectMenu.menu.items[0].values": colorValues });
    mp.callCEFVN({ "selectMenu.menu.items[1].values": colorValues });
    mp.callCEFVN({ "selectMenu.menu.items[0].i": tuningParams.primaryColour });
    mp.callCEFVN({ "selectMenu.menu.items[0].j": tuningParams.primaryColour });
    mp.callCEFVN({ "selectMenu.menu.items[1].i": tuningParams.secondaryColour });
    mp.callCEFVN({ "selectMenu.menu.items[1].j": tuningParams.secondaryColour });
    
});

mp.events.add('tuning.colors', (primary, secondary) => {
    if (primary != -1) colorData.primary = primary;
    if (secondary != -1) colorData.secondary = secondary;
    vehicle.setColours(colorData.primary, colorData.secondary);
});

mp.events.add('tuning.colors.confirm', () => {
    mp.events.callRemote('tuning.colors.set', colorData.primary, colorData.secondary);
    mp.callCEFV('selectMenu.loader = true');
});

mp.events.add('tuning.colors.set.ans', (ans) => {
    mp.callCEFV('selectMenu.loader = false');
    switch (ans) {
        case 0:
            tuningParams.primaryColour = colorData.primary;
            tuningParams.secondaryColour = colorData.secondary;
            mp.callCEFV(`selectMenu.notification = 'Автомобиль перекрашен'`);
            break;
    }



});

mp.events.add('tuning.end', () => {
    mp.callCEFV(`selectMenu.show = false`);
    vehicle.freezePosition(false);
    mp.events.callRemote('tuning.end', customsId);
});

mp.events.add('render', () => {
    if (controlsDisabled) {
        mp.game.controls.disableControlAction(1, 200, true);
    }
});

function initTuningParams() {
    
}

mp.events.add('tuning.params.set', setCurrentParams);

function setCurrentParams() {
    vehicle.setColours(tuningParams.primaryColour, tuningParams.secondaryColour);
}