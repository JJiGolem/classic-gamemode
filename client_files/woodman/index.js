"use strict";

/*
    Модуль лесоруба.

    created 25.10.19 by Carter Slade
*/

mp.woodman = {
    healthBar: {
        width: 0.1,
        height: 0.015,
        color: [0, 0, 0, 200],
        border: 0.0005,
        textColor: [255, 255, 255, 255],
        textScale: [0.2, 0.2],
    },
    treesInfo: null,
    treesHash: [],
    currentTreeHash: null,
    treeHealth: 0,
    treePos: null,


    drawHealthBar(x, y) {
        var info = this.healthBar;
        var color = info.color;
        var border = info.border;
        var fillColor = this.getFillColor();
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
    getFillColor() {
        if (this.treeHealth > 50) return [52, 222, 59, 200];
        if (this.treeHealth > 15) return [255, 187, 0, 200];

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
        return player.weapon == mp.game.joaat('weapon_battleaxe');
    },
    setInside(prices) {
        if (!prices) return mp.callCEFV(`selectMenu.show = false`);

        mp.callCEFV(`selectMenu.menus['woodman'].init('${JSON.stringify(prices)}')`);
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
};

mp.events.add({
    "render": () => {
        var player = mp.players.local;
        if (!mp.woodman.isAxInHands(player)) return;
        if (mp.woodman.treePos) {
            var pos2d = mp.game.graphics.world3dToScreen2d(mp.woodman.treePos);
            if (pos2d) mp.woodman.drawHealthBar(pos2d.x, pos2d.y);

            var startPos = player.getOffsetFromInWorldCoords(0, 0, 0);
            var endPos = player.getOffsetFromInWorldCoords(0, 1, 0);
            mp.game.graphics.drawLine(startPos.x, startPos.y, startPos.z, endPos.x, endPos.y, endPos.z, 255, 255, 255, 100);

            startPos = player.getOffsetFromInWorldCoords(0, 0, 0);
            endPos = player.getOffsetFromInWorldCoords(-0.3, 1, 0);
            mp.game.graphics.drawLine(startPos.x, startPos.y, startPos.z, endPos.x, endPos.y, endPos.z, 255, 255, 255, 100);

            startPos = player.getOffsetFromInWorldCoords(0, 0, 0);
            endPos = player.getOffsetFromInWorldCoords(0.3, 1, 0);
            mp.game.graphics.drawLine(startPos.x, startPos.y, startPos.z, endPos.x, endPos.y, endPos.z, 255, 255, 255, 100);

            if (mp.woodman.treePos) {
                startPos = player.position;
                endPos = mp.woodman.treePos;
                mp.game.graphics.drawLine(startPos.x, startPos.y, startPos.z, endPos.x, endPos.y, endPos.z, 0, 255, 0, 100);
            }
        }

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
    "woodman.storage.inside": (prices) => {
        mp.woodman.setInside(prices);
    },
    "woodman.tree.inside": (pos, health) => {
        mp.woodman.setTreeInside(pos, health);
    },
    "playerWeaponChanged": (weapon) => {
        if (!mp.woodman.treePos) return;
        if (mp.woodman.isAxInHands()) mp.prompt.showByName('woodman_start_ax');
        else mp.prompt.showByName('woodman_take_ax');
    },
});
