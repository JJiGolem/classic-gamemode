"use strict";

let inventory = call('inventory');
let notifs = call('notifications');
let terminal = call('terminal');

module.exports = {
    "init": () => {

    },
    "weapons.ammo.sync": (player, data) => {
        data = JSON.parse(data);
        console.log(`weapons.ammo.sync: ${player.name}`)
        console.log(data);
        var weapons = inventory.getArrayWeapons(player);
        weapons.forEach(item => {
            var params = inventory.getParamsValues(item);
            var newVal = data[params.weaponHash];
            if (newVal == null) return;
            if (newVal > params.ammo) {
                terminal.log(`[weapons] ${player.name} имеет на клиенте ${newVal} патрон, на сервере ${params.ammo} (weapon: ${params.weaponHash})`);
                notifs.error(player, `Вы были кикнуты по подозрению в читерстве`, `Античит`);
                player.kick();
                return;
            }
            newVal = Math.clamp(newVal, 0, 1000);
            inventory.updateParam(player, item, 'ammo', newVal);
        });
    },
}
