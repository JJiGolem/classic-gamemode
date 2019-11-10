"use strict";

/*
    Модуль лесоруба.

    created 25.10.19 by Carter Slade
*/

mp.woodman = {
    treeHealthBar: {
        width: 0.1,
        height: 0.015,
        border: 0.0005,
        textColor: [255, 255, 255, 255],
        textScale: [0.2, 0.2],
    },
    logHealthBar: {
        width: 0.05,
        height: 0.012,
        border: 0.0004,
        textColor: [255, 255, 255, 255],
        textScale: [0.17, 0.17],
    },
    treesInfo: null,
    treesHash: [],
    currentTreeHash: null,
    treeHealth: 0,
    treePos: null,
    logSquats: [],
    logObj: null,
    logFocusSlotI: -1,
    lastStartMelee: 0,
    hitWaitTime: 500,
    // Высота и ширина бревна
    logSize: {
        height: 0.3,
        width: 4.4,
    },
    logTimer: null,


    drawTreeHealthBar(x, y) {
        var info = this.treeHealthBar;
        var color = this.getProgressColor();
        var border = info.border;
        var fillColor = this.getFillColor(this.treeHealth);
        var textColor = info.textColor
        var textScale = info.textScale
        mp.game.graphics.drawRect(x, y, info.width + border * 2, info.height + border * 5, color[0], color[1], color[2], color[3]);
        mp.game.graphics.drawRect(x - (100 - this.treeHealth) * 0.0005, y,
            info.width * this.treeHealth / 100, info.height,
            fillColor[0], fillColor[1], fillColor[2], fillColor[3]);
        mp.game.graphics.drawText(`${this.treeHealth}%`, [x, y - 0.04 * textScale[0]], {
            font: 0,
            color: textColor,
            scale: textScale,
            outline: false
        });
    },
    drawLogHealthBar(x, y) {
        var info = this.logHealthBar;
        var health = this.logSquats[this.logFocusSlotI];
        var color = this.getProgressColor();
        var border = info.border;
        var fillColor = this.getFillColor(health);
        var textColor = info.textColor;
        var textScale = info.textScale;
        mp.game.graphics.drawRect(x, y, info.width + border * 2, info.height + border * 5, color[0], color[1], color[2], color[3]);
        mp.game.graphics.drawRect(x - (100 - health) * 0.00025, y,
            info.width * health / 100, info.height,
            fillColor[0], fillColor[1], fillColor[2], fillColor[3]);
        mp.game.graphics.drawText(`${health}%`, [x, y - 0.045 * textScale[0]], {
            font: 0,
            color: textColor,
            scale: textScale,
            outline: false
        });
    },
    getProgressColor() {
        var player = mp.players.local;
        return (player.isInMeleeCombat()) ? [255, 0, 0, 200] : [0, 0, 0, 200];
    },
    getFillColor(health) {
        if (health > 50) return [52, 222, 59, 200];
        if (health > 15) return [255, 187, 0, 200];

        return [187, 68, 68, 200];
    },
    setTreesInfo(info) {
        this.treesInfo = info;
        this.treesHash = info.map(x => x.hash);
    },
    setCurrentTree(hash) {
        if (hash && !this.isTreeHash(hash)) return; // фокус не на дереве
        if (this.currentTreeHash) { // в пред. кадре был фокус на дереве.
            if (hash) return; // в тек. кадре есть фокус на дереве

            this.currentTreeHash = hash;
            // mp.events.call("playerExitTree");
        } else { // в пред. кадре не было фокуса на дереве
            if (!hash) return; // в тек. кадре нет фокуса на дереве

            this.currentTreeHash = hash;
            // mp.events.call("playerEnterTree");
        }
    },
    isTreeHash(hash) {
        return hash && this.treesHash.includes(hash);
    },
    isAxInHands(player) {
        if (!player) player = mp.players.local;
        return player.weapon == mp.game.joaat('weapon_hatchet');
    },
    isFocusTree() {
        if (!this.treePos) return false;
        var player = mp.players.local;
        var raycastToTree = mp.raycasting.testPointToPoint(player.position, this.treePos);
        if (!raycastToTree || !raycastToTree.entity) return false;
        // var frontHash = mp.utils.getFrontObjectHash(player);
        // if (!frontHash || frontHash != raycastToTree.entity) return false;
        var frontPos = player.getOffsetFromInWorldCoords(0, 1, 0);

        return mp.vdist(player.position, this.treePos) > mp.vdist(frontPos, this.treePos);
    },
    setInside(data) {
        if (!data) return mp.callCEFV(`selectMenu.show = false`);

        mp.callCEFV(`selectMenu.menus['woodman'].init('${JSON.stringify(data)}')`);
        mp.callCEFV(`selectMenu.showByName('woodman')`);
    },
    setTreeInside(pos, health) {
        if (pos) {
            if (this.isAxInHands()) mp.prompt.showByName('woodman_start_ax');
            else mp.prompt.showByName('woodman_take_ax');

            this.treePos = pos;
            this.treeHealth = health;
        } else {
            mp.prompt.hide();

            this.treePos = null;
            this.treeHealth = 0;
        }
    },
    getFreeTreeSlot() {
        var player = mp.players.local;
        var leftPos = player.getOffsetFromInWorldCoords(2, -this.logSize.width / 2, 0);
        var rightPos = player.getOffsetFromInWorldCoords(2, this.logSize.width / 2, 0);

        var leftGroundZ = mp.game.gameplay.getGroundZFor3dCoord(leftPos.x, leftPos.y, leftPos.z, false, false);
        var rightGroundZ = mp.game.gameplay.getGroundZFor3dCoord(rightPos.x, rightPos.y, rightPos.z, false, false);

        var leftDist = mp.vdist(leftPos, new mp.Vector3(leftPos.x, leftPos.y, leftGroundZ));
        var rightDist = mp.vdist(rightPos, new mp.Vector3(rightPos.x, rightPos.y, rightGroundZ));

        var alpha = -Math.sin((leftDist - rightDist) / this.logSize.width) * 180 / Math.PI;


        var objPos = player.getOffsetFromInWorldCoords(2, 0, 0);
        objPos.z = mp.game.gameplay.getGroundZFor3dCoord(objPos.x, objPos.y, objPos.z, false, false) + this.logSize.height / 2;

        return {
            pos: objPos,
            rot: new mp.Vector3(0, alpha, player.getHeading() + 90),
        };
    },
    setLogInside(squats, objId) {
        if (squats) {
            if (this.isAxInHands()) mp.prompt.showByName('woodman_log_start_ax');
            else mp.prompt.showByName('woodman_log_take_ax');

            this.logSquats = squats;
            this.logObj = mp.objects.atRemoteId(objId);
        } else {
            mp.prompt.hide();

            this.logSquats = [];
            this.logObj = null;
        }
    },
    getLogSlots(obj) {
        var slots = [
            obj.getOffsetFromInWorldCoords(-2, 0, 0),
            obj.getOffsetFromInWorldCoords(-1, 0, 0),
            obj.getOffsetFromInWorldCoords(0, 0, 0),
            obj.getOffsetFromInWorldCoords(1, 0, 0),
            obj.getOffsetFromInWorldCoords(2, 0, 0),
        ];
        return slots;
    },
    hitLogHandler() {
        if (this.logFocusSlotI == -1 || !this.logObj || !mp.objects.exists(this.logObj) || this.logTimer != null) return;
        if (!this.isAxInHands()) return;
        if (!this.logSquats[this.logFocusSlotI]) return mp.notify.error(`Перейдите к другой части бревна`, `Лесоруб`);

        // TODO: set correct heading
        mp.events.callRemote(`animations.playById`, 5523);
        this.logTimer = mp.timer.add(() => {
            this.stopLogTimer();
            if (!mp.objects.exists(this.logObj) || !this.logObj || this.logFocusSlotI == -1 || !this.logSquats[this.logFocusSlotI]) {
                return;
            }
            mp.events.callRemote(`woodman.logs.hit`, this.logFocusSlotI);
        }, 2000);
    },
    stopLogTimer() {
        mp.timer.remove(this.logTimer);
        this.logTimer = null;
        mp.events.callRemote(`animations.stop`);
    },
    createJobPed() {
        var pedInfo = {
            model: "mp_m_counterfeit_01",
            position: {
                x: -567.8530883789062,
                y: 5254.45556640625,
                z: 70.46736907958984
            },
            heading: 146.89959716796875,
        };
        mp.events.call('NPC.create', pedInfo);
    },
};

