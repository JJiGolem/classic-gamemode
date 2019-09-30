"use strict";

module.exports = {
    success(player, text, header) {
        if (typeof player == 'number') return this.save(player, 'success', text, header);
        player.call("notifications.push.success", [text, header]);
    },
    warning(player, text, header) {
        if (typeof player == 'number') return this.save(player, 'warning', text, header);
        player.call("notifications.push.warning", [text, header]);
    },
    error(player, text, header) {
        if (typeof player == 'number') return this.save(player, 'error', text, header);
        player.call("notifications.push.error", [text, header]);
    },
    info(player, text, header) {
        if (typeof player == 'number') return this.save(player, 'info', text, header);
        player.call("notifications.push.info", [text, header]);
    },
    save(characterId, type, text, header = null) {
        db.Models.Notification.create({
            characterId: characterId,
            type: type,
            text: text,
            header: header
        });
    },
    async popSavedNotifs(player) {
        var list = await db.Models.Notification.findAll({
            where: {
                characterId: player.character.id
            }
        });
        list.forEach(el => el.destroy());
        return list;
    },
};
