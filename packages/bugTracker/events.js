"use strict";

let bugTracker = call('bugTracker');

module.exports = {
    "init": () => {
        bugTracker.init();
        inited(__dirname);
    },
    "bugTracker.bug.create": (player, data) => {
        if (typeof data == 'string') data = JSON.parse(data);
        bugTracker.createBug(player, data);
    },
}
