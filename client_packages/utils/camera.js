"use strict";
let cam = mp.cameras.new("utils.cam", new mp.Vector3(0, 0, 0), new mp.Vector3(0, 0, 0), 60);
cam.pointAtCoord(new mp.Vector3(0, 0, 0));
cam.setActive(false);
let isCreated = false;

exports = {
    /// Создание камеры
    /// fov can be null
    create(x, y, z, toX, toY, toZ, fov) {
        isCreated = true;
        cam.setCoord(x, y, z);
        cam.pointAtCoord(toX, toY, toZ);
        if (fov) cam.setFov(fov);
        cam.setActive(true);
        mp.game.cam.renderScriptCams(true, false, 0, true, false);
    },
    /// Удаление камеры
    destroy() {
        isCreated = false;
        cam.setActive(false);
        mp.game.cam.renderScriptCams(false, false, 0, true, false);
    },
    /// Перемещение камеры
    /// fov can be null
    moveTo(x, y, z, toX, toY, toZ, time, fov) {
        if (!isCreated) return;
        
        let camHelper = mp.cameras.new("utils.cam", new mp.Vector3(x, y, z), new mp.Vector3(0, 0, 0), fov ? fov : 60);
        camHelper.pointAtCoord(toX, toY, toZ);
        camHelper.setActiveWithInterp(cam.handle, time, 0, 0);
        setTimeout(function(camT) {
            camT.destroy(true);
        }, time + 100, cam);
        cam = camHelper;
    }
}