mp.events.add({
    "characterInit.done": () => {
        mp.keys.bind(69, true, () => { // E
            if (mp.game.ui.isPauseMenuActive()) return;
            if (mp.busy.includes()) return;
            mp.woodman.hitLogHandler();
        });
    },
    "render": () => {
        var player = mp.players.local;
        if (!mp.woodman.isAxInHands(player)) return;
        if (mp.woodman.treePos) {
            var startPos = player.getOffsetFromInWorldCoords(0, 0, 0);
            var endPos = player.getOffsetFromInWorldCoords(0, 1, 0);
            // mp.game.graphics.drawLine(startPos.x, startPos.y, startPos.z, endPos.x, endPos.y, endPos.z, 255, 255, 255, 100);

            startPos = player.getOffsetFromInWorldCoords(0, 0, 0);
            endPos = player.getOffsetFromInWorldCoords(-0.3, 1, 0);
            // mp.game.graphics.drawLine(startPos.x, startPos.y, startPos.z, endPos.x, endPos.y, endPos.z, 255, 255, 255, 100);

            startPos = player.getOffsetFromInWorldCoords(0, 0, 0);
            endPos = player.getOffsetFromInWorldCoords(0.3, 1, 0);
            // mp.game.graphics.drawLine(startPos.x, startPos.y, startPos.z, endPos.x, endPos.y, endPos.z, 255, 255, 255, 100);

            if (mp.woodman.treePos) {
                startPos = player.position;
                endPos = mp.woodman.treePos;
                // mp.game.graphics.drawLine(startPos.x, startPos.y, startPos.z, endPos.x, endPos.y, endPos.z, 0, 255, 0, 100);
            }

            if (mp.woodman.isFocusTree()) {
                var pos2d = mp.game.graphics.world3dToScreen2d(mp.woodman.treePos);
                if (pos2d) mp.woodman.drawTreeHealthBar(pos2d.x, pos2d.y);
            }
        }
        if (mp.objects.exists(mp.woodman.logObj) && mp.woodman.logObj) {
            var slots = mp.woodman.getLogSlots(mp.woodman.logObj);
            if (mp.woodman.logTimer == null) {
                var playerPos = player.getOffsetFromInWorldCoords(0, 0, -1);
                var nearSlot = mp.utils.getNearPos(playerPos, slots, mp.x);
                mp.woodman.logFocusSlotI = slots.indexOf(nearSlot);
                var frontPos = player.getOffsetFromInWorldCoords(0, 0.5, -1);
                if (mp.vdist(playerPos, nearSlot) < mp.vdist(frontPos, nearSlot)) mp.woodman.logFocusSlotI = -1;
            }
            if (mp.woodman.logFocusSlotI != -1) {
                var pos2d = mp.game.graphics.world3dToScreen2d(slots[mp.woodman.logFocusSlotI]);
                if (pos2d) mp.woodman.drawLogHealthBar(pos2d.x, pos2d.y);
            }
            var startPos = player.getOffsetFromInWorldCoords(0, 0, 0);
            var endPos = player.getOffsetFromInWorldCoords(0, 0.5, -1);
            // mp.game.graphics.drawLine(startPos.x, startPos.y, startPos.z, endPos.x, endPos.y, endPos.z, 0, 187, 255, 100);
        }
        if (mp.woodman.lastStartMelee && Date.now() > mp.woodman.lastStartMelee + mp.woodman.hitWaitTime) {
            mp.woodman.lastStartMelee = 0;

            if (mp.woodman.isAxInHands() && mp.woodman.treePos && mp.woodman.isFocusTree()) {
                mp.events.callRemote(`woodman.trees.hit`);
            }
        }

        // if (mp.woodman.logObj) mp.utils.drawText2d(`dist: ${mp.vdist(endPos, mp.woodman.getLogSlots(mp.woodman.logObj)[mp.woodman.logFocusSlotI])}`, [0.8, 0.5]);
        // mp.utils.drawText2d(`tree: ${mp.woodman.currentTreeHash}`, [0.8, 0.5]);
        // mp.utils.drawText2d(`hashes: ${mp.woodman.treesHash}`, [0.8, 0.55]);
        //
        // var raycast = mp.utils.frontRaycast(player);
        // if (!raycast) return mp.woodman.setCurrentTree(null);
        // if (raycast) mp.utils.drawText2d(`raycast: ${JSON.stringify(raycast)}`, [0.5, 0.7]);
        // var hash = mp.game.invoke('0x9F47B058362C84B5', raycast.entity);
        // mp.woodman.setCurrentTree(hash);
        // if (!mp.woodman.currentTreeHash) return;
        //
        // var pos2d = mp.game.graphics.world3dToScreen2d(raycast.position);
        // if (!pos2d) return;
        // mp.woodman.drawHealthBar(pos2d.x, pos2d.y);
        // if (hash) mp.utils.drawText2d(`hash: ${hash}`, [0.8, 0.6]);
        // if (raycast) mp.utils.drawText2d(`raycast: ${JSON.stringify(Object.keys(raycast))}`, [0.5, 0.8]);
        // if (raycast) mp.utils.drawText2d(`offset: ${JSON.stringify(mp.game.invoke('0x1899F328B0E12848', raycast.entity, 0, 0, 0))}`, [0.5, 0.85]);
    },
    "woodman.setTreesInfo": (info) => {
        mp.woodman.setTreesInfo(info);
    },
    "woodman.storage.inside": (data) => {
        mp.woodman.setInside(data);
    },
    "woodman.tree.inside": (pos, health) => {
        mp.woodman.setTreeInside(pos, health);
    },
    "woodman.tree.health": (health) => {
        mp.woodman.treeHealth = health;
    },
    "woodman.log.request": () => {
        var slot = mp.woodman.getFreeTreeSlot();
        mp.events.callRemote(`woodman.logs.add`, JSON.stringify(slot));
    },
    "woodman.log.inside": (squats, objId) => {
        mp.woodman.setLogInside(squats, objId);
    },
    "woodman.log.health": (objId, slotI, health) => {
        if (mp.woodman.logFocusSlotI == slotI) mp.woodman.stopLogTimer();
        if (!mp.objects.exists(mp.woodman.logObj) || !mp.woodman.logObj || mp.woodman.logObj.remoteId != objId) return;
        mp.woodman.logSquats[slotI] = health;
    },
    "woodman.items.request": () => {
        if (!mp.woodman.logObj) return
        var slots = mp.woodman.getLogSlots(mp.woodman.logObj);
        slots.forEach(slot => slot.z -= mp.woodman.logSize.height / 2);
        mp.events.callRemote(`woodman.items.add`, JSON.stringify(slots));
    },
    "playerWeaponChanged": (weapon) => {
        if (mp.woodman.treePos) {
            if (mp.woodman.isAxInHands()) mp.prompt.showByName('woodman_start_ax');
            else mp.prompt.showByName('woodman_take_ax');
        } else if (mp.woodman.logObj) {
            if (mp.woodman.isAxInHands()) mp.prompt.showByName('woodman_log_start_ax');
            else mp.prompt.showByName('woodman_log_take_ax');
        }
    },
    "playerStartMeleeCombat": () => {
        if (!mp.woodman.isAxInHands()) return;
        if (!mp.woodman.treePos) return;
        if (!mp.woodman.isFocusTree()) return;
        if (mp.woodman.treeHealth <= 0) return mp.notify.error(`Дерево исчерпало свой ресурс`);

        mp.woodman.lastStartMelee = Date.now();
    },
});

mp.woodman.createJobPed();
