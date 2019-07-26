"use strict";
let voice = require("./index.js");
/// Сервисные события
module.exports = {
    "voiceChat.add": (player, target) => {
        if(target) {
            console.log("voiceChat.add - p_id: " + player.id + "; t_id: " + target.id);
            player.enableVoiceTo(target);
        }
    },
    "voiceChat.remove": (player, target) => {
        if(target) {
            console.log("voiceChat.remove - p_id: " + player.id + "; t_id: " + target.id);
            player.disableVoiceTo(target);
        }
    }
};