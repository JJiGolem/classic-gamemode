"use strict";
/// Выбор персоонажа и подключение создания персоонажа
require("characterInit/characterCreate.js");
const freemodeCharacters = [mp.game.joaat("mp_m_freemode_01"), mp.game.joaat("mp_f_freemode_01")];

let charNum;
//let charClothes = new Array();
let charCustomizations = new Array();
let selectMarkers = new Array();
let currentCharacter = 0;

/// ИЗМЕНЯТЬ ДАННЫЕ НАСТРОЙки ДЛЯ УСТАНОВКИ ПЕДОВ
/// Начальная координата камеры
const camPos = [1220.15, 195.36, 81];//[-1828.8, -870.1, 3.1];//-1828.8 -867.6
/// Координата педа по оси Z для того, что бы ногами расположить на земле
const pedZPos = [81, 81, 81, 81, 81];
/// Расстояние от камеры до текущего педа
const camDist = 2.5;
/// Расстояние между педами
const pedDist = 2.5;
/// Поворот педа
const pedRotation = 180;
/// Поворот камеры
const camRotation = 30;

const cosCamRot = Math.cos(camRotation * Math.PI/180);
const sinCamRot = Math.sin(camRotation * Math.PI/180);
const cosPedRot = Math.cos((pedRotation - 90) * Math.PI/180);
const sinPedRot = Math.sin((pedRotation - 90) * Math.PI/180);

let isBinding = false;


mp.events.add('characterInit.init', (characters) => {
    currentCharacter = 0;
    if (characters != null) {
        charNum = characters.length;
        for (let i = 0; i < characters.length; i++) {
            charCustomizations.push(characters[i].customizations);
            //charClothes.push(characters[i].charClothes);
        }
        
    }
    if (!isBinding){
        binding(true);
        isBinding = true;
    }

    mp.players.local.position = new mp.Vector3(camPos[0], camPos[1], camPos[2]);

    mp.utils.cam.create(camPos[0], camPos[1], camPos[2], camPos[0] + camDist * sinCamRot, camPos[1] + camDist * cosCamRot, camPos[2]);

    createPeds();

    mp.players.local.setAlpha(0);
});

