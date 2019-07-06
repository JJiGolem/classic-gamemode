"use strict";
/// Навешиваем уведомления на игрока
module.exports = {
    "playerJoin": (player) => {

        player.notify = {};

        player.notify.success = (text, header) => {
            player.call("notifications.push.success", [text, header]);
        }
        
        player.notify.warning = (text, header) => {
           player.call("notifications.push.warning", [text, header]);
        }
        
        player.notify.error = (text, header) => {
            player.call("notifications.push.error", [text, header]);
        }
        
        player.notify.info = (text, header) => {
            player.call("notifications.push.info", [text, header]);
        }
    }
}