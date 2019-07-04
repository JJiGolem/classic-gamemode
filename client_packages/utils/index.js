"use strict";

mp.utils = {};

mp.utils.getStreetName = (pos) => {
    var getStreet = mp.game.pathfind.getStreetNameAtCoord(pos.x, pos.y, pos.z, 0, 0);
    var streetName = mp.game.ui.getStreetNameFromHashKey(getStreet["streetName"]);
    return streetName;
}

mp.utils.getRegionName = (pos) => {
    return mp.game.ui.getLabelText(mp.game.zone.getNameOfZone(pos.x, pos.y, pos.z));
}

mp.utils.getMinimapAnchor = () => {
    let sfX = 1.0 / 20.0;
    let sfY = 1.0 / 20.0;
    let safeZone = mp.game.graphics.getSafeZoneSize();
    let aspectRatio = mp.game.graphics.getScreenAspectRatio(false);
    let resolution = mp.game.graphics.getScreenActiveResolution(0, 0);
    let scaleX = 1.0 / resolution.x;
    let scaleY = 1.0 / resolution.y;

    let minimap = {
        width: scaleX * (resolution.x / (4 * aspectRatio)),
        height: scaleY * (resolution.y / 5.674),
        scaleX: scaleX,
        scaleY: scaleY,
        leftX: scaleX * (resolution.x * (sfX * (Math.abs(safeZone - 1.0) * 10))),
        bottomY: 1.0 - scaleY * (resolution.y * (sfY * (Math.abs(safeZone - 1.0) * 10))),
    };

    minimap.rightX = minimap.leftX + minimap.width;
    minimap.topY = minimap.bottomY - minimap.height;
    return minimap;
}
