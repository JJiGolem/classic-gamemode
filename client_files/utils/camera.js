"use strict";
let cams = [
    mp.cameras.new("utils.cam.0", new mp.Vector3(0, 0, 0), new mp.Vector3(0, 0, 0), 60),
    mp.cameras.new("utils.cam.1", new mp.Vector3(0, 0, 0), new mp.Vector3(0, 0, 0), 60),
];
let selectedCam = null;

exports = {
    /// Создание камеры
    /// fov can be null
    create(x, y, z, toX, toY, toZ, fov) {
        mp.console("create");
        mp.console(JSON.stringify({x: x, y: y, z: z, toX: toX, toY: toY, toZ: toZ, fov: fov}));

        selectedCam = 0;
        cams[selectedCam].setCoord(x, y, z);
        cams[selectedCam].pointAtCoord(toX, toY, toZ);
        if (fov) cams[selectedCam].setFov(fov);
        cams[selectedCam].setActive(true);
        mp.game.cam.renderScriptCams(true, false, 0, true, false);
    },
    /// Удаление камеры
    destroy() {
        mp.console("destroy");

        selectedCam = null;
        cams[0].setActive(false);
        cams[1].setActive(false);
        mp.game.cam.renderScriptCams(false, false, 0, true, false);
    },
    /// Перемещение камеры
    /// fov can be null
    moveTo(x, y, z, toX, toY, toZ, time, fov) {
        if (selectedCam == null) return;

        mp.console("moveTo");
        mp.console(JSON.stringify({x: x, y: y, z: z, toX: toX, toY: toY, toZ: toZ, time: time, fov: fov}));

        let newSelected = selectedCam == 0 ? 1 : 0;
        cams[newSelected].setCoord(x, y, z);
        cams[newSelected].pointAtCoord(toX, toY, toZ);
        if (fov) cams[newSelected].setFov(fov);
        cams[newSelected].setActiveWithInterp(cams[selectedCam].handle, time, 0, 0);
        selectedCam = newSelected;
    },
    /// Телепорт камеры
    tpTo(x, y, z, toX, toY, toZ, fov) {
        if (selectedCam == null) return;

        mp.console("tpTo");
        mp.console(JSON.stringify({x: x, y: y, z: z, toX: toX, toY: toY, toZ: toZ, fov: fov}));

        cams[selectedCam].setCoord(x, y, z);
        cams[selectedCam].pointAtCoord(toX, toY, toZ);
        if (fov) cams[selectedCam].setFov(fov);
    },
}