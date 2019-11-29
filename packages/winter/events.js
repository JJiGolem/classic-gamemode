let inventory = call('inventory');
let notifs = call('notifications');
let winter = call('winter');

module.exports = {
    "init": () => {
        inited(__dirname);
    },
    "winter.takeSnowball": (player) => {
        var header = `Снежки`;
        var out = (text) => {
            notifs.error(player, text, header);
        };

        var cantAdd = inventory.cantAdd(player, winter.snowballItemId, {});
        if (cantAdd) return out(cantAdd);

        var params = {
            weaponHash: mp.joaat('weapon_snowball'),
            ammo: winter.snowballCount,
        };
        inventory.addItem(player, winter.snowballItemId, params, (e) => {
            if (e) return out(e);

            mp.players.forEachInRange(player.position, 20, rec => {
                rec.call(`animations.play`, [player.id, {
                    dict: "anim@mp_snowball",
                    name: "pickup_snowball",
                    speed: 1,
                    flag: 1
                }, 1500]);
            });
            notifs.success(player, `Вы слепили снежок`, header);
            inventory.notifyOverhead(player, `Слепил '${inventory.getName(winter.snowballItemId)}'`);
        });
    },
};
