let player = mp.players.local;
let playerIsFrozen = false;
let gender;

let tattoPacksLoaded = 0;

let tattooList = [];

let rotation = {
    left: false,
    right: false
}

mp.events.add({
    'tattoo.pack.get': (pack, packsCount) => {
        tattooList = tattooList.concat(pack)
        mp.chat.debug(`${pack.length} tattoos received`)
        tattoPacksLoaded++;
        if (tattoPacksLoaded == packsCount) {
            clothesLoaded = 0;
            mp.chat.debug(`all tattoos received`)
            mp.chat.debug(`final length ${tattooList.length}`)
            mp.events.callRemote('tattoo.enter');
        }
    },
    'tattoo.enter': (shopData, gender) => {
        gender = gender;
        bindKeys(true);
        // setHeaders(shopData.bType);
        mp.events.call('hud.enable', false);
        mp.game.ui.displayRadar(false);
        mp.callCEFR('setOpacityChat', [0.0]);
        mp.utils.cam.create(shopData.camera.x, shopData.camera.y, shopData.camera.z, shopData.pos.x, shopData.pos.y, shopData.pos.z, 50);
        mp.callCEFV('loader.show = false');
        priceMultiplier = shopData.priceMultiplier;
        initMainMenu();
        //mp.events.call('selectMenu.show', 'tattooMain');
        player.position = new mp.Vector3(shopData.pos.x, shopData.pos.y, shopData.pos.z);
        if (!playerIsFrozen) {
            mp.utils.disablePlayerMoving(true);
            player.freezePosition(true);
        }
        mp.timer.add(() => {
            player.setHeading(shopData.pos.h);
            mp.prompt.show('Используйте <span>A</span> и <span>D</span> для того, чтобы вращать персонажа');
        }, 100);
    },
    'render': () => {
        if (rotation.left) player.setHeading(player.getHeading() - 2);
        if (rotation.right) player.setHeading(player.getHeading() + 2);
    },
});



function bindKeys(bind) {
    if (bind) {
        mp.keys.bind(0x41, true, startRotationLeft); // A
        mp.keys.bind(0x41, false, stopRotationLeft); // A
        mp.keys.bind(0x44, true, startRotationRight); // D
        mp.keys.bind(0x44, false, stopRotationRight); // D
    } else {
        mp.keys.unbind(0x41, true, startRotationLeft); // A
        mp.keys.unbind(0x41, false, stopRotationLeft); // A
        mp.keys.unbind(0x44, true, startRotationRight); // D
        mp.keys.unbind(0x44, false, stopRotationRight); // D
        rotation.left = false;
        rotation.right = false;
    }
}

function startRotationLeft() {
    rotation.left = true;
}

function stopRotationLeft() {
    rotation.left = false;
}

function startRotationRight() {
    rotation.right = true;
}

function stopRotationRight() {
    rotation.right = false;
}