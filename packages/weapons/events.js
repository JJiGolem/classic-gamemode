"use strict";

let inventory = call('inventory');
let notifs = call('notifications');
let terminal = call('terminal');
let weapons = call('weapons');

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
                terminal.log(`[weapons.ammo.sync] ${player.name} имеет на клиенте ${newVal} патрон, на сервере ${params.ammo} (weapon: ${params.weaponHash})`);
                notifs.error(player, `Вы были кикнуты по подозрению в читерстве`, `Античит`);
                player.kick();
                return;
            }
            newVal = Math.clamp(newVal, 0, 1000);
            inventory.updateParam(player, item, 'ammo', newVal);
        });
    },
    "weapons.ammo.remove": (player, sqlId, ammo) => {
        // console.log(`weapons.ammo.remove: ${player.name} ${sqlId} (${ammo} пт.)`)
        var header = `Разрядка оружия`
        var weapon = inventory.getItem(player, sqlId);
        if (!weapon) return notifs.error(player, `Предмет #${sqlId} не найден`, header);
        var ammoId = weapons.getAmmoItemId(weapon.itemId);
        var name = inventory.getName(weapon.itemId);
        if (!ammoId) return notifs.error(player, `Тип патронов для ${name} не найден`, header);
        var params = inventory.getParamsValues(weapon);
        if (!params.ammo) return notifs.error(player, `${name} пустой`, header);
        if (ammo > params.ammo) {
            terminal.log(`[weapons.ammo.remove] ${player.name} имеет на клиенте ${ammo} патрон, на сервере ${params.ammo} (weapon: ${params.weaponHash})`);
            notifs.error(player, `Вы были кикнуты по подозрению в читерстве`, `Античит`);
            player.kick();
            return;
        }

        inventory.addItem(player, ammoId, {count: ammo}, (e) => {
            if (e) return notifs.error(player, e, header);
            var ammoName = inventory.getName(ammoId);

            inventory.updateParam(player, weapon, 'ammo', 0);
            player.setWeaponAmmo(params.weaponHash, 0);
            notifs.success(player, `${name} разряжен`, ammoName)
        });
    },
}
