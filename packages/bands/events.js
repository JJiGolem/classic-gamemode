let bands = call('bands');
let factions = call('factions');

module.exports = {
    "init": () => {
        bands.init();
    },
    "characterInit.done": (player) => {
        player.call(`bands.bandZones.init`, [bands.convertToClientBandZones()]);
    },
    "bands.capture.start": (player) => {
        bands.startCapture(player);
    },
    "playerDeath": (player, reason, killer) => {
        // killer = player; // for tests
        debug(`playerDeath | reason ${reason} killer: ${killer} `)
        if (!killer || !killer.character) return;
        if (!player.character) return;
        if (!player.character.factionId) return;
        if (!factions.isBandFaction(player.character.factionId)) return;
        if (!bands.inWar(player.character.factionId)) return;
        if (!killer.character.factionId) return;
        if (!factions.isBandFaction(killer.character.factionId)) return;
        if (killer.character.factionId == player.character.factionId) return;
        if (!bands.inWar(killer.character.factionId)) return;

        var zone = bands.getZoneByPos(player.position);
        if (!zone) return;
        if (!bands.wars[zone.id]) return;

        var killerZone = bands.getZoneByPos(killer.position);
        if (!killerZone) return;
        if (zone.id != killerZone.id) return;

        var war = bands.wars[zone.id];

        bands.giveScore(killer, zone);
    },
};
