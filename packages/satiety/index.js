"use strict";
var notifs = require('../notifications');
let clubs = call('clubs');
let timer = call('timer');

module.exports = {
    intervalTime: 2 * 60 * 1000,
    satietyHealth: 4,
    thirstHealth: 2,
    satietyDec: 1,
    thirstDec: 1,
    healthMin: 5,
    timers: {},
    satietyAlcohol: 0.2,

    startTimer(player) {
        var playerId = player.id;
        var characterId = player.character.id;

        timer.remove(this.timers[playerId]);
        delete this.timers[playerId];
        this.timers[playerId] = timer.addInterval(() => {
            try {
                var rec = mp.players.at(playerId);
                if (!rec || rec.character.id != characterId) {
                    timer.remove(this.timers[playerId]);
                    delete this.timers[playerId];
                    return 0;
                }
                if (rec.godmode) return;
                var character = rec.character;

                if (character.satiety <= 0) {
                    if (rec.health - this.satietyHealth < this.healthMin) return;
                    rec.health -= this.satietyHealth;
                    if (rec.health <= 0) return notifs.warning(rec, `Вы умерли!`, "Голод");
                    if (rec.health < 30) return notifs.warning(rec, `Вы проголодались! Посетите закусочную или купите что-нибудь из еды!`, "Голод");
                }
                if (character.thirst <= 0) {
                    if (rec.health - this.thirstHealth < this.healthMin) return;
                    rec.health -= this.thirstHealth;
                    if (rec.health <= 0) return notifs.warning(rec, `Вы умерли!`, "Жажда");
                    if (rec.health < 30) return notifs.warning(rec, `Вы погибаете! Срочно выпейте напиток!`, "Жажда");
                }

                this.set(rec, character.satiety - this.satietyDec, character.thirst - this.thirstDec);
            } catch (err) {
                console.log(err.stack);
            }
        }, this.intervalTime);
        console.log(`[SATIETY] Таймер для ${player.name} запущен`)
    },
    stopTimer(player) {
        timer.remove(this.timers[player.id]);
        delete this.timers[player.id];
        console.log(`[SATIETY] Таймер для ${player.name} остановлен`);
    },
    set(player, satiety, thirst) {
        var character = player.character;
        if (player.drunkenness && character.satiety < satiety) clubs.deleteDrunkenness(player, (satiety - character.satiety) * this.satietyAlcohol);
        character.satiety = satiety;
        character.thirst = thirst;
        character.save();
        player.call("inventory.setSatiety", [character.satiety])
        player.call("inventory.setThirst", [character.thirst]);

        player.call(`hud.setData`, [{
            satiety: character.satiety,
            thirst: character.thirst
        }]);
    }
};
