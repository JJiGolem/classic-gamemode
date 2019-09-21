"use strict";

var child_process = require("child_process");

// Версия сборки сервера (кол-во коммитов)
let build = 0;


module.exports = {
    // Отображать сборку в худе на экране
    showBuild: true,

    init() {
        this.initBuild();
    },
    initBuild() {
        var cmd = `cd ${__dirname} && git rev-list --count HEAD`;
        child_process.exec(cmd, (error, stdout, stderr) => {
            if (error) console.log(stderr);

            build = parseInt(stdout);
            console.log(`[DEV] Номер сборки: ${build}`);
        });
    },
    enableBuild(enable) {
        this.showBuild = enable;
        var b = (enable) ? build : 0;
        mp.players.forEach(rec => {
            if (!rec.character) return;
            rec.call(`hud.setData`, [{
                build: b
            }]);
        });
    },
    getBuild() {
        return build;
    }
}
