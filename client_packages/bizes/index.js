"use strict";


let idBiz = null;
let cost = null;


mp.keys.bind(0x42, true, function() {           //B
    if (mp.busy.includes()) return;
    mp.events.callRemote('biz.menu.open');
});

mp.events.add("biz.menu.open", (info) => {
    if (mp.busy.includes()) return;
    if (!mp.busy.add("biz.info")) return;
    info.area = mp.game.ui.getLabelText(mp.game.zone.getNameOfZone(info.pos[0], info.pos[1], info.pos[2]));
    mp.callCEFR("biz.load", [info]);
    mp.callCEFR("biz.menu", []);
    mp.gui.cursor.show(true, true);
});

mp.events.add("biz.menu.close", (fromServer) => {
    mp.busy.remove("biz.info");
    mp.gui.cursor.show(false, false);
    if (fromServer) {
        mp.callCEFR("biz.menu.close", []);
    }
    else {
        mp.events.callRemote("biz.menu.close");
    }
});

mp.events.add("biz.buy", () => {
    mp.events.callRemote("biz.buy");
});
mp.events.add("biz.buy.ans", (ans, owner) => {
    mp.callCEFR("biz.buy.ans", [ans, owner]);
});

mp.events.add("biz.actions", (action) => {
    mp.chat.debug("BIZ actions opened");
});


/// Phone app events
mp.events.add("biz.sell.toGov", (id) => {
    mp.events.callRemote("biz.sell.toGov", id);
});
mp.events.add("biz.sell.toGov.ans", (result) => {
    mp.callCEFR("biz.sell.toGov.ans", result);
});

mp.events.add("biz.sell.check", (idBizT, idOrNick, costT) => {
    idBiz = idBizT;
    cost = costT;
    mp.events.callRemote("biz.sell.check", idOrNick);
});
mp.events.add("biz.sell.check.ans", (nick) => {
    mp.callCEFR("biz.sell.check.ans", [nick, cost]);
});

mp.events.add("biz.sell", () => {
    if (name != null && cost != null) {
        mp.events.callRemote('biz.sell', name, cost);
    }
    name = null;
    cost = null;
});
mp.events.add("biz.sell.stop", () => {
    mp.events.callRemote("biz.sell.stop");
});
mp.events.add("biz.sell.ans", (result) => {
    mp.callCEFR("biz.sell.ans", [result]);
});

mp.events.add("biz.order.add", (id, productCount, productPrice) => {
    mp.events.callRemote("biz.order.add", id, productCount, productPrice);
});
mp.events.add("biz.order.ans", (result) => {
    mp.callCEFR("biz.order.ans", [result]);
});
mp.events.add("biz.order.cancel", (id) => {
    mp.events.callRemote("biz.order.cancel", id);
});
mp.events.add("biz.order.complete", (resources) => {
    mp.callCEFR("biz.order.complete", [resources]);
});

mp.events.add("biz.statistics.update", (date, money) => {
    mp.callCEFR("biz.statistics.update", [date, money]);
});