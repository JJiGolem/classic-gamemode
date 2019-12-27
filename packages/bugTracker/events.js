"use strict";

let bugTracker = call('bugTracker');

module.exports = {
    "init": () => {
        bugTracker.init();
        inited(__dirname);
    },
}
