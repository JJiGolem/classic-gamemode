"use strict";

module.exports = {
    success(player, text, header) {
        player.call("notifications.push.success", [text, header]);
    },
    warning(player, text, header) {
        player.call("notifications.push.warning", [text, header]);
    },
    error(player, text, header) {
        player.call("notifications.push.error", [text, header]);
    },
    info(player, text, header) {
        player.call("notifications.push.info", [text, header]);
    },
};
