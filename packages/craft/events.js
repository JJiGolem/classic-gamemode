let craft = call('craft');

module.exports = {
    "init": () => {
        craft.init();
        inited(__dirname);
    },
};
