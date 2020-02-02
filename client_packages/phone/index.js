"use strict";

let isBinding = false;
let isCall = false;

mp.attachmentMngr.register("takePhone", "prop_npc_phone", 58867, new mp.Vector3(0.06, 0.04, 0.01), new mp.Vector3(-15, 0, -145)); /// Телефон в руке
mp.attachmentMngr.register("callPhone", "prop_npc_phone", 58867, new mp.Vector3(0.01, 0.05, -0.02), new mp.Vector3(-5, -65, 165)); /// Телефон у уха

mp.events.add('phone.load', function (phoneInfo, phoneDialogs, apps) {
    phoneInfo.houses.forEach(house => {
        house.area = mp.game.ui.getLabelText(mp.game.zone.getNameOfZone(house.pos[0], house.pos[1], house.pos[2]));
    });

    phoneInfo.biz.forEach(currentBiz => {
        currentBiz.area = mp.game.ui.getLabelText(mp.game.zone.getNameOfZone(currentBiz.pos[0], currentBiz.pos[1], currentBiz.pos[2]));
    });
    mp.callCEFR('phone.load', [phoneInfo]);
    mp.callCEFR('phone.message.list', [phoneDialogs]);
    apps.forEach(app => {
        mp.callCEFR('phone.app.add', [app, null]);
    });
    bindButtons(phoneInfo.isHave);
});

mp.events.add('phone.app.add', function (appName, info) {
    if (info != null) {
        info.area = mp.game.ui.getLabelText(mp.game.zone.getNameOfZone(info.pos[0], info.pos[1], info.pos[2]));
    }
    mp.callCEFR('phone.app.add', [appName, info]);
});

mp.events.add('phone.app.remove', function (appName, index) {
    mp.callCEFR('phone.app.remove', [appName]);
});

mp.events.add('characterInit.done', function () {
    mp.speechChanel.addChannel("phone");
});

mp.events.add('phone.call.start', function (number) {
    mp.events.callRemote('phone.call.ask', number);
    //playHoldAnimation(false);
    playCallAnimation(true);
});

mp.events.add('phone.call.start.ans', function (ans) {
    playHoldAnimation(true, 1000);
    mp.callCEFR('phone.call.ans', [ans]);
});

mp.events.add('phone.call.end', function () {
    mp.events.callRemote('phone.call.end');
    //playCallAnimation(false);
    playHoldAnimation(true);
});

mp.events.add('phone.call.end.in', function () {
    isCall = false;
    mp.callCEFR('phone.call.end', []);
    //playCallAnimation(false);
    playHoldAnimation(true);
});

mp.events.add('phone.call.in', function (startedPlayerNumber) {
    isCall = true;
    mp.callCEFR('phone.call.in', [startedPlayerNumber]);
});

mp.events.add('phone.call.in.ans', function (ans) {
    mp.events.callRemote('phone.call.ans', ans);
    if (ans == 1) {
        //playHoldAnimation(false);
        playCallAnimation(true);
    }
});

mp.events.add("playerDeath", (player) => {
    if (player.remoteId === mp.players.local.remoteId) {
        if (mp.busy.includes('phone')) {
            hidePhone();
        }
    }
});

mp.events.add('phone.message.send', function (message, number) {
    mp.events.callRemote('phone.message.send', message, number);
});

mp.events.add('phone.message.set', function (message, number) {
    mp.notify.info("Новое сообщение", "Телефон");
    mp.callCEFR('phone.message.set', [message, number]);
});

mp.events.add('phone.dialog.read', function (dialogNumber) {
    mp.events.callRemote('phone.dialog.read', dialogNumber);
});

mp.events.add('phone.contact.add', function (name, number) {
    mp.events.callRemote('phone.contact.add', name, number);
});

mp.events.add('phone.contact.rename', function (number, name) {
    mp.events.callRemote('phone.contact.rename', number, name);
});

mp.events.add('phone.contact.remove', function (number) {
    mp.events.callRemote('phone.contact.remove', number);
});

mp.events.add('phone.contact.mine.update', function (oldNumber, newNumber) {
    mp.callCEFR('phone.contact.mine.update', [oldNumber, newNumber]);
});

mp.events.add('phone.error', function (number) {
    mp.callCEFR('phone.error', [number]);
});



let bindButtons = (state) => {
    if (state) {
        if (isBinding) return;
        isBinding = true;
        mp.keys.bind(0x26, true, showPhone);        
        mp.keys.bind(0x28, true, hidePhone);       
    }
    else {
        if (!isBinding) return;
        isBinding = false;
        mp.keys.unbind(0x26, true, showPhone);        
        mp.keys.unbind(0x28, true, hidePhone);        
    }
};
mp.events.add("phone.show", (state) => {
    if (state) {
        showPhone();
    }
    else {
        hidePhone();
    }
});
let showPhone = () => {
    if (mp.game.ui.isPauseMenuActive()) return;
    if (mp.busy.includes()) return;
    let player = mp.players.local;
    if (player.getVariable("knocked")) return;
    if (!player.getHealth()) return;
    if (mp.farms.isCropping(player)) return;
    isCall = false;

    if (!mp.busy.add('phone')) return;
    mp.callCEFR('phone.show', [true]);
    playCallAnimation(false);
    playHoldAnimation(true);
};

let hidePhone = () => {
    if (mp.game.ui.isPauseMenuActive()) return;
    if (!isCall) {
        if (!mp.busy.includes('phone')) return;
    }
    isCall = false;

    mp.callCEFR('phone.show', [false]);
    mp.busy.remove('phone');
    playHoldAnimation(false);
    playCallAnimation(false);
    if (!mp.players.local.vehicle) {
        mp.events.callRemote('animations.stop');
    }
};

function playHoldAnimation(state, timeout) {
    if (mp.players.local.vehicle) return;
    if (state) {
        if (!timeout) timeout = 0;
        mp.timer.add(()=> {
            mp.attachmentMngr.removeLocal("callPhone");
            mp.events.callRemote('animations.play', 'amb@code_human_wander_texting@male@base', 'static', 1, 49);
            mp.attachmentMngr.addLocal("takePhone");
        }, timeout);
    }
    else {
        mp.attachmentMngr.removeLocal("takePhone");
    }
}

function playCallAnimation(state) {
    if (mp.players.local.vehicle) return;
    if (state) {
        mp.attachmentMngr.removeLocal("takePhone");
        mp.events.callRemote('animations.play', 'amb@code_human_wander_mobile@male@base', 'static', 1, 49);
        mp.attachmentMngr.addLocal("callPhone");
    }
    else {
        mp.attachmentMngr.removeLocal("callPhone");
    }
}
