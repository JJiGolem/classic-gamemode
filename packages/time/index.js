"use strict";
var factions = require('../factions');
var jobs = require('../jobs');
var notifs = require('../notifications');

module.exports = {
    init() {
        this.initPayDayTimer();
        this.updateWorldTime(new Date());
    },
    initPayDayTimer() {
        var lastPayDayHour = new Date().getHours();
        setInterval(() => {
            try {
                var date = new Date();
                this.updateWorldTime(date);
                if (date.getMinutes() >= 0 && date.getMinutes() <= 3 && date.getHours() != lastPayDayHour) {
                    lastPayDayHour = date.getHours();
                    this.payDay();
                }
            } catch (e) {
                console.log(e);
            }
        }, 60000);
    },
    payDay() {
        this.allBroadcast();
        this.factionPay();
        this.jobsPay();
        // TODO: Налоги на дома
        // TODO: Налоги на бизы
    },
    allBroadcast() {
        mp.players.forEach((rec) => {
            if (!rec.character) return;
            var minutes = parseInt((Date.now() - rec.authTime) / 1000 / 60 % 60);
            notifs.info(rec, `Минуты: ${rec.character.minutes} + ${minutes}`, `PayDay`)
            rec.character.minutes += minutes;
            rec.character.save();
        });
    },
    updateWorldTime(date) {
        mp.world.time.hour = date.getHours();
        mp.world.time.minute = date.getMinutes();
    },
    factionPay() {
        mp.players.forEach((rec) => {
            if (!rec.character) return;
            if (rec.character.factionId) factions.pay(rec);
        });
    },
    jobsPay() {
        mp.players.forEach((rec) => {
            if (!rec.character) return;
            if (rec.character.pay) jobs.pay(rec);
        });
    },
};
