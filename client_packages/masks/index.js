let isInMaskShop = false;
let maskList;
let controlsDisabled = false;
mp.events.add('masks.shop.shape', (enter) => {
    isInMaskShop = enter;
});


mp.keys.bind(0x45, true, () => {
    if (isInMaskShop) {
        if (mp.busy.includes()) return;
        mp.chat.debug('show masks');
        mp.events.callRemote('masks.shop.enter');
    }
});

mp.events.add('masks.shop.enter', (data, list) => {
    controlsDisabled = true;
    mp.events.call('hud.enable', false);
    mp.game.ui.displayRadar(false);
    mp.callCEFR('setOpacityChat', [0.0]);

    let player = mp.players.local;
    maskList = list;

    mp.events.call('masks.set', 0, 0);
    mp.utils.cam.create(data.camera.x, data.camera.y, data.camera.z, data.fitting.x, data.fitting.y, data.fitting.z + 0.6, 40);
    let items = [];
    for (let i = 0; i < maskList.length; i++) {
        let variations = getMaskVariationsNumber(maskList[i].drawable);
        let values = [];
        for (let i = 0; i < variations; i++) {
            values.push(`Вид №${i + 1}`);
        }
        items.push({
            text: maskList[i].name == 'Маска' ? `${maskList[i].name} ${maskList[i].id} [$${maskList[i].price}]` : `${maskList[i].name} [$${maskList[i].price}]`,
            values: values
        });
    }
    items.push({
        text: 'Выйти'
    });
    player.position = new mp.Vector3(data.fitting.x, data.fitting.y, data.fitting.z);
    player.freezePosition(true);
    setTimeout(() => {
        player.setHeading(data.fitting.h);
    }, 100);
    
    mp.callCEFV(`selectMenu.setItems('maskShop', ${JSON.stringify(items)});`)
    mp.callCEFV(`selectMenu.menu = cloneObj(selectMenu.menus["maskShop"])`);
    mp.callCEFV(`selectMenu.show = true`);
});

mp.events.add('masks.shop.exit', () => {
    mp.utils.cam.destroy();
    let player = mp.players.local;
    mp.events.call('hud.enable', true);
    mp.game.ui.displayRadar(true);
    mp.callCEFR('setOpacityChat', [1.0]);
    player.freezePosition(false);
    controlsDisabled = false;
    mp.callCEFV(`selectMenu.show = false`);
    mp.events.callRemote('masks.shop.exit');
});

mp.events.add('masks.set', (maskIndex, textureId) => {
    let drawableId = maskList[maskIndex].drawable;
    mp.chat.debug(getMaskVariationsNumber(drawableId))
    let player = mp.players.local;
    player.setComponentVariation(1, drawableId, textureId, 0);
});

mp.events.add('render', () => {
    if (controlsDisabled) {
        mp.game.controls.disableControlAction(0, 21, true); /// бег
        mp.game.controls.disableControlAction(0, 22, true); /// прыжок
        mp.game.controls.disableControlAction(0, 31, true); /// вперед назад
        mp.game.controls.disableControlAction(0, 30, true); /// влево вправо
        mp.game.controls.disableControlAction(0, 24, true); /// удары
    }
});

function getMaskVariationsNumber(maskId) {
    return mp.players.local.getNumberOfTextureVariations(1, maskId) || 1;
}