let markers = call('markers');

module.exports = {
    "init": () => {
        markers.init();
        inited(__dirname);
    },
};
