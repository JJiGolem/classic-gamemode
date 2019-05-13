exports = (menu) => {
    mp.events.add("bandZones.setBand", (zoneIds, bandIds, captures) => {
        // debug(`bandZones.setBand: ${zoneIds} ${bandIds}`)
        menu.execute(`bandZonesAPI.setBand('${JSON.stringify(zoneIds)}', '${JSON.stringify(bandIds)}')`);
        if (captures) {
            for (var id in captures) {
                var capt = captures[id];
                menu.execute(`bandZonesAPI.startCapture(${id}, ${capt.bandId})`);
                if (capt.my) mp.events.call("bandZones.showCaptureProgress", capt.my);
            }
        }
    });

    mp.events.add("bandZones.startCapture", (zoneId, bandId) => {
        menu.execute(`bandZonesAPI.startCapture(${zoneId}, ${bandId})`);
    });

    mp.events.add("bandZones.setPlayerPos", (x, y) => {
        menu.execute(`bandZonesAPI.setPlayerPos(${x}, ${y})`);
    });

    mp.events.add("bandZones.setRect", (x1, x2, y1, y2) => {
        menu.execute(`bandZonesAPI.setRect(${x1}, ${x2}, ${y1}, ${y2})`);
    });

    mp.events.add("bandZones.showCaptureProgress", (data) => {
        menu.execute(`bandZonesAPI.showCaptureProgress('${JSON.stringify(data)}')`);
    });

    mp.events.add("bandZones.setCaptureProgress", (bandId, score, max) => {
        menu.execute(`bandZonesAPI.setCaptureProgress(${bandId}, ${score}, ${max})`);
    });

    mp.events.add("bandZones.show", (enable) => {
        menu.execute(`bandZonesAPI.show(${enable})`);
    });

    mp.events.add("bandZones.enable", (enable) => {
        menu.execute(`bandZonesAPI.enable(${enable})`);
    });

    mp.events.add("bandZones.checkInZone", (player) => {
        var x = player.position.x;
        var y = player.position.y;
        var gangwar = player.getVariable("gangwar");
        menu.execute(`bandZonesAPI.checkInZone(${x}, ${y}, '${gangwar}')`);
    });
}
