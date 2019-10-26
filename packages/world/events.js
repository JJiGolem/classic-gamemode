let world = call('world');

module.exports = {
    "init": () => {
        world.init();
        inited(__dirname);
    },
}
