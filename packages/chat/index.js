"use strict";
/// Модуль чата, с историей сообщений, тегами и процессами

module.exports = {
    push(player, text) {
        player.call('chat.message.push', [`${text}`]);
    },
    broadcast(text) {
        mp.players.forEach(rec => {
            if (!rec.character) return;
            this.push(rec, text);
        });
    },
};
