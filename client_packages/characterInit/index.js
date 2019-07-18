"use strict";
/// Выбор персоонажа и подключение создания персоонажа
require("characterInit/characterCreate.js");
const freemodeCharacters = [mp.game.joaat("mp_m_freemode_01"), mp.game.joaat("mp_f_freemode_01")];

let menuCameras = new Array();

let charNum;
let charClothes = new Array();
let charCustomizations = new Array();
let currentCharacter = 0;
let isExist = false;

const menuCamPos = [1207.15, 176.36, 79.82];//[-1828.8, -870.1, 3.1];//-1828.8 -867.6
const menuCamDist = 2.5;
const playerPosZ = [79.83, 79.83, 79.83]//[3.151, 3.155, 3.234];
const cos30 = 0.866;
const sin30 = 0.5;

let isBinding = false;



menuCameras.push(mp.cameras.new('menu0', new mp.Vector3(menuCamPos[0], menuCamPos[1], menuCamPos[2] + 0.5), new mp.Vector3(0,0,0), 50));
menuCameras[0].pointAtCoord(menuCamPos[0] + menuCamDist * cos30, menuCamPos[1] - menuCamDist * sin30, menuCamPos[2]);
menuCameras[0].setActive(false);

menuCameras.push(mp.cameras.new('menu1', new mp.Vector3(menuCamPos[0], menuCamPos[1], menuCamPos[2] + 0.5), new mp.Vector3(0,0,0), 50));
menuCameras[1].pointAtCoord(menuCamPos[0] - menuCamDist * cos30, menuCamPos[1] - menuCamDist * sin30, menuCamPos[2]);
menuCameras[1].setActive(false);

menuCameras.push(mp.cameras.new('menu2', new mp.Vector3(menuCamPos[0], menuCamPos[1], menuCamPos[2] + 0.5), new mp.Vector3(0,0,0), 50));
menuCameras[2].pointAtCoord(menuCamPos[0], menuCamPos[1] + menuCamDist, menuCamPos[2]);
menuCameras[2].setActive(false);

menuCameras.push(mp.cameras.new('menu3', new mp.Vector3(menuCamPos[0], menuCamPos[1], menuCamPos[2] + 0.5), new mp.Vector3(0,0,0), 50));
menuCameras[3].pointAtCoord(menuCamPos[0] + menuCamDist * cos30, menuCamPos[1] - menuCamDist * sin30, menuCamPos[2]);
menuCameras[3].setActive(false);

menuCameras.push(mp.cameras.new('menu4', new mp.Vector3(menuCamPos[0], menuCamPos[1], menuCamPos[2] + 0.5), new mp.Vector3(0,0,0), 50));
menuCameras[4].pointAtCoord(menuCamPos[0] - menuCamDist * cos30, menuCamPos[1] - menuCamDist * sin30, menuCamPos[2]);
menuCameras[4].setActive(false);



mp.events.add('characterInit.init', (characters) => {
    currentCharacter = 0;
    if (characters != null) {
        charNum = characters.length;
        for (let i = 0; i < characters.length; i++) {
            charCustomizations.push(characters[i].customizations);
            charClothes.push(characters[i].charClothes);
        }
        
    }
    if (!isBinding){
        binding(true);
        isBinding = true;
    }
    //setCharCustom();
    //setCharClothes();
    mp.players.local.setRotation(0, 0, 60, 0, true);
    if (charNum == currentCharacter) {
        mp.players.local.position = new mp.Vector3(menuCamPos[0] + menuCamDist * cos30, menuCamPos[1] - menuCamDist * sin30, playerPosZ[0] + 4);
    }
    else {
        mp.players.local.position = new mp.Vector3(menuCamPos[0] + menuCamDist * cos30, menuCamPos[1] - menuCamDist * sin30, playerPosZ[0]);
    }


    menuCameras[currentCharacter].setActive(true);
    mp.game.cam.renderScriptCams(true, false, 0, true, false);
});

mp.events.add("characterInit.done", () => {
    mp.gui.cursor.show(false, false);
    mp.players.local.freezePosition(false);
    mp.game.ui.displayRadar(true);
    mp.game.ui.displayHud(true);
    
    mp.game.controls.disableControlAction(1, 199, false);    //ESC

    mp.game.cam.renderScriptCams(false, false, 0, true, false);
});

mp.events.add('characterInit.choose', (charnumber) => {
    if(isBinding) {
        binding(false);
        isBinding = false;
    }
    mp.events.callRemote('characterInit.choose', charnumber);
});

mp.events.add('characterInit.choose.ans', (ans) => {     //0 - не успешно     1 - успешно
    if (ans == 0) {
        if(!isBinding){
            binding(true);
            isBinding = true;
        }
    }
});

mp.events.add('characterInit.chooseRight', () => {
    chooseRight();
});
mp.events.add('characterInit.chooseLeft', () => {
    chooseLeft();
});



