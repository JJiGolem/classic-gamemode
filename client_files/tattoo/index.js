mp.game.ui.requestAdditionalText("tat_mnu", 9);

let player = mp.players.local;
let playerIsFrozen = false;
let gender;

let tattoPacksLoaded = 0;

let tattooList = [];

let sortedList = [];

let rotation = {
    left: false,
    right: false
}

let zonesConfig = {
    0: "Torso",
    1: "Head",
    2: "LeftArm",
    3: "RightArm",
    4: "LeftLeg",
    5: "RightLeg"
}

let characterTattoos = [];

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
        sortTattooList();
        // setHeaders(shopData.bType);
        mp.events.call('hud.enable', false);
        mp.game.ui.displayRadar(false);
        mp.callCEFR('setOpacityChat', [0.0]);
        mp.utils.cam.create(shopData.camera.x, shopData.camera.y, shopData.camera.z, shopData.pos.x, shopData.pos.y, shopData.pos.z, 50);
        mp.callCEFV('loader.show = false');
        priceMultiplier = shopData.priceMultiplier;
        initMenus();
        mp.events.call('selectMenu.show', 'tattooMain');
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
    'tattoo.player.freeze': () => {
        mp.callCEFV('loader.show = true');
        mp.utils.disablePlayerMoving(true);
        player.freezePosition(true);
        playerIsFrozen = true;
    },
    'tattoo.exit': () => {
        playerIsFrozen = false;
        mp.events.call(`selectMenu.hide`);
        bindKeys(false);
        mp.utils.cam.destroy();
        mp.events.call('hud.enable', true);
        mp.game.ui.displayRadar(true);
        mp.callCEFR('setOpacityChat', [1.0]);
        player.freezePosition(false);
        mp.utils.disablePlayerMoving(false);

        mp.events.callRemote('tattoo.exit');
    },
    'tattoo.set': (zoneId, index) => {
        let currentList = sortedList.filter(x => x.zoneId == zoneId);
        let currentTattoo = currentList[index];
        clearTattoos();
        setTattoo(currentTattoo.collection, currentTattoo[gender ? 'hashNameFemale' : 'hashNameMale']);
    },
    'tattoo.characterTattoos.add': (list) => {
        characterTattoos = characterTattoos.concat(list);
        mp.chat.debug(`${list.length} tattoos added`)
    },
    'tattoo.characterTattoos.remove': (id) => {
        characterTattoos = characterTattoos.filter(x => x.id != id);
        mp.chat.debug(`tattoo ${id} removed`)
    },
    'tattoo.clear': clearTattoos,
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

function sortTattooList() {
    let hash = gender ? 'hashNameFemale' : 'hashNameMale';
    sortedList = tattooList.filter(x => x[hash].length != 0);
    mp.chat.debug(`sortedList length ${sortedList.length}`);
}

function initMenus() {
    for (let key in zonesConfig) {
        let items = [];
        let menuName = zonesConfig[key];
        sortedList.forEach((current) => {
            if (current.zoneId != key) return;
            items.push({
                text: mp.game.ui.getLabelText(current.name),
                values: [`$${parseInt(current.price * priceMultiplier)}`]
            });
        })
        items.push({
            text: 'Назад'
        });
        mp.callCEFV(`selectMenu.setItems('tattoo${menuName}', ${JSON.stringify(items)});`)
        mp.callCEFV(`selectMenu.menus["tattoo${menuName}"].i = 0`);
        mp.callCEFV(`selectMenu.menus["tattoo${menuName}"].j = 0`);
    }
}

function clearTattoos() {
    player.clearDecorations();
    characterTattoos.forEach((current) => {
        setTattoo(current.collection, current.hashName);
    });
}

function setTattoo(collection, hashName) {
    player.setDecoration(mp.game.joaat(collection), mp.game.joaat(hashName));
}