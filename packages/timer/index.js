"use strict";
/// Глобальный таймер

const duration = 1000;
let timers = new Array();
let gId = 0;

let checker = null;

let error = false;

/// Функции глобального таймера
module.exports = {
    setChecker(player) {
        checker = player;
        if (checker != null) checker.call('timer.check.start', [duration]);
    },
    getChecker() {
        return checker;
    },
    throwError() {
        error = true;
    },
    init() {
        setInterval(async function() {
            if (error) throw new Error("ТЕСТОВАЯ ОШИБКА");
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
                }
                catch (error) {
                    timers.splice(i, 1);
                    i--;
                    console.log(error);
                }
            }
            if (checker != null) checker.call('timer.check.work', []);
        }, duration);
    },
    /// Добавление нового таймера
    /// handler желательно async
    /// return timer
    add(handler, time, isInterval = false) {
        let id = gId++;
        timers.push({
            id: id,
            handler: handler,
            time: Date.now() + time,
            interval: isInterval ? time : null
        });
        return {
            id: id
        };
    },
    /// Удаление существующего таймера, до его срабатывания
    remove(timer) {
        if (timer == null) return;
        if (timer.id == null) return;
        let index = timers.findIndex(x => x.id == timer.id);
        index != -1 && timers.splice(index, 1);
    },
    addInterval(handler, time) {
        return this.add(handler, time, true);
    },
}
/// obj.destroy()
///
