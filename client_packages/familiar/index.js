"use strict";


/*
    Модуль знакомст.

    created 12.09.19 by Carter Slade
*/

mp.familiar = {
    // Список имен знакомых
    list: [],

    init(list) {
        list.forEach(name => {
            var rec = mp.utils.getPlayerByName(name);
            if (rec) rec.isFamiliar = true;
        });
        this.list = list;
    },
    add(name) {
        if (this.list.includes(name)) return mp.notify.error(`Вы уже знаете ${name}`, `Знакомство`);
        this.list.push(name);
        var rec = mp.utils.getPlayerByName(name);
        if (rec) rec.isFamiliar = true;
    },
    remove(name) {
        var i = this.list.indexOf(name);
        if (i == -1) return mp.notify.error(`Вы не знаете ${name}`, `Знакомство`);
        this.list.splice(i, 1);
        var rec = mp.utils.getPlayerByName(name);
        if (rec) delete rec.isFamiliar;
    },
};

mp.events.add({
    "characterInit.done": () => {
    },
    "familiar.init": (list) => {
        mp.familiar.init(list);
    },
    "familiar.add": (name) => {
        mp.familiar.add(name);
    },
    "familiar.remove": (name) => {
        mp.familiar.remove(name);
    },
    "entityStreamIn": (player) => {
        if (player.type != "player") return;
        if (!mp.familiar.list.length) return;
        if (!mp.familiar.list.includes(player.name)) return;

        player.isFamiliar = true;
    },
});
