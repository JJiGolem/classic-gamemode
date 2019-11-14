"use strict";
/// Подключение всех модулей на сервере

/// Служебные модули
require('base');
require('utils');
require('browser');

let browserLoaded = false;
let initDone = false;
let showLoadingText = true;

mp.events.add('render', () => {
    if (showLoadingText) {
        mp.game.graphics.drawText("Сервер загружается, подождите", [0.5, 0.5], {
            font: 0,
            color: [252, 223, 3, 200],
            scale: [0.5, 0.5],
            outline: true
        });
    }
});

/// Автоподключение клиентских модулей
mp.events.add('init', (activeModules) => {
    activeModules = JSON.parse(activeModules);
    //let activeModules = ["admin","afk","ammunation","animations","army","attaches","auth","bands","bank","barbershop","bins","bizes","busdriver","carmarket","carrier","carservice","carshow","casino","changelist","characterInit","chat","clothes","clothingShop","death","dev","dmv","documents","eatery","economy","factions","familiar","farms","fishing","fuelstations","government","houses","hud","infoTable","inhabitants","interaction","interactionMenu","inventory","mafia","mapCase","markers","masks","money","mood","nametags","noclip","notifications","NPC","offerDialog","parkings","phone","playerMenu","police","prompt","rent","routes","selectMenu","serializer","supermarket","tattoo","taxi","terminal","time","timer","tuning","vehicles","voiceChat","walking","watermark","weapons","weather","wedding","woodman","world"];
    activeModules.forEach(moduleName => {
        require(moduleName);
    });
    initDone = true;
    if (browserLoaded) {
        showLoadingText = false;
        mp.events.callRemote('player.joined');
    }
});

mp.events.add('browserDomReady', (browser) => {
    browserLoaded = true;
    if (initDone) {
        showLoadingText = false;
        mp.events.callRemote('player.joined');
    }
});
mp.events.callRemote("playerReadyToJoin");