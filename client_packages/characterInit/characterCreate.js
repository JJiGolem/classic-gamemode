"use strict";
/// Создание персоонажа
const Data = require("characterInit/data.js");
const freemodeCharacters = [mp.game.joaat("mp_m_freemode_01"), mp.game.joaat("mp_f_freemode_01")];
const localPlayer = mp.players.local;

let charData;

let headCreatorCamera;
let creatorCamera;
function camInit() {
    let mainCamera = {
        camera: new mp.Vector3(localPlayer.position.x, localPlayer.position.y - 0.55, localPlayer.position.z + 0.675),
        cameraLookAt: new mp.Vector3(localPlayer.position.x, localPlayer.position.y, localPlayer.position.z + 0.675)
    };
    headCreatorCamera = mp.cameras.new("headCamera", mainCamera.camera, new mp.Vector3(0, 0, 0), 45);
    headCreatorCamera.pointAtCoord(mainCamera.cameraLookAt);


    let torsoCamera;
    torsoCamera = {
        camera: new mp.Vector3(localPlayer.position.x, localPlayer.position.y - 1.25, localPlayer.position.z + 0.5),
        cameraLookAt: new mp.Vector3(localPlayer.position.x, localPlayer.position.y, localPlayer.position.z + 0.5)
    };
    creatorCamera = mp.cameras.new("creatorCamera", torsoCamera.camera, new mp.Vector3(0, 0, 0), 45);
    creatorCamera.pointAtCoord(torsoCamera.cameraLookAt);
}

function applyTorsoCamera() {
    creatorCamera.setActive(true);
    headCreatorCamera.setActive(false);
}

function applyMainCamera() { 
    headCreatorCamera.setActive(true);
    creatorCamera.setActive(false);
}

function showTorso(state) {
    if (state) {
        if (charData.gender == 0) {
            localPlayer.setComponentVariation(3, 15, 0, 2);
            localPlayer.setComponentVariation(8, 15, 0, 2);
            localPlayer.setComponentVariation(11, 15, 0, 2);
        } else {
            localPlayer.setComponentVariation(3, 15, 0, 2);
            localPlayer.setComponentVariation(8, 2, 0, 2);
            localPlayer.setComponentVariation(11, 18, 0, 2);
        }
    } else {
        if (charData.gender == 0) {
            localPlayer.setComponentVariation(3, 0, 0, 2);
            localPlayer.setComponentVariation(8, 15, 0, 2);
            localPlayer.setComponentVariation(11, 0, 0, 2);
        } else {
            localPlayer.setComponentVariation(3, 0, 0, 2);
            localPlayer.setComponentVariation(8, 2, 0, 2);
            localPlayer.setComponentVariation(11, 0, 0, 2);
        }
    }
    
}

function setDefWear() {
    if (charData.gender == 0) {
        localPlayer.setComponentVariation(3, 0, 0, 2);
        localPlayer.setComponentVariation(8, 15, 0, 2);
        localPlayer.setComponentVariation(11, 0, 0, 2);
        localPlayer.setComponentVariation(6, 1, 0, 2);
        localPlayer.setComponentVariation(4, 0, 0, 2);
    } else {
        localPlayer.setComponentVariation(3, 0, 0, 2);
        localPlayer.setComponentVariation(8, 2, 0, 2);
        localPlayer.setComponentVariation(11, 0, 0, 2);
        localPlayer.setComponentVariation(6, 1, 0, 2);
        localPlayer.setComponentVariation(4, 0, 0, 2);
    }
}

function colorForOverlayIdx(index) {
    let color;

    switch (index) {
        case 1:
            color = charData.beardColor;
            break;

        case 2:
            color = charData.eyebrowColor;
            break;

        case 5:
            color = charData.blushColor;
            break;

        case 8:
            color = charData.lipstickColor;
            break;

        case 10:
            color = charData.chestHairColor;
            break;

        default:
            color = 0;
    }
    return color;
}

function updateParents() {
    localPlayer.setHeadBlendData(
        // shape
        charData.mother,
        charData.father,
        0,

        // skin
        0,
        charData.skin,
        0,

        // mixes
        charData.similarity,
        1.0,
        0.0,

        false
    );
}

let deltaRot = 30;
let rotateLeft = function() { 
    let newHeading = localPlayer.getHeading() - deltaRot;
    if (newHeading < 0) {
        newHeading = 360 - deltaRot;
    }
    localPlayer.setRotation(0, 0, newHeading, 0, true);
    localPlayer.position = localPlayer.position;
}
let rotateRight = function() { 
    let newHeading = localPlayer.getHeading() + deltaRot;
    if (newHeading > 360) {
        newHeading = deltaRot;
    }
    localPlayer.setRotation(0, 0, newHeading, 0, true);
    localPlayer.position = localPlayer.position;
}

