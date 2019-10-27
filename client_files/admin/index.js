mp.adminLevel = 0;

mp.events.add({
    'admin.set': (level) => {
        mp.adminLevel = level;
    },
    'slap': () => {
        var veh = mp.players.local.vehicle;
        (veh)? veh.setVelocity(0, 0, 10) : mp.players.local.setVelocity(0, 0, 10);
    },
});
