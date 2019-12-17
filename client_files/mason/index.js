"use strict";

/*
    Модуль каменщика.

    created 12.12.19 by Carter Slade
*/

mp.mason = {
    rockHealthBar: {
        width: 0.1,
        height: 0.015,
        border: 0.0005,
        textColor: [255, 255, 255, 255],
        textScale: [0.2, 0.2],
        getProgressColor() {
            var player = mp.players.local;
            return (player.isInMeleeCombat()) ? [255, 0, 0, 200] : [0, 0, 0, 200];
        },
        getFillColor(health) {
            if (health > 50) return [52, 222, 59, 200];
            if (health > 15) return [255, 187, 0, 200];

            return [187, 68, 68, 200];
        },
    },
    rockHealth: 0,
    rockPos: null,
    lastStartMelee: 0,
    hitWaitTime: 500,
    rockTimer: null,


    drawRockHealthBar(x, y) {
        var info = this.rockHealthBar;
        var color = info.getProgressColor();
        var border = info.border;
        var fillColor = info.getFillColor(this.rockHealth);
        var textColor = info.textColor;
        var textScale = info.textScale;
        mp.game.graphics.drawRect(x, y, info.width + border * 2, info.height + border * 5, color[0], color[1], color[2], color[3]);
        mp.game.graphics.drawRect(x - (100 - this.rockHealth) * 0.0005, y,
            info.width * this.rockHealth / 100, info.height,
            fillColor[0], fillColor[1], fillColor[2], fillColor[3]);
        mp.game.graphics.drawText(`${this.rockHealth}%`, [x, y - 0.04 * textScale[0]], {
            font: 0,
            color: textColor,
            scale: textScale,
            outline: false
        });
    },
    isPickInHands(player) {
        if (!player) player = mp.players.local;
        return player.getVariable("hands") == 136;
    },
    isFocusRock() {
        if (!this.rockPos) return false;
        var player = mp.players.local;
        var positions = [
            player.position,
            player.getOffsetFromInWorldCoords(-1, 0, 0),
            player.getOffsetFromInWorldCoords(1, 0, 0),
            player.getOffsetFromInWorldCoords(0, 0, 1),
            player.getOffsetFromInWorldCoords(0, 0, -1),
        ];
        var rockEntity = null;
        for (var i = 0; i < positions.length; i++) {
            var raycastToRock = mp.raycasting.testPointToPoint(positions[i], this.rockPos);
            // mp.game.graphics.drawLine(positions[i].x, positions[i].y, positions[i].z, this.rockPos.x, this.rockPos.y, this.rockPos.z, 255, 255, 255, 100);
            if (raycastToRock && raycastToRock.entity) {
                rockEntity = raycastToRock.entity;
                break;
            }
        }
        if (!rockEntity) return false;
        // var frontHash = mp.utils.getFrontObjectHash(player);
        // if (!frontHash || frontHash != raycastToRock.entity) return false;
        var frontPos = player.getOffsetFromInWorldCoords(0, 1, this.rockPos.z - player.position.z);

        return mp.vdist(player.position, this.rockPos) > mp.vdist(frontPos, this.rockPos);
    },
    setInside(data) {
        if (!data) return mp.callCEFV(`selectMenu.show = false`);

        mp.callCEFV(`selectMenu.menus['mason'].init(${JSON.stringify(data)})`);
        mp.callCEFV(`selectMenu.showByName('mason')`);
    },
    setRockInside(pos, health) {
        if (pos) {
            if (this.isPickInHands()) mp.prompt.showByName('mason_start_pick');
            else mp.prompt.showByName('mason_take_pick');

            this.rockPos = pos;
            this.rockHealth = health;
        } else {
            mp.prompt.hide();

            this.rockPos = null;
            this.rockHealth = 0;
        }
    },
    createJobPed() {
        var pedInfo = {
            model: "s_m_y_construct_02",
            position: {
                x: 2568.329833984375,
                y: 2719.28857421875,
                z: 42.92911148071289
            },
            heading: 246.8917236328125,
        };
        mp.events.call('NPC.create', pedInfo);
    },
    hitRockHandler() {
        if (!this.rockPos || this.rockTimer != null) return;
        if (!this.isPickInHands()) return;
        if (this.rockHealth <= 0) return mp.notify.error(`Каменная порода исчерпала свой ресурс`, `Каменщик`);

        // TODO: set correct heading
        mp.busy.add("jobProcess", false);
        mp.events.callRemote(`animations.playById`, 5523);
        this.rockTimer = mp.timer.add(() => {
            this.stopRockTimer();
            if (!this.rockPos || this.rockHealth <= 0) return;

            mp.events.callRemote(`mason.rocks.hit`);
        }, 2000);
    },
    stopRockTimer() {
        mp.timer.remove(this.rockTimer);
        this.rockTimer = null;
        mp.busy.remove("jobProcess");
        mp.events.callRemote(`animations.stop`);
    },
    getItemSlots() {
        var slots = [];
        var localPos = mp.players.local.position;
        for (var i = 0; i < 3; i++) {
            var x = mp.utils.randomFloat(-2, 2);
            var y = mp.utils.randomFloat(-1, 0);
            var pos = mp.players.local.getOffsetFromInWorldCoords(x, y, 0);
            pos.z = mp.game.gameplay.getGroundZFor3dCoord(pos.x, pos.y, localPos.z + 2, false, false);
            pos.rZ = mp.utils.randomInteger(0, 360);
            slots.push(pos);
        }
        return slots;
    },
};

