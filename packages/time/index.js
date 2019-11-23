"use strict";
var factions = require('../factions');
var farms = call('farms');
var jobs = require('../jobs');
var notifs = require('../notifications');
var timer = call('timer');

let CUSTOM_TIME;
let ticks = 0;

module.exports = {
    init() {
        this.initPayDayTimer();
        this.updateWorldTime(new Date());
    },
    initPayDayTimer() {
        var lastPayDayHour = new Date().getHours();
        timer.addInterval(() => {
            try {
                ticks++;
                mp.events.call(`time.main.tick`, ticks);
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
        this.factionPay();
        this.jobsPay();
        this.farmsTax();
        this.allBroadcast();
        // TODO: Налоги на дома
        // TODO: Налоги на бизы
    },
    allBroadcast() {
        mp.players.forEach((rec) => {
            if (!rec.character) return;
            if (rec.getVariable("afk")) return notifs.error(rec, `PayDay не засчитан`, `ANTI-AFK`);
            var minutes = parseInt((Date.now() - rec.authTime) / 1000 / 60);
            rec.authTime = Date.now();
            notifs.info(rec, `Вы отыграли ${minutes} минут`, `PayDay`)
            rec.character.minutes += minutes;
            rec.character.law++;
            rec.character.save();

            mp.events.call("player.law.changed", rec);
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
            if (rec.getVariable("afk")) return;
            if (rec.character.factionId) factions.pay(rec);
        });
    },
    jobsPay() {
        mp.players.forEach((rec) => {
            if (!rec.character) return;
            if (rec.getVariable("afk")) return;
            if (rec.character.pay) jobs.pay(rec);
        });
    },
    farmsTax() {
        farms.farms.forEach(farm => {
            if (!farm.playerId) return;
            farm.taxBalance -= farms.tax;
            var owner = mp.players.getBySqlId(farm.playerId) || farm.playerId;
            if (farm.taxBalance <= 0) {
                farm.playerId = null;
                farm.owner = null;
                farm.balance = 0;

                notifs.warning(owner, `Ферма #${farm.id} продана в штат за неуплату налогов`);
            } else if (farm.taxBalance < farms.tax * 24) {
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
