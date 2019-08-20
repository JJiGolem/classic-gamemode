"use strict";

module.exports = {
    // Кол-во боеприпасов, списываемое за выдачу формы (LSPD, LSSD)
    clothesAmmo: 0,
    // Кол-во боеприпасов, списываемое за выдачу бронежилета (LSPD, LSSD)
    armourAmmo: 100,
    // Кол-во боеприпасов, списываемое за выдачу снаряжения (LSPD, LSSD)
    itemAmmo: 100,
    // Кол-во боеприпасов, списываемое за выдачу оружия (LSPD, LSSD)
    gunAmmo: 100,
    // Кол-во боеприпасов, списываемое за выдачу патронов (LSPD, LSSD)
    ammoAmmo: 1,

    setCuffs(player, enable) {
        if (enable) {
            player.playAnimation("mp_arresting", 'idle', 1, 49);
            var index = (player.character.gender == 0) ? 41 : 25;
            player.setClothes(7, index, 0, 0);
            player.hasCuffs = true;
        } else {
            player.playAnimation("special_ped@tonya@intro", 'idle', 1, 49);
            player.setClothes(7, 0, 0, 0);
            delete player.hasCuffs;
        }
        player.call("police.cuffs.set", [enable])
    },
};
