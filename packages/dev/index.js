"use strict";

var child_process = require("child_process");

let build = 0;
let branch = "";


module.exports = {
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

        cmd = `cd ${__dirname} && git rev-parse --abbrev-ref HEAD`;
        child_process.exec(cmd, (error, stdout, stderr) => {
            if (error) console.log(stderr);

            branch = stdout.trim();
            console.log(`[DEV] Текущая ветка: ${branch}`);
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
    },
    getBranch() {
        return branch;
    },
}
