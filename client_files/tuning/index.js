let data = require('carshow/data.js');

mp.game.cam.doScreenFadeIn(50);

let colorIDs = [];
let colorValues = [];

let controlsDisabled = false;
let customsId;
let vehicle;

let vehPrice = 100;

let priceConfig = {
    color: 100,
    repair: 500,
    default: 0.01,
    engine: 0.01,
    brake: 0.01,
    transmission: 0.01,
    suspension: 0.01,
    armour: 0.01
}

let tuningParams = {
    primaryColour: -1,
    secondaryColour: -1,
    engineType: {
        modType: 11,
        current: -1,
        name: "Двигатель",
        defaultModNames: ['Стандарт', 'Улучшение СУД, уровень 1', 'Улучшение СУД, уровень 2',
            'Улучшение СУД, уровень 3', 'Улучшение СУД, уровень 4']
    },
    brakeType: {
        modType: 12,
        current: -1,
        name: "Тормоза",
        defaultModNames: ['Стандартные тормоза', 'Уличные тормоза', 'Спортивные тормоза',
            'Гоночные тормоза']
    },
    transmissionType: {
        modType: 13,
        current: -1,
        name: "Трансмиссия",
        defaultModNames: ['Стандартная трансмиссия', 'Уличная трансмиссия',
            'Спортивная трансмиссия', 'Гоночная трансмиссия']
    },
    suspensionType: {
        modType: 15,
        current: -1,
        name: "Подвеска",
        defaultModNames: ['Стандартная подвеска', 'Заниженная подвеска', 'Уличная подвеска',
            'Спортивная подвеска', 'Гоночная подвеска']
    },
    armourType: {
        modType: 16,
        current: -1,
        name: "Броня",
        defaultModNames: ['Нет', 'Усиление брони 20%', 'Усиление брони 40%', 'Усиление брони 60%',
            'Усиление брони 80%', 'Усиление брони 100%']
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
        name: "Правое крыло",
        modelsToIgnore: [mp.game.joaat('imperator')]
    },
    roof: {
        modType: 10,
        current: -1,
        name: "Крыша",
        modelsToIgnore: [mp.game.joaat('revolter'), mp.game.joaat('imperator')]
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

let lastIndex = 0;

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

mp.events.add('tuning.fadeOut', () => {
    mp.game.cam.doScreenFadeOut(80);
});

mp.events.add('tuning.start', (id, primary, secondary, priceInfo) => {
    mp.timer.add(() => {
        mp.game.cam.doScreenFadeIn(500);
    }, 500);

    if (!mp.players.local.vehicle) return;
    controlsDisabled = true;
    mp.events.call('hud.enable', false);
    mp.events.call('vehicles.speedometer.show', false);
    mp.game.ui.displayRadar(false);
    mp.callCEFR('setOpacityChat', [0.0]);
    customsId = id;
    vehicle = mp.players.local.vehicle;
    vehicle.freezePosition(true);
    tuningParams.primaryColour = primary;
    tuningParams.secondaryColour = secondary;
    colorData.primary = primary;
    colorData.secondary = secondary;
    initTuningParams();
    initPrices(priceInfo);
    mp.events.call('tuning.menu.show');
});

mp.events.add('tuning.menu.show', (index = lastIndex) => {
    mp.callCEFV(`selectMenu.menu = cloneObj(selectMenu.menus["tuningMain"])`);
    for (let key in tuningParams) {
        if (tuningParams[key].hasOwnProperty('name')) {
            if (tuningParams[key].hasOwnProperty('modelsToIgnore')) {
                if (tuningParams[key].modelsToIgnore.includes(vehicle.model)) continue;
            }
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
    let visibleIndex = index < 5 ? 0 : index - 4;
    mp.callCEFV(`selectMenu.menu.j = ${visibleIndex}`);
    mp.callCEFV(`selectMenu.menu.i = ${index}`);
    mp.callCEFV(`selectMenu.menu.items[0].values = ['$${parseInt(priceConfig.repair)}']`);
    mp.callCEFV(`selectMenu.show = true`);
});

mp.events.add('tuning.defaultMenu.show', (modName) => {
    mp.events.call('tuning.modType.set', tuningParams[modName].modType);

    let data = tuningParams[modName];
    let numMods = vehicle.getNumMods(data.modType);
    let items = [];
    for (let i = -1; i < numMods; i++) {
        let text;
        if (tuningParams[modName].hasOwnProperty("defaultModNames")) {
            text = tuningParams[modName].defaultModNames[i + 1];
            if (!text) text = `${data.name} ${i + 1}`;
        } else {
            let label = mp.players.local.vehicle.getModTextLabel(data.modType, i);
            text = mp.game.ui.getLabelText(label);
            if (text == 'NULL') {
                i != -1 ? text = `${data.name} ${i + 1}` : text = 'Нет';
            }
        }
        items.push({
            text: text,
            values: [`$${calculatePrice(data.modType, i)}`]
        });
    }
    items.push({
        text: 'Назад'
    });
    mp.callCEFV(`selectMenu.setItems('tuningDefault', ${JSON.stringify(items)});`)
    mp.callCEFV(`selectMenu.menu = cloneObj(selectMenu.menus["tuningDefault"])`);
    mp.callCEFV(`selectMenu.menu.header = '${data.name}'`);

    let setIndex = mp.players.local.vehicle.getMod(data.modType) + 1;
    mp.callCEFV(`selectMenu.menu.items[${setIndex}].values = ['уст.']`);

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
    mp.callCEFVN({ "selectMenu.menu.items[2].values": [`$${priceConfig.color}`] });

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
        case 1:
            mp.callCEFV(`selectMenu.notification = 'Недостаточно денег'`);
            break;
        case 2:
            mp.callCEFV(`selectMenu.notification = 'Вы не в транспорте'`);
            break;
        case 3:
            mp.callCEFV(`selectMenu.notification = 'Модификация недоступна'`);
            break;
        case 4:
            mp.callCEFV(`selectMenu.notification = 'Ошибка покупки'`);
            break;
        case 5:
            mp.callCEFV(`selectMenu.notification = 'В LSC кончились детали'`);
            break;
    }
});

mp.events.add('tuning.end', () => {
    lastIndex = 0;
    controlsDisabled = false;
    mp.callCEFV(`selectMenu.show = false`);
    mp.events.call('vehicles.speedometer.show', true);
    vehicle.freezePosition(false);

    mp.events.call('hud.enable', true);
    mp.game.ui.displayRadar(true);
    mp.callCEFR('setOpacityChat', [1.0]);

    mp.events.callRemote('tuning.end', customsId);
});

mp.events.add('tuning.mod.set', (type, index) => {
    if (type == -1) type = currentModType;
    vehicle.setMod(type, index);
});

mp.events.add('tuning.buy', (modType, modIndex) => {
    mp.callCEFV('selectMenu.loader = true');
    if (modType == -1) modType = currentModType;
    mp.events.callRemote('tuning.buy', modType, modIndex);
});

mp.events.add('tuning.buy.ans', (ans, mod, index) => {
    mp.callCEFV('selectMenu.loader = false');
    switch (ans) {
        case 0:
            tuningParams[mod].current = index;
            mp.callCEFV(`count = -1;
            selectMenu.menu.items.forEach((item) => {
                if (item.values[0] == 'уст.') mp.trigger('tuning.item.update', \`${mod}\`, count)
                count++;
            });
            `);
            mp.callCEFV(`selectMenu.menu.items[${index + 1}].values = ['уст.']`);
            vehicle.setMod(tuningParams[mod].modType, tuningParams[mod].current);
            mp.callCEFV(`selectMenu.notification = 'Элемент тюнинга установлен'`);
            break;
        case 1:
            mp.callCEFV(`selectMenu.notification = 'Недостаточно денег'`);
            break;
        case 2:
            mp.callCEFV(`selectMenu.notification = 'Вы не в транспорте'`);
            break;
        case 3:
            mp.callCEFV(`selectMenu.notification = 'Модификация недоступна'`);
            break;
        case 4:
            mp.callCEFV(`selectMenu.notification = 'Ошибка покупки'`);
            break;
        case 5:
            mp.callCEFV(`selectMenu.notification = 'В LSC кончились детали'`);
            break;
    }
});


mp.events.add('tuning.item.update', (mod, index) => {
    mp.callCEFV(`selectMenu.menu.items[${index + 1}].values = ['$${calculatePrice(tuningParams[mod].modType, index)}']`);
});

mp.events.add('render', () => {
    if (controlsDisabled) {
        mp.game.controls.disableControlAction(1, 200, true);
    }
});

mp.events.add('tuning.lastIndex.set', (index) => {
    lastIndex = index;
});

mp.events.add('tuning.repair', () => {
    mp.events.callRemote('tuning.repair');
    mp.callCEFV('selectMenu.loader = true');
});

mp.events.add('tuning.repair.ans', (ans) => {
    mp.callCEFV('selectMenu.loader = false');
    switch (ans) {
        case 0:
            mp.callCEFV(`selectMenu.notification = 'Автомобиль отремонтирован'`);
            break;
        case 1:
            mp.callCEFV(`selectMenu.notification = 'Недостаточно денег'`);
            break;
        case 2:
            mp.callCEFV(`selectMenu.notification = 'Вы не в транспорте'`);
            break;
        case 3:
            mp.callCEFV(`selectMenu.notification = 'Ремонт недоступен'`);
            break;
        case 4:
            mp.callCEFV(`selectMenu.notification = 'Ошибка покупки'`);
            break;
        case 5:
            mp.callCEFV(`selectMenu.notification = 'В LSC кончились детали'`);
            break;
    }
});

function initTuningParams() {
    for (let key in tuningParams) {
        if (tuningParams[key].hasOwnProperty('modType')) {
            tuningParams[key].current = mp.players.local.vehicle.getMod(tuningParams[key].modType);
        }
    }
}

mp.events.add('tuning.params.set', setCurrentParams);

mp.events.add('tuning.modType.set', (type) => {
    currentModType = type;
});

mp.events.add('render', () => {
    if (controlsDisabled) {
        mp.game.controls.disableControlAction(1, 200, true);
        mp.game.controls.disableControlAction(27, 75, true);
    }
});

function setCurrentParams() {
    vehicle.setColours(tuningParams.primaryColour, tuningParams.secondaryColour);

    for (let key in tuningParams) {
        if (tuningParams[key].hasOwnProperty('modType')) {
            vehicle.setMod(tuningParams[key].modType, tuningParams[key].current);
        }
    }
}

function calculatePrice(modType, index) {
    let key;
    let i = index + 1;
    switch (modType) {
        case 11:
            key = 'engine';
            break;
        case 12:
            key = 'brake';
            break;
        case 13:
            key = 'transmission';
            break;
        case 15:
            key = 'suspension';
            break;
        case 16:
            key = 'armour';
            break;
        default:
            key = 'default';
            break;
    }
    return parseInt(priceConfig[key] * vehPrice * i);
}

function setMenuPrices(modType, lastIndex) {
    for (let i = -1; i <= lastIndex; i++) {
        mp.callCEFV(`selectMenu.menu.items[${i + 1}].values = ['$${calculatePrice(modType, i)}']`);
    }
    let setIndex = mp.players.local.vehicle.getMod(modType) + 1;
    mp.callCEFV(`selectMenu.menu.items[${setIndex}].values = ['уст.']`);
}

function initPrices(info) {
    vehPrice = info.veh;
    for (let key in info.config) {
        priceConfig[key] = info.config[key] * info.priceMultiplier;
    }
}
