"use strict";

module.exports = {
    // Лайки на обновлениях (changelist_id: [accountId, ..., ...])
    likes: {},

    async init() {
        var dbLikes = await db.Models.ChangelistLike.findAll();

        for (var i = 0; i < dbLikes.length; i++) {
            var like = dbLikes[i];
            if (!this.likes[like.changelistId]) this.likes[like.changelistId] = [];

            this.likes[like.changelistId].push(like.likeAccountId);
        }

        console.log(`[CHANGELIST] Лайки загружены (${i} шт.)`);
    },
    haveLike(player, changelistId) {
        if (!this.likes[changelistId]) return false;
        return this.likes[changelistId].includes(player.account.id);
    },
    like(player, changelistId) {
        if (this.haveLike(player, changelistId)) return;

        if (!this.likes[changelistId]) this.likes[changelistId] = [];
        this.likes[changelistId].push(player.account.id);
        db.Models.ChangelistLike.create({
            changelistId: changelistId,
            likeAccountId: player.account.id
        });

        mp.players.forEach(rec => {
            if (!rec.character) return;
            rec.call(`changelist.setLikes`, [changelistId, this.likes[changelistId].length]);
        });
    },
    sendLikes(player) {
        var data = {};
        for (var id in this.likes) data[id] = {
            likes: this.likes[id].length,
            liked: this.haveLike(player, id),
        };

        player.call(`changelist.initLikes`, [data]);
    },
};
