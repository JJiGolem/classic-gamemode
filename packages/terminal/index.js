"use strict";

module.exports = {
    // Мин. уровень админки для доступа к кносоли (character.admin)
    access: 6,

    log(text, player) {
        this.push('log', player);
    },
    info(text, player) {
        this.push('info', player);
    },
    warning(text, player) {
        this.push('warning', player);
    },
    error(text, player) {
        this.push('error', player);
    },
    push(type, text, player) {
        if (player) return player.call(`terminal.push`, ['log', text]);

        mp.players.forEach((rec) => {
            if (rec.character.admin >= this.access) rec.call(`console.push`, ['log', text]);
        });
    }
};
