let bands = call('bands');

module.exports = {
    "init": () => {
        bands.init();
    },
    "characterInit.done": (player) => {
        player.call(`bands.bandZones.init`, [bands.convertToClientBandZones()]);
    },
};
