"use strict";

let name = null;
let cost = null;


mp.events.add('house.menu', (houseInfo) => {
    mp.gui.cursor.show(true, true);
    houseInfo.area =  mp.game.ui.getLabelText(mp.game.zone.getNameOfZone(houseInfo.pos[0], houseInfo.pos[1], houseInfo.pos[2]));
    mp.callCEFR('house.menu', []);
    mp.callCEFR('house.load', [houseInfo]);
});

mp.events.add('house.menu.close', (isServer) => {
    if (isServer) mp.callCEFR('house.menu.close', []);
    mp.gui.cursor.show(false, false);
});

mp.events.add('house.menu.enter', (place) => {
    mp.gui.cursor.show(true, true);
    mp.callCEFR('house.menu.enter', [place]);
});

mp.events.add('house.menu.enter.close', (isServer) => {
    if (isServer) mp.callCEFR('house.menu.enter.close', []);
    mp.gui.cursor.show(false, false);
});

mp.events.add('house.enter', (place) => {
    mp.events.callRemote('house.enter', place);
});

mp.events.add('house.enter.ans', (isInfoPanel, pos, rot) => {
    if (pos) {
        mp.players.local.setHeading(rot);
        mp.players.local.position = pos;
        mp.game.cam.clampGameplayCamYaw(0, 0);
        mp.gui.cursor.show(false, false);
        isInfoPanel ? mp.callCEFR('house.menu.close', []) : mp.callCEFR('house.menu.enter.close', []);
    }
    else {
        mp.callCEFR('house.enter.ans.err', []);
    }
});

mp.events.add('house.buy', () => {
    mp.events.callRemote('house.buy');
});

mp.events.add('house.buy.ans', (ans, ownerName) => {
    mp.callCEFR('house.buy.ans', [ans, ownerName]);
});


///Phone app events
mp.events.add('house.lock', (id, isOpened) => {
    mp.events.callRemote('house.lock', id, isOpened);
});

mp.events.add('house.sell.toGov', (id) => {
    mp.events.callRemote('house.sell.toGov', id);
});
mp.events.add('house.sell.toGov.ans', (ans) => {
    mp.callCEFR('house.sell.toGov.ans', [ans]);
});

mp.events.add('house.sell.check', (nameT, idOrNick, costT) => {
    name = nameT;
    cost = costT;
    mp.events.callRemote('house.sell.check', idOrNick);
});
mp.events.add('house.sell.check.ans', (nick) => {
    mp.callCEFR('house.sell.check.ans', [nick, cost]);
});

mp.events.add('house.sell', () => {
    mp.events.callRemote('house.sell', name, cost);
});
mp.events.add('house.sell.ans', (ans) => {
    mp.callCEFR('house.sell.ans', [ans]);
});
mp.events.add('house.sell.stop', () => {
    mp.events.callRemote('house.sell.stop');
});