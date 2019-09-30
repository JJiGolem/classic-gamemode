"use strict";

let chat = call('chat');
let notifs = call('notifications');

module.exports = {
    // Цена за 1 символ объявления
    symbolPrice: 5,
    // Коэффициент при начислении ЗП за объявление (adPrice * adPayK)
    adPayK: 0.3,
    // Кол-во боеприпасов, списываемое за выдачу формы
    clothesAmmo: 0,
    // Текущий прямой эфир
    liveStream: {
        ownerId: null, // тот, кто начал эфир
        memberIds: [], // члены эфира
    },
    // Дистанция прослушки эфира
    streamDist: 3,

    stream(player) {
        var header = `Эфир`;
        var out = (text) => {
            notifs.error(player, text, header);
        };
        if (this.liveStream.ownerId != null && this.liveStream.ownerId != player.id) return out(`Эфир занят другим редактором`);

        if (this.liveStream.ownerId == player.id) {
            this.liveStream.ownerId = null;
            this.liveStream.memberIds = [];
            chat.broadcast(`[Weazel News] ${player.name} завершил прямой эфир`);
        } else {
            this.liveStream.ownerId = player.id;
            this.liveStream.memberIds = [player.id];
            chat.broadcast(`[Weazel News] ${player.name} начал прямой эфир`);
        }
    },
    streamHandle(player, text) {
        if (this.liveStream.ownerId == null) return;

        var owner = mp.players.at(this.liveStream.ownerId);
        if (!owner) return this.liveStream.ownerId = null;
        if (!this.liveStream.memberIds.includes(player.id)) return;
        if (player.dist(owner.position) > this.streamDist) return;

        chat.broadcast(`[Weazel News] ${player.name}: ${text}`);
    },
};
