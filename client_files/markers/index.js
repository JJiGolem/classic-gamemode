"use strict";


/*
    Модуль маркеров.

    created 13.10.19 by Carter Slade
*/

mp.customMarkers = {
    drawRadius: 30,
};

mp.events.add({
    "time.main.tick": () => {
        mp.markers.forEach(marker => {
            var pos = mp.players.local.position;
            marker.visible = !(mp.vdist(pos, marker.position) > mp.customMarkers.drawRadius);
        });
    }
});
