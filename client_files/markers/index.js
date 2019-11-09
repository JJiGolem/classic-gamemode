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
    },
    "markers.tp.player.teleported": (playerId, pos, heading) => {
        if ((mp.police.followPlayer && mp.police.followPlayer.remoteId == playerId) ||
            (mp.mafia.followPlayer && mp.mafia.followPlayer.remoteId == playerId)) {
            mp.players.local.setCoordsNoOffset(pos.x, pos.y, pos.z, false, false, false);
            mp.players.local.setHeading(heading);
        }
    },
});
