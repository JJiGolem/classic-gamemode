"use strict";
var factions = require('../factions');
var farms = call('farms');
var jobs = require('../jobs');
var notifs = require('../notifications');

let CUSTOM_TIME;

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
        this.farmsTax();
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
        if (!CUSTOM_TIME) {
            mp.world.time.hour = date.getHours();
            mp.world.time.minute = date.getMinutes();
        }
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
    farmsTax() {
        farms.farms.forEach(farm => {
            if (!farm.playerId) return;
            farm.taxBalance -= farms.tax;
            if (farm.taxBalance <= 0) {
                farm.playerId = null;
                farm.owner = null;
                farm.balance = 0;
            } else if (farm.taxBalance < farms.tax * 24) {
                var owner = mp.players.getBySqlId(farm.playerId);
                if (owner) notifs.warning(owner, `Ферма #${farm.id} будет продана в штат менее, чем через сутки. Пополните баланс.`, `Налог на ферму`);
            }
            farm.save();
        });
    },
    setCustomTime(hours) {
        mp.world.time.hour = hours;
        CUSTOM_TIME = hours;
    },
    resetCustomTime() {
        CUSTOM_TIME = null;
        let date = new Date();
        this.updateWorldTime(date);
    }
};
