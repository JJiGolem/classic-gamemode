let config = require('barbershop/data.js');

let isInBarbershopShape = false;
let controlsDisabled = false;
let player = mp.players.local;
let currentGender = 0;

let appearance = {
    hairstyle: 0,
    hairColor: 0,
    hairHighlightColor: 0,
    facialHair: 0,
    facialHairColor: 0
}

let current = {
    hairstyle: 0,
    hairColor: 0,
    hairHighlightColor: 0,
    facialHair: 0,
    facialHairColor: 0
}
mp.events.add('barbershop.shape', (enter) => {
    isInBarbershopShape = enter;
});

mp.keys.bind(0x45, true, () => {
    if (isInBarbershopShape) {
        if (mp.busy.includes()) return;
        mp.events.callRemote('barbershop.enter');
    }
});

mp.events.add('barbershop.enter', (shopData, gender, appearanceData) => {
    controlsDisabled = true;
    mp.events.call('hud.enable', false);
    mp.game.ui.displayRadar(false);
    mp.callCEFR('setOpacityChat', [0.0]);
    currentGender = gender;
    initCurrentAppearanceParams(appearanceData);
    mp.events.call('barbershop.mainMenu.show');
    mp.utils.cam.create(shopData.camera.x, shopData.camera.y, shopData.camera.z, shopData.pos.x, shopData.pos.y, shopData.pos.z + 0.6, 40);

    player.position = new mp.Vector3(shopData.pos.x, shopData.pos.y, shopData.pos.z);
    player.freezePosition(true);
    setTimeout(() => {
        player.setHeading(shopData.pos.h);
    }, 100);
});

mp.events.add('barbershop.exit', () => {
    mp.utils.cam.destroy();
    mp.events.call('hud.enable', true);
    mp.game.ui.displayRadar(true);
    mp.callCEFR('setOpacityChat', [1.0]);
    player.freezePosition(false);
    controlsDisabled = false;
    mp.callCEFV(`selectMenu.show = false`);
    mp.events.callRemote('barbershop.exit');
});

mp.events.add('render', () => {
    if (controlsDisabled) {
        mp.game.controls.disableControlAction(0, 21, true); /// бег
        mp.game.controls.disableControlAction(0, 22, true); /// прыжок
        mp.game.controls.disableControlAction(0, 31, true); /// вперед назад
        mp.game.controls.disableControlAction(0, 30, true); /// влево вправо
        mp.game.controls.disableControlAction(0, 24, true); /// удары
        mp.game.controls.disableControlAction(1, 200, true); // esc
    }
});

mp.events.add('barbershop.mainMenu.show', () => {
    setCurrentAppearanceParams();
    let items = [{
        text: 'Прически'
    },
    {
        text: 'Цвет волос'
    },
    {
        text: 'Доп. цвет волос'
    },
    ];

    if (currentGender == 0) {
        items.push({
            text: 'Растительность на лице'
        },
            {
                text: 'Цвет растительности на лице'
            }
        )
    }
    items.push({
        text: 'Выйти'
    });

    mp.callCEFV(`selectMenu.setItems('barbershopMain', ${JSON.stringify(items)});`)
    mp.callCEFV(`selectMenu.menu = cloneObj(selectMenu.menus["barbershopMain"])`);
    mp.callCEFV(`selectMenu.show = true`);

});


mp.events.add('barbershop.hairstylesMenu.show', () => {

    let items = [];

    let hairstyles = config.hairList[currentGender];

    hairstyles.forEach((current) => {
        items.push({
            text: current.name,
            values: ['$100']
        });
    });

    items.push({
        text: 'Назад'
    });

    player.setComponentVariation(2, 0, 0, 2);
    mp.callCEFV(`selectMenu.setItems('barbershopHairstyles', ${JSON.stringify(items)});`)
    mp.callCEFV(`selectMenu.menu = cloneObj(selectMenu.menus["barbershopHairstyles"])`);
    mp.callCEFV(`selectMenu.show = true`);

});

mp.events.add('barbershop.hairstyle.set', (index) => {
    let hairstyles = config.hairList[currentGender];
    let variation = hairstyles[index].id;
    player.setComponentVariation(2, variation, 0, 2);
});

mp.events.add('barbershop.hairstyle.buy', (index) => {
    mp.callCEFV('selectMenu.loader = true');
    let hairstyles = config.hairList[currentGender];
    let hairstyleId = hairstyles[index].id;
    current.hairstyle = hairstyleId;
    mp.events.callRemote('barbershop.hairstyle.buy', hairstyleId);
});

mp.events.add('barbershop.hairstyle.buy.ans', (ans) => {
    mp.callCEFV('selectMenu.loader = false');
    switch (ans) {
        case 0:
            appearance.hairstyle = current.hairstyle;
            mp.callCEFV(`selectMenu.notification = 'Прическа сделана'`);
            break;
    }
});

mp.events.add('barbershop.facialHairMenu.show', () => {

    let items = [];

    let facialHairList = config.facialHairList;

    facialHairList.forEach((current) => {
        items.push({
            text: current,
            values: ['$100']
        });
    });

    items.push({
        text: 'Назад'
    });
    player.setHeadOverlay(1, 255, 1.0, appearance.facialHairColor, 0);
    mp.callCEFV(`selectMenu.setItems('barbershopFacialHair', ${JSON.stringify(items)});`)
    mp.callCEFV(`selectMenu.menu = cloneObj(selectMenu.menus["barbershopFacialHair"])`);
    mp.callCEFV(`selectMenu.show = true`);
});

mp.events.add('barbershop.facialHair.set', (index) => {
    index == 0 ? index = 255 : index -= 1;
    player.setHeadOverlay(1, index, 1.0, appearance.facialHairColor, 0);
});

mp.events.add('barbershop.facialHair.buy', (index) => {
    mp.callCEFV('selectMenu.loader = true');
    index == 0 ? index = 255 : index -= 1;
    current.facialHair = index;
    mp.events.callRemote('barbershop.facialHair.buy', index);
});

mp.events.add('barbershop.facialHair.buy.ans', (ans) => {
    mp.callCEFV('selectMenu.loader = false');
    switch (ans) {
        case 0:
            appearance.facialHair = current.facialHair;
            mp.callCEFV(`selectMenu.notification = 'Борода заменена'`);
            break;
    }
});

function setCurrentAppearanceParams() {
    player.setComponentVariation(2, appearance.hairstyle, 0, 2);
    player.setHeadOverlay(1, appearance.facialHair, 1.0, appearance.facialHairColor, 0)
}

function initCurrentAppearanceParams(data) {
    appearance.hairstyle = player.getDrawableVariation(2);
    appearance.facialHair = player.getHeadOverlayValue(1);
    appearance.hairColor = data.hairColor;
    appearance.hairHighlightColor = data.hairHighlightColor;
    appearance.facialHairColor = data.facialHairColor;
}