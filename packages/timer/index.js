"use strict";
/// Глобальный таймер

const duration = 60000;
let timers = new Array();
let gId = 0;

/// Функции глобального таймера
module.exports = {
    init() {
        setInterval(async function() {
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
                    console.log(error);
                }
            }
        }, duration);
    },
    /// Добавление нового таймера
    /// return timer
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
/// obj.destroy()
/// 