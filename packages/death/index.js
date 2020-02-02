"use strict";

module.exports = {
    health: 50,
    knockedList: [],

    addKnocked(player, time = 5 * 60 * 1000) {
        if (mp.players.exists(player)) player.setVariable("knocked", time);
        if (this.knockedList.includes(player.character.id)) return;
        this.knockedList.push(player.character.id);
    },
    removeKnocked(player) {
        if (mp.players.exists(player)) {
            player.setVariable("knocked", null);
            mp.events.call(`mapCase.ems.calls.remove`, player, player.character.id);
        }
        var i = this.knockedList.indexOf(player.character.id);
        if (i != -1) this.knockedList.splice(i, 1);
    }
};
