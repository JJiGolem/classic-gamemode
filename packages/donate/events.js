let donate = call('donate');

module.exports = {
    "donate.convert": (player, sum) => {
        donate.convert(player, sum);
    },
    "donate.nickname.set": (player, name) => {
        donate.setNickname(player, name);
    },
    "donate.warns.clear": (player) => {
        donate.clearWarn(player);
    },
}