let changeChar = async function() {
    setCharCustom();
    //setCharClothes();
    let up = 0;
    if (!isExist) up = 4;
    switch(currentCharacter)
    {
        case 0:
        mp.players.local.setRotation(0, 0, 60, 0, true);
        mp.players.local.position = new mp.Vector3(menuCamPos[0] + menuCamDist * cos30, menuCamPos[1] - menuCamDist * sin30, playerPosZ[0] + up);
        break;
        case 1:
        mp.players.local.setRotation(0, 0, 300, 0, true);
        mp.players.local.position = new mp.Vector3(menuCamPos[0] - menuCamDist * cos30, menuCamPos[1] - menuCamDist * sin30, playerPosZ[1] + up);
        break;
        case 2:
        mp.players.local.setRotation(0, 0, 180, 0, true);
        mp.players.local.position = new mp.Vector3(menuCamPos[0], menuCamPos[1] + menuCamDist, playerPosZ[2] + up);
        break;
        case 3:
        mp.players.local.setRotation(0, 0, 60, 0, true);
        mp.players.local.position = new mp.Vector3(menuCamPos[0] + menuCamDist * cos30, menuCamPos[1] - menuCamDist * sin30, playerPosZ[0] + up);
        break;
        case 4:
        mp.players.local.setRotation(0, 0, 300, 0, true);
        mp.players.local.position = new mp.Vector3(menuCamPos[0] - menuCamDist * cos30, menuCamPos[1] - menuCamDist * sin30, playerPosZ[1] + up);
        break;
    }
};
let chooseLeft = function() { 
    if (currentCharacter > 0) {
        currentCharacter--;
    }
    else {
        return;
    }
    
    menuCameras[currentCharacter].setActiveWithInterp(menuCameras[currentCharacter + 1].handle, 500, 0, 0);
    isExist = currentCharacter < charNum;
    setTimeout(changeChar, 250);
    //ui.callCEF('chooseLeft');
};
let chooseRight = function() { 
    if (currentCharacter < charNum) {
        currentCharacter++;
    }
    else {
        return;
    }

    menuCameras[currentCharacter].setActiveWithInterp(menuCameras[currentCharacter - 1].handle, 500, 0, 0);
    isExist = currentCharacter < charNum;
    setTimeout(changeChar, 250);
    //ui.callCEF('chooseRight');
};
let choose = function() {
    //ui.callCEF('choose');
    //temp
    mp.events.call('characterInit.choose', currentCharacter, 0);
};
let setCharClothes = function() {
    if (charClothes.length <= currentCharacter) return;
    for (let i = 0; i < charClothes[currentCharacter].length; i++) {
        for (let j = 6; j < charClothes[currentCharacter][i].length; j++) {
            mp.players.local.setComponentVariation(charClothes[currentCharacter][i][j][0], charClothes[currentCharacter][i][j][1], charClothes[currentCharacter][i][j][2], charClothes[currentCharacter][i][j][3]);
        }
    }
};
let setCharCustom = function () {
    if (charCustomizations.length <= currentCharacter) return;
    mp.players.local.model = freemodeCharacters[charCustomizations[currentCharacter].gender];
    mp.players.local.setHeadBlendData(
        // shape
        charCustomizations[currentCharacter].mother,
        charCustomizations[currentCharacter].father,
        0,

        // skin
        0,
        charCustomizations[currentCharacter].skin,
        0,

        // mixes
        charCustomizations[currentCharacter].similarity,
        1.0,
        0.0,

        false
    );
    mp.players.local.setComponentVariation(2, charCustomizations[currentCharacter].hair, 0, 2);
    mp.players.local.setHairColor(charCustomizations[currentCharacter].hairColor, charCustomizations[currentCharacter].hairHighlightColor);
    mp.players.local.setEyeColor(charCustomizations[currentCharacter].eyeColor);
    for (let i = 0; i < 10; i++) {
        mp.players.local.setHeadOverlay(i, charCustomizations[currentCharacter].Appearance[i].value,
            charCustomizations[currentCharacter].Appearance[i].opacity, colorForOverlayIdx(i), 0);
        
    }
    for (let i = 0; i < 20; i++) {
        mp.players.local.setFaceFeature(i, charCustomizations[currentCharacter].Features[i].value);
    }
};
let colorForOverlayIdx = function(index) {
    let color;

    switch (index) {
        case 1:
            color = charCustomizations[currentCharacter].BeardColor;
        break;

        case 2:
            color = charCustomizations[currentCharacter].EyebrowColor;
        break;

        case 5:
            color = charCustomizations[currentCharacter].BlushColor;
        break;

        case 8:
            color = charCustomizations[currentCharacter].LipstickColor;
        break;

        case 10:
            color = charCustomizations[currentCharacter].ChestHairColor;
        break;

        default:
            color = 0;
    }
    return color;
};



function binding(active) {
    if (active) {
        mp.keys.bind(0x44, true, chooseRight);   // D
        mp.keys.bind(0x41, true, chooseLeft);    // A
        mp.keys.bind(0x0D, true, choose);        //Enter
    }
    else {
        mp.keys.unbind(0x44, true, chooseRight);
        mp.keys.unbind(0x41, true, chooseLeft);
        mp.keys.unbind(0x0D, true, choose);
    }
};