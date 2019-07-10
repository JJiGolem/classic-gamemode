module.exports = {
    /// Отображение онлайна в худе
    "playerJoin": (player) => {
        player.call('hud.load'); 
        mp.players.forEach((current) => {
            current.call("hud.setData", [{players: mp.players.length}]);
        });
    },
    "playerQuit": (player) => {
        mp.players.forEach((current) => {
            current.call("hud.setData", [{players: mp.players.length - 1}]); /// После выхода из игры игрок какое-то время висит в пуле, поэтому передаем на 1 меньше
        });
    }
}