mp.events.add({
    "characterInit.done": () => {
        mp.mason.createJobPed();
    },
    "render": () => {
        var start = Date.now();
        var player = mp.players.local;
        if (!mp.mason.isPickInHands(player)) return;
        if (mp.mason.rockPos) {
            var startPos = player.getOffsetFromInWorldCoords(0, 0, 0);
            var endPos = player.getOffsetFromInWorldCoords(0, 1, 0);
            // mp.game.graphics.drawLine(startPos.x, startPos.y, startPos.z, endPos.x, endPos.y, endPos.z, 255, 255, 255, 100);

            startPos = player.getOffsetFromInWorldCoords(0, 0, 0);
            endPos = player.getOffsetFromInWorldCoords(-0.3, 1, 0);
            // mp.game.graphics.drawLine(startPos.x, startPos.y, startPos.z, endPos.x, endPos.y, endPos.z, 255, 255, 255, 100);

            startPos = player.getOffsetFromInWorldCoords(0, 0, 0);
            endPos = player.getOffsetFromInWorldCoords(0.3, 1, 0);
            // mp.game.graphics.drawLine(startPos.x, startPos.y, startPos.z, endPos.x, endPos.y, endPos.z, 255, 255, 255, 100);

            if (mp.mason.isFocusRock()) {
                var barPos = mp.mason.rockPos;
                barPos.z = mp.game.gameplay.getGroundZFor3dCoord(barPos.x, barPos.y, barPos.z + 2, false, false);
                var pos2d = mp.game.graphics.world3dToScreen2d(barPos);
                if (pos2d) mp.mason.drawRockHealthBar(pos2d.x, pos2d.y);
            }
        } else {
            mp.game.controls.disableControlAction(0, 24, true); /// удары
            mp.game.controls.disableControlAction(0, 25, true); /// INPUT_AIM
            mp.game.controls.disableControlAction(0, 140, true); /// удары R
            mp.game.controls.disableControlAction(0, 257, true); // INPUT_ATTACK2
        }

        if (mp.mason.lastStartMelee && Date.now() > mp.mason.lastStartMelee + mp.mason.hitWaitTime) {
            mp.mason.lastStartMelee = 0;

            if (mp.mason.isPickInHands() && mp.mason.rockPos && mp.mason.isFocusRock()) {
                mp.events.callRemote(`mason.rocks.hit`);
            }
        }

        if (mp.renderChecker) mp.utils.drawText2d(`mason rend: ${Date.now() - start} ms`, [0.8, 0.69]);
    },
    "mason.items.request": () => {
        var slots = mp.mason.getItemSlots();
        mp.events.callRemote(`mason.items.add`, JSON.stringify(slots));
    },
    "mason.storage.inside": (data) => {
        mp.mason.setInside(data);
    },
    "mason.rock.inside": (pos, health) => {
        mp.mason.setRockInside(pos, health);
    },
    "mason.rock.health": (health) => {
        mp.mason.rockHealth = health;
    },
    "playerWeaponChanged": (weapon) => {
        if (mp.mason.rockPos) {
            if (mp.mason.isPickInHands()) mp.prompt.showByName('mason_start_pick');
            else mp.prompt.showByName('mason_take_pick');
        }
    },
    "playerStartMeleeCombat": () => {
        if (!mp.mason.isPickInHands()) return;
        if (!mp.mason.rockPos) return;
        if (!mp.mason.isFocusRock()) return;
        if (mp.mason.rockHealth <= 0) return mp.notify.error(`Каменная порода исчерпала свой ресурс`);

        mp.mason.lastStartMelee = Date.now();
    },
    "click": (x, y, upOrDown, leftOrRight, relativeX, relativeY, worldPosition, hitEntity) => {
        if (upOrDown != 'down' || leftOrRight != 'left') return;

        if (mp.game.ui.isPauseMenuActive()) return;
        if (mp.busy.includes()) return;
        mp.mason.hitRockHandler();
    },
});
