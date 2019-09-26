"use strict";


/*
    Модуль анимаций.

    created 26.09.19 by Carter Slade
*/

mp.animations = {
    playAnimation(player, a) {
        player.clearTasksImmediately();
        if (!a) return;
        mp.utils.requestAnimDict(a.dict, () => {
            player.taskPlayAnim(a.dict, a.name, a.speed, 0, -1, a.flag, 0, false, false, false);
        });
    },
};

mp.events.add({
    "entityStreamIn": (player) => {
        if (player.type != "player") return;
        var a = player.getVariable("anim");
        if (!a) return;

        mp.animations.playAnimation(player, a);
    },
});

mp.events.addDataHandler("anim", (player, a) => {
    if (player.type != "player") return;

    mp.animations.playAnimation(player, a);
});
