"use strict";

var child_process = require("child_process");

module.exports = {
    // Версия сборки сервера (кол-во коммитов)
    build: 0,
    // Отображать сборку в худе на экране
    showBuild: true,

    init() {
        this.initBuild();
    },
    initBuild() {
        var cmd = `cd ${__dirname} && git rev-list --count HEAD`;
        child_process.exec(cmd, (error, stdout, stderr) => {
            if (error) console.log(stderr);

            this.build = parseInt(stdout);
            console.log(`[DEV] Номер сборки: ${this.build}`);
        });
    },
    enableBuild(enable) {
        this.showBuild = enable;
        var build = (enable) ? this.build : 0;
        mp.players.forEach(rec => {
            if (!rec.character) return;
            rec.call(`hud.setData`, [{
                build: build
            }]);
        });
    },
}
