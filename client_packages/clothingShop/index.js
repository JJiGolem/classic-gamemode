let player = mp.players.local;
let playerIsFrozen = false;

let clothesLoaded = 0;
let clothesList = {
    "bracelets": [],
    "ears": [],
    "glasses": [],
    "hats": [],
    "pants": [],
    "shoes": [],
    "ties": [],
    "tops": [],
    "watches": [],
}

let clothesInfo = {
    "bracelets": {
        prop: 0,
        menuName: 'Bracelets'
    },
    "ears": {
        prop: 2,
        menuName: 'Ears'
    },
    "glasses": {
        prop: 1,
        menuName: 'Glasses'
    },
    "hats": {
        prop: 0,
        menuName: 'Hats'
    },
    "pants": {
        component: 4,
        menuName: 'Pants'
    },
    "shoes": {
        component: 6,
        menuName: 'Shoes'
    },
    "ties": {
        component: 7,
        menuName: 'Ties'
    },
    "tops": {
        component: 11,
        menuName: 'Tops'
    },
    "watches": {
        prop: 6,
        menuName: 'Watches'
    },
}

let rotation = {
    left: false,
    right: false
}

mp.events.add({
    'clothingShop.enter': (shopData) => {
        bindKeys(true);
        setHeaders(shopData.bType);
        mp.events.call('hud.enable', false);
        mp.game.ui.displayRadar(false);
        mp.callCEFR('setOpacityChat', [0.0]);
        mp.console(JSON.stringify(clothesList));
        mp.chat.debug(clothesList.length);
        mp.utils.cam.create(shopData.camera.x, shopData.camera.y, shopData.camera.z, shopData.pos.x, shopData.pos.y, shopData.pos.z, 42);
        mp.callCEFV('loader.show = false');
        mp.events.call('selectMenu.show', 'clothingMain');
        player.position = new mp.Vector3(shopData.pos.x, shopData.pos.y, shopData.pos.z);
        if (!playerIsFrozen) {
            mp.utils.disablePlayerMoving(true);
            player.freezePosition(true);
        }
        setTimeout(() => {
            player.setHeading(shopData.pos.h);
            mp.prompt.show('Используйте <span>A</span> и <span>D</span> для того, чтобы вращать персонажа');
        }, 100);
    },
    'clothingShop.exit': () => {
        playerIsFrozen = false;
        mp.events.call(`selectMenu.hide`);
        bindKeys(false);
        mp.utils.cam.destroy();
        mp.events.call('hud.enable', true);
        mp.game.ui.displayRadar(true);
        mp.callCEFR('setOpacityChat', [1.0]);
        player.freezePosition(false);
        mp.utils.disablePlayerMoving(false);

        //mp.events.callRemote('clothingShop.exit');
    },
    'render': () => {
        if (rotation.left) player.setHeading(player.getHeading() - 2);
        if (rotation.right) player.setHeading(player.getHeading() + 2);
    },
    'clothingShop.list.get': (key, list) => {
        clothesList[key] = list;
        mp.chat.debug(`${key} get. Length ${list.length}`);
        clothesLoaded++;
        if (clothesLoaded == 9) {
            mp.chat.debug(`data received`);
            clothesLoaded = 0;
            mp.events.callRemote('clothingShop.enter');
        }
    },
    'clothingShop.player.freeze': () => {
        mp.callCEFV('loader.show = true');
        mp.utils.disablePlayerMoving(true);
        player.freezePosition(true);
        playerIsFrozen = true;
    }
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

function setHeaders(type) {
    let img;
    mp.chat.debug(type);
    switch (type) {
        case 0:
            img = 'binco';
            break;
        case 1:
            img = 'discount';
            break;
        case 2:
            img = 'suburban';
            break;
        case 3:
            img = 'ponsonbys';
            break;
    }
    ['Main'].forEach(name => mp.callCEFV(`selectMenu.menus["clothing${name}"].headerImg = '${img}.png'`));
}

function initClothingShopMenu() {

}