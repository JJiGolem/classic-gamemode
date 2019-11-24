"use strict";

module.exports = {
    // Параметры анти-чита
    params: [],

    async init() {
        await this.loadParamsFromDB();
    },
    async loadParamsFromDB() {
        this.params = await db.Models.AntiCheatParam.findAll();
        console.log(`[ANTICHEAT] Параметры загружены (${this.params.length} шт.)`);
    },
    trigger(player, reason) {
        mp.events.call("admin.notify.all", `!{#ff0000} ANTICHEAT: ${player.name} kicked (${reason})`);
        player.kick();
    },
    enableParam(id, enable) {
        var param = this.params.find(x => x.id == id);
        if (!param) return;

        param.enable = enable;
        param.save();

        mp.players.forEach(rec => {
            if (!rec.character) return;
            rec.call(`anticheat.param.set`, [param.name, enable]);
        });
    },
    initForPlayer(player) {
        var params = {};
        this.params.forEach(p => {
            params[p.name] = p.enable;
        });
        player.call(`anticheat.init`, [params]);
    },
};
