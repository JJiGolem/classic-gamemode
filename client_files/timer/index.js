"use strict";
/// Глобальный таймер

const duration = 100;
let timers = new Array();
let gId = 0;


mp.timer = {
    init() {
        /// With interval
        // setInterval(async function() {
        //     for (let i = 0; i < timers.length; i++) {
        //         try {
        //             if (timers[i].time <= Date.now()) {
        //                 timers[i].handler();
        //                 if (timers[i].interval != null) {
        //                     timers[i].time += timers[i].interval;
        //                 }
        //                 else {
        //                     timers.splice(i, 1);
        //                     i--;
        //                 }
        //             }
        //         } catch (error) {
        //             timers.splice(i, 1);
        //             i--;
        //             console.log(error);
        //         }
        //     }
        // }, duration);

        /// Whith render
        let workTime = Date.now() + duration;
        mp.events.add('render', async () => {
            if (workTime <= Date.now()) {
                for (let i = 0; i < timers.length; i++) {
                    try {
                        if (timers[i].time <= Date.now()) {
                            timers[i].handler();
                            if (timers[i].interval != null) {
                                timers[i].time += timers[i].interval;
                            }
                            else {
                                timers.splice(i, 1);
                                i--;
                            }
                        }
                    } catch (error) {
                        timers.splice(i, 1);
                        i--;
                        mp.console(JSON.stringify(error));
                    }
                }
                workTime = workTime + duration;
            }
        });
    },
    /// Добавление нового таймера
    /// handler желательно async
    /// return timer {id: id};
    add(handler, time, isInterval = false) {
        let id = gId++;
        timers.push({
            id: id,
            handler: handler,
            time: Date.now() + time,
            interval: isInterval ? time : null
        });
        return {id: id};
    },
    /// Удаление существующего таймера, до его срабатывания
    remove(timer) {
        if (timer == null) return;
        if (timer.id == null) return;
        let index = timers.findIndex( x => x.id == timer.id);
        index != -1 && timers.splice(index, 1);
    }
}
mp.timer.init();


/// Check server timer
let timerCheckerServer = null;
let isWork = true;
mp.events.add('timer.check.start', (serverDuration) => {
    if (timerCheckerServer != null) mp.timer.remove(timerCheckerServer);
    timerCheckerServer = mp.timer.add(async () => {
        if (!isWork) {
            mp.events.callRemote("timer.error");
            mp.timer.remove(timerCheckerServer);
        }
        isWork = false;
    }, serverDuration * 2, true);
});
mp.events.add('timer.check.stop', () => {
    mp.timer.remove(timerCheckerServer);
});
mp.events.add('timer.check.work', () => {
    isWork = true;
});
