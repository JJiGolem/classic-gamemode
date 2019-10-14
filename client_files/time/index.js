"use strict";

/*
    Модуль таймера.

    created 20.08.19 by Carter Slade
*/

mp.time = {
    startMainTimer() {
        setInterval(() => {
            mp.events.call("time.main.tick");
        }, 1000);
    }
};

mp.events.add("characterInit.done", () => {
    mp.time.startMainTimer();
});
