let craft = call('craft');

module.exports = {
    "init": () => {
        craft.init();
        inited(__dirname);
    },
    "characterInit.done": (player) => {
        player.call(`craft.setSkill`, [player.character.craft]);
    },
    "craft.item.craft": (player, data) => {
        if (typeof data == 'string') data = JSON.parse(data);
        craft.craftItem(player, data.typeI, data.itemI);
    },
    "craft.queue.take": (player, index) => {
        craft.takeItem(player, index);
    },
};
