"use strict";

/*
    Модуль смерти игрока. Состояние присмерти.

    created 12.09.19 by Carter Slade
*/

mp.death = {
    // Время ожидания предложения (ms)
    waitHurtTime: 4000,
    // Время ожидания медиков (ms)
    knockTime: 10000,
    // Таймер ожидания медиков
    knockTimer: null,

    knock(player, enable) {
        var dict = "amb@world_human_bum_slumped@male@laying_on_left_side@base";
        player.clearTasksImmediately();
        if (enable) mp.utils.requestAnimDict(dict, () => {
            player.taskPlayAnim(dict, 'base', 8.0, 0, -1, 1, 1.0, false, false, false);
        });
    },
    disableControls(enable) {
        mp.events.call(`mapCase.enable`, !enable);
        mp.events.call(`inventory.enable`, !enable);
        mp.events.call(`effect`, `MP_Killstreak_Out`, 800);
    },
    startKnockTimer() {
        this.stopKnockTimer();
        this.knockTimer = setTimeout(() => {
            mp.events.callRemote(`death.spawn`);
        }, this.knockTime);
    },
    stopKnockTimer() {
        clearTimeout(this.knockTimer);
    }
};

mp.events.add({
    "playerDeath": (player, reason, killer) => {
        setTimeout(() => {
            mp.callCEFV(`offerDialog.show('death')`);
        }, mp.death.waitHurtTime);
    },
    "entityStreamIn": (player) => {
        if (player.type != "player") return;
        var knocked = player.getVariable("knocked") || false;
        mp.death.knock(player, knocked);
    },
    "render": () => {
        var knocked = mp.players.local.getVariable("knocked");
        if (knocked) mp.game.controls.disableAllControlActions(0);
    },
});

mp.events.addDataHandler("knocked", (player, knocked) => {
    mp.death.knock(player, knocked);
    if (player.remoteId == mp.players.local.remoteId) {
        mp.death.disableControls(knocked);
        if (knocked) {
            mp.notify.info(`Ожидайте медиков в течение ${mp.death.knockTime / 1000} сек.`, `Здоровье`);
            mp.death.startKnockTimer();
        }
        else (mp.death.stopKnockTimer());
    }
});
