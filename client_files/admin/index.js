mp.adminLevel = 0;

mp.events.add({
    'admin.set': (level) => {
        mp.adminLevel = level;
    },
    'slap': () => {
        var veh = mp.players.local.vehicle;
        (veh) ? veh.setVelocity(0, 0, 10) : mp.players.local.setVelocity(0, 0, 10);
    },
    'entityStreamIn': (entity) => {
        if (entity.type != 'player') return;
        if (entity == mp.players.local) return;
        let isVanished = entity.getVariable('isVanished') || false;
        mp.chat.debug(`entity stream in, isVanished ${isVanished}`)
        entity.setAlpha(isVanished ? 0 : 255);
    },
    // 'render': () => {
    //     let isVanished = mp.players.local.getVariable('isVanished') || false;
    //     if (!isVanished) return;
    //     mp.game.graphics.drawText("INVISIBILITY ON", [0.93, 0.12], {
    //         font: 0,
    //         color: [252, 223, 3, 200],
    //         scale: [0.37, 0.37],
    //         outline: true
    //     });

    // }
});

// mp.events.addDataHandler('isVanished', (entity) => {
//     let isVanished = entity.getVariable('isVanished');
//     if (entity != mp.players.local) entity.setAlpha(isVanished ? 0 : 255);
// });