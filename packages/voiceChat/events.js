"use strict";
let voice = require("./index.js");

module.exports = {
    "voiceChat.add": (player, target) => {
        if(target) {
            player.enableVoiceTo(target);
        }
    },
    "voiceChat.remove": (player, target) => {
        if(target) {
            player.disableVoiceTo(target);
        }
    }
};