mp.events.add("characterInit.done", () => {
    mp.gui.cursor.show(false, false);
    mp.players.local.freezePosition(false);
    mp.game.ui.displayRadar(true);
    mp.game.ui.displayHud(true);
    
    mp.game.controls.disableControlAction(1, 199, false);    //ESC

    mp.utils.cam.destroy();

    for (let i = 0; i < selectMarkers.length; i++)
        selectMarkers[i].destroy();
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

let createPeds = function() {
    for (let i = 0; i < charNum; i++) {
        //setCharCustom(i);
        //setCharClothes(i);
    
        let ped = mp.peds.new(mp.players.local.model, new mp.Vector3(
            (camPos[0] + i * pedDist * sinPedRot) + camDist * sinCamRot, 
            (camPos[1] + i * pedDist * cosPedRot) + camDist * cosCamRot, 
            pedZPos[i]), 
            pedRotation, mp.players.local.dimension);
        mp.players.local.cloneToTarget(ped.handle);

        selectMarkers.push(mp.markers.new(2, new mp.Vector3(
            (camPos[0] + i * pedDist * sinPedRot) + camDist * sinCamRot, 
            (camPos[1] + i * pedDist * cosPedRot) + camDist * cosCamRot, 
            pedZPos[i] + 1),
            0.2, {
            direction: 0,
            rotation: new mp.Vector3(0, 180, 0),
            color: (i == currentCharacter) ? [255, 221, 85, 255] : [255, 255, 255, 120],
            visible: true,
            dimension: mp.players.local.dimension
        }));
    }
}

let updateMarkers = function() {
    for (let i = 0; i < selectMarkers.length; i++) {
        selectMarkers[i].destroy();
        selectMarkers[i] = mp.markers.new(2, new mp.Vector3(
            (camPos[0] + i * pedDist * sinPedRot) + camDist * sinCamRot, 
            (camPos[1] + i * pedDist * cosPedRot) + camDist * cosCamRot, 
            pedZPos[i] + 1),
            0.2, {
            direction: 0,
            rotation: new mp.Vector3(0, 180, 0),
            color: (i == currentCharacter) ? [255, 221, 85, 255] : [255, 255, 255, 120],
            visible: true,
            dimension: mp.players.local.dimension
        });
    }
}

let chooseLeft = function() { 
    if (currentCharacter > 0) {
        currentCharacter--;
    }
    else {
        return;
    }
    
    updateMarkers();
    mp.utils.cam.moveTo(
        camPos[0] + currentCharacter * pedDist * sinPedRot,
        camPos[1] + currentCharacter * pedDist * cosPedRot, 
        camPos[2],
        (camPos[0] + currentCharacter * pedDist * sinPedRot) + camDist * sinCamRot, 
        (camPos[1] + currentCharacter * pedDist * cosPedRot) + camDist * cosCamRot, 
        pedZPos[i], 
        500);

    
    //ui.callCEF('chooseLeft');
};
let chooseRight = function() { 
    if (currentCharacter < charNum) {
        currentCharacter++;
    }
    else {
        return;
    }
    updateMarkers();
    mp.utils.cam.moveTo(
        camPos[0] + currentCharacter * pedDist * sinPedRot,
        camPos[1] + currentCharacter * pedDist * cosPedRot, 
        camPos[2],
        (camPos[0] + currentCharacter * pedDist * sinPedRot) + camDist * sinCamRot, 
        (camPos[1] + currentCharacter * pedDist * cosPedRot) + camDist * cosCamRot, 
        camPos[2], 
        500);
    

    //ui.callCEF('chooseRight');
};
let choose = function() {
    //ui.callCEF('choose');
    //temp
    mp.events.call('characterInit.choose', currentCharacter);
};
let setCharClothes = function(indexPed) {
    if (charClothes.length <= indexPed) return;
    for (let i = 0; i < charClothes[indexPed].length; i++) {
        for (let j = 6; j < charClothes[indexPed][i].length; j++) {
            mp.players.local.setComponentVariation(charClothes[indexPed][i][j][0], charClothes[indexPed][i][j][1], charClothes[indexPed][i][j][2], charClothes[indexPed][i][j][3]);
        }
    }
};
let setCharCustom = function (indexPed) {
    if (charCustomizations.length <= indexPed) return;
    mp.players.local.model = freemodeCharacters[charCustomizations[indexPed].gender];
    mp.players.local.setHeadBlendData(
        // shape
        charCustomizations[indexPed].mother,
        charCustomizations[indexPed].father,
        0,

        // skin
        0,
        charCustomizations[indexPed].skin,
        0,

        // mixes
        charCustomizations[indexPed].similarity,
        1.0,
        0.0,

        false
    );
    mp.players.local.setComponentVariation(2, charCustomizations[indexPed].hair, 0, 2);
    mp.players.local.setHairColor(charCustomizations[indexPed].hairColor, charCustomizations[indexPed].hairHighlightColor);
    mp.players.local.setEyeColor(charCustomizations[indexPed].eyeColor);
    for (let i = 0; i < 10; i++) {
        mp.players.local.setHeadOverlay(i, charCustomizations[indexPed].Appearance[i].value,
            charCustomizations[indexPed].Appearance[i].opacity, colorForOverlayIdx(i, indexPed), 0);
        
    }
    for (let i = 0; i < 20; i++) {
        mp.players.local.setFaceFeature(i, charCustomizations[indexPed].Features[i].value);
    }
};
let colorForOverlayIdx = function(index, indexPed) {
    let color;

    switch (index) {
        case 1:
            color = charCustomizations[indexPed].BeardColor;
        break;

        case 2:
            color = charCustomizations[indexPed].EyebrowColor;
        break;

        case 5:
            color = charCustomizations[indexPed].BlushColor;
        break;

        case 8:
            color = charCustomizations[indexPed].LipstickColor;
        break;

        case 10:
            color = charCustomizations[indexPed].ChestHairColor;
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