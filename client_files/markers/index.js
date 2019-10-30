"use strict";


/*
    Модуль маркеров.

    created 13.10.19 by Carter Slade
*/

mp.moduleMarkers = {
    drawRadius: 30,
};

mp.events.add({
    "time.main.tick": () => {
        mp.markers.forEach(marker => {
            if (marker.ignoreCheckVisible) return;
            var pos = mp.players.local.position;
            marker.visible = !(mp.vdist(pos, marker.position) > mp.moduleMarkers.drawRadius);
        });
    }
});
