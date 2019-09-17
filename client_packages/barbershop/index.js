let isInBarbershopShape = false;
let controlsDisabled = false;
let player = mp.players.local;

mp.events.add('barbershop.shape', (enter) => {
    isInBarbershopShape = enter;
});

mp.keys.bind(0x45, true, () => {
    if (isInBarbershopShape) {
        if (mp.busy.includes()) return;
        mp.chat.debug('show bs');
        mp.events.callRemote('barbershop.enter');
    }
});

mp.events.add('barbershop.enter', (shopData) => {
    controlsDisabled = true;
    mp.events.call('hud.enable', false);
    mp.game.ui.displayRadar(false);
    mp.callCEFR('setOpacityChat', [0.0]);

    mp.utils.cam.create(shopData.camera.x, shopData.camera.y, shopData.camera.z, shopData.pos.x, shopData.pos.y, shopData.pos.z + 0.6, 40);
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
    items.push({
        text: 'Выйти'
    });
    player.position = new mp.Vector3(shopData.pos.x, shopData.pos.y, shopData.pos.z);
    player.freezePosition(true);
    setTimeout(() => {
        player.setHeading(shopData.pos.h);
    }, 100);

    mp.callCEFV(`selectMenu.setItems('barbershopMain', ${JSON.stringify(items)});`)
    mp.callCEFV(`selectMenu.menu = cloneObj(selectMenu.menus["barbershopMain"])`);
    mp.callCEFV(`selectMenu.show = true`);
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