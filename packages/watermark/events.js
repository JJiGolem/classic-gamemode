module.exports = {
    "characterInit.done": (player) => {
        player.call("watermark.init", [player.account.id]);
    },
}