function binding(active) {
    if (active) {
        mp.keys.bind(0x44, true, rotateRight);   // D
        mp.keys.bind(0x41, true, rotateLeft);    // A
    }
    else {
        mp.keys.unbind(0x44, true, rotateRight);
        mp.keys.unbind(0x41, true, rotateLeft);
    }
}

mp.events.add('characterInit.create.continue', () => {
    binding(false);
});

mp.events.add('characterInit.create.back', () => {
    binding(true);
});

mp.events.add('characterInit.create.check', (name, surname) => {
    mp.events.callRemote('characterInit.create.check', `${name} ${surname}`, JSON.stringify(charData));
});

mp.events.add('characterInit.create.check.ans', (ans) => {
    if (ans == 1) {
        mp.callCEFV(`selectMenu.loader = false;`);
        mp.callCEFV(`selectMenu.show = false`);
        mp.events.call('characterInit.create', false);
    }
    else {
        mp.callCEFV(`selectMenu.loader = false;`);
        mp.callCEFV(`selectMenu.notification = "Такое имя персоонажа уже занято";`);
    }
});

mp.events.add("characterInit.create", (active, rawCharData) => {
    if (active) {
        binding(true);
        charData = JSON.parse(rawCharData);
        mp.gui.cursor.show(true, false);

        camInit();
        applyTorsoCamera();
        
        mp.callCEFV(`selectMenu.menu = selectMenu.menus["characterCreateMainMenu"];`);
        mp.callCEFV(`selectMenu.show = true`);
    } else {
        mp.gui.cursor.show(false, false);
        mp.events.callRemote('characterInit.create.exit');
    }
});

mp.events.add("characterInit.create.head", (active) => {
    showTorso(false);
    if (active) {
        applyMainCamera();
    }
    else {
        applyTorsoCamera();
    }
});

mp.events.add('characterInit.create.exit', () => {
    mp.events.callRemote('characterInit.create.exit');
    mp.events.callRemote('characterInit.start');
});

mp.events.add('characterInit.create.reset', () => {
    if (charData.gender == 0) {
        charData.similarity = 1;
    }
    else {
        charData.similarity = 0;
    }
    charData.mother = 21;
    charData.father = 0;
    charData.skin = 0;
    updateParents();
    applyTorsoCamera();
});

mp.events.add('characterInit.create.setGender', gender => {
    charData.gender = parseInt(gender);
    if (charData.gender == 0 || charData.gender == 1) {
        mp.players.local.model = freemodeCharacters[charData.gender];
    }
    if (charData.gender == 0) {
        charData.similarity = 1;
    }
    else {
        charData.similarity = 0;
    }
    charData.mother = 21;
    charData.father = 0;
    charData.skin = 0;
    updateParents();
    applyTorsoCamera();
    setDefWear();
});


//Hair events
mp.events.add('characterInit.create.setHairstyle', hairStyleId => {
    hairStyleId = parseInt(hairStyleId);
    if (charData.gender === 0) {
        if (hairStyleId >= 0 && hairStyleId <= Data.hairList[0].length) {
            charData.hair = Data.hairList[0][hairStyleId].ID;
            localPlayer.setComponentVariation(2, charData.hair, 0, 2);
        }
    } else if (charData.gender === 1) {
        if (hairStyleId >= 0 && hairStyleId <= Data.hairList[1].length) {
            charData.hair = Data.hairList[1][hairStyleId].ID;
            localPlayer.setComponentVariation(2, charData.hair , 0, 2);
        }
    }
});

mp.events.add('characterInit.create.setHairColor', colorId => {
    colorId = parseInt(colorId);
    if (colorId >= 0 && colorId <= Data.maxHairColor) {
        charData.hairColor = colorId;
        localPlayer.setHairColor(colorId, charData.hairHighlightColor);
    }
});

mp.events.add('characterInit.create.setHairHighlightColor', (highlightColorId) => {
    highlightColorId = parseInt(highlightColorId);
    if (highlightColorId >= 0 && highlightColorId <= Data.maxHairColor) {
        charData.hairHighlightColor = highlightColorId;
        localPlayer.setHairColor(charData.hairColor, highlightColorId);
    }
});

