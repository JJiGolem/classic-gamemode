let player = mp.players.local;
let playerIsFrozen = false;

let clothesLoaded = 0;
let clothesList = {
    "bracelets": [],
    "ears": [],
    "glasses": [],
    "watches": [],
    "ties": [],
    "hats": [],
    "tops": [],
    "pants": [],
    "shoes": [],
}
let shopClass;
let currentItem = {
    group: 0,
    index: 0,
    textureIndex: 0
};

let clothesInfo = {
    "bracelets": {
        prop: 7,
        menuName: 'Bracelets',
        name: 'Браслеты'
    },
    "ears": {
        prop: 2,
        menuName: 'Ears',
        name: 'Серьги'
    },
    "glasses": {
        prop: 1,
        menuName: 'Glasses',
        name: 'Очки'
    },
    "hats": {
        prop: 0,
        menuName: 'Hats',
        name: 'Головные уборы'
    },
    "pants": {
        component: 4,
        menuName: 'Pants',
        name: 'Ноги'
    },
    "shoes": {
        component: 6,
        menuName: 'Shoes',
        name: 'Обувь'
    },
    "ties": {
        component: 7,
        menuName: 'Ties',
        name: 'Галстуки'
    },
    "tops": {
        component: 11,
        menuName: 'Tops',
        name: 'Тело'
    },
    "watches": {
        prop: 6,
        menuName: 'Watches',
        name: 'Часы'
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
        shopClass = shopData.class;
        initMainMenu();
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
    },
    'clothingShop.item.set': (group, index, textureIndex) => {
        currentItem.group = group;
        currentItem.index = index;
        currentItem.textureIndex = textureIndex;

        let sortedList = clothesList[group].filter(x => x.class == shopClass);
        let item = sortedList[index];
        setClothes(group, item, textureIndex);
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
    ['Main', 'Tops'].forEach(name => mp.callCEFV(`selectMenu.menus["clothing${name}"].headerImg = '${img}.png'`));
}

function initMainMenu() {
    let items = [];
    for (let key in clothesList) {
        let sortedList = clothesList[key].filter(x => x.class == shopClass);
        if (sortedList.length > 0) {
            items.push({
                text: clothesInfo[key].name
            });
            initSubMenu(key, sortedList);
        }
    }
    items.push({
        text: 'Закрыть'
    });
    mp.callCEFV(`selectMenu.setItems('clothingMain', ${JSON.stringify(items)});`)
    mp.callCEFV(`selectMenu.menus["clothingMain"].i = 0`);
    mp.callCEFV(`selectMenu.menus["clothingMain"].j = 0`);
}

function initSubMenu(key, list) {
    let items = [];
    let menuName = clothesInfo[key].menuName;
    list.forEach((current) => {
        let values = [];
        for (let i = 0; i < current.textures.length; i++) {
            values.push(`№${i + 1}`);
        }
        items.push({
            text: `${current.name} [$${current.price}]`,
            values: values
        });
    })
    items.push({
        text: 'Назад'
    });
    mp.callCEFV(`selectMenu.setItems('clothing${menuName}', ${JSON.stringify(items)});`)
    mp.callCEFV(`selectMenu.menus["clothing${menuName}"].i = 0`);
    mp.callCEFV(`selectMenu.menus["clothing${menuName}"].j = 0`);
}

function setClothes(group, item, textureIndex) {
    let info = clothesInfo[group];

    if (group == 'tops') {
        player.setComponentVariation(3, item.torso, 0, 0);
        player.setComponentVariation(8, item.undershirt, 0, 0);
    }

    if (info.component != null) {
        player.setComponentVariation(info.component, item.variation, item.textures[textureIndex], 0);
    } else {
        player.setPropIndex(info.prop, item.variation, item.textures[textureIndex], true);
    }
}