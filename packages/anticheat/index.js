"use strict";

module.exports = {
    // Параметры анти-чита
    params: [],
    // Наказания
    punishments: ['notify', 'kick'],

    async init() {
        await this.loadParamsFromDB();
    },
    async loadParamsFromDB() {
        this.params = await db.Models.AntiCheatParam.findAll();
        console.log(`[ANTICHEAT] Параметры загружены (${this.params.length} шт.)`);
    },
    trigger(player, name, reason) {
        var text = `!{#ff0000} ANTICHEAT (${name}): ${player.name}[${player.id}] (${reason})`;
        var param = this.params.find(x => x.name == name);
        if (param) {
            if (param.punish == 'kick') {
                player.kick();
                text += ` kicked`;
            }
        }
        mp.events.call("admin.notify.all", text);
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
    setPunishParam(id, punish) {
        var param = this.params.find(x => x.id == id);
        if (!param) return;

        param.punish = punish;
        param.save();
    },
    initForPlayer(player) {
        var params = {};
        this.params.forEach(p => {
            params[p.name] = p.enable;
        });
        player.call(`anticheat.init`, [params]);
    },
};
