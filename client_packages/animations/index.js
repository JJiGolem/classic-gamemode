"use strict";


/*
    Модуль анимаций.

    created 26.09.19 by Carter Slade
*/

mp.animations = {
    animatorActive: false,
    animId: 0,
    animationTimer: null,

    playAnimation(player, a, time = null) {
        player.clearTasksImmediately();
        if (!a) return;
        mp.utils.requestAnimDict(a.dict, () => {
            player.taskPlayAnim(a.dict, a.name, a.speed, 0, -1, a.flag, 0, false, false, false);
        });
        if (!time) return;
        var id = player.remoteId;
        clearTimeout(this.animationTimer);
        this.animationTimer = setTimeout(() => {
            var rec = mp.players.atRemoteId(id);
            if (rec) rec.clearTasksImmediately();
        }, time);
    },
    animator() {
        this.animatorActive = !this.animatorActive;
        if (this.animatorActive) {
            mp.keys.bind(37, false, () => { //left
                this.animId--;
                if (this.animId < 0) this.animId = 0;
                mp.events.callRemote("animations.playById", this.animId);
            });

            mp.keys.bind(39, false, () => { //right
                this.animId++;
                mp.events.callRemote("animations.playById", this.animId);
            });

            mp.keys.bind(38, false, () => { //up
                this.animId -= 100;
                if (this.animId < 0) this.animId = 0;
                mp.events.callRemote("animations.playById", this.animId);
            });

            mp.keys.bind(40, false, () => { //down
                this.animId += 100;
                mp.events.callRemote("animations.playById", this.animId);
            });

            mp.events.callRemote("animations.playById", this.animId);
        } else {
            mp.keys.unbind(37, false);
            mp.keys.unbind(39, false);
            mp.keys.unbind(38, false);
            mp.keys.unbind(40, false);

            mp.events.callRemote("animations.stop");
        }
    },
    render() {
        if (!this.animatorActive) return;

        mp.game.graphics.drawText(`~y~left, right ~w~- листать анимации`, [0.8, 0.36], {
            font: 4,
            color: [12, 144, 12, 230],
            scale: [0.6, 0.6],
            outline: true
        });
        mp.game.graphics.drawText(`~y~ up, down ~w~- листать на 100 анимаций`, [0.8, 0.4], {
            font: 4,
            color: [12, 144, 12, 230],
            scale: [0.6, 0.6],
            outline: true
        });
        mp.game.graphics.drawText(`ID: ~b~ ${this.animId}`, [0.8, 0.44], {
            font: 4,
            color: [12, 144, 12, 230],
            scale: [0.6, 0.6],
            outline: true
        });
        mp.game.graphics.drawText(`~y~ /animator ~w~- выход`, [0.8, 0.48], {
            font: 4,
            color: [12, 144, 12, 230],
            scale: [0.6, 0.6],
            outline: true
        });
    },
};

mp.events.add({
    "animations.animator": () => {
        mp.animations.animator();
    },
    "animations.play": (playerId, a, time = null) => {
        var player = mp.players.atRemoteId(playerId);
        if (!player) return;
        mp.animations.playAnimation(player, a, time);
    },
    "render": () => {
        mp.animations.render();
    },
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
