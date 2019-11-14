let clubs = call('clubs');

module.exports = {
    "init": () => {
        clubs.init();
        inited(__dirname);
    },
};
