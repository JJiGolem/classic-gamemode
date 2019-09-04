let data = require('carshow/data.js');

let colorIDs = [];
let colorValues = [];

let controlsDisabled = false;
let customsId;
let vehicle;

let tuningParams = {
    primaryColour: -1,
    secondaryColour: -1,
    engineType: {
        modType: 11,
        current: -1
    },
    breakType: {
        modType: 12,
        current: -1
    },
    transmissionType: {
        modType: 13,
        current: -1
    },
    suspensionType:{
        modType: 15,
        current: -1
    },
    armourType: {
        modType: 16,
        current: -1
    },
    turbo: {
        modType: 18,
        current: -1
    },
    spoiler: {
        modType: 0,
        current: -1,
        name: "Спойлер"
    },
    frontBumper: {
        modType: 1,
        current: -1,
        name: "Передний бампер"
    },
    rearBumper: {
        modType: 2,
        current: -1,
        name: "Задний бампер"
    },
    sideSkirt: {
        modType: 3,
        current: -1,
        name: "Пороги"
    },
    exhaust: {
        modType: 4,
        current: -1,
        name: "Глушитель"
    },
    frame: {
        modType: 5,
        current: -1,
        name: "Рама"
    },
    grille: {
        modType: 6,
        current: -1,
        name: "Решетка радиатора"
    },
    hood: {
        modType: 7,
        current: -1,
        name: "Капот"
    },
    fender: {
        modType: 8,
        current: -1,
        name: "Крыло"
    },
    rightFender: {
        modType: 9,
        current: -1,
        name: "Правое крыло"
    },
    roof: {
        modType: 10,
        current: -1,
        name: "Крыша"
    },
    frontWheels: {
        modType: 23,
        current: -1,
        name: "Колеса"
    },
    livery: {
        modType: 48,
        current: -1,
        name: "Покрасочные работы"
    },
}

let colorData = {
    primary: -1,
    secondary: -1
}

let currentModType;

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
    initTuningParams();
    mp.events.call('tuning.menu.show');
});

mp.events.add('tuning.menu.show', () => {
    mp.callCEFV(`selectMenu.menu = cloneObj(selectMenu.menus["tuningMain"])`);
    for (let key in tuningParams) {
        if (tuningParams[key].hasOwnProperty('name')) {
            if (vehicle.getNumMods(tuningParams[key].modType) > 0) {
                mp.callCEFV(`selectMenu.menu.items.push({
                    text: '${tuningParams[key].name}',
                    values: ''
                })`);
            }
        }
    }
    mp.callCEFV(`selectMenu.menu.items.push({
        text: 'Закрыть',
        values: ''
    })`);
    mp.callCEFV(`selectMenu.show = true`);
});

mp.events.add('tuning.defaultMenu.show', (modName) => {
    mp.events.call('tuning.modType.set', tuningParams[modName].modType);
    mp.callCEFV(`selectMenu.menu = cloneObj(selectMenu.menus["tuningDefault"])`);
    let data = tuningParams[modName];
    mp.callCEFV(`selectMenu.menu.header = '${data.name}'`);
    let numMods = vehicle.getNumMods(data.modType);
    for (let i = -1; i < numMods; i++) {
        let label = mp.players.local.vehicle.getModTextLabel(data.modType, i);
        let text = mp.game.ui.getLabelText(label);
        if (text == 'NULL') {
            i != -1 ? text = `${data.name} ${i + 1}` : text = 'Нет';
        }
        mp.callCEFV(`selectMenu.menu.items.push({
            text: '${text}',
            values: ['$100']
        })`);
    }
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

mp.events.add('tuning.engineMenu.show', () => {
    mp.callCEFV(`selectMenu.menu = cloneObj(selectMenu.menus["tuningEngine"])`);
    mp.callCEFV(`selectMenu.show = true`);
});

mp.events.add('tuning.breakMenu.show', () => {
    mp.callCEFV(`selectMenu.menu = cloneObj(selectMenu.menus["tuningBreak"])`);
    mp.callCEFV(`selectMenu.show = true`);
});

mp.events.add('tuning.transmissionMenu.show', () => {
    mp.callCEFV(`selectMenu.menu = cloneObj(selectMenu.menus["tuningTransmission"])`);
    mp.callCEFV(`selectMenu.show = true`);
});

mp.events.add('tuning.suspensionMenu.show', () => {
    mp.callCEFV(`selectMenu.menu = cloneObj(selectMenu.menus["tuningSuspension"])`);
    mp.callCEFV(`selectMenu.show = true`);
});

mp.events.add('tuning.armourMenu.show', () => {
    mp.callCEFV(`selectMenu.menu = cloneObj(selectMenu.menus["tuningArmour"])`);
    mp.callCEFV(`selectMenu.show = true`);
});

mp.events.add('tuning.turboMenu.show', () => {
    mp.callCEFV(`selectMenu.menu = cloneObj(selectMenu.menus["tuningTurbo"])`);
    mp.callCEFV(`selectMenu.show = true`);
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

mp.events.add('tuning.mod.set', (type, index) => {
    if (type == -1) type = currentModType;
    mp.chat.debug(currentModType);
    mp.chat.debug(type);
    vehicle.setMod(type, index);
});

mp.events.add('tuning.buy', (modType, modIndex) => {
    mp.callCEFV('selectMenu.loader = true');
    if (modType == -1) modType = currentModType;
    mp.chat.debug(currentModType);
    mp.chat.debug(modType);
    mp.events.callRemote('tuning.buy', modType, modIndex);
});

mp.events.add('tuning.buy.ans', (ans, mod, index) => {
    mp.callCEFV('selectMenu.loader = false');
    switch (ans) {
        case 0:
            tuningParams[mod].current = index;
            vehicle.setMod(tuningParams[mod].modType, tuningParams[mod].current);
            mp.callCEFV(`selectMenu.notification = 'Элемент тюнинга установлен'`);
            break;
    }
});

mp.events.add('render', () => {
    if (controlsDisabled) {
        mp.game.controls.disableControlAction(1, 200, true);
    }
});

function initTuningParams() {
    for (let key in tuningParams) {
        if (tuningParams[key].hasOwnProperty('modType')) {
            tuningParams[key].current = mp.players.local.vehicle.getMod(tuningParams[key].modType);
            mp.chat.debug(`${key} ${tuningParams[key].current}`)
        }
    }
}

mp.events.add('tuning.params.set', setCurrentParams);

mp.events.add('tuning.modType.set', (type) => {
    currentModType = type;
});

function setCurrentParams() {
    vehicle.setColours(tuningParams.primaryColour, tuningParams.secondaryColour);

    for (let key in tuningParams) {
        if (tuningParams[key].hasOwnProperty('modType')) {
            vehicle.setMod(tuningParams[key].modType, tuningParams[key].current);
        }
    }
}