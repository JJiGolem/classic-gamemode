"use strict";

let peaceZones = call('peaceZones');

module.exports = {
    "init": () => {
        peaceZones.init();
        inited(__dirname);
    },
}
