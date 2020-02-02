"use strict";

let isEscDisabled = false;

mp.events.add("render", () => {
    mp.game.controls.disableControlAction(1, 199, true);
    mp.game.controls.disableControlAction(1, 243, true);
    if (isEscDisabled) {
        mp.game.controls.disableControlAction(1, 200, true);
    }
});

var d = (text) => {
    mp.notify.info(text);
};
var debug = (text) => {
    mp.terminal.debug(text);
};

mp.events.add('time.minute.tick', () => {
    mp.discord.update('Classic Roleplay', 'classic-rp.ru');
});

mp.renderChecker = false;
mp.timeMainChecker = {
    enable: false,
    modules: {
        attaches: 0,
    }
};
mp.events.add("render", () => {
    if (!mp.timeMainChecker.enable) return;
    var y = 0.2;
    for (var name in mp.timeMainChecker.modules) {
        mp.utils.drawText2d(`${name} tick: ${mp.timeMainChecker.modules[name]} ms`, [0.8, y += 0.02]);
    }
});

mp.busy = {};
mp.busy.list = [];
mp.busy.mouses = [];

mp.busy.add = function(name, mouse = true, nocef = false) {
    if (mp.game.ui.isPauseMenuActive()) return false;
    if (!nocef) mp.callCEFV(`busy.add(\`${name}\`)`);
    if (mp.busy.list.includes(name)) return false;
    mp.busy.list.push(name);
    if (mouse) {
        mp.busy.mouses.push(name);
        mp.gui.cursor.show(true, true);
    }
    isEscDisabled = true;
    return true;
};

mp.busy.includes = function(name) {
    if (Array.isArray(name)) {
        for (let index = 0; index < name.length; index++) {
            if (mp.busy.list.includes(name[index])) {
                return true;
            }
        }
        return false;
    } else {
        if (name == null) {
            return mp.busy.list.length;
        } else {
            return mp.busy.list.includes(name);
        }
    }
};

mp.busy.remove = function(name, nocef = false) {
    if (!nocef) mp.callCEFV(`busy.remove(\`${name}\`)`);
    let index = mp.busy.list.findIndex(x => x === name);
    index !== -1 && mp.busy.list.splice(index, 1);

    let mouseIndex = mp.busy.mouses.findIndex(x => x === name);
    mouseIndex !== -1 && mp.busy.mouses.splice(mouseIndex, 1);
    if (mp.busy.mouses.length === 0) mp.gui.cursor.show(false, false);

    if (mp.busy.list.length === 0) isEscDisabled = false;
};

mp.events.add({
    "busy.add": mp.busy.add,
    "busy.remove": mp.busy.remove,
    "time.main.tick": () => {
        if (mp.busy.mouses.length && !mp.gui.cursor.visible) mp.gui.cursor.show(true, true);
        mp.game.player.resetStamina();
    }
});

mp.events.add("callRemote", (name, values) => {
    mp.events.callRemote(name, values);
});