mp.events.add('characterInit.create.setEyebrowColor', (colorId) => {
    colorId = parseInt(colorId);
    if (colorId >= 0 && colorId <= Data.maxHairColor) {
        charData.eyebrowColor = colorId;
        localPlayer.setHeadOverlayColor(2, 1, colorId, 0);
    }
});

mp.events.add('characterInit.create.setFacialHairColor', (colorId) => {
    colorId = parseInt(colorId);
    if (colorId >= 0 && colorId <= Data.maxHairColor) {
        charData.beardColor = colorId;
        localPlayer.setHeadOverlayColor(1, 1, colorId, 0);
    }
});

mp.events.add('characterInit.create.setEyeColor', (colorId) => {
    colorId = parseInt(colorId);
    if (colorId >= 0 && colorId <= Data.maxEyeColor) {
        charData.eyeColor = colorId;
        localPlayer.setEyeColor(colorId);
    }
});

mp.events.add('characterInit.create.setBlushColor', (colorId) => {
    colorId = parseInt(colorId);
    if (colorId >= 0 && colorId <= Data.maxBlushColor) {
        charData.blushColor = colorId;
        localPlayer.setHeadOverlayColor(5, 2, colorId, 0);
    }
});

mp.events.add('characterInit.create.setLipstickColor', (colorId) => {
    colorId = parseInt(colorId);
    if (colorId >= 0 && colorId <= Data.maxLipstickColor) {
        charData.lipstickColor = colorId;
        localPlayer.setHeadOverlayColor(8, 2, colorId, 0);
    }
});

mp.events.add('characterInit.create.setChestHairColor', colorId => {
    applyTorsoCamera();
    showTorso(true);
    colorId = parseInt(colorId);
    if (colorId >= 0 && colorId <= Data.maxHairColor) {
        charData.chestHairColor = colorId;
        localPlayer.setHeadOverlayColor(10, 1, colorId, 0);
    }
});

//Parents events
mp.events.add('characterInit.create.setMother', motherId => {
    motherId = parseInt(motherId);
    if (Data.mothers.includes(motherId)) {
        charData.mother = motherId;
        updateParents();
    }
});

mp.events.add('characterInit.create.setFather', fatherId => {
    fatherId = parseInt(fatherId);
    if (Data.fathers.includes(fatherId)) {
        charData.father = fatherId;
        updateParents();
    }
});


mp.events.add('characterInit.create.setSimilarity', value => {
    value = parseInt(value);
    if (value >= 0 && value <= 100) {
        charData.similarity = value * 0.01;
        updateParents();
    }
});

mp.events.add('characterInit.create.setSkin', value => {
    value = parseInt(value);
    if (value >= 0 && value <= 10) {
        charData.skin = value;
        updateParents();
    }
});


const FACE_FETURE_STEP = 0.1;

//FaceFeatures events
for (let i = 0; i < Data.faceFeaturesNames.length; i++) {
    const eventName = `characterInit.create.set${Data.faceFeaturesNames[i].replace(' ', '')}`;
    if ('characterInit.create.setNoseBroken' == eventName) {
        mp.events.add(eventName, value => {
            value = 20 - value;
            applyMainCamera();
            showTorso(false);
            value = parseInt(value);
            const valueScale = value * FACE_FETURE_STEP - 1;
            if (valueScale >= -1 && valueScale <= 1) {
                charData.Features[i].value = valueScale;
                localPlayer.setFaceFeature(i, valueScale);
            }
        });
    }
    else {
        mp.events.add(eventName, value => {
            applyMainCamera();
            showTorso(false);
            value = parseInt(value);
            const valueScale = value * FACE_FETURE_STEP - 1;
            if (valueScale >= -1 && valueScale <= 1) {
                charData.Features[i].value = valueScale;
                localPlayer.setFaceFeature(i, valueScale);
            }
        });
    }
}

//HeadOverlays events
for (let i = 0; i < Data.headOverlays.length; i++) {
    const eventName = `characterInit.create.set${Data.headOverlays[i].replace(' ', '')}`;
    mp.events.add(eventName, (value, chest) => {
        if (chest) {
            applyTorsoCamera();
            showTorso(true);
        }
        else {
            applyMainCamera();
            showTorso(false);
        }
        value = parseInt(value);
        const opacityScale = 1.0;
        if (opacityScale >= 0 && opacityScale <= 1 && value >= 0 && value <= Data.headOverlayItems[i].length) {
            value--;
            charData.Appearances[i] = {
                value: value,
                opacity: opacityScale
            };
            localPlayer.setHeadOverlay(i, value, opacityScale, colorForOverlayIdx(i), 0);
        }
    });
}