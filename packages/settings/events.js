module.exports = {
    "settings.spawn.set": (player, spawn) => {
        player.character.settings.spawn = spawn;
        player.character.settings.save();
    },
}
