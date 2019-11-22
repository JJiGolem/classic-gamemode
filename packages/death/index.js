"use strict";

module.exports = {
    // Кол-во ХП у лежачего игрока
    health: 50,
    // Список ID персонажей присмерти, которые вышли с сервера
    knockedList: [],

    addKnocked(player, time = 5 * 60 * 1000) {
        if (mp.players.exists(player)) player.setVariable("knocked", time);
        if (this.knockedList.includes(player.character.id)) return;
        this.knockedList.push(player.character.id);
    },
    removeKnocked(player) {
        if (mp.players.exists(player)) player.setVariable("knocked", null);
        var i = this.knockedList.indexOf(player.character.id);
        if (i != -1) this.knockedList.splice(i, 1);
    }
};
