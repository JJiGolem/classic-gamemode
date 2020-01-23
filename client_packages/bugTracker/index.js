"use strict";


/*
    Модуль баг-трекера.

    created 27.23.19 by Carter Slade
*/

mp.bugTracker = {

    initBugList(list) {
        mp.callCEFV(`bugTracker.initBugList(${JSON.stringify(list)})`);
    },
    addBug(bug) {
        mp.callCEFV(`bugTracker.addBug(${JSON.stringify(bug)})`);
    },
};

mp.events.add({
    "bugTracker.bugs.init": (list) => {
        mp.bugTracker.initBugList(list);
    },
    "bugTracker.bugs.add": (bug) => {
        mp.bugTracker.addBug(bug);
    },
});
