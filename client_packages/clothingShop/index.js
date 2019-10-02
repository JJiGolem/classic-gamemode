let player = mp.players.local;

mp.events.add({
    'clothingShop.enter': (shopData, gender) => {
        // bindKeys(true);
        // bType = shopData.bType;
        // mp.chat.debug(bType);
        // controlsDisabled = true;
        mp.events.call('hud.enable', false);
        mp.game.ui.displayRadar(false);
        mp.callCEFR('setOpacityChat', [0.0]);
        // prices = priceData;
        // currentGender = gender;
        mp.utils.cam.create(shopData.camera.x, shopData.camera.y, shopData.camera.z, shopData.pos.x, shopData.pos.y, shopData.pos.z, 42);

        mp.events.call('selectMenu.show', 'clothingMain');
        player.position = new mp.Vector3(shopData.pos.x, shopData.pos.y, shopData.pos.z);
        player.freezePosition(true);
        setTimeout(() => {
            player.setHeading(shopData.pos.h);
            mp.prompt.show('Используйте <span>A</span> и <span>D</span> для того, чтобы вращать персонажа');
        }, 100);
    },
    'clothingShop.exit': () => {
        mp.events.call(`selectMenu.hide`);
        //bindKeys(false);
        mp.utils.cam.destroy();
        mp.events.call('hud.enable', true);
        mp.game.ui.displayRadar(true);
        mp.callCEFR('setOpacityChat', [1.0]);
        player.freezePosition(false);
        controlsDisabled = false;

        //mp.events.callRemote('clothingShop.exit');
    }
})
