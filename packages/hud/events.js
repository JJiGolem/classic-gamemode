var hud = require('./index.js');

module.exports = {
    /// Отображение онлайна в худе
    "player.joined": (player) => {
        mp.players.forEach((current) => {
            current.call("hud.setData", [{players: mp.players.length}]);
        });
    },
    "characterInit.done": (player) => {
        player.call('hud.load'); 
    },
    "playerQuit": (player) => {
        mp.players.forEach((current) => {
            current.call("hud.setData", [{players: mp.players.length}]); /// После выхода из игры игрок какое-то время висит в пуле, возможно стоит создать таймер
        });
    },
    "hud.players.list": (player) => {
        if (player.character.admin > 0) {
            player.call("hud.players.list.enable", [true]);
            player.call("hud.players.list", [hud.getPlayers()]);
        }
    }
}